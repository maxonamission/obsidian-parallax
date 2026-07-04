# Parallax — Research Thinking

> **Research thinking, not research answers.**

Astronomers measure the distance of a star by looking at it from two points and watching it
shift: **parallax** — depth comes from changing your viewpoint. Research works the same way.
You only understand a question by looking at it from more than one angle: which assumptions
are you smuggling in, which theoretical lens are you (not) using, and does the evidence
actually support what you've come to believe?

Most AI tools for Obsidian answer questions: chat over your vault, summarise papers, generate
text. The hard part of research happens *before* any of that. **Parallax structures that
thinking process and records it as artefacts in your own notes** — so six months from now you
can still see not just *what* you concluded, but *how* and *why*.

An LLM proposes; **you decide, and you hold the pen**. Nothing is ever written over your own
thinking without asking.

<!-- SCREENSHOT: workbench sidebar next to a research session note -->

## Try it in 60 seconds — free, no API key

Install, open a note, run **Quick search (single provider)**, and insert real academic
references from [OpenAlex](https://openalex.org) (~250M scholarly works) straight into your
note — free, keyless, no account. Everything beyond that is opt-in.

## What a research session looks like

A session is a plain markdown note. A set of **copilots** works on it, each one propose-only:

1. **Explore** the problem before searching — implicit assumptions and their
   counter-assumptions, competing definitions, reformulations that would change your whole
   research programme, and search seeds you'd never find from your original phrasing.
2. **Theory** — theoretical lenses to think with, each grounded (*why it might apply here, what
   it would predict*), including the eliminative list: tempting theories that explain little.
3. **Evidence** — multi-source literature research (OpenAlex + Semantic Scholar, rank fusion, a
   transparent rerank) with a **graded** synthesis: findings labelled strong/mixed/limited,
   evidence tiers per study design, honest "cannot be answered with this evidence" sections,
   and clickable `[n]` citations. Free open-access full texts are fetched for the
   reading-recommendation sources when you deepen a finding.
4. **Challenge** — the sceptic of the suite: pushback on your framing along five dimensions,
   hardest against your recorded beliefs.
5. **Beliefs** — the convictions you bring, tracked with status and revision history, and
   confronted with each new synthesis. Verdicts are proposals; you tick what to adopt.
6. **Design** — a research agenda out of the synthesis: gaps, sharper questions, fitting study
   designs. One click opens the next session — the loop closes.
7. **Methodological account** — the audit trail as a deliverable: question, framing (and what
   it was chosen over), lenses (including the eliminated ones), search strategy with its
   funnel, synthesis and beliefs — assembled *deterministically* from what actually happened,
   never written by a model about itself.

The **Parallax sidebar** is the cockpit: where you are, a recommended next step
(never a straitjacket), your artefacts, the evidence gaps in your project, and source↔finding
provenance. Sessions group into **projects**; everything exports as a portable, reproducible
bundle (JSON + methodological account + BibTeX).

<!-- SCREENSHOT: graded synthesis with evidence tiers and clickable citations -->

## What Parallax is *not*

- **Not a chatbot.** There is no chat window. If you want to talk to your vault, Copilot and
  Smart Connections do that well.
- **Not a reference manager.** Already using Zotero Integration or Citations? Keep them — Parallax
  never manages your library; it *feeds* it (BibTeX export from its citation register).
- **Not a PDF reader or writing tool.** PDF++ and your editor own those.

Parallax is the layer those tools don't cover: the reasoning between question and conclusion.

## Why trust the output?

- **Graded, not generated-and-gone.** Findings carry evidence grades and study-design tiers;
  claims resting on abstracts say so; a resolving DOI marks *existence*, never content-truth.
- **Traceable.** Finding→source links are recorded at generation time; every inserted
  reference lands in a citation register with occurrence tracking and DOI verification.
- **Yours.** Copilots propose into review screens with adopt-toggles default-off. Re-running a
  step over a section you hand-edited asks before replacing — your edits are never collateral.

## Privacy — what leaves your machine

| Destination | What | When |
|---|---|---|
| api.openalex.org | search queries (+ optional contact e-mail) | every search |
| api.semanticscholar.org (US) | search queries | multi-source research |
| Your LLM endpoint — api.mistral.ai (EU) **or any OpenAI-compatible URL, incl. local Ollama** | question, sub-questions, abstracts, framing, beliefs + synthesis text | AI steps only (opt-in) |
| doi.org | DOIs | verification on insert |
| Publisher/OA hosts | open-access page fetch for reading-list sources | only when deepening |
| api.consensus.app | search queries | only with the optional Consensus provider |

Keys are stored locally in your vault config and never echoed in error messages. With a local
Ollama endpoint, all LLM traffic stays on your machine. No telemetry, no account, no cloud
backend of ours.

## Install

**Community plugins** → search for *Parallax* → Install → Enable.
Manual: copy `main.js`, `manifest.json`, `styles.css` from the latest
[release](../../releases) into `.obsidian/plugins/consensus-research/`.

Works on desktop and mobile (Obsidian 1.5.0+).

## Settings that matter

- **Artifact language**: the section headings, labels and methodological account Parallax
  writes into your notes come in 13 languages (English, Nederlands, Français, Deutsch,
  Español, Português, Italiano, Русский, 中文, हिन्दी, العربية, 日本語, 한국어). The AI-written
  prose always follows the language of your question.
- **Search**: OpenAlex (default, free) · Semantic Scholar (free; optional key for a faster
  lane) · Consensus (optional, paid).
- **AI (optional)**: Mistral (EU) or any OpenAI-compatible endpoint (OpenAI, Ollama, LM Studio,
  OpenRouter). Per-step model routing and reasoning effort — spend compute where it's read.
- **Everything degrades gracefully**: no LLM key → you still get multi-source search + rank
  fusion; a dropped connection → resume re-runs only the tail; a long run shows live progress
  and a Stop button.

## Support

Parallax is free and GPL-3.0. If it sharpens your research, you can
[**buy me a coffee** ☕](https://buymeacoffee.com/maxonamission) — it keeps the work going.

Issues and ideas: [GitHub issues](../../issues). Development happens in the
[automations](https://github.com/maxonamission/automations) repo; this repo carries releases.

## License

[GPL-3.0](LICENSE) — © 2026 Max Kloosterman
