# Changelog

## [0.27.0]

**Re-running research can now branch instead of overwriting.** When you run "Research a question" again in a note that already holds a synthesis — and you have since built a challenge, an argument map or other reasoning on top of it — replacing the synthesis in place would leave that later work stranded on an answer that no longer exists. The run now offers **Fork session** at that point: the fresh framework, sub-questions and synthesis land in a **new** session note (branched from your framing and lenses), while the original note keeps its old synthesis and everything you built on it, fully intact. Deepening is re-pointed at the fork automatically, so you carry straight on there. As before, Fork only appears when there is downstream reasoning to protect; a first run, or one with nothing built on the synthesis yet, just writes normally. This completes the broad-fork work started in 0.26.0 — Fork now covers the framework and synthesis written by the research run itself, not only the hand-run assistant sections.

## [0.26.0]

**Fork now protects any revision, not just four.** When you revise a section that later sections build on, revising it in place leaves those later sections orphaned — reasoning that no longer matches what it was based on. Until now only four artefacts (argument map, interview guide, hypotheses, research agenda) offered the **Fork session** escape. That was too narrow: the same is true for your framing, your theoretical lenses, your challenge — for any thinking section with reasoning after it. Now the overwrite dialog offers Fork wherever it applies: revising, say, your challenge while an argument map and hypotheses sit below it lets you branch a fresh session note from that point — everything above is copied, that section and everything below start fresh — so the old line of reasoning stays intact and navigable while you explore a new one. Fork appears only when there is actually something downstream to orphan; if the section is the last of its kind, there is nothing to protect and no Fork is offered. (Deepening a finding never triggers a fork — it enriches findings in place, it does not revise the reasoning below them.)

**Adding a section by hand asks before overwriting.** Inserting a section scaffold from the sidebar used to refuse flatly when the section already had content ("nothing inserted or replaced"). Now it opens the same gate as the AI flows — **Replace**, **Fork**, or **Keep** — so you can branch instead of losing the old content, exactly as when an assistant rewrites a section.

**A clearer message when there is nothing to deepen yet.** "Deepen finding" needs an in-memory research run from the current session (the full source list it works from is not stored in the note). After reloading the plugin that in-memory result is gone, and the command used to say the confusing "the last research belongs to another session." It now says plainly that you need to run research in this session first.

_Still to come (planned): extending Fork to the framework and synthesis sections written by the research run itself, where the fresh result needs to land in the fork._

## [0.25.0]

**A research run can no longer hang forever.** Every network request now has a 60-second time budget. A stalled connection — the classic case is a phone switching from Wi‑Fi to mobile data mid-run — used to leave a run frozen on "Step n…" with no way out, because no error ever arrived for the retry logic to catch. Now the request times out, the existing retry-with-backoff takes over, and — new — hitting **Stop** interrupts a request that is already in flight instead of only stopping the *next* step. Disabling or updating the plugin mid-run also stops the run cleanly, so a stale run can't keep writing to your notes behind the newly loaded one.

**The search step now recovers from blips like the rest of the pipeline.** A one-second connection hiccup or a temporary server error (HTTP 5xx) on OpenAlex or Semantic Scholar used to throw away that query's results immediately, while the AI steps quietly retried the same blip several times. The search fan-out — and the standalone quick-search command — now retry those transient failures too. And when *all* sources fail, the message finally tells you which problem you have: "you appear to be offline, check your connection and use Resume" when the device is dark, versus the rate-limit advice when the services are reachable but throttling you.

**No more silently missing synthesis.** If the language model returned an empty answer (for example, a response that was all "thinking" and no text), the synthesis used to vanish with no summary, no warning and nothing written — indistinguishable from success. That case is now reported as a degradation, the same honest "completed with issues" signal the rest of the pipeline already gives. Deepening failures are likewise counted and reported ("Deepened 4 of 7 findings; 3 failed") instead of just producing quietly thinner results.

**Safer handling of what comes back from the web.** Open-access full-text links from paper metadata are now validated before they are fetched — only ordinary public `http(s)` addresses, never a link pointing at your own machine or local network. Links shown in your notes and in the results list are held to the same `http(s)`-only rule, so a malformed URL in search metadata renders as plain text instead of something clickable. The optional debug log now masks anything that looks like an API key before writing it to the note. And the source text fed to the AI is explicitly fenced off and labelled as data, so a paper abstract can't smuggle instructions into your synthesis.

**Under the hood.** A large internal reorganisation split the plugin's biggest file into focused modules (artefact landing, the research-run controller, the export commands) with no change to behaviour, and the test suite grew from about 1,260 to about 1,380 tests covering the run assembly, the commands, settings loading and the new guards. You should notice none of this directly — it is groundwork that makes the plugin safer to keep building on. Full background: the July 2026 code audit and its nine-step follow-up.
## [0.24.0]

**Your records now survive device sync — and can be rebuilt from the note.** Field test finding: hypotheses adopted on one device never showed on another. Cause: the register and the research records live in the hidden `.consensus-research/` folder by default, and Obsidian Sync does not sync hidden folders — your notes travelled, the structured records didn't. Two repairs. First, **Maintenance · rebuild records from note** re-parses the note's own sections back into the records (in any artifact language): the hypotheses and the argument map are restored exactly as written — the note is the source of truth — and the findings are rebuilt best-effort from the graded synthesis bullets (only when no richer record exists; recorded bases are not invented, so no false staleness). Second, the settings now spell out the sync trap under **Register file**, and a one-click **Move now** action moves the register, the records and their backup to a visible (and therefore syncing) folder of your choice — nothing is ever overwritten, skipped files are reported.

## [0.23.0]

**The inline Mermaid diagram retires.** The `## Argument` section keeps its numbered claims, assumptions and relation lines — the searchable text — but no longer embeds the Mermaid mini-diagram: it truncated every node to 60 characters, depended on theme rendering, and duplicated what the Canvas now does better. The Canvas (“Design · argument canvas”) is the visual map from here on.

**Evidence joins the canvas too.** When you map the argument, the AI now also links your synthesis findings to the claims they bear on. Those links land everywhere the map lives: as an *Evidence* list in the `## Argument` section, and on the canvas as a band of finding nodes **above** the claims — green where a finding supports a claim, red where it attacks one, arrows pointing down into the claim. At a glance you see which claims are backed, which are contested, and which stand bare. The links are proposed with everything else (you adopt the map, evidence follows its claim), each snapshot keeps its source references, and older argument maps simply have no evidence band until you re-map.

**Hypotheses join the canvas.** Adopted hypotheses now appear as a purple third band below the assumptions, each linked ("tests") to the claim or assumption its recorded basis names — so the canvas shows not just what you argue, but which parts of the argument are testable and how you plan to test them. Hypotheses without a recognizable basis simply join the band without an arrow.

**The map explains its own colors — and its own nature.** Every generated canvas now carries a small legend node: 🟦 claims, 🟨 assumptions, 🟪 hypotheses, 🟩/🟥 evidence, and what the green/red/purple arrows mean — in your artifact language. It opens with the one thing worth knowing: this canvas is a *projection* of your session note (with a wikilink straight to it) — edit at the source, because regeneration refreshes node texts from the record. Move the legend wherever you like; regeneration respects its position like any other node.

**The map extracts — it no longer paraphrases.** Field test finding: assumptions traced cleanly back to the note, but some claims existed only on the map — reworded from findings or invented outright. Mapping the argument is now strictly extraction: every claim and assumption must be a statement that already appears in your session (the AI is told to quote, never author), each node carries a source locator (like *beliefs:2* or *synthesis*) that shows up in the `## Argument` section, and the review dialog runs a literal-match check against your note — anything that doesn't occur verbatim gets a visible ⚠ flag so you can untick it deliberately.

**Every section now introduces itself.** Each machine-written section opens with one italic line saying what the section is and how it relates to the steps around it — *"Counter-arguments and blind spots raised against the synthesis above; what survives feeds the beliefs below."* — in your artifact language. The session note reads as a guided method instead of a stack of bare headings. The line is machine wayfinding: scaffold detection and progress tracking ignore it, and it never blocks a rewrite.

**Hypotheses moved up to where they come from.** In the canonical section order, `## Hypotheses` now sits directly below the argument map it is derived from — no longer at the bottom past the interview guide and the research agenda. Existing notes are never rearranged automatically; run **Session · reorder sections** once to pull an older note into the new order.

**"Expectation" and "hypothesis" are no longer the same word.** The prediction each sub-question carries into the search is now labelled *Expectation* — a search-steering guess stated before the results, not a formal hypothesis. The `## Hypotheses` section (derived from the argument map, and the only thing that appears on the canvas) keeps the name. The two are also finally related: *Design · hypotheses* now reads your sub-question expectations from the note as candidates — the ones the argument map bears out come back as falsifiable hypotheses, the rest are dropped. Older notes with the old *Hypothesis* label keep working.

**The Rephrase button works in every window now.** Field test finding: tapping *Rephrase for search (uses AI)* from the Explore-the-problem window (and most other Ask Parallax windows) claimed "No AI provider configured" — no matter which provider was set up. Only quick search actually handed the window the rephrase capability; the seven other flows forgot to. It's now wired once, centrally, for all of them — the message only appears when there truly is no provider configured.

**Sections remember what they were based on.** From now on, adopting a challenge, argument map, hypotheses, interview guide or research agenda also records fingerprints of the sections it was built from. When one of those upstream sections later changes — a rewritten synthesis, updated beliefs — the workbench marks the dependent step with a red note saying exactly which basis moved, and the argument canvas gets a red banner above its legend ("the basis of this map changed — run *Design · argument map* again"). Re-running the step clears the mark. Existing notes are unaffected until their next adoption records a basis.

**Revising a section now asks first — and before the AI runs.** Two changes to the edit-respect gate. First: an existing section always asks before being overwritten — also when it was AI-written and untouched (it may be the recorded basis of later sections); only a brand-new section is written silently. Second: for the session-bound assistants (argument, hypotheses, interview guide, research agenda) the question moves to before the AI call — choosing Keep no longer costs a wasted run, and you're warned at the moment you can still change course. The check at paste time stays as a safety net, but only re-asks if the section changed while the AI was working.

**Fork a session from the revision point.** When you revise a section that later sections build on, the dialog now offers a fourth choice: **Fork session**. It creates a new session note next to the original with everything above the revised section copied — text, front-matter, and the structured records of the kept artefacts — while the revised section and everything below start fresh. The two notes cross-link (a parent pointer in the fork's context, a logbook line on both sides), so the original stays behind as a consistent snapshot of the earlier thinking, and you re-run the revising step in the fork. Beliefs travel along only when they sit above the revision point.

**The palette now speaks in research phases — and got shorter.** Every command carries its phase or domain up front: *Challenge · framing*, *Theory · lenses*, *Design · argument map*, *Evidence · quick search* — type a phase in the palette and its steps cluster together (Obsidian already adds "Parallax:", so the plugin name stays out of the names). The palette also went from 47 to 41 entries without losing anything: "search selected text" is gone (a selection already pre-fills quick search), the force-cross-sector command became a **toggle under Filters** in the Ask window, and the three refresh commands, the two connections/library scope variants and the two Quadro exports each merged into one command with a quick picker. Command ids are unchanged, so existing hotkeys survive — except on merged commands, whose old entries no longer exist.

**The argument canvas lays itself out as a tower grid.** The generated canvas used to place nodes in document order on a plain grid, and every arrow left the bottom of its node and arrived at the top of its target — for an assumption pointing at a claim *above* it, that meant a giant loop around the entire map. Now every claim gets its own vertical **tower**: its evidence on top, the claim, then its assumptions and the hypotheses that test them — and the towers wrap three per row, so the map stays roughly square instead of a mile-wide ribbon. Arrows leave and arrive at the sides that actually face each other (also after you move nodes around yourself), rows are ordered by connectivity, and nodes tied to no claim gather in a block below the grid. Rearranging by hand still wins: regeneration never moves a node you placed yourself. And for a canvas that has already grown messy there's a new explicit command, **Design · argument canvas re-layout** — it works from the canvas itself too — that rearranges the argument nodes while your own nodes and connections stay exactly where you put them.

## [0.22.0]

**Pick your effort level on modern Claude models.** The reasoning dropdowns now offer the full effort range (low · medium · high · xhigh · max) for current Anthropic models — Sonnet 5, Opus 4.7/4.8, Fable/Mythos 5 — and up to *max* on the 4.6 family. Under the hood the Anthropic adapter now speaks the current API: adaptive thinking plus the effort parameter, instead of the legacy thinking-token budgets those models reject outright. Older Claude models (3.7, Opus/Sonnet 4.0–4.5, Haiku 4.5) keep their budget-based levels — everything stays working across the board.

**Rephrase now knows what your session is about.** A selected line often names its subject only implicitly ("does this hold for this question?") — and a rephrase without the subject finds beautifully generic literature about everything except your topic. When you rephrase inside a research session, the session topic now rides along, so "this question" resolves to what you're actually researching and its key terms land in the query.

**OpenAlex searches are now semantic.** OpenAlex quietly gained an embedding-based search mode, and the difference on natural-language queries is night and day: the same personality-and-music-preferences query that returned a mixed bag under keyword matching comes back fully on-topic — at the same (free-tier) cost. All OpenAlex searches — quick search and the research pipeline — now use it, with your year and peer-reviewed filters intact. Since the parameter isn't in OpenAlex's documented API yet, the plugin automatically falls back to classic keyword search if it's ever rejected.

**Windows now use your phone's screen.** On phones, the search-results window squeezed the reference list down to a sliver of a few pixels — technically scrollable, practically invisible — while the window itself used barely half the screen. Windows may now grow to most of the screen (the on-screen keyboard still shrinks them dynamically when it opens), the results list stretches into whatever space is available so the buttons stay in view without scrolling, and reaching the list's end no longer scrolls the note behind it. Text fits too: a long selection pre-filled into the search field is fully visible right away (it used to stay clipped at three lines until you typed), field explanations no longer get cut off mid-sentence by theme styling, and a huge selection scrolls inside its field instead of pushing the buttons out.

**One work, one entry.** Semantic ranking has a side effect: the journal article, its publisher data deposit, and its preprint are each other's nearest neighbours, so the same work could show up two or three times under different DOIs. Result lists now collapse those versions into one entry — the best-cited version (usually the journal article) represents the work, holds the top-ranked spot, and quietly inherits anything the other versions knew (an abstract, an open-access link). Genuinely different works are never merged.

**Room to actually search: OpenAlex API key.** OpenAlex meters anonymous usage at a tiny daily allowance — about ten searches, which a single research run can exhaust ("Rate limit exceeded"). A free API key raises that to roughly a thousand searches per day. Settings → Parallax → Search sources now has an **OpenAlex API key** field, with a link to where you create one (openalex.org/settings/api). Like the other keys it's stored locally in your vault, masked in the settings screen, and sent only to OpenAlex itself.

## [0.21.4]

**Fixes from the first field test of Rephrase.** Three things the 0.21.3 test surfaced, fixed in one go:

- **The newest Claude models work again.** Recent Anthropic models reject the `temperature` parameter outright ("deprecated for this model"), which failed every AI call on them. The plugin now retries once without it — older models keep their temperature, newer ones just work.
- **Error messages tell you what's actually wrong.** "Chat request failed (400)" now carries the provider's own explanation (wrong model, unsupported option, token limit) for all four AI providers, instead of a generic hint.
- **The Rephrase button always responds.** On mobile, a tap without a configured AI provider used to do nothing at all (a disabled button with a tooltip — which mobile doesn't show). Every tap now answers: what to configure, what's missing, progress, or the result.

## [0.21.3]

**Quick search now understands what you selected.** Selecting a line from your note used to drag its markdown along into the search — a challenge item like `- [open] Is 'persoonskenmerken' te breed?` reached the search provider with `- open` as its most prominent "keywords", burying the actual question under random matches. Quick search now strips markdown structure (list markers, status boxes, emphasis, links) for all three providers, understands Dutch function words next to English ones when distilling keywords for Semantic Scholar, and puts the terms you 'quoted' yourself at the front of the query — they are, after all, the concepts you're asking about.

**…and rephrases anything into a real search query.** The scholarly databases are overwhelmingly English, and a selection dragged from a note is rarely search-shaped — whatever its language. The quick-search window now always offers **Rephrase for search (uses AI)** when an AI provider is configured: one click turns any text — a Dutch question, a rhetorical English challenge line — into a concise English search query (author citations like *(Tait, 1985)* preserved), which replaces your editable text so you review it before searching. No language detection, no assumptions. Nothing else about quick search touches AI — without a provider it stays fully keyless, and the button simply explains what to configure.

## [0.21.2]

**Tidy up an older note on demand.** 0.21.1 made *new* sections land in a fixed, logical order — but deliberately never touches what's already there, so notes from before it can still be scrambled. The new command **"Reorder sections (canonical order)"** puts the active note's sections in that same order as an explicit action: references end up last, your intro stays on top, and your own headings travel with the section they sit under. Section content is untouched; running it on a note that's already in order changes nothing and says so.

## [0.21.1]

**Sections now land in a fixed, logical order.** Repeated research runs in the same note used to append each new section wherever the note happened to end — logbook in the middle, a synthesis below the references. New sections now slot in at their canonical position: exploration → lenses → framework → sub-questions → search strategy → synthesis → challenge → beliefs → argument → interview → agenda → hypotheses → connections → logbook, with references always last. Sections that already exist are never moved — your own arrangement (and your own headings) stay exactly where you put them; only where a *new* section lands is governed.

## [0.21.0]

**Bring any AI — or none at all.** The biggest release since the research pipeline itself, in four moves:

- **Six LLM providers, first-class.** Mistral · OpenAI · Anthropic · Google · Local (Ollama/LM Studio) · Custom (any OpenAI-compatible endpoint). Each gets its own settings block with a live model list fetched from your account, and the chat-model choice moved out of Advanced to where you configure the provider. Embeddings for the semantic rerank are a separate, explicit choice (Anthropic has none — pick another provider there, or the rerank gracefully falls back to fusion order). Reasoning dropdowns now offer only the levels your chosen model actually supports (Mistral's enum is effectively off/high; gpt-5 knows `minimal`, the o-series doesn't; Claude and Gemini think in budgets) — and mismatched leftovers are clamped at call time instead of erroring. A local server never needs a key, works from mobile via its LAN address, and an empty base URL is a hard error rather than a silent fallback to OpenAI.
- **Settings you can read.** The settings tab is now an accordion: sections open themselves (with a badge saying why) only when something needs your attention — a fresh install reads as a short checklist, a configured one opens fully collapsed. Options that only matter when the AI pipeline runs carry a subtle "Uses AI" chip; the Public/Academic output modes now visibly take over the two evidence toggles they force on.
- **Every thinking step works without AI.** Each research-assistant step has a self-write twin: **Add section** inserts the marked section with a one-line writing hint (as an `[!info]` callout, in your Artifact language — all 13), and **Ask AI** runs the assistant as before. A hint-only section doesn't count as "done" until your own words are under it. And when AI meets a section you hand-edited, you now choose: **Keep mine · Append below · Replace**.
- **A calmer sidebar.** Steps are cards — title, description, then the buttons — instead of cramped rows; the More group follows the same layout with honest verbs (Search, Open, Export). Without a configured provider, "Add section" takes the accent: the workbench stays usable end-to-end, AI is the accelerator, not the entry fee.

## [0.20.0]

**Your words, not ours.** "Route C" — an internal codename that leaked into settings and logs — is gone: the plugin now speaks of the *research pipeline* and *research assistants* everywhere, matching what the UI already said. Persisted settings migrate automatically on first load; your existing notes, markers and commands keep working untouched.

## [0.19.0]

**Research results land where they belong.** A research run now writes the full result into the session note as proper sections — theoretical framework, sub-questions and the graded synthesis each under their own heading — instead of one blob at the cursor. Reference actions insert exactly that: references, with canonical numbering, in a `## References` section at the bottom of the note. The floating "Insert here" step is gone; the note structure is the landing zone.

## [0.18.0]

**Sub-questions became a real checkpoint.** When "Review sub-questions before searching" is on, every proposed sub-question gets its own edit field (full modal width, also on mobile), you can add or remove questions, and "Insert into note" lands the reviewed set in the session note so you can refine it there and restart the research from your own version.

## [0.17.0]

**The quantitative route gets a road.** Since 0.15.0 Parallax knows which of your questions lean quantitative — now it knows what to do with them, in three propose-only steps that mirror the qualitative bridge (interview guide → Quadro):

- **Propose hypotheses (from the argument map).** Your argument map holds claims, assumptions and attack relations (E103) — exactly where a test changes the argument most. This command turns them (plus your open beliefs and quantitative-labelled questions) into falsifiable hypotheses, each with the element it operationalizes and a one-line testing direction. You adopt per hypothesis; the set lands as a `## Hypotheses` section (13 languages), a structured record, and a logbook event — and it appears in the methodological account. *Hypotheses — refresh* re-renders from the record without the LLM.
- **Find validated scales (for a construct).** The agenda's "required data / measurement instruments" line becomes actionable: name a construct ("perceived recovery", not a whole question) and Parallax runs a fixed psychometric query fan-out through the same free search machinery as always (OpenAlex + Semantic Scholar), ranks toward measurement literature (scales, questionnaires, validation studies) and lands in the familiar results screen — inserting references records them in the citation register like any source. No LLM call.
- **Export pre-registration draft.** Deterministically assembled from what your session already recorded — question and framing, research questions with their method fit, adopted hypotheses, the agenda's study designs and data needs — into a plain-markdown draft next to your note. Sampling and analysis plans are deliberately fill-in sections: Parallax names them so you can't overlook them, and says explicitly that designing them is yours. A draft to review and complete, never a submission.

Fielding and analysis stay out of scope by design — Parallax prepares the thinking, your survey and stats tools do the doing. Also in this release: the plugin description now leads with the parallel theoretical lenses, and the Quadro starter kit's `Data/README` now carries the maintainer-confirmed transcript conventions (one paragraph per speaker turn; speaker labels and pre-existing block ids are safe; data files reserve only the front-matter key `read`).

## [0.16.0]

**When the network drops, you now see it, survive it longer, and learn why.** A research run on mobile can lose its connection halfway (screen off, wifi asleep, a network switch) — and until now that looked like a freeze, retried briefly, and left a debug log that said only "network error". Three changes: **(1) Visible retries** — every network retry of an AI call shows a short toast ("Network error — retrying synthesis (2/6)…") next to the persistent step notice, so a retry window reads as *still working*. **(2) A wider window** — network errors now get 6 retries instead of 4 (~45 seconds with backoff), enough for a woken-up mobile connection to come back; a resume after a failed synthesis therefore survives a slow reconnect. **(3) A verdict in the debug log** — each retry line now names the underlying cause (e.g. `UnknownHostException` = DNS), and when all retries are exhausted the log adds a one-line **network diagnosis**: the plugin probes a neutral reference host (OpenAlex) and tells you whether *only* the AI endpoint is unreachable (points to a DNS filter, adblock list or VPN rule blocking that domain) or *everything* is (the device is simply offline). Both providers (Mistral and OpenAI-compatible) get the same treatment.

## [0.15.0]

**Not every question wants the same kind of research.** "How does cold water immersion influence inflammatory biomarkers…" is a measuring question; "How do athletes experience recovery…" is an understanding question — and that difference should surface *before* you hand questions to a qualitative coding workflow, not after. The Research Design copilot now proposes a **method fit** for every new research question — *qualitative*, *quantitative* or *mixed methods*, with a one-line rationale — and the review screen gives each question its own dropdown, so you adjust the proposal per question before anything lands. The fit travels with the question: it appears as an italic aside on the question line in the *New research questions* list (in your Artifact language), and it's stored in the structured agenda record. Downstream, **Export Quadro starter kit** now opens a selection screen first: every question arrives as a toggle, and questions with a *quantitative* fit are merely unticked by default — Quadro's extraction-based coding suits qualitative work, but you decide; nothing is blocked, and nothing is written until you confirm. Older notes keep working: agendas without method fits parse as before, and the aside is recognised (and stripped) cross-language when the kit reads questions back from your note.

## [0.14.0]

**One session per lens — parallax by construction.** Choosing several theoretical lenses and running one research pass used to flatten them into a single framework: the framework phase is deliberately singular, so one lens got developed and the others merely widened the search. Now, when two or more lenses are proposed, the Theory review screen offers **One session per lens**: pick your lenses and Parallax creates one session note per lens ("<question> — <lens>"), each carrying the full Theory artefact with *its* lens as the chosen one — so each session's framework, sub-questions and synthesis grow from its own theoretical viewpoint. Children link back to the parent (the familiar Context line), the parent keeps the complete artefact plus a logbook entry linking all lens sessions, and the project's Contents section indexes them automatically. Research deliberately does **not** auto-run n times — you start it per session, at your own pace, with the sidebar recommending it as the next step. Also: the search-results button is now labelled *Insert references at cursor* — references are writing material and belong at your cursor; that route records to the citation register as always. And because that sources list ends every research run, it now says so when your synthesis has already landed in the session — inserting references there is optional, not the landing of your research. The Quadro starter kit also got smarter about questions: no research agenda yet (say, the synthesis step failed offline)? It falls back to the session's decomposed sub-questions — real research questions the session already has.

## [0.13.0]

**Artefacts now land where they belong.** The copilot review screens used to offer "Insert only" — pasting the artefact as a loose block at wherever your cursor happened to be, outside the note's section structure, invisible to everything that reads sections (exports, records, the sidebar). Those buttons now name the actual landing:

- **In a research session**: one button — *Add to session* — and the artefact lands as its own `##` section, as always.
- **On a project hub**: *Add to a new session in this project* (the existing hub behaviour, now labelled honestly).
- **On a plain note without a session**: *Add to a new session note* creates a session right next to the note (project-linked when the note lives in a project folder) and lands the artefact there — or *Insert here* if you really want the loose block. That escape hatch only remains where no proper landing spot exists.
- **The research agenda** always runs inside a session, so its "Insert only" button is simply gone: the agenda lands as its section, with its record, every time.

Existing loose blocks in your notes keep being read (the tolerant fallbacks stay); new ones just stop being created unless you ask for them.

## [0.12.0]

**Your records now follow your notes.** Parallax keeps two path-keyed registries next to your notes (the citation register and the research-graph records). Two housekeeping improvements keep them truthful:

- **Renames and moves are followed automatically.** Rename a session note, move it into a project, or rename a whole project folder — the records repoint themselves, atomically and silently. Before this, a renamed note quietly lost its recorded adoptions, search strategy and findings-provenance.
- **Clean up records (missing notes)** — a new command for what deleting can't know: it lists everything that points at notes which no longer exist, grouped per missing folder (deleting a project is one tick), with nothing selected by default. Cleanup works at the level of *entries*, never references: a reference still used in an existing note always stays — only its dead entries are removed; a reference is only deleted when every use is gone *and* you ticked it. Nothing is written before you confirm, and the register is backed up first. Deliberately not automatic on delete: a deletion may be a sync hiccup or something you're about to undo.

## [0.11.0]

**Design the conversation before you have it.** A tenth artefact bridges your thinking to
qualitative fieldwork: run **Design interview guide (propose-only)** in a research session
and Parallax proposes a topic guide — up to ten questions, each carrying a visible
provenance label showing *why it's being asked*: which sub-question it serves, which
evidence gap it should close, which attacked assumption from your argument map it probes,
or which belief it tests. You adopt question by question; probes follow their question;
cancelling writes nothing. Adopting writes an **Interview guide** section (headings and
labels in your Artifact language) and stores the guide as records, so **Interview guide —
refresh** re-renders it without the LLM. When it's time to go out: **Interview guide —
export for fieldwork** writes a clean, plain-markdown protocol next to your note — title,
date and respondent fill-in lines, the questions and probes without the provenance
scaffolding — ready for paper, tablet or another vault, and pointing at the Quadro starter
kit's Data/ intake for what happens after the recording (Voxtral transcribes, Quadro codes).
Parallax designs and accounts for the conversation; conducting and analysing it stays yours.

## [0.10.0]

**From research design to qualitative analysis — a Quadro hand-off.** If your research agenda points to a qualitative study, Parallax now bridges you into [Quadro](https://github.com/chrisgrieser/obsidian-quadro) (the plain-markdown QDA plugin) with two new commands, built against conventions confirmed by Quadro's maintainer:

- **Quadro — export codebook (from lenses)**: your adopted theoretical lenses become a starting codebook (`Codes/<group>/<lens>.md`, rationale in the `code description` field Quadro itself uses) — an a-priori, deductive set to code with, next to the codes that emerge from your data.
- **Quadro — export starter kit**: a complete, copy-ready kit — `Data/` (with an intake README, including Voxtral Transcribe as the audio-to-transcript route), the codebook, and one extraction type per research question whose `Template.md` pre-fills Quadro's extraction form (Quadro's reserved fields are deliberately left alone). Both land under `Exports/` in your vault.
- **The methodological account now covers the analysis phase**: if this vault carries Quadro traces (its `progress.json`, your codebook), the account gains a "Qualitative analysis (Quadro)" section — codes created vs. assignments (a saturation signal), extractions, data files read, and the recorded period. Read-only and tolerant: no Quadro, no section, byte-identical account.

Everything is plain files: Parallax works fully without Quadro, and the kit stays readable even outside Obsidian. All texts follow your **Artifact language** (13 languages); the template field keys are deliberately stable English so tools can read them back.

## [0.9.0]

**The argument map grows up — and your project shows its shape.** Two additions complete
the visualisation ladder introduced in 0.8.0:

- **Argument — open as Canvas**: when the inline Mermaid map gets crowded, project the
  same argument structure onto a native `.canvas` file next to your note — claims on top,
  assumptions below, support edges green, attack edges red, all labeled. Rearrange it
  freely: re-running the command keeps your positions (matched by node id) and **never
  deletes anything you added yourself**; only Parallax-owned nodes that left the argument
  disappear. The inline map's "large map" hint now points here.
- **Connections — refresh (this note / this project)**: a generated **Connections**
  section turns invisible relations into real wikilinks — the project hub, parent and
  follow-up sessions, and "shares N sources" links to sessions citing the same references.
  With those links in place, Obsidian's own graph view on a project folder finally shows
  the project's shape (see the new "Graph view" section in the README for recommended
  settings). Support/attack semantics stay in the Mermaid/Canvas views — the graph view
  shows cohesion, not logic.

As always: sections respect your edits (replace is always asked), refreshes are
deterministic, and headings/labels follow your Artifact language.

## [0.8.0]

**Map the argument.** A ninth artefact makes the *logical skeleton* of your thinking
explicit: claims, assumptions, and the supports/attacks relations between them. Run **Map
the argument (propose-only)** in a research session and Parallax proposes a structure drawn
from your question, framing, beliefs, synthesis and challenges — you adopt it element by
element (uncheck what you disagree with; relations follow the endpoints you keep). Adopting
writes an **Argument structure** section into the note: numbered claims and assumptions,
readable relation lines, and an inline **Mermaid map** — claims as rectangles, assumptions
rounded, support edges solid, attack edges dotted, rendered natively by Obsidian with no
extra dependency. The structure is also stored as records, so **Argument — refresh map**
re-renders the section deterministically without touching the LLM. Everything respects your
edits: replacing a hand-edited section always asks first, and every adoption lands in the
logbook. Section headings and map labels follow your Artifact language (13 languages).

## [0.7.0]

**Your library is now a living link, not a one-time import.** Building on 0.6.0's read-only
`.bib` support, three new commands close the loop that the abandoned Zotero plugins left open:

- **Library — insert citation**: fuzzy-search your `.bib` (citekey, author, year, title) and
  insert a formatted reference at the cursor — recorded in the citation register like any
  search result, no network needed.
- **Library — update references (this note / this project)**: your reference manager fixed a
  year, corrected a title, changed a journal? Re-run the update and Parallax shows you exactly
  which fields would change — per reference, old → new — **before** anything is written. No
  silent overwrites, ever. References you marked as verified are never touched, and every
  applied update lands as a logbook event in the note.

The `.bib` file itself remains strictly read-only, and everything keeps working normally if
you never configure a library.

## [0.6.0]

**Parallax can now read your own reference library.** Point the new **Library file (.bib)**
setting at a BibTeX file in your vault — for example a Zotero Better BibTeX auto-export —
and run **Library — read .bib library** to load it. Parsing is deliberately tolerant: one
broken entry never blocks the rest (skipped entries are counted in the notice), duplicate
citekeys collapse to the newest state, and re-running the command simply picks up whatever
your reference manager exported since. The file is strictly read-only for Parallax: your
library stays yours, and there is no Zotero plugin or API coupling to break — the file is
the interface. Sources that reach the citation register via your library are marked with
their citekey and "library" origin. This is the foundation; inserting citations straight
from the library picker comes next.

## [0.5.0]

**The project hub now keeps its own table of contents.** A new **Contents** section lists
every note in the project folder as plain wikilinks — no Bases/Dataview dependency, so it
stays readable as plain markdown even outside Obsidian. It updates automatically whenever
Parallax creates or moves a note into the folder (a new question, a follow-up, starting a
project from an existing note, generating a methodological account); a new **Refresh project
contents** command catches notes added or renamed outside Parallax. Existing hubs only get
the section the next time something changes there — Parallax never mass-rewrites notes you
already have.

## [0.4.1]

Multi-line fields stay multi-line: on mobile (and sometimes on desktop) the growing text areas — like the project objective — could collapse to a single line when a modal opened before layout settled. They now keep a hard minimum height.

Selection-to-field, everywhere: following the same principle as the project-name suggestion, every command that opens an input now pre-fills it with your selected text. New in this release: **Quick search**, **Start research session** (a selected line is often the question itself) and **New question in this project** (a selection — say, an open hypothesis in the hub — now wins over the project objective). The research/explore/theory/challenge commands already worked this way.

## [0.4.0]

**Starting a project got smarter.** When you run *Start research project* from a note, Parallax now suggests a project name — the first line of your selection if you have one, otherwise the note's title. It's pre-filled and selected, so accepting costs nothing and replacing it costs one keystroke. (The option to move the current note into the new project was already there.)

Also, the last two hardcoded Dutch file names now follow your **Artifact language**: the project hub is created as "&lt;project&gt; — overview.md" (was "— overzicht.md"), and the register views ("bibliography-…", "register-overview") are named in your language too. Existing notes keep their names — Parallax never renames what's already yours.

## [0.3.2]

Finishes the artifact-language work from 0.2.0 — a handful of strings were still hardcoded Dutch and now follow your **Artifact language** setting:

- New session notes are named "&lt;question&gt; — session.md" in your language (was always "— sessie").
- The Context lines of follow-up sessions ("Follow-up question arising from…", "Parent session: [[…]]") are written in your language; notes written under any other language (including the old Dutch) keep being recognised.
- The project export's index line ("{n} session(s) exported.") follows your language.
- The sidebar's open-hypotheses list showed the internal Dutch tokens "overtuiging"/"richting" — now proper labels ("belief" / "follow-up direction").

Notes written by earlier versions keep their existing text — Parallax never rewrites your notes; new writes follow the setting.

## [0.3.1]

Polish on the new Steps sidebar, from first-use feedback:

- Buttons, explanations and group labels now scale with your font size.
- Explanations align vertically with their buttons.
- The "More" commands carry the same step labels where one applies (Theory / Evidence); register views and exports sit under a neutral "Register & exports" group.
- The alternative next step now has a hover hint, like the recommended one.

## [0.3.0]

**A clearer sidebar.** The action buttons ("Next step", "All steps" and "More") are now one integrated **Steps** list: every action on its own row with a short explanation of what it does, grouped in the same order as the workflow strip at the top (Explore → Frame → Theory → Challenge → Evidence → Design). The recommended next step is highlighted in place — with a context-aware explanation — instead of living in a separate section, and the "More" commands got the same row layout with explanations.

Also fixed: with a non-Dutch question, a few AI-generated fields (the scope note, the "would require a …" study design, mechanism phrasings) could come back in Dutch — the prompts behind them now carry language-neutral examples, so those fields follow the language of your question like the rest of the prose.

## [0.2.0]

**Artifact language — Parallax now writes in your language.** The section headings, labels and methodological account that Parallax writes into your notes are available in 13 languages: English (new default), Nederlands, Français, Deutsch, Español, Português, Italiano, Русский, 中文, हिन्दी, العربية, 日本語 and 한국어. Pick yours under **Settings → Artifact language**. The AI-written prose already followed the language of your question — now the surrounding structure does too.

- Existing notes keep working when you switch languages: section recognition matches invisible markers first, then heading text in any supported language.
- If you started on 0.1.x and want to keep the original Dutch artefacts, set **Artifact language** to *Nederlands* — the output is identical to before.
- The non-English/Dutch translations are machine-generated first versions — corrections from native speakers are very welcome on GitHub.
- Also: the Advanced settings section lost its internal "Route C" jargon in favour of plain descriptions.

## [0.1.1]

Maintenance release for the community plugin review: shortened the plugin description in `manifest.json` to fit the directory's 250-character limit. No functional changes.

## [0.1.0]

First public release of **Parallax** — research thinking, not research answers. A workbench that structures your research *thinking* and records it as artefacts in your own notes.

### Highlights

- **Free literature search, no API key**: quick single-provider search via [OpenAlex](https://openalex.org) (~250M scholarly works) straight into your note — keyless, no account.
- **Explore**: probe a problem before searching — implicit assumptions and counter-assumptions, competing definitions, reformulations, and search seeds beyond your original phrasing.
- **Theory**: grounded theoretical lenses to think with (*why it might apply, what it would predict*), including an eliminative list of tempting-but-weak theories.
- **Evidence**: multi-source literature research (OpenAlex + Semantic Scholar, rank fusion, transparent rerank) with a **graded synthesis** — strong/mixed/limited findings, evidence tiers per study design, honest "cannot be answered" sections, and clickable citations.
- **Challenge**: structured pushback on your framing along five dimensions, hardest against your recorded beliefs.
- **Beliefs**: track the convictions you bring, with status and revision history, confronted with each new synthesis — verdicts are proposals, you decide what to adopt.
- **Design**: turn a synthesis into a research agenda — gaps, sharper questions, fitting study designs — and open the next session in one click.
- **Methodological account**: a deterministic audit trail of your session — question, framing, lenses, search funnel, synthesis and beliefs — assembled from what actually happened, never written by a model about itself.
- **Parallax sidebar**: your position, a recommended next step, artefacts, evidence gaps and source↔finding provenance at a glance; sessions group into projects with a portable export bundle (JSON + methodological account + BibTeX).
- **Bring any LLM or none**: optional AI steps via Mistral or any OpenAI-compatible endpoint (incl. local Ollama); everything degrades gracefully without a key. No telemetry, no account, no cloud backend.

Works on desktop and mobile (Obsidian 1.5.0+).
