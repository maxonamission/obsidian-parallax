# Changelog

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
