# Graph Report - TrueSwing-expo-app  (2026-06-07)

## Corpus Check
- 128 files · ~69,044 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 647 nodes · 810 edges · 73 communities (47 shown, 26 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c819853d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Practice Flow|Practice Flow]]
- [[_COMMUNITY_Video Scrubber|Video Scrubber]]
- [[_COMMUNITY_Upload Flow|Upload Flow]]
- [[_COMMUNITY_App Config|App Config]]
- [[_COMMUNITY_Root Layout & Home|Root Layout & Home]]
- [[_COMMUNITY_Analysis Reel Player|Analysis Reel Player]]
- [[_COMMUNITY_Expo Dependencies|Expo Dependencies]]
- [[_COMMUNITY_Auth Provider|Auth Provider]]
- [[_COMMUNITY_Detailed Video & Reel|Detailed Video & Reel]]
- [[_COMMUNITY_Dev Tooling|Dev Tooling]]
- [[_COMMUNITY_Video Rekeyframe (iOSAndroid)|Video Rekeyframe (iOS/Android)]]
- [[_COMMUNITY_Issues Tracking|Issues Tracking]]
- [[_COMMUNITY_EAS Build Profiles|EAS Build Profiles]]
- [[_COMMUNITY_FastSeek Android|FastSeek Android]]
- [[_COMMUNITY_Video Cache|Video Cache]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Project Conventions|Project Conventions]]
- [[_COMMUNITY_Issue Pill Overlay|Issue Pill Overlay]]
- [[_COMMUNITY_Camera & Video Picker|Camera & Video Picker]]
- [[_COMMUNITY_FastSeek Package|FastSeek Package]]
- [[_COMMUNITY_Rekeyframe Package|Rekeyframe Package]]
- [[_COMMUNITY_Duration Label|Duration Label]]
- [[_COMMUNITY_FastSeek Module Config|FastSeek Module Config]]
- [[_COMMUNITY_AI Consent Helper|AI Consent Helper]]
- [[_COMMUNITY_App Router Structure|App Router Structure]]
- [[_COMMUNITY_Features Conventions|Features Conventions]]
- [[_COMMUNITY_Bottom Tab Bar|Bottom Tab Bar]]
- [[_COMMUNITY_Upload Theme Utils|Upload Theme Utils]]
- [[_COMMUNITY_Drawing Overlay|Drawing Overlay]]
- [[_COMMUNITY_Rekeyframe Module Config|Rekeyframe Module Config]]
- [[_COMMUNITY_Flow File Pattern|Flow File Pattern]]
- [[_COMMUNITY_Metro Config|Metro Config]]
- [[_COMMUNITY_Claude Settings Hooks|Claude Settings Hooks]]
- [[_COMMUNITY_AI Consent Modal|AI Consent Modal]]
- [[_COMMUNITY_Analysis Header Overlay|Analysis Header Overlay]]
- [[_COMMUNITY_Delete Confirmation|Delete Confirmation]]
- [[_COMMUNITY_Error State|Error State]]
- [[_COMMUNITY_Inactive Reel|Inactive Reel]]
- [[_COMMUNITY_Loading State|Loading State]]
- [[_COMMUNITY_Text Box Component|Text Box Component]]
- [[_COMMUNITY_Video Seek Bar|Video Seek Bar]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Result Navigation|Result Navigation]]
- [[_COMMUNITY_Scrubber & FastSeek Link|Scrubber & FastSeek Link]]
- [[_COMMUNITY_Supabase Client|Supabase Client]]
- [[_COMMUNITY_Privacy Types|Privacy Types]]
- [[_COMMUNITY_Shared Screen Types|Shared Screen Types]]
- [[_COMMUNITY_Adaptive Icon Asset|Adaptive Icon Asset]]
- [[_COMMUNITY_Favicon Asset|Favicon Asset]]
- [[_COMMUNITY_App Icon Asset|App Icon Asset]]
- [[_COMMUNITY_Splash Image|Splash Image]]
- [[_COMMUNITY_TrueSwing Logo (Dark)|TrueSwing Logo (Dark)]]
- [[_COMMUNITY_TrueSwing Logo (Light)|TrueSwing Logo (Light)]]
- [[_COMMUNITY_TrueSwing Logo (Grey)|TrueSwing Logo (Grey)]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]

## God Nodes (most connected - your core abstractions)
1. `expo` - 16 edges
2. `DrillRun` - 12 edges
3. `IssueService` - 11 edges
4. `Issue` - 11 edges
5. `PracticeSession` - 11 edges
6. `VideoRekeyframeModule` - 10 edges
7. `TrueSwing Expo App` - 10 edges
8. `Analysis` - 9 edges
9. `Architecture` - 9 edges
10. `expo-router` - 9 edges

## Surprising Connections (you probably didn't know these)
- `App()` --redirects_to--> `app/(public)/`  [EXTRACTED]
  App.tsx → CLAUDE.md
- `AppLayout()` --calls--> `useAuth()`  [INFERRED]
  app/(app)/_layout.tsx → features/auth/AuthProvider.tsx
- `UsePracticeDrillsReturn` --references--> `Drill`  [EXTRACTED]
  features/practice/hooks/usePracticeScreenState.ts → features/drill/types/Drill.ts
- `HomeFlow()` --calls--> `useScreenSequence()`  [INFERRED]
  features/home/homeFlow.tsx → features/shared/hooks/useScreenState.ts
- `PracticeFlow()` --calls--> `useScreenSequence()`  [INFERRED]
  features/practice/practiceFlow.tsx → features/shared/hooks/useScreenState.ts

## Import Cycles
- 1-file cycle: `metro.config.js -> metro.config.js`

## Communities (73 total, 26 thin omitted)

### Community 0 - "Practice Flow"
Cohesion: 0.09
Nodes (26): DrillInstructionsOverlayProps, ProgressBar(), Props, useDrillRunActions(), UseDrillRunActionsReturn, usePracticeResultsState(), UsePracticeResultsStateReturn, UsePracticeDrillsReturn (+18 more)

### Community 1 - "Video Scrubber"
Cohesion: 0.09
Nodes (30): Props, s, ScrubberBar(), Props, Props, s, Native, expo-video (+22 more)

### Community 2 - "Upload Flow"
Cohesion: 0.07
Nodes (25): AnalysisSuccessProps, usePrompt(), UsePromptReturn, useScreenSequence(), UploadProps, useUpload(), useVideo(), UseVideoReturn (+17 more)

### Community 3 - "App Config"
Cohesion: 0.05
Nodes (39): backgroundColor, foregroundImage, adaptiveIcon, allowBackup, intentFilters, package, permissions, version (+31 more)

### Community 4 - "Root Layout & Home"
Cohesion: 0.06
Nodes (17): AppLayout(), useAuth(), WelcomeCardProps, HomeAnalysisContext, HomeAnalysisContextValue, useHomeAnalysis(), expo-router, expo-router (+9 more)

### Community 5 - "Analysis Reel Player"
Cohesion: 0.09
Nodes (21): Analysis, AnalysisIssue, AnalysisWithIssues, CreateAnalysisRequest, CreateAnalysisResponse, VideoUrlResponse, AnalysisReelItem(), AnalysisReelItemProps (+13 more)

### Community 6 - "Expo Dependencies"
Cohesion: 0.06
Nodes (34): dependencies, expo, expo-apple-authentication, expo-auth-session, expo-blur, expo-constants, expo-dev-client, expo-linear-gradient (+26 more)

### Community 7 - "Auth Provider"
Cohesion: 0.08
Nodes (15): app/_layout.tsx, AuthContext, AuthContextWithMethods, redirectTo, AppUser, AuthContextType, features/analysis/services/analysisService.ts, features/auth/AuthProvider.tsx (+7 more)

### Community 8 - "Detailed Video & Reel"
Cohesion: 0.07
Nodes (16): DetailedVideo(), { height }, OverlayIconButtonProps, Props, Reel(), ReelProps, { width, height }, Native (+8 more)

### Community 9 - "Dev Tooling"
Cohesion: 0.08
Nodes (23): devDependencies, @babel/core, eslint, eslint-config-expo, eslint-config-prettier, prettier, prettier-plugin-tailwindcss, tailwindcss (+15 more)

### Community 10 - "Video Rekeyframe (iOS/Android)"
Cohesion: 0.18
Nodes (11): FastSeekModule, Map, MediaCodec, MediaExtractor, MediaMuxer, Module, ModuleDefinition, Any (+3 more)

### Community 11 - "Issues Tracking"
Cohesion: 0.18
Nodes (7): UseIssueReturn, AnalysisIssueProgress, CreateIssueRequest, CreateIssueResponse, Issue, UpdateIssueRequest, IssueService

### Community 12 - "EAS Build Profiles"
Cohesion: 0.14
Nodes (13): build, development, preview, production, cli, appVersionSource, version, developmentClient (+5 more)

### Community 13 - "FastSeek Android"
Cohesion: 0.24
Nodes (6): Boolean, FastSeekModule, Long, Any, Int, View

### Community 14 - "Video Cache"
Cohesion: 0.22
Nodes (3): DownloadHandle, evictOldest(), safeUnlink()

### Community 15 - "TypeScript Config"
Cohesion: 0.22
Nodes (8): compilerOptions, baseUrl, ignoreDeprecations, paths, strict, types, extends, @/*

### Community 16 - "Project Conventions"
Cohesion: 0.25
Nodes (8): EXPO_PUBLIC env vars, NativeWind v4, nativewind, react-native-video-trim, tsconfigPaths aliases, react-native-video-trim, react-native-worklets, TrueSwing Expo App

### Community 17 - "Issue Pill Overlay"
Cohesion: 0.29
Nodes (3): IssueShowcaseOverlayProps, IssueWithConfidence, { width }

### Community 18 - "Camera & Video Picker"
Cohesion: 0.29
Nodes (5): expo-camera, expo-image-picker, expo-camera, expo-image-picker, RecordingTimer

### Community 19 - "FastSeek Package"
Cohesion: 0.29
Nodes (6): description, exports, main, name, private, version

### Community 20 - "Rekeyframe Package"
Cohesion: 0.29
Nodes (6): description, exports, main, name, private, version

### Community 21 - "Duration Label"
Cohesion: 0.33
Nodes (3): AnimatedTextInput, Props, s

### Community 22 - "FastSeek Module Config"
Cohesion: 0.33
Nodes (5): android, modules, apple, modules, platforms

### Community 24 - "App Router Structure"
Cohesion: 0.40
Nodes (4): App(), app/(public)/, app/(app)/(tabs)/, SimpleTabBar

### Community 25 - "Features Conventions"
Cohesion: 0.40
Nodes (5): CLAUDE.md (root), Feature subfolder convention, features/CLAUDE.md, features/, 200-line component limit

### Community 26 - "Bottom Tab Bar"
Cohesion: 0.40
Nodes (3): Tab, TabItem, TABS

### Community 29 - "Rekeyframe Module Config"
Cohesion: 0.50
Nodes (3): android, modules, platforms

### Community 30 - "Flow File Pattern"
Cohesion: 0.50
Nodes (4): features/home/homeFlow.tsx, features/upload/uploadFlow.tsx, Flow file pattern, useScreenSequence

### Community 31 - "Metro Config"
Cohesion: 0.67
Nodes (3): config, { getDefaultConfig }, { withNativeWind }

### Community 69 - "Community 69"
Cohesion: 0.13
Nodes (13): Architecture, Auth (`features/auth/AuthProvider.tsx`), Backend API (`lib/apiClient.ts`), Commands, Conventions, Environment, Features (`features/`), graphify (+5 more)

### Community 70 - "Community 70"
Cohesion: 0.40
Nodes (4): Conventions, FEATURES DIRECTORY, What this folder is and layout, What to avoid

### Community 72 - "Community 72"
Cohesion: 0.29
Nodes (5): DrillService, CreateDrillRequest, CreateDrillResponse, Drill, UpdateDrillRequest

## Knowledge Gaps
- **244 isolated node(s):** `PreToolUse`, `allow`, `scheme`, `name`, `slug` (+239 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useScreenSequence()` connect `Upload Flow` to `Root Layout & Home`, `Analysis Reel Player`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `expo-video` connect `Video Scrubber` to `Detailed Video & Reel`, `Project Conventions`, `Expo Dependencies`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `expo-router` connect `Root Layout & Home` to `Project Conventions`, `Upload Flow`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **What connects `PreToolUse`, `allow`, `scheme` to the rest of the system?**
  _247 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Practice Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.08599033816425121 - nodes in this community are weakly interconnected._
- **Should `Video Scrubber` be split into smaller, more focused modules?**
  _Cohesion score 0.09435707678075855 - nodes in this community are weakly interconnected._
- **Should `Upload Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.07399577167019028 - nodes in this community are weakly interconnected._