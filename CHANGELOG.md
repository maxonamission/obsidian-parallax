# Changelog

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
