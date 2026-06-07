# Structural Analysis

Derived from the graphify knowledge graph (618 nodes, 768 edges, 69 communities) on the TrueSwing Expo app. Signals below come from the graph itself — community cohesion scores, degree distribution, betweenness centrality, and community sizes — not from reading code.

## 1. Weak module cohesion in the three flow features

The biggest feature communities all score very low on internal interconnectedness:

- **Practice Flow** (54 nodes) — cohesion **0.068**
- **Upload Flow** (44 nodes) — cohesion **0.074**
- **Video Scrubber** (47 nodes) — cohesion **0.094**

A healthy feature module typically scores 0.2+. These are big "bags of files" — the components, hooks, and screens inside them don't actually talk to each other much. Likely candidates for splitting (e.g. Practice has both practice and drill subsystems mashed together).

## 2. 328 leaf nodes (53% of graph) and 15 fully isolated nodes

Over half the graph is a single-hop appendage — symbols only referenced once. The 15 fully isolated nodes are mostly config files (`babel.config`, `tailwind.config`, `prettier.config`, `nativewind-env.d`, `index.js`, `global.d`, asset PNGs, Android `build.gradle`s) — expected for configs, but it's a signal that AST extraction can't see how `index.js`/`global.d` connect, which usually means dead config or untracked entry points.

## 3. Fragmented community structure: 69 communities, 37 of them ≤3 nodes

More than half the communities are tiny — a sign of many one-off components/types that don't share structure with anything. Examples: `Info Card`, `Awake Screen Hook`, `Supabase Client`, `Privacy Types`, each their own micro-island. Some of these (`lib/supabase.ts`, `useAwakeScreen`) probably *should* connect to many places but the extractor only saw one caller — a hint that some imports are being used as singletons through indirection.

## 4. The flow pattern is a hidden god-bridge

`useScreenSequence()` has the highest betweenness in the graph (**0.136**) — it bridges Upload, Home, and Analysis flows. That's by design (it's *the* flow abstraction per `features/CLAUDE.md`), but it means any change to it touches three feature communities simultaneously. Same risk on `expo-video` (0.126) and `expo-router` (0.118) — the latter two are external deps you don't control.

## 5. Two native modules with near-duplicate shape

`FastSeek` and `VideoRekeyframe` each form their own iOS+Android+JS communities (C1+C8+C10+C13+C19+C22 cluster), with `VideoRekeyframeModule` at 10 edges. They mirror each other structurally — strong INFERRED signal that there's a shared abstraction (a "low-latency video seek module") that hasn't been factored out.

## 6. 234 weakly-connected nodes

Flagged by the report as "possible documentation gaps or missing edges" — most of these are types and props that AST sees as defined but never followed back to their consumer. Not a code smell on its own, but a sign that the type layer and the runtime call graph are not crossing as much as you'd expect.

---

## Most actionable next step

**Practice Flow cohesion 0.068.** Run `graphify explain "Practice Flow"` or `graphify path` between two of its members to see *why* it's so loose — that will reveal the natural split lines.
