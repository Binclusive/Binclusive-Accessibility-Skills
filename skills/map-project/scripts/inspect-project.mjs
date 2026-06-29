#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? process.cwd());
const MAX_FILES = 20000;
const SKIP_DIRS = new Set([
  ".git",
  ".next",
  ".expo",
  ".turbo",
  ".vercel",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "Pods",
  "DerivedData",
  ".gradle",
]);

function safeRead(file, maxBytes = 200000) {
  try {
    const text = readFileSync(file, "utf8");
    return text.length > maxBytes ? text.slice(0, maxBytes) : text;
  } catch {
    return null;
  }
}

function safeJson(file) {
  const text = safeRead(file);
  if (text === null) return null;
  try {
    return JSON.parse(text.replace(/^\uFEFF/, ""));
  } catch {
    return null;
  }
}
function stripLineComments(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => !line.trimStart().startsWith("//"))
    .join("\n");
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/") || ".";
}

function walk(dir, out = []) {
  if (out.length >= MAX_FILES) return out;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (out.length >= MAX_FILES) break;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function hasDir(relativePath) {
  try {
    return statSync(path.join(root, relativePath)).isDirectory();
  } catch {
    return false;
  }
}

function hasFile(relativePath) {
  return existsSync(path.join(root, relativePath));
}

function depsOf(pkg) {
  return {
    ...pkg?.dependencies,
    ...pkg?.devDependencies,
    ...pkg?.peerDependencies,
    ...pkg?.optionalDependencies,
  };
}

function pickDeps(deps, names) {
  return names
    .filter((name) => deps[name])
    .map((name) => ({ name, version: deps[name] }));
}

function detectPackageManagers(files) {
  const names = new Set(files.map((file) => rel(file)));
  const managers = [];
  if (names.has("pnpm-lock.yaml")) managers.push("pnpm");
  if (names.has("package-lock.json")) managers.push("npm");
  if (names.has("yarn.lock")) managers.push("yarn");
  if (names.has("bun.lockb") || names.has("bun.lock")) managers.push("bun");
  if ([...names].some((name) => name.endsWith("Package.swift") || name.endsWith("Package.resolved"))) {
    managers.push("swift-package-manager");
  }
  if (
    names.has("gradlew") ||
    names.has("gradlew.bat") ||
    [...names].some((name) => /(^|\/)(settings\.gradle|settings\.gradle\.kts|build\.gradle|build\.gradle\.kts)$/.test(name))
  ) {
    managers.push(names.has("gradlew") || names.has("gradlew.bat") ? "gradle-wrapper" : "gradle");
  }
  if (
    [...names].some((name) => /(^|\/)packages\.config$/.test(name)) ||
    [...names].some((name) => /\.(csproj|vbproj|fsproj)$/.test(name))
  ) {
    managers.push("nuget");
  }
  if ([...names].some((name) => /(^|\/)pubspec\.yaml$/.test(name))) {
    managers.push("pub");
  }
  return managers;
}

function detectWeb(files, pkg) {
  const deps = depsOf(pkg);
  const fileSet = new Set(files.map((file) => rel(file)));
  const configFiles = [...fileSet].filter((name) =>
    /^(next|vite|remix|gatsby|tailwind|postcss|tsconfig|jsconfig)\.|\.(babelrc)$/.test(name),
  );

  const framework =
    deps.next || [...fileSet].some((name) => name.startsWith("next.config."))
      ? "next"
      : deps.vite || [...fileSet].some((name) => name.startsWith("vite.config."))
        ? "vite"
        : deps["@remix-run/react"]
          ? "remix"
          : deps.gatsby
            ? "gatsby"
            : deps["react-scripts"]
              ? "create-react-app"
              : deps.react
                ? "react"
              : null;
  const webLikely = framework !== null || Boolean(deps.react) || Boolean(deps["react-dom"]);

  const routingSignals = [];
  if (webLikely) {
    for (const candidate of ["app", "src/app", "pages", "src/pages", "app/routes", "src/routes"]) {
      if (hasDir(candidate)) routingSignals.push({ type: "directory", path: candidate });
    }
  }
  if (deps["react-router-dom"]) {
    routingSignals.push({
      type: "dependency",
      name: "react-router-dom",
      version: deps["react-router-dom"],
    });
  }

  const componentDirCandidates = [
    "components",
    "src/components",
    "app/components",
    "src/ui",
    "src/shared",
    "src/common",
    "packages/ui",
  ].filter(hasDir);

  const i18nDeps = pickDeps(deps, [
    "next-intl",
    "i18next",
    "react-i18next",
    "next-i18next",
    "react-intl",
    "@formatjs/intl",
    "@lingui/react",
  ]);
  const i18nSignals = [
    ...i18nDeps.map((dep) => ({ type: "dependency", ...dep })),
    ...["locales", "src/locales", "messages", "src/messages", "translations", "src/translations", "lang"].filter(hasDir).map((dir) => ({
      type: "directory",
      path: dir,
    })),
    ...[...fileSet]
      .filter((name) => name.includes("[locale]") || /i18n\.(js|ts|mjs|cjs)$/.test(name))
      .slice(0, 50)
      .map((name) => ({ type: "file", path: name })),
  ];

  const stylingSignals = [];
  if (deps.tailwindcss || [...fileSet].some((name) => name.startsWith("tailwind.config."))) {
    stylingSignals.push({ type: "tailwind" });
  }
  if (deps["styled-components"]) stylingSignals.push({ type: "styled-components", version: deps["styled-components"] });
  if (deps["@emotion/react"] || deps["@emotion/styled"]) stylingSignals.push({ type: "emotion" });
  if ([...fileSet].some((name) => name.endsWith(".module.css") || name.endsWith(".module.scss"))) {
    stylingSignals.push({ type: "css-modules" });
  }

  const a11yRelevantDependencies = pickDeps(deps, [
    "@radix-ui/react-dialog",
    "@radix-ui/react-popover",
    "@radix-ui/react-tooltip",
    "@radix-ui/react-select",
    "@headlessui/react",
    "@mui/material",
    "@chakra-ui/react",
    "antd",
    "react-hook-form",
    "formik",
    "framer-motion",
    "react-window",
    "react-virtualized",
    "embla-carousel-react",
    "swiper",
    "recharts",
    "react-icons",
    "lucide-react",
  ]);

  return {
    packageJson: pkg === null ? null : "package.json",
    configFiles,
    framework,
    reactVersion: deps.react ?? null,
    routingSignals,
    componentDirCandidates,
    i18nSignals,
    stylingSignals,
    a11yRelevantDependencies,
  };
}

function detectAngular(files, pkg) {
  const deps = depsOf(pkg);
  const fileSet = new Set(files.map((file) => rel(file)));
  const angularCore = deps["@angular/core"] ?? null;
  const angularJsonFiles = [...fileSet].filter((name) => /(^|\/)angular\.json$/.test(name));
  // AngularJS (1.x) is the legacy `angular` package; modern Angular is `@angular/*`.
  const angularLikely = angularCore !== null || angularJsonFiles.length > 0;

  const tsFiles = files.filter((file) => /\.ts$/.test(file) && !/\.spec\.ts$/.test(file));
  const componentFiles = files.filter((file) => /\.component\.ts$/.test(file));
  const templateFiles = files.filter((file) => /\.component\.html$/.test(file));
  const tsSample = tsFiles.slice(0, 350).map((file) => ({ file, text: stripLineComments(safeRead(file, 10000) ?? "") }));
  const templateSample = templateFiles.slice(0, 350).map((file) => ({ file, text: safeRead(file, 10000) ?? "" }));

  const standaloneSignals = tsSample
    .filter(({ text }) => /standalone\s*:\s*true|bootstrapApplication\s*\(|provideRouter\s*\(/.test(text))
    .slice(0, 50)
    .map(({ file }) => rel(file));
  const moduleSignals = tsSample
    .filter(({ text }) => /@NgModule\s*\(|RouterModule\.for(Root|Child)\s*\(/.test(text))
    .slice(0, 50)
    .map(({ file }) => rel(file));

  const routingSignals = [
    ...[...fileSet]
      .filter((name) => /(^|\/)(app\.routes|.*-routing\.module|.*\.routes)\.ts$/.test(name))
      .slice(0, 50)
      .map((name) => ({ type: "file", path: name })),
    ...tsSample
      .filter(({ text }) => /\bRoutes\b|provideRouter\s*\(|RouterModule\.for(Root|Child)\s*\(|loadComponent\s*:|loadChildren\s*:/.test(text))
      .slice(0, 50)
      .map(({ file }) => ({ type: "file", path: rel(file) })),
  ];

  const componentDirCandidates = [
    "src/app",
    "src/app/components",
    "src/app/shared",
    "src/app/ui",
    "src/app/features",
    "projects",
    "libs",
  ].filter(hasDir);

  const cdkA11ySignals = [
    ...pickDeps(deps, ["@angular/cdk", "@angular/material"]).map((dep) => ({ type: "dependency", ...dep })),
    ...[...tsSample, ...templateSample]
      .filter(({ text }) =>
        /cdkTrapFocus|cdkFocusInitial|cdkAriaLive|cdkMonitor(Element|Subtree)Focus|LiveAnnouncer|FocusMonitor|FocusTrap|A11yModule|cdkAriaDescriber|@angular\/cdk\/a11y/.test(text),
      )
      .slice(0, 50)
      .map(({ file }) => ({ type: "file", path: rel(file) })),
  ];

  const ariaBindingSignals = templateSample
    .filter(({ text }) => /\[attr\.aria-[a-z]+\]|\[attr\.role\]|\baria-[a-z]+=|\brole=/.test(text))
    .slice(0, 75)
    .map(({ file }) => rel(file));

  const i18nSignals = [
    ...pickDeps(deps, [
      "@angular/localize",
      "@ngx-translate/core",
      "@ngx-translate/http-loader",
      "@jsverse/transloco",
      "transloco",
      "@ngneat/transloco",
    ]).map((dep) => ({ type: "dependency", ...dep })),
    ...["src/assets/i18n", "src/locale", "src/i18n", "i18n", "translations"].filter(hasDir).map((dir) => ({ type: "directory", path: dir })),
    ...templateSample
      .filter(({ text }) => /\bi18n(-[a-z@.-]+)?=|\|\s*translate\b|\|\s*transloco\b|\*transloco\b/.test(text))
      .slice(0, 50)
      .map(({ file }) => ({ type: "file", path: rel(file) })),
  ];

  const a11yRelevantDependencies = pickDeps(deps, [
    "@angular/cdk",
    "@angular/material",
    "@angular/forms",
    "@angular/animations",
    "primeng",
    "ng-zorro-antd",
    "@ng-bootstrap/ng-bootstrap",
    "ngx-bootstrap",
    "@ng-select/ng-select",
    "@swimlane/ngx-datatable",
    "@swimlane/ngx-charts",
    "highcharts-angular",
    "@angular/google-maps",
    "ngx-translate",
    "ngx-toastr",
  ]);

  return {
    packageJson: pkg === null ? null : "package.json",
    framework: angularLikely ? "angular" : null,
    angularVersion: angularCore,
    angularJsonFiles: angularJsonFiles.slice(0, 20),
    appModel: standaloneSignals.length > 0 ? "standalone" : moduleSignals.length > 0 ? "ngmodule" : "unknown",
    standaloneSignals,
    moduleSignals,
    routingSignals,
    componentFileCount: componentFiles.length,
    templateFileCount: templateFiles.length,
    componentDirCandidates,
    cdkA11ySignals,
    ariaBindingSignals,
    i18nSignals,
    a11yRelevantDependencies,
    ssrSignals: pickDeps(deps, ["@angular/ssr", "@angular/platform-server"]).map((dep) => ({ type: "dependency", ...dep })),
  };
}

function detectReactNative(files, pkg) {
  const deps = depsOf(pkg);
  const fileSet = new Set(files.map((file) => rel(file)));
  const jsFiles = files.filter((file) => /\.(js|jsx|ts|tsx)$/.test(file));
  const sample = jsFiles
    .slice(0, 350)
    .map((file) => ({ file, text: stripLineComments(safeRead(file, 10000) ?? "") }));
  const rnLikely = Boolean(deps["react-native"] || deps.expo || deps["expo-router"] || deps["react-native-web"]);
  const expoSignals = [];
  if (deps.expo) expoSignals.push({ type: "dependency", name: "expo", version: deps.expo });
  if (deps["expo-router"]) expoSignals.push({ type: "dependency", name: "expo-router", version: deps["expo-router"] });
  for (const candidate of ["app.json", "app.config.js", "app.config.ts", "app.config.mjs"]) {
    if (fileSet.has(candidate)) expoSignals.push({ type: "file", path: candidate });
  }
  const navigationSignals = [
    ...pickDeps(deps, [
      "@react-navigation/native",
      "@react-navigation/stack",
      "@react-navigation/native-stack",
      "@react-navigation/bottom-tabs",
      "@react-navigation/drawer",
      "expo-router",
    ]).map((dep) => ({ type: "dependency", ...dep })),
    ...["app", "src/navigation", "navigation", "src/routes", "routes"].filter(hasDir).map((dir) => ({ type: "directory", path: dir })),
  ];
  const componentDirCandidates = [
    "components",
    "src/components",
    "app/components",
    "src/ui",
    "src/shared",
    "src/common",
    "src/design-system",
    "packages/ui",
  ].filter(hasDir);
  const accessibilitySignals = sample
    .filter(({ text }) => /accessibility(Label|Role|Hint|State|Value|Actions|LiveRegion|ViewIsModal)|importantForAccessibility|allowFontScaling|maxFontSizeMultiplier|numberOfLines/.test(text))
    .slice(0, 75)
    .map(({ file }) => rel(file));
  const primitiveSignals = sample
    .filter(({ text }) => /from\s+["']react-native["']|<(Pressable|TouchableOpacity|TouchableHighlight|TouchableWithoutFeedback|TextInput|FlatList|SectionList|Modal|Image|Text)\b/.test(text))
    .slice(0, 75)
    .map(({ file }) => rel(file));
  const i18nSignals = [
    ...pickDeps(deps, [
      "i18next",
      "react-i18next",
      "react-intl",
      "expo-localization",
      "i18n-js",
      "@lingui/react",
      "@formatjs/intl",
    ]).map((dep) => ({ type: "dependency", ...dep })),
    ...["locales", "src/locales", "messages", "src/messages", "translations", "src/translations", "lang", "src/i18n"].filter(hasDir).map((dir) => ({ type: "directory", path: dir })),
    ...[...fileSet]
      .filter((name) => /(^|\/)i18n\.(js|ts|tsx|mjs|cjs)$/.test(name) || /(^|\/)translations\//.test(name))
      .slice(0, 50)
      .map((name) => ({ type: "file", path: name })),
  ];
  const a11yRelevantDependencies = pickDeps(deps, [
    "react-native-gesture-handler",
    "react-native-reanimated",
    "react-native-screens",
    "react-native-safe-area-context",
    "react-native-webview",
    "react-native-svg",
    "react-native-vector-icons",
    "@expo/vector-icons",
    "@gorhom/bottom-sheet",
    "react-native-modal",
    "react-native-paper",
    "native-base",
    "tamagui",
    "react-native-elements",
    "react-native-maps",
    "react-native-video",
    "react-native-chart-kit",
    "victory-native",
    "react-native-calendars",
    "@react-native-picker/picker",
    "@react-native-community/slider",
    "react-hook-form",
    "formik",
  ]);
  return {
    packageJson: pkg === null ? null : "package.json",
    framework: rnLikely ? (deps.expo || deps["expo-router"] ? "expo-react-native" : "react-native") : null,
    reactNativeVersion: deps["react-native"] ?? null,
    expoSignals,
    navigationSignals,
    componentDirCandidates,
    accessibilitySignals,
    primitiveSignals,
    i18nSignals,
    a11yRelevantDependencies,
    platformDirs: ["ios", "android"].filter(hasDir),
    configFiles: [...fileSet]
      .filter((name) => /^(metro|babel|app\.config|eas)\.|^app\.json$|^expo-env\.d\.ts$/.test(name))
      .slice(0, 50),
  };
}
function detectIos(files) {
  const swiftFiles = files.filter((file) => file.endsWith(".swift"));
  const swiftSample = swiftFiles
    .slice(0, 250)
    .map((file) => ({ file, text: stripLineComments(safeRead(file, 8000) ?? "") }));
  const swiftuiSignals = swiftSample
    .filter(({ text }) => /import\s+SwiftUI|struct\s+\w+\s*:\s*View\b|@main[\s\S]{0,400}App\b/.test(text))
    .slice(0, 50)
    .map(({ file }) => rel(file));
  const swiftAccessibilitySignals = swiftSample
    .filter(({ text }) => /\.accessibility(Label|Hidden|Hint|Value|AddTraits|Element|Action)/.test(text))
    .slice(0, 50)
    .map(({ file }) => rel(file));
  const uikitSignals = swiftSample
    .filter(({ text }) => /import\s+UIKit|UIViewController|UIView\b/.test(text))
    .slice(0, 50)
    .map(({ file }) => rel(file));

  const interfaceBuilderFiles = files.filter((file) => /\.(storyboard|xib)$/.test(file));
  const interfaceBuilder = interfaceBuilderFiles.slice(0, 200).map((file) => {
    const text = safeRead(file, 200000) ?? "";
    return {
      file: rel(file),
      kind: file.endsWith(".storyboard") ? "storyboard" : "xib",
      // Cheap static coverage signal: does any element declare an <accessibility> config at all?
      hasAccessibilityConfig: /<accessibility\b/.test(text),
      // Interactive/visual elements whose accessibility commonly needs review when no config is present.
      hasButtons: /<button\b/.test(text),
      hasImageViews: /<imageView\b/.test(text),
      hasTextInputs: /<textField\b|<textView\b|<searchBar\b/.test(text),
      // userLabel is the IB design-time name, useful for grounding findings to a scene element.
      hasUserLabels: /\buserLabel="/.test(text),
    };
  });

  return {
    xcodeProjects: files.filter((file) => file.endsWith(".xcodeproj") || file.endsWith(".xcworkspace")).map(rel),
    swiftPackages: files.filter((file) => path.basename(file) === "Package.swift").map(rel),
    swiftFileCount: swiftFiles.length,
    swiftuiSignals,
    swiftAccessibilitySignals,
    uikitSignals,
    interfaceBuilder,
    interfaceBuilderFileCount: interfaceBuilderFiles.length,
    storyboardLocalizationSignals: files
      .filter((file) => /(^|\/)Base\.lproj\//.test(rel(file)) || /[/\\][a-zA-Z-]+\.lproj[/\\].+\.strings$/.test(file))
      .slice(0, 100)
      .map(rel),
    localizationSignals: files
      .filter((file) => /\.(strings|stringsdict|xcstrings)$/.test(file))
      .slice(0, 100)
      .map(rel),
  };
}

function detectAndroid(files) {
  const kotlinFiles = files.filter((file) => file.endsWith(".kt"));
  const javaFiles = files.filter((file) => file.endsWith(".java"));
  const kotlinSample = kotlinFiles.slice(0, 250).map((file) => ({ file, text: safeRead(file, 8000) ?? "" }));
  const codeSample = [...kotlinSample, ...javaFiles.slice(0, 100).map((file) => ({ file, text: safeRead(file, 8000) ?? "" }))];
  const xmlLayoutFiles = files.filter((file) => /[/\\]res[/\\]layout[^/\\]*[/\\].+\.xml$/.test(file));
  return {
    gradleFiles: files
      .filter((file) => /(^|[/\\])(settings\.gradle|settings\.gradle\.kts|build\.gradle|build\.gradle\.kts)$/.test(file))
      .map(rel),
    versionCatalogs: files.filter((file) => /[/\\]gradle[/\\]libs\.versions\.toml$/.test(file)).map(rel),
    manifestFiles: files.filter((file) => /(^|[/\\])AndroidManifest\.xml$/.test(file)).slice(0, 50).map(rel),
    kotlinFileCount: kotlinFiles.length,
    javaFileCount: javaFiles.length,
    composeSignals: kotlinSample
      .filter(({ text }) => /androidx\.compose|@Composable|Modifier\.semantics|contentDescription/.test(text))
      .slice(0, 50)
      .map(({ file }) => rel(file)),
    composeAccessibilitySignals: codeSample
      .filter(({ text }) => /Modifier\.semantics|clearAndSetSemantics|contentDescription|stateDescription|Role\.|mergeDescendants|liveRegion|minimumInteractiveComponentSize|onClickLabel|heading\(\)/.test(text))
      .slice(0, 50)
      .map(({ file }) => rel(file)),
    xmlLayoutSignals: xmlLayoutFiles.slice(0, 100).map(rel),
    xmlAccessibilitySignals: xmlLayoutFiles
      .slice(0, 300)
      .map((file) => ({ file, text: safeRead(file, 60000) ?? "" }))
      .filter(({ text }) => /android:contentDescription|android:importantForAccessibility|android:labelFor|android:accessibilityHeading|android:accessibilityLiveRegion|android:screenReaderFocusable/.test(text))
      .slice(0, 100)
      .map(({ file }) => rel(file)),
    navigationResources: files.filter((file) => /[/\\]res[/\\]navigation[^/\\]*[/\\].+\.xml$/.test(file)).slice(0, 50).map(rel),
    menuResources: files.filter((file) => /[/\\]res[/\\]menu[^/\\]*[/\\].+\.xml$/.test(file)).slice(0, 50).map(rel),
    localizationSignals: files.filter((file) => /[/\\]res[/\\]values[^/\\]*[/\\]strings\.xml$/.test(file)).slice(0, 100).map(rel),
  };
}

function detectFlutter(files) {
  const dartFiles = files.filter((file) => file.endsWith(".dart"));
  const pubspecFiles = files.filter((file) => /(^|[/\\])pubspec\.yaml$/.test(file));
  const pubspecText = pubspecFiles.map((file) => safeRead(file, 60000) ?? "").join("\n");
  // A `flutter` SDK dependency in pubspec.yaml is what distinguishes a Flutter app from a plain Dart package.
  const hasFlutterSdkDependency = /sdk:\s*flutter\b/.test(pubspecText) || /(^|\n)\s*flutter\s*:/.test(pubspecText);
  const dartSample = dartFiles
    .slice(0, 300)
    .map((file) => ({ file, text: stripLineComments(safeRead(file, 8000) ?? "") }));
  const l10nDeps = ["flutter_localizations", "intl", "intl_utils", "easy_localization", "slang"].filter((name) =>
    new RegExp(`(^|\\n)\\s*${name}\\s*:`).test(pubspecText),
  );
  return {
    pubspecFiles: pubspecFiles.slice(0, 20).map(rel),
    pubspecLock: files.filter((file) => /(^|[/\\])pubspec\.lock$/.test(file)).slice(0, 20).map(rel),
    hasFlutterSdkDependency,
    entrypoints: files
      .filter((file) => /(^|[/\\])lib[/\\]main(_[a-z0-9]+)?\.dart$/i.test(file))
      .slice(0, 20)
      .map(rel),
    dartFileCount: dartFiles.length,
    widgetSignals: dartSample
      .filter(({ text }) => /package:flutter\/(material|cupertino|widgets)\.dart|extends\s+(StatelessWidget|StatefulWidget)|MaterialApp|CupertinoApp|Scaffold\b/.test(text))
      .slice(0, 50)
      .map(({ file }) => rel(file)),
    accessibilitySignals: dartSample
      .filter(({ text }) => /\bSemantics\s*\(|semanticLabel\s*:|ExcludeSemantics|MergeSemantics|BlockSemantics|SemanticsService\.announce|OrdinalSortKey|FocusTraversal(Group|Order)|tooltip\s*:|liveRegion\s*:/.test(text))
      .slice(0, 50)
      .map(({ file }) => rel(file)),
    localizationSignals: [
      ...l10nDeps.map((name) => ({ type: "dependency", name })),
      ...files.filter((file) => /(^|[/\\])l10n\.yaml$/.test(file)).slice(0, 20).map((file) => ({ type: "file", path: rel(file) })),
      ...files.filter((file) => file.endsWith(".arb")).slice(0, 100).map((file) => ({ type: "file", path: rel(file) })),
    ],
    platformDirs: ["android", "ios", "web", "macos", "linux", "windows"].filter(hasDir),
  };
}

function extractPackageReferences(file) {
  const text = safeRead(file, 200000);
  if (text === null) return [];
  const references = [];
  for (const match of text.matchAll(/<PackageReference\b[^>]*\bInclude=["']([^"']+)["'][^>]*(?:\bVersion=["']([^"']+)["'])?[^>]*>/gi)) {
    references.push({ name: match[1], version: match[2] ?? null, source: rel(file) });
  }
  for (const match of text.matchAll(/<package\b[^>]*\bid=["']([^"']+)["'][^>]*(?:\bversion=["']([^"']+)["'])?[^>]*>/gi)) {
    references.push({ name: match[1], version: match[2] ?? null, source: rel(file) });
  }
  return references;
}

function pickPackageReferences(references, names) {
  const wanted = new Set(names.map((name) => name.toLowerCase()));
  return references.filter((reference) => wanted.has(reference.name.toLowerCase()));
}

function detectAspNet(files) {
  const fileSet = new Set(files.map((file) => rel(file)));
  const projectFiles = files.filter((file) => /\.(sln|csproj|vbproj|fsproj)$/.test(file)).map(rel);
  const webConfigFiles = files.filter((file) => /(^|[/\\])web\.config$/i.test(file)).map(rel);
  const globalAsaxFiles = files.filter((file) => /(^|[/\\])Global\.asax(\.(cs|vb))?$/i.test(file)).map(rel);
  const aspxPages = files.filter((file) => /\.aspx$/i.test(file)).map(rel);
  const userControls = files.filter((file) => /\.ascx$/i.test(file)).map(rel);
  const masterPages = files.filter((file) => /\.master$/i.test(file)).map(rel);
  const razorViews = files.filter((file) => /\.(cshtml|vbhtml)$/i.test(file)).map(rel);
  const controllers = files.filter((file) => /(^|[/\\])Controllers[/\\].+Controller\.(cs|vb)$/i.test(file)).map(rel);
  const routeFiles = files
    .filter((file) => /(^|[/\\])(RouteConfig|Startup|Program)\.(cs|vb)$/i.test(file))
    .map(rel);
  const resourceFiles = files.filter((file) => /\.resx$/i.test(file)).slice(0, 100).map(rel);
  const packageReferences = files
    .filter((file) => /\.(csproj|vbproj|fsproj)$/i.test(file) || /(^|[/\\])packages\.config$/i.test(file))
    .flatMap(extractPackageReferences);

  const webFormsLikely = aspxPages.length > 0 || userControls.length > 0 || masterPages.length > 0;
  const mvcLikely = controllers.length > 0 || [...fileSet].some((name) => /(^|\/)Views\/.+\.(cshtml|vbhtml)$/i.test(name));
  const razorPagesLikely = [...fileSet].some((name) => /(^|\/)Pages\/.+\.cshtml$/i.test(name));
  const aspNetCoreLikely =
    [...fileSet].some((name) => /(^|\/)(Program|Startup)\.cs$/i.test(name)) &&
    packageReferences.some((reference) => reference.name.toLowerCase().startsWith("microsoft.aspnetcore"));

  const framework =
    webFormsLikely && mvcLikely
      ? "aspnet-mixed"
      : webFormsLikely
        ? "aspnet-webforms"
        : razorPagesLikely
          ? "aspnet-razor-pages"
          : mvcLikely
            ? aspNetCoreLikely
              ? "aspnet-core-mvc"
              : "aspnet-mvc"
            : aspNetCoreLikely
              ? "aspnet-core"
              : projectFiles.length > 0 || webConfigFiles.length > 0
                ? "aspnet-unknown"
                : null;

  const uiLibraryReferences = pickPackageReferences(packageReferences, [
    "Telerik.UI.for.AspNet.Ajax",
    "Telerik.UI.for.AspNet.Mvc",
    "Kendo.Mvc",
    "DevExpress.Web",
    "AjaxControlToolkit",
    "Microsoft.jQuery.Unobtrusive.Validation",
    "jQuery.Validation",
    "bootstrap",
  ]);

  return {
    framework,
    projectFiles: projectFiles.slice(0, 50),
    webConfigFiles: webConfigFiles.slice(0, 50),
    globalAsaxFiles: globalAsaxFiles.slice(0, 20),
    routeFiles: routeFiles.slice(0, 50),
    webForms: {
      aspxPages: aspxPages.slice(0, 100),
      userControls: userControls.slice(0, 100),
      masterPages: masterPages.slice(0, 50),
    },
    mvc: {
      controllers: controllers.slice(0, 100),
      razorViews: razorViews.slice(0, 150),
      sharedViews: razorViews.filter((name) => /(^|\/)(Views\/Shared|Pages\/Shared)\//i.test(name)).slice(0, 75),
    },
    localizationSignals: resourceFiles,
    a11yRelevantDependencies: uiLibraryReferences,
  };
}

const files = walk(root);
const pkg = safeJson(path.join(root, "package.json"));
const web = detectWeb(files, pkg);
const angular = detectAngular(files, pkg);
const reactNative = detectReactNative(files, pkg);
const ios = detectIos(files);
const android = detectAndroid(files);
const flutter = detectFlutter(files);
const aspNet = detectAspNet(files);
const detectedPlatforms = [];
const packageDeps = depsOf(pkg);
const hasReactDependency = Boolean(packageDeps.react);
const hasExplicitWebTarget =
  web.framework !== null &&
  (reactNative.framework === null ||
    web.framework !== "react" ||
    Boolean(
      packageDeps["react-dom"] ||
        packageDeps.next ||
        packageDeps.vite ||
        packageDeps["@remix-run/react"] ||
        packageDeps.gatsby ||
        packageDeps["react-scripts"] ||
        packageDeps["react-native-web"],
    ));
if (reactNative.framework !== null) detectedPlatforms.push("mobile-react-native");
if (angular.framework !== null) detectedPlatforms.push("web-angular");
if (hasExplicitWebTarget || (hasReactDependency && reactNative.framework === null)) detectedPlatforms.push("web-react");
if (aspNet.framework !== null) {
  detectedPlatforms.push(
    aspNet.framework === "aspnet-webforms" || aspNet.framework === "aspnet-mixed"
      ? "web-aspnet-aspx"
      : "web-aspnet",
  );
}
if (
  ios.swiftFileCount > 0 ||
  ios.xcodeProjects.length > 0 ||
  ios.swiftPackages.length > 0 ||
  ios.interfaceBuilderFileCount > 0
) {
  detectedPlatforms.push(ios.swiftuiSignals.length > 0 ? "ios-swiftui" : "ios-swift");
}
if (android.gradleFiles.length > 0 || android.kotlinFileCount > 0 || android.javaFileCount > 0) {
  detectedPlatforms.push(android.composeSignals.length > 0 ? "android-kotlin-compose" : "android");
}
if (flutter.hasFlutterSdkDependency || (flutter.pubspecFiles.length > 0 && flutter.dartFileCount > 0)) {
  detectedPlatforms.push("flutter");
}

const notes = [];
if (files.length >= MAX_FILES) notes.push(`File scan capped at ${MAX_FILES} files.`);
if (pkg === null && hasFile("package.json")) notes.push("package.json exists but could not be parsed as JSON.");
if (detectedPlatforms.length === 0) notes.push("No supported platform signals detected.");
if (detectedPlatforms.some((platform) => platform.startsWith("ios") || platform === "mobile-react-native" || platform.startsWith("android"))) {
  notes.push("React Native mapping is supported through mapper-react-native.md; iOS mapping is supported through mapper-ios-swift.md when SwiftUI/UIKit is in scope; native Android mapping is supported through mapper-android.md for Jetpack Compose and Android Views/XML.");
}
if (detectedPlatforms.some((platform) => platform.startsWith("android")) && reactNative.framework !== null) {
  notes.push("Both native-Android and React Native signals were found. If this is a React Native/Expo app with a generated android/ folder, map it with mapper-react-native.md; use mapper-android.md only for genuinely native Compose/View UI.");
}
if (detectedPlatforms.includes("flutter")) {
  notes.push("Flutter mapping is supported through mapper-flutter.md for Dart apps using Material, Cupertino, or the base Widgets library.");
}
if (detectedPlatforms.includes("flutter") && detectedPlatforms.some((platform) => platform.startsWith("android") || platform.startsWith("ios"))) {
  notes.push("Both Flutter and native-Android/iOS signals were found. A Flutter app ships android/ and ios/ host folders (often with a small MainActivity/AppDelegate); map the Flutter UI with mapper-flutter.md and use mapper-android.md / mapper-ios-swift.md only for genuinely native Kotlin/Java or Swift UI.");
}
if (detectedPlatforms.includes("web-angular")) {
  notes.push(
    `Angular project detected (${angular.appModel} app model${angular.angularVersion ? `, @angular/core ${angular.angularVersion}` : ""}). Map it with mapper-angular.md; audit it with auditor-web-a11y.md plus angular.md (Angular CDK a11y, [attr.aria-*] bindings, structural directives, router focus). React/Next.js web uses mapper-web.md.`,
  );
}
if (ios.interfaceBuilderFileCount > 0) {
  const withoutConfig = ios.interfaceBuilder.filter((ib) => !ib.hasAccessibilityConfig).length;
  notes.push(
    `${ios.interfaceBuilderFileCount} Interface Builder file(s) found (.storyboard/.xib); ${withoutConfig} declare no <accessibility> config. Audit storyboard/XIB markup as XML and check paired .lproj/*.strings for localized accessibility labels.`,
  );
}

const result = {
  projectRoot: root,
  projectName: pkg?.name ?? path.basename(root),
  detectedPlatforms,
  packageManagers: detectPackageManagers(files),
  web,
  angular,
  reactNative,
  ios,
  android,
  flutter,
  aspNet,
  notes,
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

