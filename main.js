"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ParallaxPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian18 = require("obsidian");

// src/settings-tab.ts
var import_obsidian = require("obsidian");
var ParallaxSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    this.render();
  }
  /**
   * Full (re)render of the tab. Extracted from `display()` so in-tab refreshes (provider
   * switch, model-catalogue reload) can re-render without calling the deprecated-typed
   * `display()` entrypoint — Obsidian itself still invokes `display()` when opening the tab.
   */
  render() {
    var _a;
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Search provider").setDesc(
      'Provider for the single-source "Quick search (single provider)" command. The "Ask a question (AI \xB7 multi-source)" command always combines OpenAlex + Semantic Scholar, regardless of this choice.'
    ).addDropdown((d) => {
      d.addOption("openalex", "OpenAlex (free)").addOption("semanticscholar", "Semantic Scholar (free, optional key)").addOption("consensus", "Consensus (API key)").setValue(this.plugin.settings.provider).onChange(async (v) => {
        this.plugin.settings.provider = v;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("Contact e-mail (OpenAlex)").setDesc(
      `Optional. Opts into OpenAlex's faster "polite pool" and avoids rate limits \u2014 used by single-source OpenAlex and by route C. Not sent anywhere else.`
    ).addText(
      (t) => t.setPlaceholder("you@example.com").setValue(this.plugin.settings.openAlexMailto).onChange(async (v) => {
        this.plugin.settings.openAlexMailto = v.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Semantic Scholar API key").setDesc(
      createFragment((f) => {
        f.appendText(
          "Optional \u2014 works without one, but a free key raises the rate limit. Used by single-source Semantic Scholar and by route C. Request at "
        );
        f.createEl("a", {
          text: "semanticscholar.org/product/api",
          href: "https://www.semanticscholar.org/product/api#api-key-form"
        });
        f.appendText(". Stored locally; never shared.");
      })
    ).addText((t) => {
      t.setPlaceholder("optional").setValue(this.plugin.settings.semanticScholarApiKey).onChange(async (v) => {
        this.plugin.settings.semanticScholarApiKey = v.trim();
        await this.plugin.saveSettings();
      });
      t.inputEl.type = "password";
    });
    new import_obsidian.Setting(containerEl).setName("Consensus API key").setDesc(
      createFragment((f) => {
        f.appendText("Only needed for the Consensus provider. Request access at ");
        f.createEl("a", {
          text: "consensus.app/home/api",
          href: "https://consensus.app/home/api/"
        });
        f.appendText(".");
      })
    ).addText((t) => {
      t.setPlaceholder("sk-\u2026").setValue(this.plugin.settings.apiKey).onChange(async (v) => {
        this.plugin.settings.apiKey = v.trim();
        await this.plugin.saveSettings();
      });
      t.inputEl.type = "password";
    });
    new import_obsidian.Setting(containerEl).setName("Default format").setDesc("How references are rendered when inserted into a note.").addDropdown((d) => {
      d.addOption("detailed", "Detailed (with abstracts)").addOption("compact", "Compact list").addOption("bibliography", "Bibliography").setValue(this.plugin.settings.defaultFormat).onChange(async (v) => {
        this.plugin.settings.defaultFormat = v;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("Insert question as heading").setDesc("Prepend the research question as an H3 above the references.").addToggle(
      (t) => t.setValue(this.plugin.settings.insertQuestionHeading).onChange(async (v) => {
        this.plugin.settings.insertQuestionHeading = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Include abstracts").setDesc("Show the abstract under each paper in the detailed format.").addToggle(
      (t) => t.setValue(this.plugin.settings.includeAbstract).onChange(async (v) => {
        this.plugin.settings.includeAbstract = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Result limit").setDesc("How many papers to request (Consensus returns up to 20 per search).").addText(
      (t) => t.setValue(String(this.plugin.settings.resultLimit)).onChange(async (v) => {
        const n = Number(v);
        if (!Number.isNaN(n) && n > 0) {
          this.plugin.settings.resultLimit = Math.min(n, 20);
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian.Setting(containerEl).setName("Citation register").setHeading();
    new import_obsidian.Setting(containerEl).setName("Keep a citation register").setDesc(
      "Record every inserted reference in a central JSON file, so you can see which sources recur across notes and projects."
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.registerEnabled).onChange(async (v) => {
        this.plugin.settings.registerEnabled = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Register file").setDesc("Vault-relative path of the register JSON.").addText(
      (t) => t.setPlaceholder(".consensus-research/citations.json").setValue(this.plugin.settings.registerPath).onChange(async (v) => {
        this.plugin.settings.registerPath = v.trim() || ".consensus-research/citations.json";
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("AI research (route C)").setHeading();
    new import_obsidian.Setting(containerEl).setName("LLM provider").setDesc(
      'Which backend powers route C (decomposition, rerank embeddings, synthesis and the copilots). "OpenAI-compatible" also covers self-hosted/local servers such as Ollama or LM Studio \u2014 point baseUrl at them below.'
    ).addDropdown(
      (d) => d.addOption("mistral", "Mistral").addOption("openai-compat", "OpenAI-compatible (OpenAI, Ollama, LM Studio, \u2026)").setValue(this.plugin.settings.llmProvider).onChange(async (v) => {
        this.plugin.settings.llmProvider = v;
        await this.plugin.saveSettings();
        this.render();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Mistral API key").setDesc(
      createFragment((f) => {
        f.appendText(
          'Used when the LLM provider above is Mistral. Enables the "Ask a question (AI \xB7 multi-source)" command: question \u2192 sub-questions \u2192 multi-source search \u2192 rerank \u2192 AI synthesis. Without a key it falls back to multi-source search + fusion. Get one at '
        );
        f.createEl("a", { text: "console.mistral.ai", href: "https://console.mistral.ai/" });
        f.appendText(". Stored locally (EU); never shared.");
      })
    ).addText((t) => {
      t.setPlaceholder("optional").setValue(this.plugin.settings.mistralApiKey).onChange(async (v) => {
        this.plugin.settings.mistralApiKey = v.trim();
        await this.plugin.saveSettings();
      });
      t.inputEl.type = "password";
    });
    if (this.plugin.settings.llmProvider === "openai-compat") {
      new import_obsidian.Setting(containerEl).setName("OpenAI-compatible base URL").setDesc(
        "The endpoint's API root, no trailing slash. Examples: https://api.openai.com/v1 (OpenAI), http://localhost:11434/v1 (Ollama), http://localhost:1234/v1 (LM Studio), https://openrouter.ai/api/v1 (OpenRouter)."
      ).addText(
        (t) => t.setPlaceholder("https://api.openai.com/v1").setValue(this.plugin.settings.openaiCompatBaseUrl).onChange(async (v) => {
          this.plugin.settings.openaiCompatBaseUrl = v.trim() || "https://api.openai.com/v1";
          await this.plugin.saveSettings();
        })
      );
      new import_obsidian.Setting(containerEl).setName("OpenAI-compatible API key").setDesc("Optional \u2014 keyless is a valid config for a local server (Ollama, LM Studio with auth disabled). Never shared.").addText((t) => {
        t.setPlaceholder("optional").setValue(this.plugin.settings.openaiCompatApiKey).onChange(async (v) => {
          this.plugin.settings.openaiCompatApiKey = v.trim();
          await this.plugin.saveSettings();
        });
        t.inputEl.type = "password";
      });
      new import_obsidian.Setting(containerEl).setName("OpenAI-compatible chat model").setDesc(
        `Free text \u2014 no live catalogue fetch for this provider (unlike Mistral's "Refresh model list"). Examples: gpt-4o-mini (OpenAI), llama3.1 (Ollama).`
      ).addText(
        (t) => t.setPlaceholder("gpt-4o-mini").setValue(this.plugin.settings.openaiCompatChatModel).onChange(async (v) => {
          this.plugin.settings.openaiCompatChatModel = v.trim();
          await this.plugin.saveSettings();
        })
      );
      new import_obsidian.Setting(containerEl).setName("OpenAI-compatible embedding model").setDesc(
        "Used for the rerank step. Free text. Examples: text-embedding-3-small (OpenAI), nomic-embed-text (Ollama)."
      ).addText(
        (t) => t.setPlaceholder("text-embedding-3-small").setValue(this.plugin.settings.openaiCompatEmbedModel).onChange(async (v) => {
          this.plugin.settings.openaiCompatEmbedModel = v.trim();
          await this.plugin.saveSettings();
        })
      );
    }
    new import_obsidian.Setting(containerEl).setName("Pipeline phases").setHeading();
    new import_obsidian.Setting(containerEl).setName("Theoretical framework phase").setDesc(
      'Before the topic search, distil a short theoretical framework (central construct \u2192 working definition \u2192 dimensions from seminal sources) and let its dimensions steer the sub-questions. The "Build theoretical framework" command runs this regardless of this toggle.'
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.routeCFrameworkPhase).onChange(async (v) => {
        this.plugin.settings.routeCFrameworkPhase = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Review sub-questions before searching").setDesc(
      "After the question is split into sub-questions (and the framework, if on), pause to edit, add or remove them before the literature search runs. Editing here keeps source attribution accurate."
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.routeCSubQuestionCheckpoint).onChange(async (v) => {
        this.plugin.settings.routeCSubQuestionCheckpoint = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Cross-sector evidence").setDesc(
      'When the topic evidence is thin within its own domain, also search analogous sectors (e.g. healthcare, public administration, education) and offer the hits as clearly-labelled transfer evidence. Only fires on thin evidence; the "force cross-sector" command runs it regardless.'
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.routeCCrossSector).onChange(async (v) => {
        this.plugin.settings.routeCCrossSector = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Synthesis").setHeading();
    new import_obsidian.Setting(containerEl).setName("Output mode").setDesc(
      "Balanced uses the two toggles below. Public = practical and safe (lead with what is proven + a practical translation). Academic = more nuance + a section flagging hypothesis-forming directions and open questions. Public/Academic force both toggles on."
    ).addDropdown(
      (d) => d.addOption("balanced", "Balanced (use toggles)").addOption("public", "Public (practical, safe)").addOption("academic", "Academic (nuance, follow-ups)").setValue(this.plugin.settings.routeCOutputMode).onChange(async (v) => {
        this.plugin.settings.routeCOutputMode = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Weight evidence by study design").setDesc(
      "Tag each source by study design (review/meta-analysis > RCT > small study) and steer the synthesis to weight by it \u2014 claims resting only on small studies are flagged as hypothesis-forming, and the basis is shown next to each finding. On by default."
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.routeCEvidenceWeighting).onChange(async (v) => {
        this.plugin.settings.routeCEvidenceWeighting = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Calibrate claims").setDesc(
      "Steer the synthesis to avoid over-stating: hedge absolute claims, surface moderators and context-dependence, and keep distinct outcomes apart. On by default."
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.routeCClaimCalibration).onChange(async (v) => {
        this.plugin.settings.routeCClaimCalibration = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Auto-deepen findings").setDesc(
      'After the synthesis, automatically add a deepening under each finding (specific numbers, methods, mechanisms) drawing on \u2014 and citing \u2014 the whole bibliography. Off by default; adds one LLM call per finding (a run with 6 findings adds 6 calls). The "Deepen selected finding(s)" command works regardless. The usage summary after each run reports the total tokens spent.'
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.routeCAutoDeepen).onChange(async (v) => {
        this.plugin.settings.routeCAutoDeepen = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Reading recommendations").setDesc(
      'Add an "Aanrader om volledig te lezen" section: a short, prioritised shortlist of which sources are most worth reading in full (and why). The full texts are often paywalled, so fetching them is a separate manual step. On by default.'
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.routeCReadingTips).onChange(async (v) => {
        this.plugin.settings.routeCReadingTips = v;
        await this.plugin.saveSettings();
      })
    );
    const adv = containerEl.createEl("details");
    adv.createEl("summary", { text: "Advanced" });
    new import_obsidian.Setting(adv).setName("Route C retrieval tuning").setHeading();
    new import_obsidian.Setting(adv).setName("Max results").setDesc('Upper bound on how many reranked papers "Ask a question (AI \xB7 multi-source)" returns. The selection is weighted, so this is just the ceiling.').addText(
      (t) => t.setValue(String(this.plugin.settings.routeCMaxResults)).onChange(async (v) => {
        const n = Number(v);
        if (!Number.isNaN(n) && n > 0) {
          this.plugin.settings.routeCMaxResults = Math.min(Math.floor(n), 60);
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian.Setting(adv).setName("Min results").setDesc("Lower bound \u2014 always keep at least this many, even if scores are low.").addText(
      (t) => t.setValue(String(this.plugin.settings.routeCMinResults)).onChange(async (v) => {
        const n = Number(v);
        if (!Number.isNaN(n) && n > 0) {
          this.plugin.settings.routeCMinResults = Math.min(Math.floor(n), 60);
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian.Setting(adv).setName("Keep ratio").setDesc("Weighted cutoff (0\u20131): keep papers scoring at least this fraction of the top result. Lower = more inclusive; clamped by min/max.").addText(
      (t) => t.setValue(String(this.plugin.settings.routeCKeepRatio)).onChange(async (v) => {
        const n = Number(v);
        if (!Number.isNaN(n) && n > 0 && n <= 1) {
          this.plugin.settings.routeCKeepRatio = n;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian.Setting(adv).setName("Relevance keep").setDesc("Topicality gate (0\u20131): keep this fraction of candidates ranked by semantic match to the question, dropping the least-on-topic tail before the weighted cutoff. Lower = stricter (less noise); 1 = off. Protected by the min bound.").addText(
      (t) => t.setValue(String(this.plugin.settings.routeCRelevanceKeep)).onChange(async (v) => {
        const n = Number(v);
        if (!Number.isNaN(n) && n > 0 && n <= 1) {
          this.plugin.settings.routeCRelevanceKeep = n;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian.Setting(adv).setName("Debug logging").setDesc(
      'Write a "Parallax debug" note with what "Ask a question (AI \xB7 multi-source)" did (sub-questions, queries, per-source result counts). Handy on mobile, where the dev console is out of reach.'
    ).addToggle(
      (t) => t.setValue(this.plugin.settings.debugLogging).onChange(async (v) => {
        this.plugin.settings.debugLogging = v;
        await this.plugin.saveSettings();
      })
    );
    const catalog = (_a = this.plugin.settings.mistralModelCatalog) != null ? _a : [];
    const chatModels = catalog.filter((m) => m.chat).map((m) => m.id);
    const allModels = catalog.map((m) => m.id);
    const labelFor = (id) => {
      var _a2;
      return ((_a2 = catalog.find((m) => m.id === id)) == null ? void 0 : _a2.reasoning) ? `${id} \xB7 reasoning` : id;
    };
    const modelDropdown = (setting, candidates, get, set, globalOption) => {
      setting.addDropdown((d) => {
        if (globalOption !== null) d.addOption("", globalOption);
        const ids = [...candidates];
        const cur = get();
        if (cur && !ids.includes(cur)) ids.push(cur);
        if (ids.length === 0) ids.push(cur || "mistral-small-latest");
        for (const id of ids) d.addOption(id, labelFor(id));
        d.setValue(cur).onChange(async (v) => {
          set(v);
          await this.plugin.saveSettings();
        });
      });
    };
    new import_obsidian.Setting(adv).setName("Mistral model list").setDesc(
      catalog.length > 0 ? `${catalog.length} model(s) loaded \u2014 the dropdowns below use this list (\xB7 reasoning = supports a thinking pass). Refresh to update.` : "No models loaded yet. Click to fetch the current models from your Mistral account, so the dropdowns below are real choices instead of free text."
    ).addButton(
      (b) => b.setButtonText(catalog.length > 0 ? "Refresh model list" : "Load model list").onClick(async () => {
        if (!this.plugin.settings.mistralApiKey.trim()) {
          new import_obsidian.Notice("Set a Mistral API key first.");
          return;
        }
        b.setDisabled(true).setButtonText("Loading\u2026");
        try {
          const models = await this.plugin.llm.listModels();
          this.plugin.settings.mistralModelCatalog = models;
          await this.plugin.saveSettings();
          new import_obsidian.Notice(`Loaded ${models.length} Mistral model(s).`);
          this.render();
        } catch (e) {
          new import_obsidian.Notice(`Could not load models: ${String(e)}`);
          b.setDisabled(false).setButtonText("Refresh model list");
        }
      })
    );
    modelDropdown(
      new import_obsidian.Setting(adv).setName("Mistral chat model").setDesc("The global default for every route C step (decompose, framework, synthesis, deepen, cross-sector). Per-step overrides below."),
      chatModels,
      () => this.plugin.settings.mistralChatModel,
      (v) => {
        this.plugin.settings.mistralChatModel = v || "mistral-small-latest";
      },
      null
    );
    new import_obsidian.Setting(adv).setName("Per-step model overrides (route C)").setHeading();
    const stepModel = (step, name, desc) => {
      modelDropdown(
        new import_obsidian.Setting(adv).setName(name).setDesc(desc),
        chatModels,
        () => {
          var _a2;
          return (_a2 = this.plugin.settings.routeCStepModels[step]) != null ? _a2 : "";
        },
        (v) => {
          if (v) this.plugin.settings.routeCStepModels[step] = v;
          else delete this.plugin.settings.routeCStepModels[step];
        },
        "(use global chat model)"
      );
    };
    stepModel(
      "synthesis",
      "Model \u2014 synthesis",
      "The graded answer; the step most worth a stronger model (e.g. mistral-medium-latest). Enable reasoning below for a thinking pass."
    );
    stepModel(
      "deepen",
      "Model \u2014 deepen",
      "Per-finding deepening. Strong helps, but it runs once per finding \u2014 mind the cost with auto-deepen on."
    );
    stepModel(
      "decompose",
      "Model \u2014 decompose",
      "Splitting the question into sub-questions. A cheaper model is usually fine here."
    );
    stepModel(
      "framework",
      "Model \u2014 framework",
      "The theoretical-framework phase (construct, definition, dimensions)."
    );
    stepModel(
      "crosssector",
      "Model \u2014 cross-sector",
      "The analogous-sector transfer step. A cheaper model is usually fine here."
    );
    new import_obsidian.Setting(adv).setName("Per-step reasoning effort (route C)").setHeading();
    new import_obsidian.Setting(adv).setDesc(
      `Let a step think before answering. Off by default. Reasoning helps synthesis (and deepen) most; it is usually wasted tokens on the straightforward steps. The thinking is dropped from the output. Supported levels are model-specific \u2014 if you pick one the model doesn't support, the call automatically uses the cheapest level it DOES support (e.g. mistral-medium-latest only offers "high"), shown in the debug log; pick "off" to skip reasoning. On a model with only "high", reasoning is effectively all-or-nothing \u2014 which matters most for deepen (it runs once per finding). Magistral is deprecated. Only the ACTIVE provider's supported levels are offered here (E53) \u2014 the OpenAI-compatible provider offers only "off" for now (see openai-compat-provider.ts).`
    );
    const stepReasoning = (step, name, desc) => {
      new import_obsidian.Setting(adv).setName(name).setDesc(desc).addDropdown((d) => {
        for (const e of this.plugin.llm.capabilities.reasoningEfforts) {
          d.addOption(e, e === "off" ? "off (no reasoning)" : e);
        }
        d.setValue(this.plugin.settings.routeCStepReasoning[step] || "off").onChange(async (v) => {
          if (v && v !== "off") this.plugin.settings.routeCStepReasoning[step] = v;
          else delete this.plugin.settings.routeCStepReasoning[step];
          await this.plugin.saveSettings();
        });
      });
    };
    stepReasoning(
      "synthesis",
      "Reasoning \u2014 synthesis",
      "The graded answer; the step most likely to benefit from a thinking pass."
    );
    stepReasoning(
      "deepen",
      "Reasoning \u2014 deepen",
      "Per-finding deepening. Can help faithfulness, but runs once per finding \u2014 mind the cost."
    );
    stepReasoning(
      "decompose",
      "Reasoning \u2014 decompose",
      "Splitting into sub-questions \u2014 usually straightforward; off is normally fine."
    );
    stepReasoning(
      "framework",
      "Reasoning \u2014 framework",
      "The theoretical-framework phase \u2014 off is normally fine."
    );
    stepReasoning(
      "crosssector",
      "Reasoning \u2014 cross-sector",
      "The analogous-sector transfer step \u2014 off is normally fine."
    );
    modelDropdown(
      new import_obsidian.Setting(adv).setName("Mistral embedding model").setDesc("Used for the rerank (e.g. mistral-embed)."),
      allModels,
      () => this.plugin.settings.mistralEmbedModel,
      (v) => {
        this.plugin.settings.mistralEmbedModel = v || "mistral-embed";
      },
      null
    );
    new import_obsidian.Setting(adv).setName("API base URL").setDesc("Override only if Consensus changes the endpoint or version.").addText(
      (t) => t.setValue(this.plugin.settings.apiBaseUrl).onChange(async (v) => {
        this.plugin.settings.apiBaseUrl = v.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(adv).setName("API key header").setDesc("Header used to send the key. Default: X-API-Key.").addText(
      (t) => t.setValue(this.plugin.settings.apiKeyHeader).onChange(async (v) => {
        this.plugin.settings.apiKeyHeader = v.trim() || "X-API-Key";
        await this.plugin.saveSettings();
      })
    );
  }
};

// src/search-modal.ts
var import_obsidian3 = require("obsidian");

// src/modal-chrome.ts
var import_obsidian2 = require("obsidian");
var FOCUS_SCROLL_DELAY_MS = 280;
var VIEWPORT_MARGIN_PX = 16;
function modalMaxHeight(viewportHeight, margin = VIEWPORT_MARGIN_PX) {
  return Math.max(0, viewportHeight - margin);
}
function rowsForLines(lineCount, minRows) {
  return Math.max(minRows, lineCount + 1);
}
function makeAutoGrowTextarea(textarea, minRows = 2) {
  textarea.rows = minRows;
  const resize = () => {
    textarea.setCssStyles({ height: "auto" });
    textarea.setCssStyles({ height: `${textarea.scrollHeight}px` });
  };
  textarea.addEventListener("input", resize);
  resize();
  return resize;
}
function attachKeyboardAvoidance(modal) {
  const { contentEl } = modal;
  const vv = window.visualViewport;
  const onViewportResize = () => {
    if (!vv) return;
    const top = contentEl.getBoundingClientRect().top;
    contentEl.setCssStyles({ maxHeight: `${modalMaxHeight(vv.height - top)}px` });
  };
  if (vv) {
    vv.addEventListener("resize", onViewportResize);
    onViewportResize();
  }
  let focusTimeout;
  const onFocusIn = (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) return;
    window.clearTimeout(focusTimeout);
    focusTimeout = window.setTimeout(() => {
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    }, FOCUS_SCROLL_DELAY_MS);
  };
  contentEl.addEventListener("focusin", onFocusIn);
  return () => {
    if (vv) vv.removeEventListener("resize", onViewportResize);
    contentEl.removeEventListener("focusin", onFocusIn);
    window.clearTimeout(focusTimeout);
    contentEl.setCssStyles({ maxHeight: "" });
  };
}
function applyModalChrome(modal) {
  modal.modalEl.addClass("consensus-modal");
  if (!import_obsidian2.Platform.isMobile) return;
  const cleanup = attachKeyboardAvoidance(modal);
  const originalOnClose = modal.onClose.bind(modal);
  modal.onClose = () => {
    cleanup();
    originalOnClose();
  };
}

// src/search-modal.ts
var SearchModal = class extends import_obsidian3.Modal {
  constructor(app, initialQuery, supportsMedicalFilters, onSubmit, hint) {
    super(app);
    this.filters = {};
    this.submitted = false;
    this.query = initialQuery;
    this.supportsMedicalFilters = supportsMedicalFilters;
    this.onSubmit = onSubmit;
    this.hint = hint;
  }
  onOpen() {
    const { contentEl } = this;
    applyModalChrome(this);
    contentEl.createEl("h2", { text: "Ask Parallax" });
    if (this.hint) contentEl.createEl("p", { text: this.hint, cls: "consensus-handoff-hint" });
    contentEl.createEl("label", { text: "Research question", cls: "consensus-search-label" });
    contentEl.createEl("div", {
      text: 'Phrased as you would search \u2014 e.g. "does spaced repetition improve retention".',
      cls: "setting-item-description"
    });
    const ta = contentEl.createEl("textarea", { cls: "consensus-search-input" });
    ta.value = this.query;
    ta.placeholder = "Type your question\u2026";
    ta.addEventListener("input", () => this.query = ta.value);
    makeAutoGrowTextarea(ta, 3);
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        this.submit();
      }
    });
    if (!import_obsidian3.Platform.isMobile) window.setTimeout(() => ta.focus(), 0);
    const details = contentEl.createEl("details", { cls: "consensus-filters" });
    details.createEl("summary", { text: "Filters (optional)" });
    new import_obsidian3.Setting(details).setName("Published from year").addText((t) => {
      t.setPlaceholder("e.g. 2018").onChange((v) => {
        const n = Number(v);
        this.filters.yearMin = v && !Number.isNaN(n) ? n : void 0;
      });
    });
    new import_obsidian3.Setting(details).setName("Peer-reviewed only").addToggle((t) => {
      t.setValue(false).onChange((v) => this.filters.excludePreprints = v || void 0);
    });
    if (this.supportsMedicalFilters) {
      new import_obsidian3.Setting(details).setName("Human studies only").addToggle((t) => {
        t.setValue(false).onChange((v) => this.filters.humanOnly = v || void 0);
      });
    }
    new import_obsidian3.Setting(contentEl).addButton(
      (b) => b.setButtonText("Search").setCta().onClick(() => this.submit())
    );
  }
  submit() {
    const q = this.query.trim();
    if (!q) return;
    this.submitted = true;
    this.onSubmit({ query: q, filters: this.filters });
    this.close();
  }
  onClose() {
    this.contentEl.empty();
    if (!this.submitted) this.onSubmit(null);
  }
};

// src/project-modal.ts
var import_obsidian4 = require("obsidian");
var ProjectModal = class extends import_obsidian4.Modal {
  constructor(app, moveEligible, onSubmit) {
    super(app);
    this.moveEligible = moveEligible;
    this.name = "";
    this.objective = "";
    this.moveNote = true;
    this.submitted = false;
    this.onSubmit = onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    applyModalChrome(this);
    contentEl.createEl("h2", { text: "Start research project" });
    contentEl.createEl("p", {
      text: "A project = a folder with one session note per research question. The objective becomes the first artefact in the project hub; the individual questions operationalise it.",
      cls: "consensus-handoff-hint"
    });
    contentEl.createEl("label", { text: "Project name", cls: "consensus-search-label" });
    contentEl.createEl("div", { text: "Becomes the folder name and the hub note's title.", cls: "setting-item-description" });
    const nameEl = contentEl.createEl("input", { cls: "consensus-search-input", type: "text" });
    nameEl.placeholder = "e.g. Talent development in speed skating";
    nameEl.addEventListener("input", () => this.name = nameEl.value);
    nameEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.submit();
      }
    });
    contentEl.createEl("label", { text: "Research objective", cls: "consensus-search-label" });
    contentEl.createEl("div", {
      text: "What do you ultimately want to understand or achieve with this project? Becomes the first artefact (## Doelstelling).",
      cls: "setting-item-description"
    });
    const objEl = contentEl.createEl("textarea", { cls: "consensus-search-input" });
    objEl.placeholder = "Describe the aim or the reason for the project\u2026";
    objEl.addEventListener("input", () => this.objective = objEl.value);
    makeAutoGrowTextarea(objEl, 4);
    objEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        this.submit();
      }
    });
    if (this.moveEligible) {
      new import_obsidian4.Setting(contentEl).setName("Move the current note into the project").addToggle((t) => t.setValue(this.moveNote).onChange((v) => this.moveNote = v));
    }
    new import_obsidian4.Setting(contentEl).addButton(
      (b) => b.setButtonText("Create project").setCta().onClick(() => this.submit())
    );
    if (!import_obsidian4.Platform.isMobile) window.setTimeout(() => nameEl.focus(), 0);
  }
  submit() {
    const name = this.name.trim();
    if (!name) return;
    this.submitted = true;
    this.onSubmit({ name, objective: this.objective.trim(), moveNote: this.moveEligible && this.moveNote });
    this.close();
  }
  onClose() {
    this.contentEl.empty();
    if (!this.submitted) this.onSubmit(null);
  }
};

// src/results-modal.ts
var import_obsidian5 = require("obsidian");

// src/evidence-tier.ts
var STRONG_RE = /\b(meta-?analy(?:s|z)|systematic review|cochrane|umbrella review|network meta)/i;
var MODERATE_RE = /(randomi[sz]ed[ -]?controlled|\brct\b|\brcts\b|controlled trial|randomi[sz]ed trial)/i;
var PROTOCOL_RE = /\bprotocol\b/i;
var S2_STRONG_TYPES = /* @__PURE__ */ new Set(["Review", "MetaAnalysis"]);
var S2_MODERATE_TYPES = /* @__PURE__ */ new Set(["ClinicalTrial"]);
function classifyFromMetadata(types) {
  if (!types || types.length === 0) return null;
  if (types.some((t) => S2_STRONG_TYPES.has(t))) return "strong";
  if (types.some((t) => S2_MODERATE_TYPES.has(t))) return "moderate";
  return null;
}
function classifyFromTitle(title) {
  const t = title != null ? title : "";
  if (PROTOCOL_RE.test(t)) return "limited";
  if (STRONG_RE.test(t)) return "strong";
  if (MODERATE_RE.test(t)) return "moderate";
  return "limited";
}
function classifyEvidenceTier(paper) {
  const fromMetadata = classifyFromMetadata(paper.publicationTypes);
  if (fromMetadata) return fromMetadata;
  return classifyFromTitle(paper.title);
}
function evidenceTierLabel(tier) {
  switch (tier) {
    case "strong":
      return "review/meta-analyse";
    case "moderate":
      return "RCT";
    case "limited":
      return "hypothesevormend";
  }
}
function evidenceTierTag(tier) {
  return `[evidence: ${tier}]`;
}

// src/citation-register.ts
var REGISTER_VERSION = 1;
function emptyRegister() {
  return { version: REGISTER_VERSION, citations: [] };
}
function normalizeDoi(raw) {
  if (!raw) return void 0;
  const bare = raw.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").replace(/^doi:/i, "").toLowerCase().trim();
  return bare.length > 0 ? bare : void 0;
}
function titleFingerprint(title) {
  return title.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "");
}
function citationKey(paper) {
  const doi = normalizeDoi(paper.doi);
  if (doi) return `doi:${doi}`;
  if (paper.isbn) {
    const isbn = paper.isbn.replace(/[^0-9xX]/g, "").toLowerCase();
    if (isbn) return `isbn:${isbn}`;
  }
  return `title:${titleFingerprint(paper.title)}`;
}
function persistableIdentifier(status) {
  return status === "unreachable" ? void 0 : status;
}
function paperToRecord(paper, key) {
  return {
    key,
    title: paper.title,
    authors: [...paper.authors],
    year: paper.year,
    journal: paper.journal,
    doi: normalizeDoi(paper.doi),
    isbn: void 0,
    url: paper.url,
    verified: false,
    identifier: persistableIdentifier(paper.verification),
    occurrences: []
  };
}
function enrichRecord(record, paper) {
  if (record.authors.length === 0 && paper.authors.length > 0) {
    record.authors = [...paper.authors];
  }
  if (record.year == null && paper.year != null) record.year = paper.year;
  if (!record.journal && paper.journal) record.journal = paper.journal;
  if (!record.doi) record.doi = normalizeDoi(paper.doi);
  if (!record.url && paper.url) record.url = paper.url;
  const fresh = persistableIdentifier(paper.verification);
  if (fresh && record.identifier !== "resolved") {
    record.identifier = fresh;
  }
}
function upsertCitation(register, paper, occurrence) {
  const key = citationKey(paper);
  const existing = register.citations.find((c) => c.key === key);
  if (!existing) {
    const record = paperToRecord(paper, key);
    record.occurrences.push({ ...occurrence });
    register.citations.push(record);
    return {
      register,
      record,
      existed: false,
      previousOccurrences: [],
      occurrenceAdded: true
    };
  }
  const previousOccurrences = existing.occurrences.map((o) => ({ ...o }));
  enrichRecord(existing, paper);
  const alreadyInNote = existing.occurrences.some((o) => o.note === occurrence.note);
  if (!alreadyInNote) {
    existing.occurrences.push({ ...occurrence });
  }
  return {
    register,
    record: existing,
    existed: true,
    previousOccurrences,
    occurrenceAdded: !alreadyInNote
  };
}
function serializeRegister(register) {
  return JSON.stringify(register, null, 2) + "\n";
}
function sanitizeOccurrence(raw) {
  if (!raw || typeof raw !== "object") return null;
  const o = raw;
  if (typeof o.note !== "string" || typeof o.date !== "string") return null;
  const occ = { note: o.note, date: o.date };
  if (typeof o.project === "string" && o.project) occ.project = o.project;
  return occ;
}
function sanitizeRecord(raw) {
  if (!raw || typeof raw !== "object") return null;
  const r = raw;
  if (typeof r.key !== "string" || typeof r.title !== "string") return null;
  const occurrences = Array.isArray(r.occurrences) ? r.occurrences.map(sanitizeOccurrence).filter((o) => o !== null) : [];
  return {
    key: r.key,
    title: r.title,
    authors: Array.isArray(r.authors) ? r.authors.filter((a) => typeof a === "string") : [],
    year: typeof r.year === "number" ? r.year : void 0,
    journal: typeof r.journal === "string" ? r.journal : void 0,
    doi: typeof r.doi === "string" ? r.doi : void 0,
    isbn: typeof r.isbn === "string" ? r.isbn : void 0,
    url: typeof r.url === "string" ? r.url : "",
    verified: r.verified === true,
    identifier: r.identifier === "resolved" || r.identifier === "unresolved" || r.identifier === "missing" ? r.identifier : void 0,
    occurrences
  };
}
function parseRegister(text) {
  if (!text || text.trim().length === 0) return emptyRegister();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch (e) {
    return emptyRegister();
  }
  if (!payload || typeof payload !== "object") return emptyRegister();
  const p = payload;
  const citations = Array.isArray(p.citations) ? p.citations.map(sanitizeRecord).filter((c) => c !== null) : [];
  return {
    version: typeof p.version === "number" ? p.version : REGISTER_VERSION,
    citations
  };
}
function shouldBackupCorrupt(raw, parsedEmpty) {
  if (!parsedEmpty) return false;
  if (!raw) return false;
  const trimmed = raw.trim();
  if (trimmed.length <= 2) return false;
  return true;
}

// src/fulltext.ts
var DEFAULT_MAX_CHARS_PER_SOURCE = 2e4;
var DEFAULT_MAX_SOURCES_PER_RUN = 5;
function isPdfUrl(url) {
  if (!url) return false;
  const path = url.split(/[?#]/)[0];
  return /\.pdf$/i.test(path);
}
function isPdfContentType(contentType) {
  return !!contentType && contentType.toLowerCase().includes("pdf");
}
function findHeader(headers, name) {
  if (!headers) return void 0;
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === lower) return v;
  }
  return void 0;
}
function qualifiesForOaFetch(paper) {
  return !!paper.oaUrl && !isPdfUrl(paper.oaUrl);
}
function selectFetchCandidates(papers, recommendations, maxSources = DEFAULT_MAX_SOURCES_PER_RUN) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const r of recommendations) {
    const paper = papers[r.source - 1];
    if (!paper || !qualifiesForOaFetch(paper)) continue;
    const key = citationKey(paper);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(paper);
    if (out.length >= maxSources) break;
  }
  return out;
}
function stripHtml(html) {
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  const withoutTags = withoutScripts.replace(/<[^>]+>/g, " ");
  const decoded = withoutTags.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#0?39;/gi, "'");
  return decoded.replace(/\s+/g, " ").trim();
}
function truncateFulltext(text, maxChars) {
  const trimmed = text.trim();
  return trimmed.length > maxChars ? `${trimmed.slice(0, maxChars).trimEnd()}\u2026` : trimmed;
}
async function fetchOaTexts(papers, recommendations, cache, http, opts = {}) {
  var _a, _b, _c, _d, _e, _f, _g;
  const maxChars = (_a = opts.maxCharsPerSource) != null ? _a : DEFAULT_MAX_CHARS_PER_SOURCE;
  const maxSources = (_b = opts.maxSourcesPerRun) != null ? _b : DEFAULT_MAX_SOURCES_PER_RUN;
  const candidates = selectFetchCandidates(papers, recommendations, maxSources);
  const next = { ...cache };
  let fetchedCount = 0;
  for (const paper of candidates) {
    if ((_c = opts.cancellation) == null ? void 0 : _c.cancelled) break;
    const key = citationKey(paper);
    if (next[key]) continue;
    try {
      const res = await http({
        url: paper.oaUrl,
        method: "GET",
        headers: { Accept: "text/html,application/xhtml+xml,application/pdf;q=0.5,*/*;q=0.1" }
      });
      if (res.status < 200 || res.status >= 300) {
        (_d = opts.log) == null ? void 0 : _d.call(opts, `fulltext fetch: ${res.status} for ${key}`);
        continue;
      }
      if (isPdfContentType(findHeader(res.headers, "content-type"))) {
        next[key] = { pdfOnly: true, fetchedAt: Date.now() };
        continue;
      }
      const text = truncateFulltext(stripHtml((_e = res.text) != null ? _e : ""), maxChars);
      if (!text) {
        (_f = opts.log) == null ? void 0 : _f.call(opts, `fulltext fetch: empty body for ${key}`);
        continue;
      }
      next[key] = { text, fetchedAt: Date.now() };
      fetchedCount += 1;
    } catch (e) {
      (_g = opts.log) == null ? void 0 : _g.call(opts, `fulltext fetch failed for ${key}`, e instanceof Error ? e.message : String(e));
    }
  }
  return { cache: next, fetchedCount };
}
function renderOaBadge(paper) {
  if (!(paper == null ? void 0 : paper.oaUrl)) return "waarschijnlijk achter een paywall";
  return isPdfUrl(paper.oaUrl) ? `[OA beschikbaar (pdf)](${paper.oaUrl})` : `[OA beschikbaar](${paper.oaUrl})`;
}

// src/errors.ts
var SearchApiError = class extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "SearchApiError";
  }
};

// src/llm-routing.ts
var REASONING_EFFORTS = ["off", "minimal", "low", "medium", "high", "xhigh"];
function resolveStepModel(settings, step) {
  const perStep = settings.routeCStepModels[step];
  return (perStep != null ? perStep : "").trim() || settings.mistralChatModel;
}
function resolveStepReasoning(settings, step) {
  const v = settings.routeCStepReasoning[step];
  return (v != null ? v : "").trim() || "off";
}

// src/mistral-api.ts
var MISTRAL_BASE = "https://api.mistral.ai/v1";
function extractJsonObject(raw) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  return start >= 0 && end > start ? raw.slice(start, end + 1) : raw;
}
var REASONING_EFFORTS2 = REASONING_EFFORTS;
function parseSupportedEfforts(reason) {
  const out = [];
  for (const m of reason.matchAll(/'([a-z]+)'/gi)) {
    const e = m[1].toLowerCase();
    if (e !== "none" && e !== "off" && REASONING_EFFORTS2.includes(e) && !out.includes(e)) {
      out.push(e);
    }
  }
  return out.sort((a, b) => REASONING_EFFORTS2.indexOf(a) - REASONING_EFFORTS2.indexOf(b));
}
function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
function isTransientStatus(status) {
  return status === 429 || status >= 500 && status < 600;
}
function extractUsage(payload) {
  if (payload && typeof payload === "object") {
    const usage = payload.usage;
    if (usage && typeof usage === "object") {
      const u = usage;
      const num = (v) => typeof v === "number" ? v : void 0;
      return { prompt: num(u.prompt_tokens), completion: num(u.completion_tokens), total: num(u.total_tokens) };
    }
  }
  return {};
}
function requireKey(settings) {
  const key = settings.mistralApiKey.trim();
  if (!key) {
    throw new SearchApiError("Set your Mistral API key in the plugin settings to use the AI features.", 0);
  }
  return key;
}
function authHeaders(key) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${key}`
  };
}
function stripThinking(text) {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}
function extractChatContent(payload) {
  if (!payload || typeof payload !== "object") return "";
  const choices = payload.choices;
  if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== "object") return "";
  const message = choices[0].message;
  if (!message || typeof message !== "object") return "";
  const content = message.content;
  if (typeof content === "string") return stripThinking(content);
  if (Array.isArray(content)) {
    const text = content.map((chunk) => {
      if (typeof chunk === "string") return chunk;
      if (chunk && typeof chunk === "object") {
        const c = chunk;
        if (c.type === "text" && typeof c.text === "string") return c.text;
      }
      return "";
    }).join("");
    return stripThinking(text);
  }
  return "";
}
function errorMessage(payload) {
  var _a, _b;
  if (!payload || typeof payload !== "object") return "";
  const p = payload;
  const raw = (_b = (_a = p.message) != null ? _a : p.detail) != null ? _b : p.error;
  const text = typeof raw === "string" ? raw : raw && typeof raw === "object" ? JSON.stringify(raw) : "";
  return text.replace(/\s+/g, " ").trim().slice(0, 200);
}
async function mistralChat(messages, opts, settings, http, net = {}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const key = requireKey(settings);
  const model = opts.model || settings.mistralChatModel;
  const body = { model, messages };
  if (opts.temperature != null) body.temperature = opts.temperature;
  let effort = net.reasoningEffort && net.reasoningEffort !== "off" ? net.reasoningEffort : "";
  let reasoningApplied = !!effort;
  const applyShape = () => {
    delete body.prompt_mode;
    delete body.reasoning_effort;
    delete body.response_format;
    if (reasoningApplied && effort) {
      body.reasoning_effort = effort;
    } else if (opts.json) {
      body.response_format = { type: "json_object" };
    }
  };
  applyShape();
  const retries = (_a = net.retries) != null ? _a : 2;
  const networkRetries = (_b = net.networkRetries) != null ? _b : 4;
  const backoffMs = (_c = net.backoffMs) != null ? _c : 800;
  const label = net.label ? `${net.label} ` : "";
  let triedSupportedEffort = false;
  let triedWithoutReasoning = false;
  for (let attempt = 0; ; attempt++) {
    let status = 0;
    let reason = "";
    try {
      const res = await http({
        url: `${MISTRAL_BASE}/chat/completions`,
        method: "POST",
        headers: authHeaders(key),
        body: JSON.stringify(body)
      });
      status = res.status;
      if (status >= 200 && status < 300) {
        const usage = extractUsage(res.json);
        if (usage.total != null) {
          (_f = net.log) == null ? void 0 : _f.call(net, `Mistral ${label}(${model}): ${usage.total} tokens (prompt ${(_d = usage.prompt) != null ? _d : "?"}, completion ${(_e = usage.completion) != null ? _e : "?"})`);
          (_g = net.log) == null ? void 0 : _g.addUsage(usage.total);
        }
        return extractChatContent(res.json);
      }
      reason = errorMessage(res.json);
    } catch (e) {
      if (attempt >= networkRetries) throw e;
    }
    if (reasoningApplied && status >= 400 && status < 500 && status !== 429) {
      const supported = parseSupportedEfforts(reason);
      if (!triedSupportedEffort && supported.length > 0 && !supported.includes(effort)) {
        triedSupportedEffort = true;
        const next = supported[0];
        (_h = net.log) == null ? void 0 : _h.call(net, `Mistral ${label}(${model}): ${status} \u2014 effort "${effort}" unsupported; retrying with "${next}"${reason ? ` (${reason})` : ""}`);
        effort = next;
        applyShape();
        continue;
      }
      if (!triedWithoutReasoning) {
        reasoningApplied = false;
        triedWithoutReasoning = true;
        applyShape();
        (_i = net.log) == null ? void 0 : _i.call(net, `Mistral ${label}(${model}): ${status} with reasoning \u2014 retrying WITHOUT reasoning${reason ? ` (${reason})` : ""}`);
        continue;
      }
    }
    if (status !== 0 && (!isTransientStatus(status) || attempt >= retries)) {
      if (reason) (_j = net.log) == null ? void 0 : _j.call(net, `Mistral ${label}(${model}): ${status} \u2014 ${reason}`);
      throw new SearchApiError(`Mistral chat request failed (${status}). Check your key and connection.`, status);
    }
    const budget = status === 0 ? networkRetries : retries;
    const wait = Math.min(backoffMs * 2 ** attempt, 8e3);
    (_k = net.log) == null ? void 0 : _k.call(net, `Mistral ${label}(${model}): ${status || "network error"} \u2014 retry ${attempt + 1}/${budget} in ${wait}ms`);
    if (wait > 0) await delay(wait);
  }
}
function indexOf(entry) {
  if (entry && typeof entry === "object") {
    const idx = entry.index;
    if (typeof idx === "number") return idx;
  }
  return 0;
}
function extractEmbeddings(payload) {
  const out = [];
  if (payload && typeof payload === "object") {
    const data = payload.data;
    if (Array.isArray(data)) {
      const ordered = [...data].sort((a, b) => indexOf(a) - indexOf(b));
      for (const entry of ordered) {
        if (entry && typeof entry === "object") {
          const emb = entry.embedding;
          if (Array.isArray(emb)) {
            out.push(emb.filter((x) => typeof x === "number"));
          }
        }
      }
    }
  }
  return out;
}
async function mistralEmbed(texts, settings, http, net = {}) {
  var _a, _b, _c, _d;
  if (texts.length === 0) return [];
  const key = requireKey(settings);
  const retries = (_a = net.retries) != null ? _a : 2;
  const networkRetries = (_b = net.networkRetries) != null ? _b : 4;
  const backoffMs = (_c = net.backoffMs) != null ? _c : 800;
  const payload = JSON.stringify({ model: settings.mistralEmbedModel, input: texts });
  for (let attempt = 0; ; attempt++) {
    let status = 0;
    try {
      const res = await http({
        url: `${MISTRAL_BASE}/embeddings`,
        method: "POST",
        headers: authHeaders(key),
        body: payload
      });
      status = res.status;
      if (status >= 200 && status < 300) return extractEmbeddings(res.json);
    } catch (e) {
      if (attempt >= networkRetries) throw e;
    }
    if (status !== 0 && (!isTransientStatus(status) || attempt >= retries)) {
      throw new SearchApiError(`Mistral embeddings request failed (${status}). Check your key and connection.`, status);
    }
    const budget = status === 0 ? networkRetries : retries;
    const wait = Math.min(backoffMs * 2 ** attempt, 8e3);
    (_d = net.log) == null ? void 0 : _d.call(net, `Mistral embed: ${status || "network error"} \u2014 retry ${attempt + 1}/${budget} in ${wait}ms`);
    if (wait > 0) await delay(wait);
  }
}
function parseModelList(payload) {
  var _a;
  const data = payload && typeof payload === "object" ? payload.data : void 0;
  if (!Array.isArray(data)) return [];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const entry of data) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry;
    const id = typeof e.id === "string" ? e.id : "";
    if (!id || seen.has(id)) continue;
    const caps = (_a = e.capabilities) != null ? _a : {};
    seen.add(id);
    out.push({ id, chat: caps.completion_chat === true, reasoning: caps.reasoning === true });
  }
  out.sort((a, b) => a.id.localeCompare(b.id));
  return out;
}
async function mistralListModels(settings, http) {
  const key = requireKey(settings);
  const res = await http({ url: `${MISTRAL_BASE}/models`, method: "GET", headers: authHeaders(key) });
  if (res.status < 200 || res.status >= 300) {
    throw new SearchApiError(`Mistral models request failed (${res.status}). Check your key and connection.`, res.status);
  }
  return parseModelList(res.json);
}

// src/synthesis.ts
var STRENGTHS = ["sterk", "gemengd", "beperkt"];
var MAX_FINDINGS = 6;
var MAX_READING_RECOMMENDATIONS = 5;
var MAX_UNANSWERED = 4;
var MAX_FOLLOW_UPS = 6;
var NO_ABSTRACT_MARKER = "[no abstract available \u2014 do not infer findings from the title]";
function buildSourceBlock(papers) {
  return papers.map((p, i) => {
    var _a, _b;
    const tier = p.evidenceTier ? ` ${evidenceTierTag(p.evidenceTier)}` : "";
    const abstract = ((_a = p.abstract) != null ? _a : "").trim() || NO_ABSTRACT_MARKER;
    return `[${i + 1}] ${p.title} (${(_b = p.year) != null ? _b : "n.d."}).${tier} ${abstract}`.trim();
  }).join("\n\n");
}
function cleanSources(raw, sourceCount) {
  if (!Array.isArray(raw)) return [];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const v of raw) {
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isInteger(n) || n < 1 || n > sourceCount) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}
function normalizeStrength(v) {
  const s = typeof v === "string" ? v.toLowerCase().trim() : "";
  return STRENGTHS.includes(s) ? s : "beperkt";
}
function parseUnanswered(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry;
    const question = typeof e.question === "string" ? e.question.trim() : "";
    if (!question) continue;
    const key = question.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const r = typeof e.reason === "string" ? e.reason.toLowerCase().trim() : "";
    const reason = r === "ontwerp-ontoereikend" ? "ontwerp-ontoereikend" : "niet-onderzocht";
    const angle = { question, reason };
    const design = typeof e.design_needed === "string" ? e.design_needed.trim() : "";
    if (design) angle.designNeeded = design;
    out.push(angle);
    if (out.length >= MAX_UNANSWERED) break;
  }
  return out;
}
function parseFindings(raw, sourceCount) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry;
    const claim = typeof e.claim === "string" ? e.claim.trim() : "";
    if (!claim) continue;
    out.push({ claim, strength: normalizeStrength(e.strength), sources: cleanSources(e.sources, sourceCount) });
    if (out.length >= MAX_FINDINGS) break;
  }
  return out;
}
function parseReadingRecommendations(raw, sourceCount) {
  if (!Array.isArray(raw)) return [];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry;
    const n = typeof e.source === "number" ? e.source : Number(e.source);
    if (!Number.isInteger(n) || n < 1 || n > sourceCount || seen.has(n)) continue;
    const reason = typeof e.reason === "string" ? e.reason.trim() : "";
    if (!reason) continue;
    seen.add(n);
    out.push({ source: n, reason });
    if (out.length >= MAX_READING_RECOMMENDATIONS) break;
  }
  return out;
}
function parseScope(raw) {
  if (!raw || typeof raw !== "object") return void 0;
  const e = raw;
  const m = typeof e.match === "string" ? e.match.toLowerCase().trim() : "";
  const match = m === "broader" ? "broader" : m === "adjacent" ? "adjacent" : "direct";
  const note = typeof e.note === "string" ? e.note.trim() : "";
  return { match, note };
}
function parseContradictions(raw, sourceCount) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry;
    const point = typeof e.point === "string" ? e.point.trim() : "";
    if (!point) continue;
    out.push({ point, sources: cleanSources(e.sources, sourceCount) });
  }
  return out;
}
function parseSynthesis(raw, sourceCount) {
  let payload;
  try {
    payload = JSON.parse(extractJsonObject(raw));
  } catch (e) {
    return null;
  }
  if (!payload || typeof payload !== "object") return null;
  const p = payload;
  const headline = typeof p.headline === "string" ? p.headline.trim() : "";
  const findings = parseFindings(p.findings, sourceCount);
  const contradictions = parseContradictions(p.contradictions, sourceCount);
  const evidenceNote = typeof p.evidence_note === "string" ? p.evidence_note.trim() : "";
  if (!headline && findings.length === 0) return null;
  const synthesis = { headline, findings, contradictions, evidenceNote };
  const summary = typeof p.summary === "string" ? p.summary.trim() : "";
  if (summary) synthesis.summary = summary;
  const followUps = Array.isArray(p.follow_ups) ? p.follow_ups.map((d) => typeof d === "string" ? d.trim() : "").filter(Boolean).slice(0, MAX_FOLLOW_UPS) : [];
  if (followUps.length > 0) synthesis.followUps = followUps;
  const practical = typeof p.practical === "string" ? p.practical.trim() : "";
  if (practical) synthesis.practical = practical;
  const scope = parseScope(p.scope);
  if (scope && scope.match !== "direct" && scope.note) synthesis.scope = scope;
  const reading = parseReadingRecommendations(p.reading_recommendations, sourceCount);
  if (reading.length > 0) synthesis.readingRecommendations = reading;
  const unanswered = parseUnanswered(p.unanswered);
  if (unanswered.length > 0) synthesis.unanswered = unanswered;
  return synthesis;
}
function renderSources(sources) {
  return sources.map((n) => `[${n}]`).join("");
}
var TIER_RANK = { strong: 3, moderate: 2, limited: 1 };
function strongestTier(sources, papers) {
  var _a;
  let best;
  for (const n of sources) {
    const tier = (_a = papers[n - 1]) == null ? void 0 : _a.evidenceTier;
    if (tier && (!best || TIER_RANK[tier] > TIER_RANK[best])) best = tier;
  }
  return best;
}
function renderAbstract(s, question) {
  if (!s.headline && !s.summary) return "";
  const lines = ["#### Samenvatting", ""];
  const q = question == null ? void 0 : question.trim();
  if (q) lines.push(`*Onderzoeksvraag: ${q}*`, "");
  if (s.headline) lines.push(`**${s.headline}**`);
  if (s.summary) {
    if (s.headline) lines.push("");
    lines.push(s.summary);
  }
  return lines.join("\n");
}
var ABSTRACTS_DISCLOSURE_BASE = "De bewijskracht hierboven is gebaseerd op abstracts, niet op volledige teksten \u2014 abstracts laten vaak moderatoren, betrouwbaarheidsintervallen en null-resultaten weg.";
var ABSTRACTS_DISCLOSURE_BASE_LINE = `*${ABSTRACTS_DISCLOSURE_BASE}*`;
function abstractsDisclosureLine(fulltextSourceCount = 0) {
  if (fulltextSourceCount <= 0) return ABSTRACTS_DISCLOSURE_BASE_LINE;
  const n = fulltextSourceCount === 1 ? "1 bron rust" : `${fulltextSourceCount} bronnen rusten`;
  return `*${ABSTRACTS_DISCLOSURE_BASE} Inmiddels ${n} op de volledige tekst (zie de verdieping).*`;
}
function nuanceAbstractsDisclosure(markdown, fulltextSourceCount) {
  if (fulltextSourceCount <= 0 || !markdown.includes(ABSTRACTS_DISCLOSURE_BASE_LINE)) return markdown;
  return markdown.replace(ABSTRACTS_DISCLOSURE_BASE_LINE, abstractsDisclosureLine(fulltextSourceCount));
}
function renderSynthesis(s, papers = []) {
  const lines = [];
  if (s.findings.length > 0) {
    lines.push("", "#### Bevindingen");
    for (const f of s.findings) {
      const cite = f.sources.length ? ` ${renderSources(f.sources)}` : "";
      const tier = strongestTier(f.sources, papers);
      const basis = tier ? ` \xB7 ${evidenceTierLabel(tier)}` : "";
      lines.push(`- ${f.claim} \u2014 *bewijs: ${f.strength}${basis}*${cite}`);
    }
  }
  if (s.contradictions.length > 0) {
    lines.push("", "#### Tegenspraak / het hangt af van");
    for (const c of s.contradictions) {
      const cite = c.sources.length ? ` ${renderSources(c.sources)}` : "";
      lines.push(`- ${c.point}${cite}`);
    }
  }
  if (s.practical) {
    lines.push("", "#### Praktische vertaling", "", s.practical);
  }
  if (s.followUps && s.followUps.length > 0) {
    lines.push("", "#### Hypothesevormende vervolgrichtingen & open vragen");
    for (const d of s.followUps) lines.push(`- ${d}`);
  }
  if (s.scope || s.evidenceNote) {
    lines.push("", "#### Bewijskracht & lacunes");
    if (s.scope) {
      lines.push(
        "",
        `\u26A0 Bereik: het bewijs gaat vooral over ${s.scope.note} \u2014 niet specifiek over de vraag zoals gesteld. Generaliseer met voorzichtigheid.`
      );
    }
    if (s.evidenceNote) lines.push("", s.evidenceNote);
    lines.push("", abstractsDisclosureLine());
  }
  if (s.unanswered && s.unanswered.length > 0) {
    lines.push("", "#### Niet te beantwoorden met dit bewijs");
    for (const u of s.unanswered) {
      const why = u.reason === "ontwerp-ontoereikend" ? "niet vast te stellen met het gevonden bewijs (ontwerp ontoereikend, bv. cross-sectioneel)" : "niet onderzocht in de gevonden bronnen";
      const design = u.designNeeded ? ` Zou een ${u.designNeeded} vergen.` : "";
      lines.push(`- ${u.question} \u2014 ${why}.${design}`);
    }
  }
  if (s.readingRecommendations && s.readingRecommendations.length > 0) {
    lines.push(
      "",
      "#### Aanrader om volledig te lezen",
      "",
      "*(op basis van de abstracts; vaak achter een paywall \u2014 jij haalt de volledige tekst erbij)*"
    );
    for (const r of s.readingRecommendations) {
      lines.push(`- [${r.source}] ${r.reason} \u2014 ${renderOaBadge(papers[r.source - 1])}`);
    }
  }
  while (lines.length > 0 && lines[0] === "") lines.shift();
  return lines.join("\n");
}
var STRUCTURED_BASE = [
  "You are a careful research assistant for a writer.",
  "Summarise ONLY the provided sources as structured JSON; never invent findings, sources or citations.",
  'Return JSON of the form {"headline":"the core answer in ONE short sentence (max ~25 words)",',
  '"summary":"a self-contained abstract of 2-4 sentences that expands the headline: what the evidence shows overall, the main nuance or condition, and the bottom line \u2014 do NOT repeat the headline verbatim, and cite key claims with [n]",',
  '"findings":[{"claim":"...","strength":"sterk|gemengd|beperkt","sources":[1,3]}],',
  '"contradictions":[{"point":"where studies disagree or it depends","sources":[5]}],',
  '"evidence_note":"1-2 sentences: how many/which studies, how consistent, what is missing or thin",',
  `"unanswered":[{"question":"an angle of the question the sources do NOT answer","reason":"niet-onderzocht|ontwerp-ontoereikend","design_needed":"the study design that WOULD answer it, in the question's language, e.g. longitudinaal cohortonderzoek / interventie (RCT)"}],`,
  '"scope":{"match":"direct|broader|adjacent","note":"empty when direct; else a SHORT NOUN PHRASE (no leading capital, no full sentence) that grammatically completes \\"het bewijs gaat vooral over \u2026\\", e.g. \\"algemene criminaliteitspreventie, niet georganiseerde criminaliteit\\""}}.',
  "For 'scope': judge whether the sources address the SPECIFIC subject of the question, or mostly a BROADER/more",
  "general or ADJACENT (related-but-different) subject. If the question names a specific phenomenon, subtype,",
  "population, mechanism or context while the evidence is mostly about a more general or neighbouring topic, set",
  "match to 'broader' or 'adjacent' and put the gap in note as a short noun phrase (what it IS mostly about vs. the",
  "specific ask), in the question's language. When in doubt, do NOT use 'direct'.",
  "Set strength to 'sterk' only for multiple consistent studies or a review/meta-analysis;",
  "'beperkt' for a single study or weak/indirect design; 'gemengd' when studies conflict or are conditional.",
  "When in doubt, grade lower. Cite each claim with the [n] source numbers it rests on.",
  "NO FABRICATED QUANTITIES: only state a number, effect size, sample size, percentage or p-value if it LITERALLY",
  "appears in that source's abstract; never estimate, infer or invent one.",
  "MECHANISM vs EFFECT: distinguish a DEMONSTRATED effect from the MECHANISM that supposedly explains it.",
  "When a claim asserts a causal pathway or mediation (X works VIA Y, or X\u2192Y\u2192Z) that no single source directly",
  "tested, present it as a SUPPOSED/likely mechanism \u2014 phrase it as 'waarschijnlijk mechanisme', 'de literatuur",
  "veronderstelt', 'vermoedelijk via' (in the question's language), NOT as a settled causal chain. A meta-analytic",
  "effect of participation on outcomes does NOT by itself establish the intermediate mechanism.",
  "BE HONEST ABOUT WHAT THE EVIDENCE CANNOT ANSWER (use 'unanswered'): if the question \u2014 or a salient angle",
  "in it such as reversibility, change-over-time, causality, or long-term effect \u2014 is NOT answerable from the",
  "provided sources, say so EXPLICITLY rather than papering over it with merely related findings. Distinguish",
  "the reason: 'niet-onderzocht' = no source addresses the angle at all; 'ontwerp-ontoereikend' = sources touch",
  "it but their DESIGN cannot establish it (e.g. cross-sectional/correlational evidence cannot speak to",
  "reversibility or temporal dynamics \u2014 that needs a longitudinal or intervention design). For each, name the",
  "study design that WOULD answer it in 'design_needed'. Leave 'unanswered' EMPTY when the sources genuinely",
  "cover the question's main angles; do NOT invent gaps to fill it \u2014 but an explicit ask about change-over-time",
  "or reversibility answered only by cross-sectional sources MUST be flagged 'ontwerp-ontoereikend'.",
  "Some sources may have NO abstract (marked '[no abstract available \u2026]') \u2014 only a title. Do NOT infer",
  "or invent findings from a title alone, and never attach a specific claim to a source whose abstract is absent.",
  "Keep the strength VALUES exactly as the Dutch tokens sterk/gemengd/beperkt,",
  "but write all prose (headline, claims, points, evidence_note) in the SAME language as the question.",
  "Leave contradictions empty if the sources broadly agree."
];
var EVIDENCE_WEIGHTING_CLAUSE = [
  "Weight the evidence by study design, shown as [evidence: strong|moderate|limited] on each source:",
  "strong = meta-analyses/systematic reviews, moderate = RCTs, limited = small/observational studies.",
  "NEVER give a single 'limited' study the same weight as a 'strong' source; when a claim rests only on",
  "'limited' studies, say so (e.g. 'hypothesevormend') and grade it 'beperkt'.",
  "Base the strength grade on the strongest supporting design, not the number of studies alone."
].join(" ");
var CALIBRATION_CLAUSE = [
  "Calibrate every claim: do NOT over-state. Prefer 'has the most support on average, but the optimal",
  "value depends on \u2026' over absolute 'is most effective'. Surface the moderators and context-dependence",
  "the sources mention (e.g. type of exercise, population, body part, desired outcome).",
  "Keep distinct outcomes apart rather than treating the construct as one thing."
].join(" ");
var PUBLIC_CLAUSE = [
  "Write for a general/practitioner audience: practical and actionable. Be DECISIVE where the evidence",
  "is strong \u2014 do NOT hedge well-established findings (state them plainly); reserve caution for genuinely",
  "mixed or weak evidence. Avoid jargon and downplay speculative findings.",
  'ALSO add a "practical":"..." field: a concrete DECISION RULE \u2014 when to use it, when NOT to, and what to',
  "combine it with \u2014 naming the key trade-off and concrete scenarios, grounded in the strong findings."
].join(" ");
var ACADEMIC_CLAUSE = [
  "Write for an academic audience in cautious review-paper language: foreground nuance and conditionality,",
  "and HEDGE causal claims ('there are indications that\u2026', 'X is associated with\u2026' rather than 'X improves Y').",
  "Distinguish a statistical or physiological effect from its CLINICAL significance, and say so when the",
  "latter is unclear or unestablished.",
  'ALSO add a "follow_ups":["...","..."] field: 2-5 hypothesis-forming directions / open questions the evidence raises.'
].join(" ");
var READING_TIPS_CLAUSE = [
  'ALSO add a "reading_recommendations":[{"source":n,"reason":"..."}] field: 3-5 of the sources whose FULL TEXT',
  "would most reward reading \u2014 prioritise those that would most CHANGE, DEEPEN or VERIFY the answer (e.g. the only",
  "primary study directly testing the question, the strongest design, the seminal source, or one whose abstract",
  "hints at rich data the synthesis could not fully use). NOT simply the most-cited. Give each a one-sentence reason",
  "in the SAME language as the question. The reader will fetch these (often paywalled) full texts themselves."
].join(" ");
function buildStructuredSystem(opts = {}) {
  const parts = [...STRUCTURED_BASE];
  if (opts.evidenceWeighting) parts.push(EVIDENCE_WEIGHTING_CLAUSE);
  if (opts.calibration) parts.push(CALIBRATION_CLAUSE);
  if (opts.mode === "public") parts.push(PUBLIC_CLAUSE);
  if (opts.mode === "academic") parts.push(ACADEMIC_CLAUSE);
  if (opts.readingTips) parts.push(READING_TIPS_CLAUSE);
  parts.push("Respond with strict JSON only.");
  return parts.join(" ");
}
async function synthesizeStructuredFull(question, papers, chat, opts = {}) {
  const user = `Question: ${question}

Sources:
${buildSourceBlock(papers)}`;
  try {
    const raw = await chat(
      [
        { role: "system", content: buildStructuredSystem(opts) },
        { role: "user", content: user }
      ],
      { json: true, temperature: 0.2 }
    );
    const parsed = parseSynthesis(raw, papers.length);
    if (parsed) return { markdown: renderSynthesis(parsed, papers), synthesis: parsed };
  } catch (e) {
  }
  return { markdown: await synthesizeAnswer(question, papers, chat), synthesis: null };
}
async function synthesizeAnswer(question, papers, chat) {
  const system = [
    "You are a careful research assistant for a writer.",
    "Summarise, in a few sentences, what the provided sources say about the question.",
    "Write the summary in the SAME language as the question.",
    "Rules: use ONLY the provided sources; cite them inline as [n];",
    "do NOT invent findings, sources or citations; if the evidence is thin or mixed, say so plainly.",
    "A source marked '[no abstract available \u2026]' gives only a title \u2014 do not infer findings from it."
  ].join(" ");
  const user = `Question: ${question}

Sources:
${buildSourceBlock(papers)}`;
  return chat(
    [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    { temperature: 0.2 }
  );
}

// src/verification.ts
var DOI_PATTERN = /^10\.\d+\/\S+$/;
function isValidDoi(doi) {
  const bare = normalizeDoi(doi);
  return bare != null && DOI_PATTERN.test(bare);
}
function isValidIsbn10(s) {
  if (!/^[0-9]{9}[0-9X]$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const v = s[i] === "X" ? 10 : Number(s[i]);
    sum += (i + 1) * v;
  }
  return sum % 11 === 0;
}
function isValidIsbn13(s) {
  if (!/^[0-9]{13}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += Number(s[i]) * (i % 2 === 0 ? 1 : 3);
  }
  return sum % 10 === 0;
}
function toIsbn13(isbn10) {
  const core = "978" + isbn10.slice(0, 9);
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(core[i]) * (i % 2 === 0 ? 1 : 3);
  const check = (10 - sum % 10) % 10;
  return core + String(check);
}
function normalizeIsbn(raw) {
  if (!raw) return void 0;
  const cleaned = raw.replace(/[^0-9xX]/g, "").toUpperCase();
  if (cleaned.length === 10 && isValidIsbn10(cleaned)) return toIsbn13(cleaned);
  if (cleaned.length === 13 && isValidIsbn13(cleaned)) return cleaned;
  return void 0;
}
var defaultSleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
var RETRY_BACKOFF_MS = 800;
async function resolveDoi(doi, http, attempts, sleep = defaultSleep) {
  const url = `https://doi.org/${encodeURI(doi)}`;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await http({ url, method: "GET", headers: { Accept: "application/json" } });
      if (res.status >= 200 && res.status < 400) return "resolved";
      if (res.status === 404) return "unresolved";
    } catch (e) {
    }
    if (i < attempts - 1) await sleep(RETRY_BACKOFF_MS);
  }
  return "unreachable";
}
async function verifyIdentifier(source, http, opts = {}) {
  var _a;
  const isbn = normalizeIsbn(source.isbn);
  const doi = isValidDoi(source.doi) ? normalizeDoi(source.doi) : void 0;
  if (!doi && !isbn) {
    return { status: "missing", note: "geen DOI/ISBN" };
  }
  if (!doi && isbn) {
    return { status: "resolved", isbn, note: "geldige ISBN" };
  }
  const outcome = await resolveDoi(doi, http, (_a = opts.attempts) != null ? _a : 2, opts.sleep);
  switch (outcome) {
    case "resolved":
      return { status: "resolved", doi, isbn, note: "DOI resolveert" };
    case "unresolved":
      return { status: "unresolved", doi, isbn, note: "DOI niet vindbaar" };
    case "unreachable":
      return { status: "unreachable", doi, isbn, note: "geen verbinding" };
  }
}
function identifierMarker(status) {
  switch (status) {
    case "unresolved":
      return "\u26A0 niet geverifieerd (DOI niet vindbaar)";
    case "unreachable":
      return "\u26A0 niet gecontroleerd (geen verbinding)";
    case "missing":
      return "\u26A0 niet geverifieerd (geen DOI/ISBN)";
    case "resolved":
    default:
      return void 0;
  }
}

// src/formatter.ts
function formatAuthors(authors) {
  if (authors.length === 0) return "Unknown authors";
  if (authors.length <= 3) {
    if (authors.length === 1) return authors[0];
    return `${authors.slice(0, -1).join(", ")} & ${authors[authors.length - 1]}`;
  }
  return `${authors[0]} et al.`;
}
function metaTail(paper) {
  const bits = [];
  if (paper.year != null) bits.push(String(paper.year));
  if (paper.journal) bits.push(`*${paper.journal}*`);
  if (paper.citationCount != null) {
    bits.push(`${paper.citationCount} citation${paper.citationCount === 1 ? "" : "s"}`);
  }
  return bits.join(", ");
}
function titleLink(paper) {
  return paper.url ? `[${paper.title}](${paper.url})` : paper.title;
}
function collapseWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}
function toApaAuthor(name) {
  const n = collapseWhitespace(name);
  if (!n) return "";
  let family;
  let given;
  if (n.includes(",")) {
    const [fam, ...rest] = n.split(",");
    family = fam.trim();
    given = rest.join(",").trim();
  } else {
    const parts = n.split(" ");
    family = parts[parts.length - 1];
    given = parts.slice(0, -1).join(" ");
  }
  const initials = given.split(/[\s.]+/).filter(Boolean).map((g) => `${g[0].toUpperCase()}.`).join(" ");
  return initials ? `${family}, ${initials}` : family;
}
function formatApaAuthors(authors) {
  const apa = authors.map(toApaAuthor).filter(Boolean);
  if (apa.length === 0) return "Unknown author";
  if (apa.length === 1) return apa[0];
  if (apa.length <= 20) return `${apa.slice(0, -1).join(", ")}, & ${apa[apa.length - 1]}`;
  return `${apa.slice(0, 19).join(", ")}, \u2026 ${apa[apa.length - 1]}`;
}
function apaCitation(paper) {
  const lead = formatApaAuthors(paper.authors);
  const year = paper.year != null ? String(paper.year) : "n.d.";
  const title = collapseWhitespace(paper.title).replace(/\.+$/, "");
  const journal = paper.journal ? ` *${collapseWhitespace(paper.journal)}*.` : "";
  const doi = paper.doi ? ` https://doi.org/${paper.doi}` : "";
  return `${lead} (${year}). ${title}.${journal}${doi}`.trim();
}
function doiIsbnLine(paper) {
  const parts = [];
  if (paper.doi) parts.push(`DOI [${paper.doi}](https://doi.org/${paper.doi})`);
  if (paper.isbn) parts.push(`ISBN ${paper.isbn}`);
  return parts.length ? parts.join(" \xB7 ") : "\u2014";
}
function markerSuffix(paper) {
  const marker = identifierMarker(paper.verification);
  return marker ? ` ${marker}` : "";
}
function originSuffix(paper) {
  if (paper.origin === "framework") return " \xB7 kaderbron";
  if (paper.sector === "transfer") return ` \xB7 analoog (${paper.transferSector || "andere sector"})`;
  return "";
}
function evidenceTierSuffix(paper) {
  return paper.evidenceTier ? ` \xB7 bewijs: ${evidenceTierLabel(paper.evidenceTier)}` : "";
}
function renderFramework(fw) {
  const lines = [`#### Theoretisch kader \u2014 ${collapseWhitespace(fw.construct)}`];
  if (fw.definition) lines.push("", collapseWhitespace(fw.definition));
  if (fw.dimensions.length > 0) {
    lines.push("", "Dimensies (sturen de deelvragen):");
    for (const d of fw.dimensions) lines.push(`- ${collapseWhitespace(d)}`);
  }
  if (fw.sources && fw.sources.length > 0) {
    lines.push("", `Sleutelbronnen: ${fw.sources.map((n) => `[${n}]`).join("")}`);
  }
  return lines.join("\n");
}
function formatOnePaper(paper, opts, index) {
  const authors = formatAuthors(paper.authors);
  const meta = metaTail(paper);
  const marker = `${markerSuffix(paper)}${originSuffix(paper)}${evidenceTierSuffix(paper)}`;
  switch (opts.format) {
    case "compact":
      return `- ${titleLink(paper)} \u2014 ${authors}${meta ? ` (${meta})` : ""}${marker}`;
    case "bibliography": {
      const yr = paper.year != null ? ` (${paper.year})` : "";
      const jr = paper.journal ? ` *${paper.journal}*.` : "";
      const link = paper.url ? ` ${paper.url}` : "";
      return `${index}. ${authors}${yr}. ${paper.title}.${jr}${link}${marker}`.trim();
    }
    case "detailed":
    default: {
      const header = `${index}. **${titleLink(paper)}** \u2014 ${authors}${meta ? ` (${meta})` : ""}${marker}`;
      const quoteLines = [];
      if (opts.includeAbstract && paper.abstract) {
        quoteLines.push(collapseWhitespace(paper.abstract));
      }
      quoteLines.push(`**APA:** ${apaCitation(paper)}`);
      quoteLines.push(`**DOI/ISBN:** ${doiIsbnLine(paper)}`);
      const quote = quoteLines.map((l) => `   > ${l}`).join("\n   >\n");
      return `${header}
${quote}`;
    }
  }
}
function paperLink(paper) {
  if (!paper) return "";
  if (paper.doi) return `https://doi.org/${paper.doi}`;
  return paper.url || "";
}
function linkifyCitations(text, papers) {
  return text.replace(/\[(\d+)\]/g, (whole, num) => {
    const link = paperLink(papers[Number(num) - 1]);
    return link ? `[\\[${num}\\]](${link})` : whole;
  });
}
function formatResult(result, papers, opts) {
  const parts = [];
  const cite = (text) => linkifyCitations(text, result.papers);
  if (opts.insertQuestionHeading) {
    parts.push(`### ${result.query}`);
  }
  if (result.synthesis) {
    const abstract = renderAbstract(result.synthesis, result.query);
    if (abstract) parts.push(cite(abstract));
  }
  if (result.framework) {
    parts.push(cite(renderFramework(result.framework)));
  }
  if (result.subQuestions && result.subQuestions.length > 0) {
    const items = result.subQuestions.map((s, i) => {
      const notes = s.sources && s.sources.length ? ` ${cite(s.sources.map((n) => `[${n}]`).join(""))}` : "";
      const lines = [`${i + 1}. ${collapseWhitespace(s.query)}${notes}`];
      if (s.hypothesis) lines.push(`   - *Hypothese:* ${collapseWhitespace(s.hypothesis)}`);
      return lines.join("\n");
    });
    const hasHypotheses = result.subQuestions.some((s) => s.hypothesis);
    const note = hasHypotheses ? "*(zo is de vraag opgesplitst; nummers verwijzen naar de bronnen die elke deelvraag opleverde, gevolgd door de hypothese per deelvraag)*" : "*(zo is de vraag opgesplitst; nummers verwijzen naar de bronnen die elke deelvraag opleverde)*";
    parts.push(["#### Deelvragen", "", note, ...items].join("\n"));
  }
  if (result.summary) {
    parts.push(cite(result.summary.trim()));
  }
  if (result.transferSectors && result.transferSectors.length > 0) {
    parts.push(
      `**Analoog bewijs uit andere sectoren** (transfer, geen domein-eigen bewijs) \u2014 ${result.transferSectors.map((s) => collapseWhitespace(s)).join(", ")}. Hieronder gemarkeerd met *\xB7 analoog (andere sector)*.`
    );
  }
  const body = papers.map((p, i) => formatOnePaper(p, opts, i + 1));
  parts.push(opts.format === "compact" ? body.join("\n") : body.join("\n\n"));
  return parts.join("\n\n") + "\n";
}

// src/results-modal.ts
var ResultsModal = class extends import_obsidian5.Modal {
  constructor(app, result, settings, onSubmit) {
    super(app);
    /** Live checkbox refs (D9/E78) — lets select-all/none update in place instead of a full re-render
     *  (a `contentEl.empty()` + `onOpen()` re-render drops focus/scroll on every click). */
    this.checkboxes = [];
    this.result = result;
    this.settings = settings;
    this.onSubmit = onSubmit;
    this.format = settings.defaultFormat;
    this.selected = new Set(result.papers.map((_, i) => i));
  }
  selectedPapers() {
    return this.result.papers.filter((_, i) => this.selected.has(i));
  }
  onOpen() {
    const { contentEl } = this;
    applyModalChrome(this);
    contentEl.addClass("consensus-results");
    contentEl.createEl("h2", { text: this.result.query });
    contentEl.createEl("p", {
      text: `${this.result.papers.length} papers found \xB7 ${this.selected.size} selected`,
      cls: "consensus-results-count"
    });
    const controls = new import_obsidian5.Setting(contentEl).setName("Format");
    controls.addDropdown((d) => {
      d.addOption("detailed", "Detailed (with abstracts)").addOption("compact", "Compact list").addOption("bibliography", "Bibliography").setValue(this.format).onChange((v) => this.format = v);
    });
    controls.addExtraButton(
      (b) => b.setIcon("check-check").setTooltip("Select all").onClick(() => this.setAll(true))
    );
    controls.addExtraButton(
      (b) => b.setIcon("square").setTooltip("Select none").onClick(() => this.setAll(false))
    );
    const list = contentEl.createDiv({ cls: "consensus-paper-list" });
    this.checkboxes = [];
    this.result.papers.forEach((paper, i) => {
      const row = list.createEl("label", { cls: "consensus-paper-row" });
      const cb = row.createEl("input", { type: "checkbox" });
      cb.checked = this.selected.has(i);
      cb.setAttr("aria-label", paper.title);
      cb.addEventListener("change", () => {
        if (cb.checked) this.selected.add(i);
        else this.selected.delete(i);
        this.refreshCount();
      });
      this.checkboxes.push(cb);
      const text = row.createDiv({ cls: "consensus-paper-text" });
      const titleEl = text.createEl("div", { cls: "consensus-paper-title" });
      if (paper.url) {
        const link = titleEl.createEl("a", { text: paper.title, href: paper.url });
        link.addEventListener("click", (e) => e.stopPropagation());
      } else {
        titleEl.setText(paper.title);
      }
      const meta = [formatAuthors(paper.authors)];
      if (paper.year != null) meta.push(String(paper.year));
      if (paper.journal) meta.push(paper.journal);
      if (paper.citationCount != null) meta.push(`${paper.citationCount} cit.`);
      text.createEl("div", { text: meta.join(" \xB7 "), cls: "consensus-paper-meta" });
    });
    new import_obsidian5.Setting(contentEl).addButton(
      (b) => b.setButtonText("Insert at cursor").setCta().onClick(() => {
        if (this.selected.size === 0) {
          new import_obsidian5.Notice("Select at least one paper.");
          return;
        }
        const papers = this.selectedPapers();
        this.close();
        void this.onSubmit(papers, this.format, "insert");
      })
    ).addButton(
      (b) => b.setButtonText("Copy").onClick(() => {
        if (this.selected.size === 0) {
          new import_obsidian5.Notice("Select at least one paper.");
          return;
        }
        void this.onSubmit(this.selectedPapers(), this.format, "copy");
      })
    );
  }
  setAll(value) {
    this.selected = value ? new Set(this.result.papers.map((_, i) => i)) : /* @__PURE__ */ new Set();
    for (const cb of this.checkboxes) cb.checked = value;
    this.refreshCount();
  }
  refreshCount() {
    const el = this.contentEl.querySelector(".consensus-results-count");
    if (el) {
      el.setText(`${this.result.papers.length} papers found \xB7 ${this.selected.size} selected`);
    }
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/notify.ts
var import_obsidian6 = require("obsidian");
function notifyError(context, e, opts = {}) {
  var _a;
  (_a = opts.log) == null ? void 0 : _a.call(opts, `${context} \u2014 FAILED`, e instanceof Error ? e.message : String(e));
  const message = e instanceof SearchApiError ? e.message : `${context} failed \u2014 likely a connection or configuration problem. Details in the debug log.`;
  new import_obsidian6.Notice(message, 0);
}

// src/consensus-api.ts
function buildSearchUrl(query, filters, settings) {
  const base = settings.apiBaseUrl.replace(/\/+$/, "");
  const params = new URLSearchParams();
  params.set("query", query);
  if (settings.resultLimit) params.set("page_size", String(settings.resultLimit));
  if (filters.yearMin != null) params.set("year_min", String(filters.yearMin));
  if (filters.yearMax != null) params.set("year_max", String(filters.yearMax));
  if (filters.excludePreprints) params.set("exclude_preprints", "true");
  if (filters.humanOnly) params.set("human", "true");
  if (filters.sampleSizeMin != null) {
    params.set("sample_size_min", String(filters.sampleSizeMin));
  }
  if (filters.studyTypes && filters.studyTypes.length > 0) {
    for (const t of filters.studyTypes) params.append("study_types", t);
  }
  return `${base}/quick_search?${params.toString()}`;
}
function firstString(obj, keys) {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return void 0;
}
function firstNumber(obj, keys) {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() && !Number.isNaN(Number(v))) {
      return Number(v);
    }
  }
  return void 0;
}
function parseAuthors(obj) {
  var _a, _b;
  const raw = (_b = (_a = obj.authors) != null ? _a : obj.author_names) != null ? _b : obj.author;
  if (Array.isArray(raw)) {
    return raw.map((a) => {
      var _a2;
      if (typeof a === "string") return a;
      if (a && typeof a === "object") {
        const o = a;
        return (_a2 = firstString(o, ["name", "display_name", "full_name"])) != null ? _a2 : "";
      }
      return "";
    }).filter((s) => s.length > 0);
  }
  if (typeof raw === "string" && raw.trim()) {
    return raw.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}
function normalizePaper(raw) {
  var _a;
  if (!raw || typeof raw !== "object") return null;
  const o = raw;
  const title = firstString(o, ["title", "paper_title", "name"]);
  if (!title) return null;
  const url = (_a = firstString(o, ["url", "paper_url", "consensus_url", "link", "doi_url"])) != null ? _a : "";
  return {
    title,
    authors: parseAuthors(o),
    year: firstNumber(o, ["year", "publish_year", "publication_year"]),
    journal: firstString(o, ["journal", "journal_name", "venue", "publication"]),
    citationCount: firstNumber(o, ["citation_count", "citations", "cited_by_count"]),
    url,
    doi: firstString(o, ["doi"]),
    abstract: firstString(o, ["abstract", "snippet", "text", "summary"])
  };
}
function extractPaperArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const o = payload;
    for (const key of ["results", "papers", "data", "items", "search_results"]) {
      if (Array.isArray(o[key])) return o[key];
    }
  }
  return [];
}
function parseSearchResponse(query, payload) {
  const papers = extractPaperArray(payload).map(normalizePaper).filter((p) => p !== null);
  let summary;
  if (payload && typeof payload === "object") {
    summary = firstString(payload, [
      "summary",
      "answer",
      "synthesis"
    ]);
  }
  return { query, papers, summary, raw: payload };
}
async function searchConsensus(query, filters, settings, http) {
  var _a;
  if (!settings.apiKey) {
    throw new SearchApiError("No Consensus API key configured.", 0);
  }
  const url = buildSearchUrl(query, filters, settings);
  const headers = {
    Accept: "application/json",
    [settings.apiKeyHeader]: settings.apiKey
  };
  const res = await http({ url, method: "GET", headers });
  if (res.status < 200 || res.status >= 300) {
    const detail = (_a = res.json && typeof res.json === "object" ? firstString(res.json, ["message", "detail", "error"]) : void 0) != null ? _a : res.text;
    throw new SearchApiError(
      `Consensus API returned ${res.status}${detail ? `: ${detail}` : ""}`,
      res.status
    );
  }
  return parseSearchResponse(query, res.json);
}

// src/openalex-api.ts
var OPENALEX_WORKS = "https://api.openalex.org/works";
function buildOpenAlexUrl(query, filters, settings) {
  const params = new URLSearchParams();
  params.set("search", query.replace(/[?*]/g, " ").replace(/\s+/g, " ").trim());
  params.set("per-page", String(Math.min(settings.resultLimit || 20, 50)));
  params.set(
    "select",
    "id,doi,title,display_name,publication_year,cited_by_count,primary_location,authorships,abstract_inverted_index,type,open_access"
  );
  if (settings.openAlexMailto) params.set("mailto", settings.openAlexMailto);
  const filterParts = [];
  if (filters.yearMin != null) filterParts.push(`from_publication_date:${filters.yearMin}-01-01`);
  if (filters.yearMax != null) filterParts.push(`to_publication_date:${filters.yearMax}-12-31`);
  if (filters.excludePreprints) filterParts.push("type:article");
  if (filterParts.length > 0) params.set("filter", filterParts.join(","));
  return `${OPENALEX_WORKS}?${params.toString()}`;
}
function reconstructAbstract(inverted) {
  if (!inverted || typeof inverted !== "object") return void 0;
  const entries = Object.entries(inverted);
  const slots = [];
  for (const [word, positions] of entries) {
    if (!Array.isArray(positions)) continue;
    for (const pos of positions) {
      if (typeof pos === "number") slots[pos] = word;
    }
  }
  const text = slots.filter((w) => w !== void 0).join(" ").trim();
  return text.length > 0 ? text : void 0;
}
function pickUrl(work) {
  const doi = work.doi;
  if (typeof doi === "string" && doi) return doi;
  const loc = work.primary_location;
  if (loc && typeof loc === "object") {
    const landing = loc.landing_page_url;
    if (typeof landing === "string" && landing) return landing;
  }
  const id = work.id;
  return typeof id === "string" ? id : "";
}
function pickJournal(work) {
  const loc = work.primary_location;
  if (loc && typeof loc === "object") {
    const source = loc.source;
    if (source && typeof source === "object") {
      const name = source.display_name;
      if (typeof name === "string" && name) return name;
    }
  }
  return void 0;
}
function pickAuthors(work) {
  const authorships = work.authorships;
  if (!Array.isArray(authorships)) return [];
  return authorships.map((a) => {
    if (a && typeof a === "object") {
      const author = a.author;
      if (author && typeof author === "object") {
        const name = author.display_name;
        if (typeof name === "string") return name;
      }
    }
    return "";
  }).filter((s) => s.length > 0);
}
function pickPublicationTypes(work) {
  const type = work.type;
  if (typeof type !== "string" || !type) return void 0;
  if (type === "review") return ["Review"];
  return void 0;
}
function pickOpenAccess(work) {
  const oa = work.open_access;
  if (!oa || typeof oa !== "object") return {};
  const o = oa;
  const oaUrl = typeof o.oa_url === "string" && o.oa_url ? o.oa_url : void 0;
  const isOpenAccess = typeof o.is_oa === "boolean" ? o.is_oa : void 0;
  return { oaUrl, isOpenAccess };
}
function normalizeOpenAlexWork(raw) {
  if (!raw || typeof raw !== "object") return null;
  const w = raw;
  const title = typeof w.title === "string" && w.title || typeof w.display_name === "string" && w.display_name || "";
  if (!title) return null;
  const year = typeof w.publication_year === "number" ? w.publication_year : void 0;
  const citationCount = typeof w.cited_by_count === "number" ? w.cited_by_count : void 0;
  const doi = typeof w.doi === "string" ? w.doi.replace(/^https?:\/\/doi\.org\//, "") : void 0;
  return {
    title,
    authors: pickAuthors(w),
    year,
    journal: pickJournal(w),
    citationCount,
    url: pickUrl(w),
    doi,
    abstract: reconstructAbstract(w.abstract_inverted_index),
    publicationTypes: pickPublicationTypes(w),
    ...pickOpenAccess(w)
  };
}
function parseOpenAlexResponse(query, payload) {
  let results = [];
  if (payload && typeof payload === "object" && Array.isArray(payload.results)) {
    results = payload.results;
  }
  const papers = results.map(normalizeOpenAlexWork).filter((p) => p !== null);
  return { query, papers, raw: payload };
}
async function searchOpenAlex(query, filters, settings, http) {
  const url = buildOpenAlexUrl(query, filters, settings);
  const res = await http({ url, method: "GET", headers: { Accept: "application/json" } });
  if (res.status < 200 || res.status >= 300) {
    throw new SearchApiError(
      `OpenAlex returned ${res.status}${res.text ? `: ${res.text.slice(0, 200)}` : ""}`,
      res.status
    );
  }
  return parseOpenAlexResponse(query, res.json);
}

// src/semanticscholar-api.ts
var S2_SEARCH = "https://api.semanticscholar.org/graph/v1/paper/search";
var S2_STOPWORDS = /* @__PURE__ */ new Set([
  "a",
  "an",
  "the",
  "of",
  "to",
  "in",
  "on",
  "for",
  "and",
  "or",
  "but",
  "by",
  "with",
  "within",
  "into",
  "from",
  "at",
  "as",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "do",
  "does",
  "did",
  "what",
  "how",
  "which",
  "why",
  "who",
  "whom",
  "when",
  "where",
  "whether",
  "that",
  "this",
  "these",
  "those",
  "their",
  "they",
  "them",
  "its",
  "it",
  "can",
  "could",
  "should",
  "would",
  "may",
  "might",
  "will",
  "shall",
  "than",
  "then",
  "there",
  "about",
  "over",
  "under",
  "between",
  "among",
  "through",
  "per"
]);
function toKeywordQuery(query, maxTokens = 8) {
  const cleaned = query.replace(/[?*()[\]{}"'“”‘’,;:.!]/g, " ").replace(/\s+/g, " ").trim();
  const tokens = cleaned.split(" ").filter(Boolean);
  const content = tokens.filter((t) => !S2_STOPWORDS.has(t.toLowerCase()));
  const kept = content.slice(0, maxTokens).join(" ").trim();
  return content.length >= 2 ? kept : cleaned;
}
var S2_FIELDS = [
  "title",
  "abstract",
  "year",
  "authors",
  "venue",
  "externalIds",
  "citationCount",
  "influentialCitationCount",
  "publicationTypes",
  "url",
  "openAccessPdf"
].join(",");
function buildSemanticScholarUrl(query, filters, settings) {
  var _a, _b;
  const params = new URLSearchParams();
  params.set("query", toKeywordQuery(query));
  params.set("limit", String(Math.min(settings.resultLimit || 20, 100)));
  params.set("fields", S2_FIELDS);
  if (filters.yearMin != null || filters.yearMax != null) {
    params.set("year", `${(_a = filters.yearMin) != null ? _a : ""}-${(_b = filters.yearMax) != null ? _b : ""}`);
  }
  if (filters.excludePreprints) params.set("publicationTypes", "JournalArticle");
  return `${S2_SEARCH}?${params.toString()}`;
}
function pickAuthors2(raw) {
  const authors = raw.authors;
  if (!Array.isArray(authors)) return [];
  return authors.map((a) => a && typeof a === "object" ? a.name : "").filter((n) => typeof n === "string" && n.length > 0);
}
function pickDoi(raw) {
  const ext = raw.externalIds;
  if (ext && typeof ext === "object") {
    const doi = ext.DOI;
    if (typeof doi === "string" && doi) return doi;
  }
  return void 0;
}
function pickUrl2(raw, doi) {
  if (typeof raw.url === "string" && raw.url) return raw.url;
  if (doi) return `https://doi.org/${doi}`;
  return "";
}
function pickPublicationTypes2(raw) {
  const types = raw.publicationTypes;
  if (!Array.isArray(types)) return void 0;
  const out = types.filter((t) => typeof t === "string" && t.length > 0);
  return out.length > 0 ? out : void 0;
}
function pickOpenAccess2(raw) {
  const pdf = raw.openAccessPdf;
  if (!pdf || typeof pdf !== "object") return {};
  const url = pdf.url;
  return typeof url === "string" && url ? { oaUrl: url, isOpenAccess: true } : {};
}
function normalizeSemanticScholarPaper(raw) {
  if (!raw || typeof raw !== "object") return null;
  const p = raw;
  const title = typeof p.title === "string" ? p.title : "";
  if (!title) return null;
  const doi = pickDoi(p);
  return {
    title,
    authors: pickAuthors2(p),
    year: typeof p.year === "number" ? p.year : void 0,
    journal: typeof p.venue === "string" && p.venue ? p.venue : void 0,
    citationCount: typeof p.citationCount === "number" ? p.citationCount : void 0,
    url: pickUrl2(p, doi),
    doi,
    abstract: typeof p.abstract === "string" ? p.abstract : void 0,
    publicationTypes: pickPublicationTypes2(p),
    ...pickOpenAccess2(p)
  };
}
function parseSemanticScholarResponse(query, payload) {
  let data = [];
  if (payload && typeof payload === "object" && Array.isArray(payload.data)) {
    data = payload.data;
  }
  const papers = data.map(normalizeSemanticScholarPaper).filter((p) => p !== null);
  return { query, papers, raw: payload };
}
async function searchSemanticScholar(query, filters, settings, http) {
  const headers = { Accept: "application/json" };
  if (settings.semanticScholarApiKey) headers["x-api-key"] = settings.semanticScholarApiKey;
  const url = buildSemanticScholarUrl(query, filters, settings);
  const res = await http({ url, method: "GET", headers });
  if (res.status === 429) {
    throw new SearchApiError(
      "Semantic Scholar rate limit reached (429). Add a free API key in settings for a dedicated lane.",
      429
    );
  }
  if (res.status < 200 || res.status >= 300) {
    throw new SearchApiError(
      `Semantic Scholar returned ${res.status}${res.text ? `: ${res.text.slice(0, 200)}` : ""}`,
      res.status
    );
  }
  return parseSemanticScholarResponse(query, res.json);
}

// src/providers.ts
var PROVIDERS = {
  openalex: {
    id: "openalex",
    label: "OpenAlex (free)",
    requiresApiKey: false,
    supportsMedicalFilters: false,
    search: searchOpenAlex
  },
  semanticscholar: {
    id: "semanticscholar",
    label: "Semantic Scholar (free, optional key)",
    // Works without a key (shared pool); a free key just raises the rate limit.
    requiresApiKey: false,
    supportsMedicalFilters: false,
    search: searchSemanticScholar
  },
  consensus: {
    id: "consensus",
    label: "Consensus (API key)",
    requiresApiKey: true,
    supportsMedicalFilters: true,
    search: searchConsensus
  }
};
function getProvider(id) {
  var _a;
  return (_a = PROVIDERS[id]) != null ? _a : PROVIDERS.openalex;
}

// src/logger.ts
function safeStringify(data) {
  if (typeof data === "string") return data;
  try {
    return JSON.stringify(data);
  } catch (e) {
    return String(data);
  }
}
function createLogger(enabled) {
  const lines = [];
  const fn = ((label, data) => {
    if (!enabled) return;
    lines.push(data === void 0 ? label : `${label} \u2014 ${safeStringify(data)}`);
  });
  fn.lines = lines;
  fn.enabled = enabled;
  fn.totalUsage = 0;
  fn.callCount = 0;
  fn.addUsage = (tokens) => {
    if (!tokens) return;
    fn.totalUsage += tokens;
    fn.callCount += 1;
  };
  return fn;
}

// src/research-session.ts
var SESSION_FLAG = "research-session";
var PROJECT_FLAG = "research-project";
function normalizeProjectRef(value) {
  let s = typeof value === "string" ? value.trim() : "";
  if (!s) return "";
  s = s.replace(/^\[\[/, "").replace(/\]\]$/, "");
  s = s.replace(/\.md$/i, "");
  const slash = s.lastIndexOf("/");
  if (slash >= 0) s = s.slice(slash + 1);
  return s.replace(/\s+/g, " ").trim();
}
function parseProjectHub(frontmatter) {
  if (!frontmatter || typeof frontmatter !== "object") return null;
  const fm = frontmatter;
  if (fm[PROJECT_FLAG] !== true) return null;
  return { project: normalizeProjectRef(fm.project) };
}
function sameProject(a, b) {
  return !!a && a.toLowerCase() === b.toLowerCase();
}
function shouldPreferLastResearch(lastResearchNotePath, activeNotePath) {
  return lastResearchNotePath !== null && lastResearchNotePath === activeNotePath;
}
function canDeepenFromLastResearch(lastResearchNotePath, activeSessionNotePath) {
  if (activeSessionNotePath === null) return true;
  return lastResearchNotePath === activeSessionNotePath;
}
function cleanStrList(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const v of raw) {
    const s = typeof v === "string" ? v.trim() : "";
    if (s) out.push(s);
  }
  return out;
}
function parseBeliefs(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry;
    const claim = typeof e.claim === "string" ? e.claim.trim() : "";
    if (!claim) continue;
    const belief = { claim };
    if (e.confidence === "laag" || e.confidence === "midden" || e.confidence === "hoog") belief.confidence = e.confidence;
    if (e.status === "open" || e.status === "ondersteund" || e.status === "weersproken") belief.status = e.status;
    out.push(belief);
  }
  return out;
}
function parseSession(frontmatter) {
  if (!frontmatter || typeof frontmatter !== "object") return null;
  const fm = frontmatter;
  if (fm[SESSION_FLAG] !== true) return null;
  const framing = typeof fm.framing === "string" ? fm.framing.trim() : "";
  return {
    project: normalizeProjectRef(fm.project),
    question: typeof fm.question === "string" ? fm.question.trim() : "",
    framing: framing || void 0,
    seeds: cleanStrList(fm.seeds),
    lenses: cleanStrList(fm.lenses),
    beliefs: parseBeliefs(fm.beliefs)
  };
}
function sessionTopic(session) {
  return ((session == null ? void 0 : session.framing) || (session == null ? void 0 : session.question) || "").trim();
}
function pickPromptSeed(initialQuery, selection, topic) {
  return (initialQuery || "").trim() || (selection || "").trim() || (topic || "").trim();
}
function parseBeliefLines(text) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const raw of text.split("\n")) {
    const claim = raw.trim().replace(/^[-*]\s*/, "").trim();
    if (!claim) continue;
    const key = claim.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ claim, status: "open" });
  }
  return out;
}
function mergeBeliefs(existing, add) {
  const out = [...existing];
  const seen = new Set(existing.map((b) => b.claim.toLowerCase()));
  for (const b of add) {
    const key = b.claim.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(b);
  }
  return out;
}
function applyBeliefStatus(beliefs, updates) {
  const byClaim = new Map(updates.map((u) => [u.claim.toLowerCase(), u.status]));
  return beliefs.map((b) => {
    const status = byClaim.get(b.claim.toLowerCase());
    return status ? { ...b, status } : b;
  });
}
function renderBeliefs(beliefs) {
  if (beliefs.length === 0) return "_(nog geen overtuigingen vastgelegd)_";
  return beliefs.map((b) => {
    var _a;
    const conf = b.confidence ? ` _(vertrouwen: ${b.confidence})_` : "";
    return `- [${(_a = b.status) != null ? _a : "open"}] ${b.claim}${conf}`;
  }).join("\n");
}
var SECTION_IDS = {
  synthesis: "Synthese",
  exploration: "Probleemverkenning",
  lenses: "Theoretische lenzen",
  challenge: "Challenge",
  agenda: "Onderzoeksagenda",
  logbook: "Logboek",
  searchstrategy: "Zoekstrategie",
  objective: "Doelstelling",
  context: "Context",
  beliefs: "Overtuigingen"
};
var LEGACY_HEADINGS = {
  beliefs: ["Beliefs"],
  agenda: ["Implicaties"]
};
function sectionMarker(id, hash) {
  return hash ? `<!-- lens:${id} h:${hash} -->` : `<!-- lens:${id} -->`;
}
function markerRegex(id) {
  return new RegExp(`<!--\\s*lens:${id}(?:\\s+h:([0-9a-f]+))?\\s*-->`);
}
function isSectionId(heading) {
  return Object.prototype.hasOwnProperty.call(SECTION_IDS, heading);
}
function resolveHeading(headingOrId) {
  var _a;
  if (isSectionId(headingOrId)) return { heading: SECTION_IDS[headingOrId], id: headingOrId };
  const id = (_a = Object.keys(SECTION_IDS).find((k) => SECTION_IDS[k] === headingOrId)) != null ? _a : null;
  return { heading: headingOrId, id };
}
function findHeadingLine(lines, headingOrId) {
  const { heading, id } = resolveHeading(headingOrId);
  if (id) {
    const re = markerRegex(id);
    const byMarker = lines.findIndex((l) => /^##\s+/.test(l) && re.test(l));
    if (byMarker !== -1) return byMarker;
  }
  const byText = lines.findIndex((l) => l.trim() === `## ${heading}`);
  if (byText !== -1) return byText;
  for (const alias of id && LEGACY_HEADINGS[id] || []) {
    const byLegacyText = lines.findIndex((l) => l.trim() === `## ${alias}`);
    if (byLegacyText !== -1) return byLegacyText;
  }
  return -1;
}
function stampedHash(lines, headingIdx, id) {
  var _a;
  if (headingIdx === -1 || !id) return null;
  const m = markerRegex(id).exec(lines[headingIdx]);
  return (_a = m == null ? void 0 : m[1]) != null ? _a : null;
}
function extractSection(body, headingOrId) {
  const lines = body.split("\n");
  const start = findHeadingLine(lines, headingOrId);
  if (start === -1) return "";
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join("\n").trim();
}
function extractBulletsUnderHeading(body, headingMatch) {
  const lines = body.split("\n");
  const start = lines.findIndex((l) => {
    const m = l.match(/^#{1,6}\s+(.*)$/);
    return m ? headingMatch(m[1].trim()) : false;
  });
  if (start === -1) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^#{1,6}\s/.test(lines[i])) break;
    const m = lines[i].trim().match(/^[-*]\s+(.*)$/);
    if (m && m[1].trim()) out.push(m[1].trim());
  }
  return out;
}
function unionStrings(existing, add) {
  const out = Array.isArray(existing) ? existing.filter((x) => typeof x === "string") : [];
  const seen = new Set(out.map((s) => s.toLowerCase()));
  for (const s of add) {
    const t = s.trim();
    if (!t || seen.has(t.toLowerCase())) continue;
    seen.add(t.toLowerCase());
    out.push(t);
  }
  return out;
}
function sectionFingerprint(content) {
  const s = content.trim();
  let hash = 5381;
  for (let i = 0; i < s.length; i++) hash = hash * 33 + s.charCodeAt(i) | 0;
  return (hash >>> 0).toString(16).padStart(8, "0");
}
function sectionEditState(body, headingOrId) {
  const lines = body.split("\n");
  const idx = findHeadingLine(lines, headingOrId);
  if (idx === -1) return "absent";
  const { id } = resolveHeading(headingOrId);
  const hash = stampedHash(lines, idx, id);
  if (!hash) return "unstamped";
  return sectionFingerprint(extractSection(body, headingOrId)) === hash ? "machine" : "edited";
}
function needsOverwriteConfirmation(state) {
  return state === "edited" || state === "unstamped";
}
function upsertSection(body, headingOrId, content) {
  const lines = body.split("\n");
  const { heading, id } = resolveHeading(headingOrId);
  const headingLine = id ? `## ${heading} ${sectionMarker(id, sectionFingerprint(content))}` : `## ${heading}`;
  const block2 = [headingLine, "", content.trimEnd()];
  const startIdx = findHeadingLine(lines, headingOrId);
  if (startIdx === -1) {
    const base = body.replace(/\s+$/, "");
    return `${base ? `${base}

` : ""}${block2.join("\n")}
`;
  }
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      endIdx = i;
      break;
    }
  }
  const before = lines.slice(0, startIdx);
  const after = lines.slice(endIdx);
  const rebuilt = [...before, ...block2, "", ...after].join("\n");
  return `${rebuilt.replace(/\n{3,}/g, "\n\n").replace(/\s+$/, "")}
`;
}
function appendToSection(body, headingOrId, line) {
  const lines = body.split("\n");
  const { heading, id } = resolveHeading(headingOrId);
  const headingLine = id ? `## ${heading} ${sectionMarker(id)}` : `## ${heading}`;
  const startIdx = findHeadingLine(lines, headingOrId);
  if (startIdx === -1) {
    const base = body.replace(/\s+$/, "");
    return `${base ? `${base}

` : ""}${headingLine}

${line.trimEnd()}
`;
  }
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      endIdx = i;
      break;
    }
  }
  let insertAt = startIdx + 1;
  for (let i = startIdx + 1; i < endIdx; i++) {
    if (lines[i].trim() !== "") insertAt = i + 1;
  }
  const rebuilt = [...lines.slice(0, insertAt), line.trimEnd(), ...lines.slice(insertAt)].join("\n");
  return `${rebuilt.replace(/\n{3,}/g, "\n\n").replace(/\s+$/, "")}
`;
}

// src/workbench.ts
var SNIPPET_LEN = 160;
function deriveSessionState(session, body) {
  var _a, _b, _c;
  const synthesis = extractSection(body, "synthesis");
  const lenses = (_a = session == null ? void 0 : session.lenses) != null ? _a : [];
  const beliefs = (_b = session == null ? void 0 : session.beliefs) != null ? _b : [];
  const snippet2 = synthesis.replace(/\s+/g, " ").trim().slice(0, SNIPPET_LEN);
  return {
    isSession: session !== null,
    question: (_c = session == null ? void 0 : session.question) != null ? _c : "",
    framing: session == null ? void 0 : session.framing,
    hasFraming: !!(session == null ? void 0 : session.framing),
    lenses,
    openBeliefs: beliefs.filter((b) => {
      var _a2;
      return ((_a2 = b.status) != null ? _a2 : "open") === "open";
    }).length,
    totalBeliefs: beliefs.length,
    hasExploration: extractSection(body, "exploration") !== "",
    hasLenses: lenses.length > 0 || extractSection(body, "lenses") !== "",
    hasChallenge: extractSection(body, "challenge") !== "",
    hasSynthesis: synthesis !== "",
    hasAgenda: extractSection(body, "agenda") !== "",
    synthesisSnippet: synthesis ? `${snippet2}${synthesis.length > SNIPPET_LEN ? "\u2026" : ""}` : ""
  };
}
function recommendActions(s) {
  const postSynthesisChallenge = s.isSession && s.hasSynthesis && !s.hasChallenge;
  const candidates = [
    {
      when: !s.isSession,
      action: {
        commandId: "start-research-session",
        label: "Start research session",
        why: "Turn this note into a session so the copilots write into it and the chain builds up.",
        step: "explore"
      }
    },
    {
      when: !s.hasExploration && !s.hasSynthesis,
      action: {
        commandId: "explore-problem",
        label: "Explore the problem",
        why: "Explore the problem first \u2014 assumptions, counter-assumptions and reformulations \u2014 before you search.",
        step: "explore"
      }
    },
    {
      when: s.isSession && s.hasExploration && !s.hasChallenge && !s.hasSynthesis,
      action: {
        commandId: "challenge-framing",
        label: "Challenge my framing",
        why: "You have an exploration and framing. Test your assumptions along five dimensions before the literature research.",
        step: "challenge"
      }
    },
    {
      when: s.isSession && s.hasExploration && !s.hasLenses && !s.hasSynthesis,
      action: {
        commandId: "theory-lenses",
        label: "Explore theoretical lenses",
        why: "Choose the theoretical lenses to think with \u2014 they steer the search terms and the synthesis.",
        step: "theory"
      }
    },
    {
      when: s.isSession && !s.hasSynthesis && (s.hasExploration || s.hasFraming),
      action: {
        commandId: "research-question",
        label: "Ask a question (research)",
        why: "Run the literature research: search \u2192 rerank \u2192 graded synthesis, seeded from your framing/lenses.",
        step: "evidence"
      }
    },
    {
      when: s.isSession && s.hasSynthesis && s.openBeliefs > 0,
      action: {
        commandId: "confront-beliefs",
        label: "Confront beliefs",
        why: `You have ${s.openBeliefs} open belief(s). Test them against the synthesis \u2014 you decide what to adopt.`,
        step: "evidence"
      }
    },
    {
      when: s.isSession && s.hasSynthesis && !s.hasAgenda,
      action: {
        commandId: "research-agenda",
        label: "Propose research agenda",
        why: "Think through where the synthesis ends: gaps, new questions and fitting research designs.",
        step: "design"
      }
    },
    {
      // Recurrent challenge (D4): a synthesis exists but hasn't been challenged yet — offered as
      // the ALTERNATIVE alongside whichever primary (beliefs/agenda) applies above, ranked ahead
      // of the methodology account so a stale, never-challenged framing surfaces before wrap-up.
      when: postSynthesisChallenge,
      action: {
        commandId: "challenge-framing",
        label: "Challenge my framing",
        why: "You have a synthesis but haven't challenged it yet. Test it along five dimensions \u2014 challenging is recurrent, not a one-time gate.",
        step: "challenge"
      }
    },
    {
      when: s.isSession && s.hasSynthesis,
      action: {
        commandId: "methodology-account",
        label: "Generate methodological account",
        why: "Bundle the chain into a self-contained, reproducible account document.",
        step: "design"
      }
    },
    {
      when: s.isSession,
      action: {
        commandId: "research-question",
        label: "Ask a question (research)",
        why: "Refine or extend with a new round of research on this session.",
        step: "evidence"
      }
    }
  ];
  const picked = [];
  const seen = /* @__PURE__ */ new Set();
  for (const c of candidates) {
    if (!c.when || seen.has(c.action.commandId)) continue;
    seen.add(c.action.commandId);
    picked.push(c.action);
    if (picked.length === 2) break;
  }
  return picked;
}
function allActions(s) {
  const out = [];
  if (!s.isSession) out.push({ commandId: "start-research-session", label: "Start research session" });
  out.push(
    { commandId: "explore-problem", label: "Explore the problem" },
    { commandId: "theory-lenses", label: "Explore theoretical lenses" },
    { commandId: "challenge-framing", label: "Challenge my framing" },
    { commandId: "research-question", label: "Ask a question (research)" }
  );
  if (s.isSession) {
    out.push(
      { commandId: "confront-beliefs", label: "Confront beliefs" },
      { commandId: "research-agenda", label: "Propose research agenda" },
      { commandId: "methodology-account", label: "Generate methodological account" }
    );
  }
  return out;
}
function moreActions() {
  return [
    { commandId: "build-framework", label: "Build theoretical framework" },
    { commandId: "research-question-cross-sector", label: "Ask a question \u2014 force cross-sector evidence" },
    { commandId: "deepen-finding", label: "Deepen selected finding(s)" },
    { commandId: "register-bibliography-project", label: "Register \u2014 bibliography (this note's project)" },
    { commandId: "register-bridge-papers", label: "Register \u2014 bridge papers across projects" },
    { commandId: "register-overview", label: "Register \u2014 authors & orphans" },
    { commandId: "register-export-bibtex", label: "Register \u2014 export BibTeX" },
    { commandId: "ask-research-question", label: "Quick search (single provider)" },
    { commandId: "export-session", label: "Export research session (portable)" },
    { commandId: "export-project", label: "Export research project (portable)" }
  ];
}
function listArtifacts(session, body) {
  var _a, _b;
  const has = (id) => extractSection(body, id) !== "";
  const row = (id, presentExtra = false) => ({
    label: SECTION_IDS[id],
    heading: SECTION_IDS[id],
    present: presentExtra || has(id),
    navigable: has(id)
  });
  return [
    row("exploration"),
    row("lenses", ((_a = session == null ? void 0 : session.lenses.length) != null ? _a : 0) > 0),
    row("searchstrategy"),
    row("synthesis"),
    row("challenge"),
    row("beliefs", ((_b = session == null ? void 0 : session.beliefs.length) != null ? _b : 0) > 0),
    row("agenda"),
    row("logbook")
  ];
}
function workflowSteps(s) {
  var _a;
  const raw = [
    { label: "Explore", done: s.hasExploration, key: "explore" },
    { label: "Frame", done: s.hasFraming, key: "frame" },
    { label: "Theory", done: s.hasLenses, key: "theory" },
    { label: "Challenge", done: s.hasChallenge, key: "challenge" },
    { label: "Evidence", done: s.hasSynthesis, key: "evidence" },
    { label: "Design", done: s.hasAgenda, key: "design" }
  ];
  const primaryStep = (_a = recommendActions(s)[0]) == null ? void 0 : _a.step;
  return raw.map(({ key, ...step }) => ({ ...step, current: key === primaryStep }));
}
function formatRunPhase(phase) {
  const p = (phase != null ? phase : "").trim();
  return p ? `Running: ${p}` : null;
}
function shouldRerenderOnChange(changedPath, renderedNotePath, projectMemberPaths) {
  if (renderedNotePath !== null && changedPath === renderedNotePath) return true;
  return projectMemberPaths.includes(changedPath);
}
function recentLog(body, n) {
  const log = extractSection(body, "logbook");
  if (!log) return [];
  const lines = log.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("- "));
  return lines.slice(Math.max(0, lines.length - n));
}

// src/project.ts
var DOELSTELLING_PLACEHOLDER = "_(nog te formuleren \u2014 waar wil dit project uiteindelijk antwoord op geven?)_";
function renderProjectHub(name, objective) {
  const doelstelling = objective.trim() || DOELSTELLING_PLACEHOLDER;
  let body = `# ${name}`;
  body = upsertSection(body, "objective", doelstelling);
  body = upsertSection(
    body,
    "Overzicht",
    "_Elke onderzoeksvraag is een eigen sessie-notitie in deze map; open de Research Workbench-zijbalk voor het overzicht en om een nieuwe vraag toe te voegen._"
  );
  return `---
${PROJECT_FLAG}: true
project: ${JSON.stringify(name)}
---

${body}`;
}
function resolveProject(notePath, frontmatter) {
  const fm = frontmatter == null ? void 0 : frontmatter.project;
  if (typeof fm === "string" && fm.trim()) return fm.trim();
  if (Array.isArray(fm) && typeof fm[0] === "string" && fm[0].trim()) return fm[0].trim();
  const parts = notePath.split("/").filter((p) => p.length > 0);
  if (parts.length > 1) return parts[0];
  return void 0;
}
function resolveProjectId(hub, basename) {
  return hub.project || normalizeProjectRef(basename);
}
function projectMembers(projectId, notes) {
  const out = [];
  for (const n of notes) {
    if (!n.session || !sameProject(n.session.project, projectId)) continue;
    const state = deriveSessionState(n.session, n.body);
    out.push({ path: n.path, title: n.title, hasSynthesis: state.hasSynthesis, openBeliefs: state.openBeliefs });
  }
  return out;
}
var MAX_PROJECT_HYPOTHESES = 20;
function isDirectionsHeading(text) {
  return /^Hypothesevormende vervolgrichtingen/i.test(text);
}
function projectHypotheses(projectId, notes) {
  var _a;
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const add = (text, kind, n) => {
    const t = text.trim();
    const key = t.toLowerCase();
    if (!t || seen.has(key) || out.length >= MAX_PROJECT_HYPOTHESES) return;
    seen.add(key);
    out.push({ text: t, kind, sourceTitle: n.title, sourcePath: n.path });
  };
  for (const n of notes) {
    if (!n.session || !sameProject(n.session.project, projectId)) continue;
    for (const b of n.session.beliefs) if (((_a = b.status) != null ? _a : "open") === "open") add(b.claim, "overtuiging", n);
    for (const d of extractBulletsUnderHeading(n.body, isDirectionsHeading)) add(d, "richting", n);
  }
  return out;
}
function artefactLandingTarget(activeNoteIsHub, hasActiveSession) {
  if (hasActiveSession) return "session-note";
  if (activeNoteIsHub) return "new-project-session";
  return "cursor";
}
function noteEligibleForProjectMove(frontmatter, notePath) {
  if (parseProjectHub(frontmatter)) return false;
  return resolveProject(notePath, frontmatter) === void 0;
}

// src/graph.ts
var LABEL_MAX = 120;
function clip(s, max = LABEL_MAX) {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1)}\u2026` : t;
}
function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "x";
}
function bronNodeId(key) {
  return `bron:${slug(key)}`;
}
function parseSourceRefs(text) {
  const out = [];
  const re = /\[(\d+)\]/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const n = Number(m[1]);
    if (Number.isInteger(n) && !out.includes(n)) out.push(n);
  }
  return out;
}
function findingClaim(bullet) {
  return bullet.replace(/\s*—\s*\*bewijs:.*$/i, "").replace(/\[\d+\]/g, "").trim() || bullet.trim();
}
function buildProjectGraph(project, notes, sources, records = []) {
  var _a;
  const nodes = [];
  const edges = [];
  const lensSeen = /* @__PURE__ */ new Map();
  const recordByNote = new Map(records.map((r) => [r.note, r]));
  const bronById = /* @__PURE__ */ new Map();
  const ensureBron = (key, title, year) => {
    const bronId = bronNodeId(key);
    const existing = bronById.get(bronId);
    if (!existing) {
      bronById.set(bronId, { type: "bron", id: bronId, label: clip(title || key), meta: year ? { jaar: year } : void 0 });
    } else if ((!existing.label || existing.label === key) && title) {
      existing.label = clip(title);
    }
    return bronId;
  };
  for (const n of notes) {
    const s = n.session;
    if (!s || !s.question) continue;
    const vraagId = `vraag:${slug(n.path)}`;
    nodes.push({ type: "vraag", id: vraagId, label: clip(s.question), note: n.path });
    const record = (_a = recordByNote.get(n.path)) != null ? _a : null;
    for (const lens of s.lenses) {
      const keyL = lens.toLowerCase().trim();
      let lensId = lensSeen.get(keyL);
      if (!lensId) {
        lensId = `lens:${slug(lens)}`;
        lensSeen.set(keyL, lensId);
        nodes.push({ type: "lens", id: lensId, label: clip(lens) });
      }
      edges.push({ from: lensId, to: vraagId, type: "kadert" });
    }
    s.beliefs.forEach((b, i) => {
      var _a2;
      const hypId = `hyp:${slug(n.path)}#${i}`;
      nodes.push({
        type: "hypothese",
        id: hypId,
        label: clip(b.claim),
        note: n.path,
        meta: { status: (_a2 = b.status) != null ? _a2 : "open", ...b.confidence ? { vertrouwen: b.confidence } : {} }
      });
      edges.push({ from: hypId, to: vraagId, type: "beantwoordt" });
    });
    const synthese = extractSection(n.body, "synthesis");
    const deelvragen = record && record.subQuestions.length > 0 ? record.subQuestions : extractBulletsUnderHeading(synthese, (h) => /deelvra/i.test(h));
    deelvragen.forEach((dv, i) => {
      const dvId = `dv:${slug(n.path)}#${i}`;
      nodes.push({ type: "deelvraag", id: dvId, label: clip(dv), note: n.path });
      edges.push({ from: dvId, to: vraagId, type: "splitst" });
    });
    if (record) {
      for (const meta of record.sources) ensureBron(meta.key, meta.title, meta.year);
      record.findings.forEach((f, i) => {
        const bevId = `bev:${slug(n.path)}#${i}`;
        nodes.push({
          type: "bevinding",
          id: bevId,
          label: clip(f.claim),
          note: n.path,
          meta: { bewijs: f.strength, bronverwijzingen: f.sourceKeys.length }
        });
        edges.push({ from: bevId, to: vraagId, type: "adresseert" });
        for (const key of f.sourceKeys) edges.push({ from: ensureBron(key), to: bevId, type: "onderbouwt" });
      });
    } else {
      const bevindingen = extractBulletsUnderHeading(synthese, (h) => /bevinding/i.test(h));
      bevindingen.forEach((bv, i) => {
        const bevId = `bev:${slug(n.path)}#${i}`;
        nodes.push({
          type: "bevinding",
          id: bevId,
          label: clip(findingClaim(bv)),
          note: n.path,
          meta: { bronverwijzingen: parseSourceRefs(bv).length }
        });
        edges.push({ from: bevId, to: vraagId, type: "adresseert" });
      });
    }
  }
  const noteToVraag = /* @__PURE__ */ new Map();
  for (const node of nodes) if (node.type === "vraag" && node.note) noteToVraag.set(node.note, node.id);
  for (const src of sources) {
    const bronId = ensureBron(src.key, src.title, src.year);
    for (const notePath of src.notes) {
      const vraagId = noteToVraag.get(notePath);
      if (vraagId) edges.push({ from: bronId, to: vraagId, type: "gebruikt-in" });
    }
  }
  return { project, nodes: [...nodes, ...bronById.values()], edges };
}
function graphStats(graph) {
  const byType = { vraag: 0, deelvraag: 0, hypothese: 0, bevinding: 0, bron: 0, lens: 0 };
  for (const n of graph.nodes) byType[n.type]++;
  return { byType, edges: graph.edges.length };
}
function detectGaps(graph) {
  var _a, _b, _c, _d;
  const gaps = [];
  const has = (from, type, vraagId) => graph.edges.some((e) => e.to === vraagId && e.type === type && nodeType(graph, e.from) === from);
  const hasRealSourceEdges = graph.edges.some((e) => e.type === "onderbouwt");
  for (const node of graph.nodes) {
    if (node.type === "vraag") {
      if (!has("deelvraag", "splitst", node.id))
        gaps.push({ type: "vraag-zonder-deelvraag", severity: "midden", nodeId: node.id, note: node.note, message: `Vraag nog niet opgesplitst in deelvragen: "${node.label}"` });
      if (!has("bevinding", "adresseert", node.id))
        gaps.push({ type: "vraag-zonder-bevinding", severity: "midden", nodeId: node.id, note: node.note, message: `Vraag heeft nog geen synthese-bevindingen: "${node.label}"` });
      if (!has("bron", "gebruikt-in", node.id))
        gaps.push({ type: "vraag-zonder-bron", severity: "midden", nodeId: node.id, note: node.note, message: `Vraag heeft nog geen literatuur in het register: "${node.label}"` });
    }
    if (node.type === "bevinding" && Number((_b = (_a = node.meta) == null ? void 0 : _a.bronverwijzingen) != null ? _b : 0) === 0)
      gaps.push({ type: "bevinding-zonder-bron", severity: "hoog", nodeId: node.id, note: node.note, message: `Bevinding zonder bronverwijzing (onbewezen claim): "${node.label}"` });
    if (node.type === "hypothese" && ((_d = (_c = node.meta) == null ? void 0 : _c.status) != null ? _d : "open") === "open")
      gaps.push({ type: "hypothese-open", severity: "info", nodeId: node.id, note: node.note, message: `Open hypothese, nog te toetsen: "${node.label}"` });
    if (hasRealSourceEdges && node.type === "bron" && !graph.edges.some((e) => e.from === node.id && e.type === "onderbouwt"))
      gaps.push({ type: "bron-zonder-bevinding", severity: "info", nodeId: node.id, note: node.note, message: `Bron nog niet gebruikt in een bevinding: "${node.label}"` });
  }
  return gaps;
}
function nodeType(graph, id) {
  var _a;
  return (_a = graph.nodes.find((n) => n.id === id)) == null ? void 0 : _a.type;
}
var GAP_HEADING = {
  hoog: "\u{1F534} Hoog \u2014 onbewezen claims",
  midden: "\u{1F7E0} Midden \u2014 ontbrekende stappen",
  info: "\u{1F535} Info \u2014 open draden"
};
function noteLink(label, note) {
  return note ? `[[${note}|${label}]]` : label;
}
function renderGraphReport(graph, gaps, jsonBytes) {
  const stats = graphStats(graph);
  const lines = [
    `# Kennisgraph (spike) \u2014 ${graph.project}`,
    "",
    "_Read-only projectie uit de bestaande artefacten (front-matter + gerenderde synthese + citatie-register). Wegwerp: niet met de hand bijwerken \u2014 opnieuw genereren._",
    "",
    "## Omvang",
    "",
    `- **${graph.nodes.length}** nodes, **${graph.edges.length}** edges` + (jsonBytes !== void 0 ? ` \xB7 graph-JSON \u2248 ${(jsonBytes / 1024).toFixed(1)} kB` : ""),
    `- vraag ${stats.byType.vraag} \xB7 deelvraag ${stats.byType.deelvraag} \xB7 hypothese ${stats.byType.hypothese} \xB7 bevinding ${stats.byType.bevinding} \xB7 bron ${stats.byType.bron} \xB7 lens ${stats.byType.lens}`,
    "",
    "## Gaten",
    ""
  ];
  if (gaps.length === 0) {
    lines.push("_Geen gaten gedetecteerd._", "");
  } else {
    for (const sev of ["hoog", "midden", "info"]) {
      const group = gaps.filter((g) => g.severity === sev);
      if (group.length === 0) continue;
      lines.push(`### ${GAP_HEADING[sev]} (${group.length})`, "");
      for (const g of group) lines.push(`- ${g.message.replace(/^(.*?): "(.*)"$/, (_, p, l) => `${p}: ${noteLink(l, g.note)}`)}`);
      lines.push("");
    }
  }
  lines.push("## Nodes per type", "");
  for (const type of ["vraag", "deelvraag", "hypothese", "bevinding", "bron", "lens"]) {
    const group = graph.nodes.filter((n) => n.type === type);
    if (group.length === 0) continue;
    lines.push(`### ${type} (${group.length})`, "");
    for (const n of group) {
      const meta = n.meta ? ` _(${Object.entries(n.meta).map(([k, v]) => `${k}: ${v}`).join(", ")})_` : "";
      lines.push(`- ${noteLink(n.label, n.note)}${meta}`);
    }
    lines.push("");
  }
  const withEdges = graph.edges.some((e) => e.type === "onderbouwt");
  lines.push(
    "## Provenance",
    "",
    withEdges ? "Deze graph gebruikt **edges-bij-generatie** (E68): `bron\u2192bevinding` (`onderbouwt`) komt uit de vastgelegde records, dus bevinding\u2192specifieke-bron is betrouwbaar. Notities zonder record (oude runs / proza-fallback) tellen alleen het *aantal* `[n]`-verwijzingen." : "Nog **geen** edges-bij-generatie (E68-records) gevonden voor dit project \u2014 de bevindingen komen uit de gerenderde synthese, waar de `[n]`-nummers geen persistente mapping naar citatie-keys hebben. We tellen daarom alleen of een bevinding *een* verwijzing draagt. Draai een nieuwe synthese om betrouwbare `bron\u2192bevinding`-edges te krijgen.",
    ""
  );
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}
`;
}

// src/research-graph-store.ts
var GRAPH_STORE_VERSION = 1;
function emptyGraphStore() {
  return { version: GRAPH_STORE_VERSION, sessions: [], artefacts: [] };
}
function parseGraphStore(raw) {
  if (!raw) return emptyGraphStore();
  try {
    const obj = JSON.parse(raw);
    if (!obj || !Array.isArray(obj.sessions)) return emptyGraphStore();
    return {
      version: typeof obj.version === "number" ? obj.version : GRAPH_STORE_VERSION,
      sessions: obj.sessions,
      artefacts: Array.isArray(obj.artefacts) ? obj.artefacts : []
    };
  } catch (e) {
    return emptyGraphStore();
  }
}
function serializeGraphStore(store) {
  return `${JSON.stringify(store, null, 2)}
`;
}
function resolveSourceKeys(indices, papers) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const n of indices) {
    if (!Number.isInteger(n) || n < 1 || n > papers.length) continue;
    const key = citationKey(papers[n - 1]);
    if (key && !seen.has(key)) {
      seen.add(key);
      out.push(key);
    }
  }
  return out;
}
function buildSessionGraphRecord(note, synthesis, papers, subQuestions = []) {
  var _a;
  const findings = synthesis.findings.map((f) => ({
    claim: f.claim,
    strength: f.strength,
    sourceKeys: resolveSourceKeys(f.sources, papers)
  }));
  const citedIdx = /* @__PURE__ */ new Set();
  for (const f of synthesis.findings) for (const n of f.sources) citedIdx.add(n);
  for (const c of synthesis.contradictions) for (const n of c.sources) citedIdx.add(n);
  const sources = [];
  const seenKey = /* @__PURE__ */ new Set();
  for (const n of [...citedIdx].sort((a, b) => a - b)) {
    if (!Number.isInteger(n) || n < 1 || n > papers.length) continue;
    const p = papers[n - 1];
    const key = citationKey(p);
    if (!key || seenKey.has(key)) continue;
    seenKey.add(key);
    sources.push({ key, title: p.title, ...typeof p.year === "number" ? { year: p.year } : {} });
  }
  return {
    note,
    question: synthesis.headline || "",
    subQuestions: subQuestions.map((s) => s.trim()).filter((s) => s.length > 0),
    findings,
    unanswered: ((_a = synthesis.unanswered) != null ? _a : []).map((u) => ({
      question: u.question,
      reason: u.reason,
      ...u.designNeeded ? { designNeeded: u.designNeeded } : {}
    })),
    sources
  };
}
function upsertSessionGraphRecord(store, record) {
  const sessions = store.sessions.filter((s) => s.note !== record.note);
  sessions.push(record);
  return { version: store.version, sessions, artefacts: store.artefacts };
}
function recordForNote(store, note) {
  var _a;
  return (_a = store.sessions.find((s) => s.note === note)) != null ? _a : null;
}
function artefactRecordForNote(store, note) {
  var _a;
  return (_a = store.artefacts.find((a) => a.note === note)) != null ? _a : null;
}
function upsertSessionArtefactRecord(store, note, patch) {
  var _a, _b, _c;
  const existing = artefactRecordForNote(store, note);
  const searchStrategy = (_a = patch.searchStrategy) != null ? _a : existing == null ? void 0 : existing.searchStrategy;
  const mergedAdoptions = { ...(_b = existing == null ? void 0 : existing.adoptions) != null ? _b : {}, ...(_c = patch.adoptions) != null ? _c : {} };
  const record = {
    note,
    ...searchStrategy ? { searchStrategy } : {},
    ...Object.keys(mergedAdoptions).length > 0 ? { adoptions: mergedAdoptions } : {}
  };
  const artefacts = store.artefacts.filter((a) => a.note !== note);
  artefacts.push(record);
  return { version: store.version, sessions: store.sessions, artefacts };
}

// src/methodology-account.ts
var NOT_RECORDED = "_Niet vastgelegd \u2014 deze stap is (nog) niet uitgevoerd._";
function block(heading, content) {
  return `## ${heading}

${content.trim() || NOT_RECORDED}`;
}
function assembleMethodologyAccount(session, body, sourceLink) {
  const parts = [];
  parts.push("# Methodologische verantwoording");
  const prov = [
    "> Afgeleid, reproduceerbaar document \u2014 automatisch samengesteld uit de onderzoekssessie.",
    "> Het beschrijft de **methodologische keuzes** rond het onderzoek, niet het interne redeneren van het model.",
    sourceLink ? `> Bron: ${sourceLink}` : null
  ].filter(Boolean).join("\n");
  parts.push(prov);
  const framingChosen = session.framing && session.framing !== session.question;
  const vraag = [
    session.question || NOT_RECORDED,
    "",
    framingChosen ? `**Gekozen herformulering (framing):** ${session.framing}

De overwogen alternatieve formuleringen staan onder *Probleemverkenning*.` : "_De oorspronkelijke vraag is ongewijzigd aangehouden._"
  ].join("\n");
  parts.push(`## Onderzoeksvraag

${vraag}`);
  parts.push(block("Probleemverkenning", extractSection(body, "exploration")));
  const lensSection = extractSection(body, "lenses");
  const lensChosen = session.lenses.length > 0 ? `**Gekozen lenzen:** ${session.lenses.join(", ")}.

` : "";
  parts.push(`## Theoretische lenzen

${(lensChosen + lensSection).trim() || NOT_RECORDED}`);
  parts.push(block("Zoekstrategie", extractSection(body, "searchstrategy")));
  parts.push(block("Synthese", extractSection(body, "synthesis")));
  parts.push(`## Overtuigingen

${renderBeliefs(session.beliefs)}`);
  const openVragen = extractSection(body, "agenda");
  if (openVragen) parts.push(`## Open vragen en vervolgonderzoek

${openVragen}`);
  const logbook = extractSection(body, "logbook");
  if (logbook) parts.push(`## Logboek

${logbook}`);
  return parts.join("\n\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

// src/research-event.ts
function formatEvent(e) {
  const iso = new Date(e.timestamp).toISOString();
  const stamp = `${iso.slice(0, 10)} ${iso.slice(11, 16)}`;
  return `- ${stamp} \xB7 **${e.step}** \u2014 ${e.summary}`;
}
var BELIEF_SNIPPET_LEN = 60;
function snippet(text, max) {
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max).trimEnd()}\u2026` : t;
}
function formatBeliefTransition(t) {
  return `[belief: "${snippet(t.claim, BELIEF_SNIPPET_LEN)}" ${t.from} \u2192 ${t.to}]`;
}
function appendBeliefTransitions(summary, transitions) {
  if (transitions.length === 0) return summary;
  return `${summary} ${transitions.map(formatBeliefTransition).join(" ")}`;
}
function parseBeliefTransitions(logbookSection) {
  const isStatus = (s) => s === "open" || s === "ondersteund" || s === "weersproken";
  const out = [];
  const re = /\[belief:\s*"([^"]*)"\s*(\S+)\s*→\s*(\S+)\]/g;
  for (const m of logbookSection.matchAll(re)) {
    const [, claim, from, to] = m;
    if (!isStatus(from) || !isStatus(to)) continue;
    out.push({ claim, from, to });
  }
  return out;
}

// src/session-export.ts
var SESSION_EXPORT_SCHEMA = "lens-session-export";
var SESSION_EXPORT_SCHEMA_VERSION = 2;
var SESSION_EXPORT_SECTION_IDS = Object.keys(SECTION_IDS).filter(
  (id) => id !== "objective" && id !== "context"
);
function filterRegisterToNote(register, notePath) {
  return {
    version: register.version,
    citations: register.citations.filter((c) => c.occurrences.some((o) => o.note === notePath))
  };
}
var TRANSITION_SNIPPET_LEN = 60;
function transitionMatchesClaim(transitionClaim, fullClaim) {
  const claim = fullClaim.trim().toLowerCase();
  if (transitionClaim.endsWith("\u2026") && transitionClaim.length - 1 >= TRANSITION_SNIPPET_LEN) {
    const prefix = transitionClaim.slice(0, -1).trim().toLowerCase();
    return claim.startsWith(prefix);
  }
  return claim === transitionClaim.trim().toLowerCase();
}
function parseFollowUp(contextBody) {
  const m = /Ouder-sessie:\s*\[\[([^\]]+)\]\]/.exec(contextBody);
  return { parentNote: m ? m[1] : null };
}
function buildSessionExport(inputs) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const artefacts = {};
  for (const id of SESSION_EXPORT_SECTION_IDS) {
    const raw = extractSection(inputs.body, id);
    artefacts[id] = raw ? { present: true, body: raw } : { present: false, body: null };
  }
  const contextRaw = extractSection(inputs.body, "context");
  const followUp = contextRaw ? parseFollowUp(contextRaw) : void 0;
  const transitions = parseBeliefTransitions((_a = artefacts.logbook.body) != null ? _a : "");
  const beliefs = inputs.beliefs.map((b) => {
    var _a2;
    return {
      text: b.claim,
      status: (_a2 = b.status) != null ? _a2 : "open",
      transitions: transitions.filter((t) => transitionMatchesClaim(t.claim, b.claim)).map((t) => ({ from: t.from, to: t.to }))
    };
  });
  const findings = ((_c = (_b = inputs.graphRecord) == null ? void 0 : _b.findings) != null ? _c : []).map((f) => {
    var _a2;
    return {
      text: f.claim,
      grade: (_a2 = f.strength) != null ? _a2 : null,
      sourceKeys: f.sourceKeys
    };
  });
  const bibliography = filterRegisterToNote(inputs.register, inputs.notePath).citations.map(
    (c) => {
      var _a2, _b2, _c2, _d2, _e2;
      return {
        key: c.key,
        title: c.title,
        authors: formatAuthors(c.authors),
        year: (_a2 = c.year) != null ? _a2 : null,
        journal: (_b2 = c.journal) != null ? _b2 : null,
        doi: (_c2 = c.doi) != null ? _c2 : null,
        isbn: (_d2 = c.isbn) != null ? _d2 : null,
        url: c.url || null,
        identifierStatus: (_e2 = c.identifier) != null ? _e2 : null,
        verified: c.verified
      };
    }
  );
  const methodologicalAccount = inputs.isSession ? {
    present: true,
    markdown: assembleMethodologyAccount(
      {
        project: (_d = inputs.project) != null ? _d : "",
        question: (_e = inputs.question) != null ? _e : "",
        framing: (_f = inputs.framing) != null ? _f : void 0,
        seeds: inputs.seeds,
        lenses: inputs.lenses,
        beliefs: inputs.beliefs
      },
      inputs.body,
      inputs.sourceLink
    )
  } : { present: false, markdown: null };
  const searchStrategy = (_g = inputs.artefactRecord) == null ? void 0 : _g.searchStrategy;
  const adoptions = (_h = inputs.artefactRecord) == null ? void 0 : _h.adoptions;
  return {
    schema: SESSION_EXPORT_SCHEMA,
    schemaVersion: SESSION_EXPORT_SCHEMA_VERSION,
    exportedAt: inputs.exportedAt,
    source: { notePath: inputs.notePath, project: inputs.project },
    question: inputs.question,
    frontmatter: { framing: inputs.framing, seeds: inputs.seeds, lenses: inputs.lenses },
    artefacts,
    ...followUp ? { followUp } : {},
    beliefs,
    findings,
    ...searchStrategy ? { searchStrategy } : {},
    ...adoptions && Object.keys(adoptions).length > 0 ? { adoptions } : {},
    bibliography,
    methodologicalAccount
  };
}

// src/session-export-bundle.ts
var SESSION_EXPORT_JSON_FILE = "session.json";
var SESSION_EXPORT_ACCOUNT_FILE = "verantwoording.md";
var SESSION_EXPORT_BIBTEX_FILE = "bronnen.bib";
var PROJECT_EXPORT_INDEX_FILE = "index.md";
function methodologyStub(missing) {
  const list = (missing.length > 0 ? missing : ["de methodologische verantwoording"]).map((m) => `- ${m}`).join("\n");
  return ["# Methodologische verantwoording", "", "_Kon niet automatisch worden samengesteld voor deze export._", "", "Ontbrekend:", list, ""].join(
    "\n"
  );
}
function buildSessionBundleFiles(exportDoc, bibtex) {
  const account = exportDoc.methodologicalAccount.present && exportDoc.methodologicalAccount.markdown ? exportDoc.methodologicalAccount.markdown : methodologyStub(["methodologische verantwoording (geen sessie-front-matter gevonden op deze notitie)"]);
  return [
    { relativePath: SESSION_EXPORT_JSON_FILE, content: `${JSON.stringify(exportDoc, null, 2)}
` },
    { relativePath: SESSION_EXPORT_ACCOUNT_FILE, content: account },
    { relativePath: SESSION_EXPORT_BIBTEX_FILE, content: bibtex }
  ];
}
function artefactSummary(exportDoc) {
  const present = SESSION_EXPORT_SECTION_IDS.filter((id) => exportDoc.artefacts[id].present).length;
  return `${present}/${SESSION_EXPORT_SECTION_IDS.length} artefacten aanwezig`;
}
function buildProjectIndexMarkdown(project, entries, hubObjective) {
  const lines = [`# Portable export \u2014 ${project}`, ""];
  if (hubObjective && hubObjective.trim()) {
    lines.push("## Doelstelling", "", hubObjective.trim(), "");
  }
  lines.push(`${entries.length} sessie(s) ge\xEBxporteerd.`, "");
  if (entries.length === 0) {
    lines.push("_Geen sessies gevonden voor dit project._");
    return `${lines.join("\n")}
`;
  }
  for (const e of entries) {
    lines.push(`## [${e.title}](${e.folderName}/${SESSION_EXPORT_ACCOUNT_FILE})`);
    lines.push("");
    lines.push(`- ${artefactSummary(e.exportDoc)}`);
    lines.push(`- Bevindingen: ${e.exportDoc.findings.length}`);
    lines.push(`- Bibliografie: ${e.exportDoc.bibliography.length} bron(nen)`);
    lines.push(`- JSON: [${SESSION_EXPORT_JSON_FILE}](${e.folderName}/${SESSION_EXPORT_JSON_FILE})`);
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}
`;
}

// src/cancellation.ts
var ResearchCancelledError = class extends Error {
  constructor() {
    super("Research cancelled.");
    this.name = "ResearchCancelledError";
  }
};
function createCancellationToken() {
  let cancelled = false;
  const waiters = [];
  return {
    get cancelled() {
      return cancelled;
    },
    cancel() {
      var _a;
      if (cancelled) return;
      cancelled = true;
      while (waiters.length > 0) (_a = waiters.pop()) == null ? void 0 : _a();
    },
    throwIfCancelled() {
      if (cancelled) throw new ResearchCancelledError();
    },
    race(promise) {
      if (cancelled) return Promise.reject(new ResearchCancelledError());
      return new Promise((resolve, reject) => {
        const onCancel = () => reject(new ResearchCancelledError());
        waiters.push(onCancel);
        promise.then(resolve, reject);
      });
    }
  };
}

// src/json-parse.ts
function parseJsonObject(raw, label, log) {
  let payload;
  try {
    payload = JSON.parse(extractJsonObject(raw));
  } catch (e) {
    log == null ? void 0 : log(`parse failure \u2014 ${label}: invalid JSON`, {
      error: String(e),
      length: raw.length,
      preview: raw.slice(0, 200)
    });
    return null;
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    log == null ? void 0 : log(`parse failure \u2014 ${label}: not a JSON object`, {
      type: Array.isArray(payload) ? "array" : payload === null ? "null" : typeof payload
    });
    return null;
  }
  return payload;
}

// src/crosssector.ts
var MAX_SECTORS = 3;
var MAX_TRANSFER_QUERIES = 4;
function normalize(s) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}
function dedupeCapped(raw, max) {
  if (!Array.isArray(raw)) return [];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const v of raw) {
    const s = typeof v === "string" ? v.trim() : "";
    if (!s) continue;
    const key = normalize(s);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= max) break;
  }
  return out;
}
function dedupeQueriesWithSectors(rawQueries, rawSectors, max) {
  if (!Array.isArray(rawQueries)) return [];
  const sectorsArr = Array.isArray(rawSectors) ? rawSectors : [];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (let i = 0; i < rawQueries.length; i++) {
    const q = typeof rawQueries[i] === "string" ? rawQueries[i].trim() : "";
    if (!q) continue;
    const key = normalize(q);
    if (seen.has(key)) continue;
    seen.add(key);
    const sector = typeof sectorsArr[i] === "string" ? sectorsArr[i].trim() : "";
    out.push({ query: q, sector });
    if (out.length >= max) break;
  }
  return out;
}
function parseAnalogues(raw, maxSectors = MAX_SECTORS, maxQueries = MAX_TRANSFER_QUERIES, log) {
  const p = parseJsonObject(raw, "crosssector", log);
  if (!p) return null;
  const sectors = dedupeCapped(p.sectors, maxSectors);
  const queryList2 = dedupeQueriesWithSectors(p.queries, p.querySectors, maxQueries);
  const queries = queryList2.map((q) => q.query);
  if (sectors.length === 0 || queries.length === 0) return null;
  return { sectors, queries, queryList: queryList2 };
}
var ANALOGUE_SYSTEM = [
  "You help a writer find ANALOGOUS evidence when their own domain is thinly studied.",
  "Given a theoretical construct and the original research question, name 2-3 OTHER sectors",
  "where the SAME construct is studied (e.g. healthcare networks, public administration,",
  "supply chains, education, non-profits), and write English search queries for the construct",
  "in those analogous sectors \u2014 deliberately NOT in the original domain.",
  "The goal is transferable evidence, clearly from another sector.",
  "Do NOT invent facts, sources, findings or citations. Respond with strict JSON only."
].join(" ");
async function proposeAnalogues(question, construct, chat, opts = {}) {
  var _a, _b;
  const maxSectors = (_a = opts.maxSectors) != null ? _a : MAX_SECTORS;
  const maxQueries = (_b = opts.maxQueries) != null ? _b : MAX_TRANSFER_QUERIES;
  const log = opts.log;
  const user = [
    `Original research question: ${question}`,
    `Central construct: ${construct}`,
    `Return JSON of the form {"sectors":["...","..."],"queries":["...","..."],"querySectors":["...","..."]}`,
    `with ${maxSectors} or fewer sectors and ${maxQueries} or fewer queries.`,
    `"querySectors" must be the SAME LENGTH and ORDER as "queries": querySectors[i] names which`,
    `sector from "sectors" queries[i] targets, so each query is traceable back to its sector.`
  ].join("\n");
  let raw;
  try {
    raw = await chat(
      [
        { role: "system", content: ANALOGUE_SYSTEM },
        { role: "user", content: user }
      ],
      { json: true, temperature: 0 }
    );
  } catch (e) {
    log == null ? void 0 : log(`crosssector \u2014 chat failure`, String(e));
    return null;
  }
  return parseAnalogues(raw, maxSectors, maxQueries, log);
}
function tagTransferPapers(papers, queryList2) {
  const sectorByQuery = /* @__PURE__ */ new Map();
  for (const { query, sector } of queryList2) {
    if (!sector) continue;
    const key = normalize(query);
    if (!sectorByQuery.has(key)) sectorByQuery.set(key, sector);
  }
  return papers.map((paper) => {
    var _a;
    let transferSector;
    for (const q of (_a = paper.fromQueries) != null ? _a : []) {
      const sector = sectorByQuery.get(normalize(q));
      if (sector) {
        transferSector = sector;
        break;
      }
    }
    return transferSector ? { ...paper, sector: "transfer", transferSector } : { ...paper, sector: "transfer" };
  });
}

// src/decompose.ts
var SYSTEM = [
  "You are a research methodologist helping a writer search the literature.",
  "Decompose a possibly vague research question into sharp, searchable sub-questions,",
  "as a researcher would \u2014 drawing on review frameworks (PICO/PECO/SPIDER/PCC) where they fit.",
  "Write EVERY sub-question in English \u2014 the language of academic indexing \u2014 even when the",
  "input question is in another language; otherwise the search engines return almost nothing.",
  "EVERY sub-question MUST include a non-empty 'hypothesis': one sentence stating the expected,",
  "falsifiable answer (a directional prediction). Never omit the hypothesis field.",
  "Rules: produce ONLY searchable sub-questions; do NOT invent facts, sources, findings or citations.",
  "Deduplicate near-identical sub-questions. Respond with strict JSON only."
].join(" ");
function normalize2(query) {
  return query.toLowerCase().replace(/\s+/g, " ").trim();
}
function parseSubquestions(raw, max, log) {
  const payload = parseJsonObject(raw, "decompose", log);
  const list = payload ? payload.subquestions : void 0;
  if (!Array.isArray(list)) return [];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const entry of list) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry;
    const query = typeof e.query === "string" ? e.query.trim() : "";
    if (!query) continue;
    const key = normalize2(query);
    if (seen.has(key)) continue;
    seen.add(key);
    const sub = { query };
    if (typeof e.hypothesis === "string" && e.hypothesis.trim()) sub.hypothesis = e.hypothesis.trim();
    out.push(sub);
    if (out.length >= max) break;
  }
  return out;
}
async function decomposeQuestion(question, chat, opts = {}) {
  var _a, _b;
  const log = opts.log;
  const max = (_a = opts.max) != null ? _a : 5;
  const dimensions = ((_b = opts.dimensions) != null ? _b : []).map((d) => d.trim()).filter(Boolean);
  const steer = dimensions.length ? [
    ``,
    `A theoretical framework has identified these analytical dimensions of the construct.`,
    `Make sure the sub-questions TOGETHER cover them (one or more per dimension as fits):`,
    ...dimensions.map((d) => `- ${d}`)
  ] : [];
  const user = [
    `Research question: ${question}`,
    ...steer,
    `Return JSON of the form {"subquestions":[{"query":"...","hypothesis":"..."}]}`,
    `with 3 to ${max} entries. The "hypothesis" field is REQUIRED and non-empty for every entry.`
  ].join("\n");
  let raw;
  try {
    raw = await chat(
      [
        { role: "system", content: SYSTEM },
        { role: "user", content: user }
      ],
      // Temperature 0 keeps the sub-question split reproducible run-to-run, so
      // the candidate set (and key studies) stays stable instead of drifting.
      { json: true, temperature: 0 }
    );
  } catch (e) {
    log == null ? void 0 : log(`decompose \u2014 chat failure; degraded to a single query (the original question)`, String(e));
    return [{ query: question }];
  }
  const parsed = parseSubquestions(raw, max, log);
  if (parsed.length === 0) {
    log == null ? void 0 : log(`decompose \u2014 no usable sub-questions parsed; degraded to a single query (the original question)`);
    return [{ query: question }];
  }
  return parsed;
}

// src/framework.ts
var MAX_CONCEPTUAL_QUERIES = 4;
var MAX_DIMENSIONS = 6;
var FALLBACK_SEMINAL = 3;
function normalize3(s) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}
function stripInlineCitations(text) {
  return text.replace(/\s*\[\s*\d+(?:\s*,\s*\d+)*\s*\]/g, "").replace(/\s+([.,;:])/g, "$1").replace(/\s+/g, " ").trim();
}
function parseConstruct(raw, maxQueries = MAX_CONCEPTUAL_QUERIES, log) {
  const p = parseJsonObject(raw, "framework-construct", log);
  if (!p) return null;
  const construct = typeof p.construct === "string" ? p.construct.trim() : "";
  if (!construct) return null;
  const rawQueries = Array.isArray(p.queries) ? p.queries : [];
  const seen = /* @__PURE__ */ new Set();
  const conceptualQueries = [];
  for (const q of rawQueries) {
    const query = typeof q === "string" ? q.trim() : "";
    if (!query) continue;
    const key = normalize3(query);
    if (seen.has(key)) continue;
    seen.add(key);
    conceptualQueries.push(query);
    if (conceptualQueries.length >= maxQueries) break;
  }
  return { construct, conceptualQueries };
}
var EXTRACT_SYSTEM = [
  "You help a writer build a THEORETICAL FRAMEWORK before searching the topic literature.",
  "From the research question, identify the single central theoretical construct",
  "(e.g. 'interorganisational collaboration', 'self-determination', 'social capital'),",
  "and propose conceptual search queries for its DEFINITION, DIMENSIONS and SEMINAL theories/authors.",
  "ANCHOR the construct in the question's DOMAIN: at least half of the queries must COMBINE the construct",
  "with the question's key subject terms (the population, sector or phenomenon it is about), so the seminal",
  "sources connect to the actual topic instead of returning generic, unrelated theory.",
  "Write EVERY query in English (the language of academic indexing), even when the question is not.",
  "Do NOT invent facts, sources, findings or citations. Respond with strict JSON only."
].join(" ");
async function extractConstruct(question, chat, opts = {}) {
  var _a;
  const maxQueries = (_a = opts.maxQueries) != null ? _a : MAX_CONCEPTUAL_QUERIES;
  const log = opts.log;
  const user = [
    `Research question: ${question}`,
    `Return JSON of the form {"construct":"...","queries":["...","..."]}`,
    `with 2 to ${maxQueries} conceptual queries.`
  ].join("\n");
  let raw;
  try {
    raw = await chat(
      [
        { role: "system", content: EXTRACT_SYSTEM },
        { role: "user", content: user }
      ],
      // Temperature 0 keeps the construct/queries reproducible run-to-run.
      { json: true, temperature: 0 }
    );
  } catch (e) {
    log == null ? void 0 : log(`framework-construct \u2014 chat failure`, String(e));
    return null;
  }
  return parseConstruct(raw, maxQueries, log);
}
function cleanSources2(raw, sourceCount) {
  if (!Array.isArray(raw)) return [];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const v of raw) {
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isInteger(n) || n < 1 || n > sourceCount) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}
function parseFramework(raw, sourceCount, maxDimensions = MAX_DIMENSIONS, log) {
  const p = parseJsonObject(raw, "framework-synthesis", log);
  if (!p) return null;
  const definition = typeof p.definition === "string" ? stripInlineCitations(p.definition) : "";
  const rawDims = Array.isArray(p.dimensions) ? p.dimensions : [];
  const seen = /* @__PURE__ */ new Set();
  const dimensions = [];
  for (const d of rawDims) {
    const dim = typeof d === "string" ? stripInlineCitations(d) : "";
    if (!dim) continue;
    const key = normalize3(dim);
    if (seen.has(key)) continue;
    seen.add(key);
    dimensions.push(dim);
    if (dimensions.length >= maxDimensions) break;
  }
  if (!definition && dimensions.length === 0) return null;
  return { definition, dimensions, sources: cleanSources2(p.sources, sourceCount) };
}
var FRAMEWORK_SYSTEM = [
  "You are a careful research assistant building a theoretical framework for a writer.",
  "Using ONLY the numbered conceptual sources provided, give a short WORKING DEFINITION of the",
  "construct and the analytical DIMENSIONS along which the topic should be examined.",
  "Never invent findings, sources or citations.",
  "Do NOT put [n] citations inside the definition or dimensions text; instead list the",
  "seminal source numbers ONLY in the sources field.",
  'Return JSON of the form {"definition":"one or two sentences",',
  '"dimensions":["dimension 1","dimension 2","dimension 3"],"sources":[1,3]}.',
  "Keep 3 to 6 dimensions \u2014 the analytical axes a researcher would use to structure the topic.",
  "Write the definition and dimensions in the SAME language as the question. Respond with strict JSON only."
].join(" ");
async function synthesizeFramework(question, construct, papers, chat, log) {
  if (papers.length === 0) return null;
  const user = [
    `Question: ${question}`,
    `Central construct: ${construct}`,
    ``,
    `Conceptual sources:`,
    buildSourceBlock(papers)
  ].join("\n");
  let raw;
  try {
    raw = await chat(
      [
        { role: "system", content: FRAMEWORK_SYSTEM },
        { role: "user", content: user }
      ],
      { json: true, temperature: 0.2 }
    );
  } catch (e) {
    log == null ? void 0 : log(`framework-synthesis \u2014 chat failure`, String(e));
    return null;
  }
  return parseFramework(raw, papers.length, MAX_DIMENSIONS, log);
}
function pickSeminalPapers(conceptual, sources, fallback = FALLBACK_SEMINAL) {
  const picked = sources.length > 0 ? sources.map((n) => conceptual[n - 1]).filter((p) => Boolean(p)) : conceptual.slice(0, fallback);
  return picked.map((p) => ({ ...p, origin: "framework" }));
}

// src/fusion.ts
var RRF_K = 60;
function unionQueries(a, b) {
  if (!a && !b) return void 0;
  return [.../* @__PURE__ */ new Set([...a != null ? a : [], ...b != null ? b : []])];
}
function mergePapers(a, b) {
  var _a, _b, _c, _d;
  return {
    title: a.title || b.title,
    authors: a.authors.length > 0 ? a.authors : b.authors,
    year: (_a = a.year) != null ? _a : b.year,
    journal: a.journal || b.journal,
    citationCount: (_b = a.citationCount) != null ? _b : b.citationCount,
    url: a.url || b.url,
    doi: a.doi || b.doi,
    isbn: a.isbn || b.isbn,
    abstract: a.abstract || b.abstract,
    verification: (_c = a.verification) != null ? _c : b.verification,
    fromQueries: unionQueries(a.fromQueries, b.fromQueries),
    // AU_E81_S1: keep an OA url a duplicate hit from the OTHER provider supplied.
    oaUrl: a.oaUrl || b.oaUrl,
    isOpenAccess: (_d = a.isOpenAccess) != null ? _d : b.isOpenAccess
  };
}
function reciprocalRankFusion(lists, k = RRF_K) {
  const byKey = /* @__PURE__ */ new Map();
  for (const list of lists) {
    list.forEach((paper, index) => {
      const key = citationKey(paper);
      const contribution = 1 / (k + index + 1);
      const existing = byKey.get(key);
      if (existing) {
        existing.score += contribution;
        existing.paper = mergePapers(existing.paper, paper);
      } else {
        byKey.set(key, { paper: { ...paper }, score: contribution });
      }
    });
  }
  return [...byKey.values()].sort((a, b) => b.score - a.score).map((e) => e.paper);
}
function delay2(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
function cancellableDelay(ms, cancellation) {
  return cancellation ? cancellation.race(delay2(ms)) : delay2(ms);
}
async function searchWithRetry(id, query, filters, settings, http, opts) {
  var _a, _b, _c;
  for (let attempt = 0; ; attempt++) {
    try {
      const r = await getProvider(id).search(query, filters, settings, http);
      (_a = opts.log) == null ? void 0 : _a.call(opts, `search "${query}" via ${id}: ${r.papers.length} result(s)${attempt > 0 ? ` (na ${attempt}\xD7 retry)` : ""}`);
      return { ok: true, provider: id, papers: r.papers.map((p) => ({ ...p, fromQueries: [query] })) };
    } catch (e) {
      const status = e instanceof SearchApiError ? e.status : "error";
      if (status === 429 && attempt < opts.retries) {
        const wait = opts.backoffMs * 2 ** attempt;
        (_b = opts.log) == null ? void 0 : _b.call(opts, `search "${query}" via ${id}: 429 \u2014 retry ${attempt + 1}/${opts.retries} in ${wait}ms`);
        if (wait > 0) await cancellableDelay(wait, opts.cancellation);
        continue;
      }
      (_c = opts.log) == null ? void 0 : _c.call(opts, `search "${query}" via ${id}: FAILED (${status})`);
      return { ok: false, provider: id, papers: [] };
    }
  }
}
function summarizeProviderFailures(outcomes, providerIds) {
  var _a;
  const counts = /* @__PURE__ */ new Map();
  for (const o of outcomes) {
    const c = (_a = counts.get(o.provider)) != null ? _a : { failed: 0, total: 0 };
    c.total += 1;
    if (!o.ok) c.failed += 1;
    counts.set(o.provider, c);
  }
  return providerIds.filter((id) => counts.has(id)).map((provider) => ({ provider, ...counts.get(provider) }));
}
async function fanOutSearch(queries, providerIds, filters, settings, http, k = RRF_K, opts = {}) {
  var _a, _b, _c, _d, _e;
  const used = queries.slice(0, (_a = opts.maxQueries) != null ? _a : 4);
  const spacingMs = (_b = opts.spacingMs) != null ? _b : 1100;
  const retries = (_c = opts.retries) != null ? _c : 2;
  const backoffMs = (_d = opts.backoffMs) != null ? _d : 1500;
  const log = opts.log;
  const cancellation = opts.cancellation;
  const outcomes = [];
  const failedQueries = [];
  for (let i = 0; i < used.length; i++) {
    cancellation == null ? void 0 : cancellation.throwIfCancelled();
    if (i > 0 && spacingMs > 0) await cancellableDelay(spacingMs, cancellation);
    const round = await Promise.all(
      providerIds.map((id) => searchWithRetry(id, used[i], filters, settings, http, { retries, backoffMs, log, cancellation }))
    );
    outcomes.push(...round);
    if (round.length > 0 && round.every((o) => !o.ok)) failedQueries.push(used[i]);
  }
  if (outcomes.length > 0 && outcomes.every((o) => !o.ok)) {
    throw new SearchApiError(
      "All search sources failed \u2014 likely rate limits. Add a Semantic Scholar API key and an OpenAlex contact e-mail in settings, then retry.",
      0
    );
  }
  const papers = reciprocalRankFusion(outcomes.map((o) => o.papers), k);
  const providerFailures = summarizeProviderFailures(outcomes, providerIds);
  return { query: (_e = used[0]) != null ? _e : "", papers, raw: { queries: used, providerIds, failedQueries, providerFailures } };
}

// src/rerank.ts
var DEFAULT_WEIGHTS = { semantic: 0.8, citations: 0.1, recency: 0.1, evidence: 0.15 };
var TIER_SCORE = { strong: 1, moderate: 0.6, limited: 0.25 };
var RERANK_EMBED_CAP = 80;
var RERANK_RRF_FALLBACK_MARKER = "rerank \u2014 embeddings unavailable";
function cosine(a, b) {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
function normalizeCitations(papers) {
  const logs = papers.map((p) => {
    var _a;
    return Math.log1p(Math.max(0, (_a = p.citationCount) != null ? _a : 0));
  });
  const max = Math.max(0, ...logs);
  return logs.map((l) => max > 0 ? l / max : 0);
}
function recencyScore(year, currentYear, tau = 10) {
  if (year == null) return 0;
  const age = Math.max(0, currentYear - year);
  return Math.exp(-age / tau);
}
function blendScore(parts, weights = DEFAULT_WEIGHTS) {
  var _a, _b;
  return weights.semantic * parts.semantic + weights.citations * parts.citations + weights.recency * parts.recency + ((_a = weights.evidence) != null ? _a : 0) * ((_b = parts.evidence) != null ? _b : 0);
}
function queryList(query) {
  const raw = Array.isArray(query) ? query : [query];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const q of raw) {
    const t = q.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}
async function scorePapers(query, papers, embed, opts) {
  var _a, _b;
  if (papers.length === 0) return [];
  const queries = queryList(query);
  if (queries.length === 0) return [];
  const core = (_a = opts.coreQuery) == null ? void 0 : _a.trim();
  const hasCore = !!core && !queries.includes(core);
  const paperTexts = papers.map((p) => {
    var _a2;
    return `${p.title}. ${(_a2 = p.abstract) != null ? _a2 : ""}`.trim();
  });
  const texts = hasCore ? [...queries, core, ...paperTexts] : [...queries, ...paperTexts];
  let vectors;
  try {
    vectors = await embed(texts);
  } catch (e) {
    return null;
  }
  if (vectors.length !== texts.length) return null;
  const queryVecs = vectors.slice(0, queries.length);
  const coreVec = hasCore ? vectors[queries.length] : void 0;
  const paperVecs = vectors.slice(hasCore ? queries.length + 1 : queries.length);
  const citations = normalizeCitations(papers);
  const weights = (_b = opts.weights) != null ? _b : DEFAULT_WEIGHTS;
  return papers.map((paper, i) => {
    const semantic = Math.max(...queryVecs.map((qv) => cosine(qv, paperVecs[i])));
    const parts = {
      semantic,
      citations: citations[i],
      recency: recencyScore(paper.year, opts.currentYear)
    };
    if (coreVec) parts.coreSemantic = cosine(coreVec, paperVecs[i]);
    if (opts.weightByEvidence) parts.evidence = TIER_SCORE[classifyEvidenceTier(paper)];
    return { paper, score: blendScore(parts, weights), parts };
  });
}
function applyRelevanceGate(scored, opts) {
  const cf = opts.coreKeepFraction;
  const hasCore = cf != null && cf < 1 && scored.some((s) => s.parts.coreSemantic != null);
  if (opts.keepFraction >= 1 && !hasCore || scored.length <= opts.min) return scored;
  const bySemantic = [...scored].sort((a, b) => b.parts.semantic - a.parts.semantic);
  const subN = opts.keepFraction < 1 ? Math.max(opts.min, Math.ceil(scored.length * opts.keepFraction)) : scored.length;
  if (!hasCore) return bySemantic.slice(0, subN);
  const subTop = new Set(bySemantic.slice(0, subN));
  const byCore = [...scored].sort((a, b) => {
    var _a, _b;
    return ((_a = b.parts.coreSemantic) != null ? _a : -1) - ((_b = a.parts.coreSemantic) != null ? _b : -1);
  });
  const coreN = Math.max(opts.min, Math.ceil(scored.length * cf));
  const coreTop = new Set(byCore.slice(0, coreN));
  const intersect = bySemantic.filter((s) => subTop.has(s) && coreTop.has(s));
  if (intersect.length >= opts.min) return intersect;
  const out = [...intersect];
  for (const s of bySemantic) {
    if (out.length >= opts.min) break;
    if (!out.includes(s)) out.push(s);
  }
  return out;
}
function selectByScore(scored, opts) {
  var _a, _b;
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  if (sorted.length <= opts.min) return sorted;
  const top = (_b = (_a = sorted[0]) == null ? void 0 : _a.score) != null ? _b : 0;
  const threshold = top * opts.keepRatio;
  const aboveThreshold = sorted.filter((s) => s.score >= threshold).length;
  const n = Math.max(opts.min, Math.min(aboveThreshold, opts.max));
  return sorted.slice(0, n);
}
async function rerankAndSelect(query, papers, embed, opts) {
  var _a, _b, _c, _d, _e, _f;
  const embedN = Math.min(papers.length, RERANK_EMBED_CAP);
  const head = papers.slice(0, embedN);
  if (papers.length > RERANK_EMBED_CAP) {
    (_a = opts.log) == null ? void 0 : _a.call(opts, `rerank \u2014 embed cap ${RERANK_EMBED_CAP} reached; discarding ${papers.length - RERANK_EMBED_CAP} lowest-ranked fused candidate(s)`);
  }
  const currentYear = (_b = opts.currentYear) != null ? _b : (/* @__PURE__ */ new Date()).getFullYear();
  const scored = await scorePapers(query, head, embed, {
    currentYear,
    weights: opts.weights,
    coreQuery: opts.coreQuery,
    weightByEvidence: opts.weightByEvidence
  });
  if (!scored) {
    (_c = opts.log) == null ? void 0 : _c.call(opts, `${RERANK_RRF_FALLBACK_MARKER}; falling back to the RRF fusion order`);
    return papers.slice(0, opts.max);
  }
  const keepFraction = (_d = opts.relevanceKeep) != null ? _d : 1;
  const queries = queryList(query);
  const hasCore = !!((_e = opts.coreQuery) == null ? void 0 : _e.trim()) && !queries.includes(opts.coreQuery.trim());
  const coreKeepFraction = hasCore ? keepFraction : void 0;
  const gated = applyRelevanceGate(scored, { keepFraction, min: opts.min, coreKeepFraction });
  if (opts.log && (keepFraction < 1 || hasCore)) {
    const anchor = hasCore ? `, core-topic-anker "${(_f = opts.coreQuery) == null ? void 0 : _f.trim()}"` : "";
    opts.log(`relevance gate: kept ${gated.length}/${scored.length} most on-topic (keep ${keepFraction}${anchor})`);
  }
  return selectByScore(gated, { min: opts.min, max: opts.max, keepRatio: opts.keepRatio }).map(
    (s) => s.paper
  );
}

// src/research-pipeline.ts
var ROUTE_C_PROVIDERS = ["openalex", "semanticscholar"];
var THIN_EVIDENCE_THRESHOLD = 3;
var SYNTHESIS_SOURCE_CAP = 20;
var FRAMEWORK_SOURCE_CAP = 8;
function dedupeQueries(queries, max = 8) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const q of queries) {
    const key = q.toLowerCase().replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(q);
    if (out.length >= max) break;
  }
  return out;
}
function mergePinned(pinned, rest) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const p of [...pinned, ...rest]) {
    const key = citationKey(p);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}
function indicesOf(target, list) {
  const keys = new Set(target.map(citationKey));
  const out = [];
  list.forEach((p, i) => {
    if (keys.has(citationKey(p))) out.push(i + 1);
  });
  return out;
}
async function orchestrate(question, deps, log, finalLimit, opts = {}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
  const progress = opts.progress;
  const resume = (_a = opts.resumeFrom) != null ? _a : null;
  const cancellation = (_b = opts.cancellation) != null ? _b : null;
  let framework;
  let subquestions;
  let fused;
  let fanoutQueries = [];
  let fanoutSeeds = [];
  let fanoutProviderFailures = [];
  const degradations = [];
  cancellation == null ? void 0 : cancellation.throwIfCancelled();
  if (resume) {
    framework = resume.framework;
    subquestions = resume.subQuestions.length > 0 ? resume.subQuestions : [{ query: question }];
    let resumedPapers = resume.fusedPapers;
    let remainingFailed = (_c = resume.failedQueries) != null ? _c : [];
    if (remainingFailed.length > 0) {
      progress == null ? void 0 : progress("Retrying failed searches\u2026");
      try {
        const recovered = await deps.search(remainingFailed);
        const recoveredFailed = (_e = (_d = recovered.raw) == null ? void 0 : _d.failedQueries) != null ? _e : [];
        resumedPapers = mergePinned(resume.fusedPapers, recovered.papers);
        const newlyRecovered = remainingFailed.filter((q) => !recoveredFailed.includes(q));
        remainingFailed = recoveredFailed;
        log == null ? void 0 : log(
          `resume \u2014 retried ${resume.failedQueries.length} failed quer${resume.failedQueries.length === 1 ? "y" : "ies"}; recovered ${newlyRecovered.length}, ${resumedPapers.length} candidate(s) total`
        );
        (_f = opts.onSearchComplete) == null ? void 0 : _f.call(opts, { question, framework, subQuestions: subquestions, fusedPapers: resumedPapers, failedQueries: remainingFailed });
      } catch (e) {
        log == null ? void 0 : log(`resume \u2014 failed-query retry did not succeed (${String(e)}); proceeding with cached candidates`);
      }
    }
    fused = { query: question, papers: resumedPapers, raw: { resumed: true } };
    log == null ? void 0 : log(
      `resume \u2014 ${fused.papers.length} cached candidate(s); framework: ${framework ? "yes" : "no"}; ${subquestions.length} sub-question(s)`
    );
  } else {
    framework = (_g = opts.presetFramework) != null ? _g : null;
    if (framework) {
      log == null ? void 0 : log(
        `framework \u2014 preset (${framework.framework.dimensions.length} dimension(s), ${framework.papers.length} seminal source(s))`
      );
    } else if (deps.framework) {
      cancellation == null ? void 0 : cancellation.throwIfCancelled();
      progress == null ? void 0 : progress("Building theoretical framework\u2026");
      framework = await deps.framework(question);
      if (framework) {
        log == null ? void 0 : log(
          `framework \u2014 construct "${framework.framework.construct}", ${framework.framework.dimensions.length} dimension(s), ${framework.papers.length} seminal source(s)`
        );
      } else {
        log == null ? void 0 : log(`framework \u2014 skipped (no usable construct/framework)`);
        degradations.push({ step: "framework", reason: "no usable construct or framework came back" });
      }
    }
    if (opts.frameworkOnly) {
      const fwPapers = (_h = framework == null ? void 0 : framework.papers) != null ? _h : [];
      const result2 = { query: question, papers: fwPapers, raw: { frameworkOnly: true } };
      if (framework) {
        result2.framework = { ...framework.framework, sources: fwPapers.map((_, i) => i + 1) };
      }
      if (degradations.length > 0) result2.degradations = degradations;
      log == null ? void 0 : log(`done (framework only) \u2014 ${fwPapers.length} seminal source(s), framework: ${result2.framework ? "yes" : "no"}`);
      return result2;
    }
    cancellation == null ? void 0 : cancellation.throwIfCancelled();
    progress == null ? void 0 : progress("Splitting question into sub-questions\u2026");
    subquestions = await deps.decompose(question, framework == null ? void 0 : framework.framework.dimensions);
    log == null ? void 0 : log(`decomposed into ${subquestions.length} sub-question(s)`, subquestions.map((s) => s.query));
    if (subquestions.length === 1 && subquestions[0].query === question && !subquestions[0].hypothesis) {
      degradations.push({ step: "decompose", reason: "fell back to a single query (the original question)" });
    }
    if (opts.reviewSubQuestions) {
      const edited = await opts.reviewSubQuestions(subquestions, (_i = framework == null ? void 0 : framework.framework) != null ? _i : null);
      if (!edited || edited.length === 0) {
        log == null ? void 0 : log(`sub-question review \u2014 cancelled`);
        throw new ResearchCancelledError();
      }
      subquestions = edited;
      log == null ? void 0 : log(`sub-question review \u2014 proceeding with ${subquestions.length} edited sub-question(s)`, subquestions.map((s) => s.query));
    }
    cancellation == null ? void 0 : cancellation.throwIfCancelled();
    const splitForSearch = subquestions.length > 1;
    const baseTerms = splitForSearch ? subquestions.map((s) => s.query) : [question, ...subquestions.map((s) => s.query)];
    const seeds = ((_j = opts.extraSearchTerms) != null ? _j : []).map((s) => s.trim()).filter(Boolean);
    const searchTerms = [...baseTerms, ...seeds];
    const queries = dedupeQueries(searchTerms, seeds.length ? baseTerms.length + seeds.length : 8);
    fanoutQueries = queries;
    fanoutSeeds = seeds;
    if (seeds.length) log == null ? void 0 : log(`exploration seeds \u2014 added ${seeds.length} extra search term(s) to the fan-out`);
    progress == null ? void 0 : progress("Searching sources (OpenAlex + Semantic Scholar)\u2026");
    fused = await deps.search(queries);
    cancellation == null ? void 0 : cancellation.throwIfCancelled();
    log == null ? void 0 : log(
      `fused ${fused.papers.length} unique paper(s) from ${queries.length} quer${queries.length === 1 ? "y" : "ies"}${splitForSearch ? " (sub-questions only; raw question dropped)" : ""}`
    );
    const failedQueries = (_l = (_k = fused.raw) == null ? void 0 : _k.failedQueries) != null ? _l : [];
    fanoutProviderFailures = (_n = (_m = fused.raw) == null ? void 0 : _m.providerFailures) != null ? _n : [];
    (_o = opts.onSearchComplete) == null ? void 0 : _o.call(opts, { question, framework, subQuestions: subquestions, fusedPapers: fused.papers, failedQueries });
  }
  const split = subquestions.length > 1;
  const rerankQuery = split ? subquestions.map((s) => s.query) : question;
  cancellation == null ? void 0 : cancellation.throwIfCancelled();
  progress == null ? void 0 : progress("Filtering and reranking for relevance\u2026");
  const linesBeforeRerank = (_p = log == null ? void 0 : log.lines.length) != null ? _p : 0;
  let topical = await deps.rerank(rerankQuery, fused.papers, framework == null ? void 0 : framework.framework.construct);
  log == null ? void 0 : log(`reranked/selected ${topical.length} paper(s)`);
  if (log == null ? void 0 : log.lines.slice(linesBeforeRerank).some((l) => l.includes(RERANK_RRF_FALLBACK_MARKER))) {
    degradations.push({ step: "rerank", reason: "embeddings unavailable; used the RRF fusion order instead" });
  }
  const rerankedCount = topical.length;
  if (finalLimit && finalLimit > 0 && topical.length > finalLimit) {
    log == null ? void 0 : log(`trimmed to top ${finalLimit} of ${topical.length} reranked paper(s)`);
    topical = topical.slice(0, finalLimit);
  }
  let crossSector = null;
  const domainThin = topical.length < THIN_EVIDENCE_THRESHOLD;
  if (deps.crossSector && (opts.crossSectorForce || domainThin)) {
    const reason = opts.crossSectorForce ? "forced" : `thin domain evidence (${topical.length})`;
    log == null ? void 0 : log(`cross-sector \u2014 triggered (${reason})`);
    cancellation == null ? void 0 : cancellation.throwIfCancelled();
    progress == null ? void 0 : progress("Searching analogous evidence from other sectors\u2026");
    crossSector = await deps.crossSector(question, framework == null ? void 0 : framework.framework.construct);
    if (crossSector) {
      log == null ? void 0 : log(`cross-sector \u2014 ${crossSector.papers.length} transfer paper(s) from: ${crossSector.sectors.join(", ")}`);
    } else {
      log == null ? void 0 : log(`cross-sector \u2014 skipped (no usable analogues)`);
      degradations.push({ step: "crosssector", reason: "no usable analogous-sector proposal came back" });
    }
  }
  let papers = mergePinned((_q = framework == null ? void 0 : framework.papers) != null ? _q : [], [...topical, ...(_r = crossSector == null ? void 0 : crossSector.papers) != null ? _r : []]);
  if (opts.evidenceWeighting) {
    papers = papers.map((p) => ({ ...p, evidenceTier: classifyEvidenceTier(p) }));
  }
  const result = { ...fused, query: question, papers };
  result.searchStrategy = {
    providers: ROUTE_C_PROVIDERS,
    queries: fanoutQueries,
    seeds: fanoutSeeds,
    split,
    fusedCount: fused.papers.length,
    rerankedCount,
    keptCount: papers.length,
    rerankLimit: finalLimit && finalLimit > 0 ? finalLimit : null,
    crossSector: !!(crossSector && crossSector.papers.length > 0),
    transferSectors: (_s = crossSector == null ? void 0 : crossSector.sectors) != null ? _s : [],
    resumed: !!resume,
    providerFailures: fanoutProviderFailures
  };
  if (framework) {
    result.framework = { ...framework.framework, sources: indicesOf(framework.papers, papers) };
  }
  if (crossSector && crossSector.papers.length > 0) {
    result.transferSectors = crossSector.sectors;
  }
  if (subquestions.length > 1) {
    result.subQuestions = subquestions.map((s) => {
      const sources = [];
      papers.forEach((p, idx) => {
        var _a2;
        if ((_a2 = p.fromQueries) == null ? void 0 : _a2.includes(s.query)) sources.push(idx + 1);
      });
      const base = s.hypothesis ? { query: s.query, hypothesis: s.hypothesis } : { query: s.query };
      return sources.length > 0 ? { ...base, sources } : base;
    });
  }
  if (deps.synthesize && papers.length > 0) {
    const synthesisSources = papers.filter((p) => p.sector !== "transfer").slice(0, SYNTHESIS_SOURCE_CAP);
    const noAbstract = synthesisSources.filter((p) => {
      var _a2;
      return !((_a2 = p.abstract) != null ? _a2 : "").trim();
    }).length;
    if (noAbstract > 0) {
      log == null ? void 0 : log(`synthesis grounding \u2014 ${noAbstract}/${synthesisSources.length} source(s) have NO abstract (title-only; flagged to the model)`);
    }
    let summary = "";
    try {
      if (synthesisSources.length > 0) {
        cancellation == null ? void 0 : cancellation.throwIfCancelled();
        progress == null ? void 0 : progress("Writing synthesis with Mistral\u2026");
      }
      summary = synthesisSources.length > 0 ? await deps.synthesize(question, synthesisSources) : "";
    } catch (e) {
      if (e instanceof ResearchCancelledError) throw e;
      degradations.push({ step: "synthesis", reason: e instanceof Error ? e.message : String(e) });
      log == null ? void 0 : log(`synthesis \u2014 failed after retries; omitted`, e instanceof Error ? e.message : String(e));
      summary = "";
    }
    if (topical.length < THIN_EVIDENCE_THRESHOLD) {
      const warning = `\u26A0 Dunne evidence: slechts ${topical.length} domein-bron(nen) gevonden \u2014 behandel dit met voorzichtigheid.`;
      summary = summary ? `${warning}

${summary}` : warning;
    }
    if (summary) result.summary = summary;
  }
  if (degradations.length > 0) {
    result.degradations = degradations;
    log == null ? void 0 : log(`degradations \u2014 ${degradations.length}`, degradations);
  }
  log == null ? void 0 : log(`done \u2014 ${result.papers.length} paper(s), synthesis: ${result.summary ? "yes" : "no"}`);
  return result;
}
function sanitizeQuestion(raw) {
  return raw.replace(/^[\s>]*#{1,6}\s*/, "").replace(/^[\s>]+/, "").trim();
}
async function runResearch(rawQuestion, settings, http, provider, filters = {}, log = createLogger(false), opts = {}) {
  var _a;
  const question = sanitizeQuestion(rawQuestion);
  const hasKey = provider.isConfigured();
  log(`route C start \u2014 LLM provider (${provider.id}) ${hasKey ? "configured" : "not configured"}`, {
    question,
    frameworkOnly: !!opts.frameworkOnly,
    crossSectorForce: !!opts.crossSectorForce
  });
  log(
    `credentials \u2014 OpenAlex mailto: ${settings.openAlexMailto ? "set" : "unset"}, Semantic Scholar key: ${settings.semanticScholarApiKey ? "set" : "unset"}`
  );
  const chatFor = (step) => {
    const model = resolveStepModel(settings, step);
    return async (messages, copts) => {
      var _a2;
      try {
        return await provider.chat(
          messages,
          { ...copts, model: (_a2 = copts.model) != null ? _a2 : model },
          { log, label: step, reasoningEffort: resolveStepReasoning(settings, step) }
        );
      } catch (e) {
        log(`LLM chat FAILED (${step})`, String(e));
        throw e;
      }
    };
  };
  const chatDecompose = chatFor("decompose");
  const chatFramework = chatFor("framework");
  const chatSynthesis = chatFor("synthesis");
  const chatCrossSector = chatFor("crosssector");
  const embed = async (texts) => {
    try {
      return await provider.embed(texts, { log, label: "embed" });
    } catch (e) {
      log(`LLM embeddings FAILED`, String(e));
      throw e;
    }
  };
  const search = (queries) => fanOutSearch(queries, ROUTE_C_PROVIDERS, filters, settings, http, void 0, {
    log,
    maxQueries: queries.length,
    cancellation: opts.cancellation
  });
  const frameworkEnabled = hasKey && (opts.frameworkOnly || settings.routeCFrameworkPhase);
  const frameworkPhase = async (q) => {
    const extraction = await extractConstruct(q, chatFramework, { log });
    if (!extraction) {
      log(`framework \u2014 no construct extracted`);
      return null;
    }
    const conceptualQueries = dedupeQueries(extraction.conceptualQueries, MAX_CONCEPTUAL_QUERIES);
    if (conceptualQueries.length === 0) {
      log(`framework \u2014 no conceptual queries`);
      return null;
    }
    log(`framework \u2014 construct "${extraction.construct}"; conceptual queries`, conceptualQueries);
    const conceptual = await search(conceptualQueries);
    if (conceptual.papers.length === 0) {
      log(`framework \u2014 conceptual search returned nothing`);
      return null;
    }
    const top = conceptual.papers.slice(0, FRAMEWORK_SOURCE_CAP);
    const parsed = await synthesizeFramework(q, extraction.construct, top, chatFramework, log);
    if (!parsed) {
      log(`framework \u2014 synthesis unusable`);
      return null;
    }
    return {
      framework: { construct: extraction.construct, definition: parsed.definition, dimensions: parsed.dimensions },
      papers: pickSeminalPapers(top, parsed.sources)
    };
  };
  const crossSectorEnabled = hasKey && (opts.crossSectorForce || settings.routeCCrossSector);
  const crossSectorPhase = async (q, construct) => {
    let resolved = construct;
    if (!resolved) {
      const extraction = await extractConstruct(q, chatCrossSector, { log });
      resolved = extraction == null ? void 0 : extraction.construct;
    }
    if (!resolved) {
      log(`cross-sector \u2014 no construct to abstract`);
      return null;
    }
    const proposal = await proposeAnalogues(q, resolved, chatCrossSector, { log });
    if (!proposal) {
      log(`cross-sector \u2014 no usable analogue proposal`);
      return null;
    }
    log(`cross-sector \u2014 sectors ${proposal.sectors.join(", ")}; queries`, proposal.queries);
    const transferQueries = dedupeQueries(proposal.queries, MAX_TRANSFER_QUERIES);
    const found = await search(transferQueries);
    if (found.papers.length === 0) {
      log(`cross-sector \u2014 transfer search returned nothing`);
      return null;
    }
    const papers = tagTransferPapers(found.papers, proposal.queryList);
    return { sectors: proposal.sectors, papers };
  };
  let capturedSynthesis = null;
  let proseFallback = false;
  const mode = settings.routeCOutputMode;
  const evidenceWeighting = mode === "balanced" ? settings.routeCEvidenceWeighting : true;
  const calibration = mode === "balanced" ? settings.routeCClaimCalibration : true;
  const deps = {
    framework: frameworkEnabled ? frameworkPhase : null,
    decompose: hasKey ? (q, dimensions) => decomposeQuestion(q, chatDecompose, { dimensions, log }) : async (q) => [{ query: q }],
    search,
    crossSector: crossSectorEnabled ? crossSectorPhase : null,
    rerank: hasKey ? (q, papers, coreQuery) => rerankAndSelect(q, papers, embed, {
      min: settings.routeCMinResults > 0 ? settings.routeCMinResults : 5,
      max: settings.routeCMaxResults > 0 ? settings.routeCMaxResults : 20,
      keepRatio: settings.routeCKeepRatio > 0 ? settings.routeCKeepRatio : 0.5,
      relevanceKeep: Number.isFinite(settings.routeCRelevanceKeep) ? settings.routeCRelevanceKeep : 1,
      coreQuery,
      // E41: tilt selection toward stronger designs when evidence-weighting is on
      // (same flag that weights the synthesis), so a meta-analysis outranks a
      // recent case study — modestly, with topical relevance still dominant.
      weightByEvidence: evidenceWeighting,
      log
    }) : async (_q, papers) => papers,
    // Capture the structured synthesis (findings + their sources) so findings can
    // be deepened later (E21), while the dep still returns the rendered markdown.
    synthesize: hasKey ? async (q, papers) => {
      const { markdown, synthesis } = await synthesizeStructuredFull(q, papers, chatSynthesis, {
        evidenceWeighting,
        calibration,
        mode,
        readingTips: settings.routeCReadingTips
      });
      if (!synthesis && markdown) {
        proseFallback = true;
      }
      capturedSynthesis = synthesis;
      return markdown;
    } : null
  };
  const limit = settings.routeCMaxResults > 0 ? settings.routeCMaxResults : 20;
  const reviewSubQuestions = hasKey && !opts.frameworkOnly ? opts.reviewSubQuestions : void 0;
  const result = await orchestrate(question, deps, log, limit, {
    frameworkOnly: opts.frameworkOnly,
    crossSectorForce: opts.crossSectorForce,
    evidenceWeighting,
    presetFramework: opts.presetFramework,
    reviewSubQuestions,
    progress: opts.progress,
    extraSearchTerms: opts.extraSearchTerms,
    resumeFrom: opts.resumeFrom,
    onSearchComplete: opts.onSearchComplete,
    cancellation: opts.cancellation
  });
  if (capturedSynthesis) result.synthesis = capturedSynthesis;
  if (proseFallback) {
    const reason = "structured JSON synthesis was unusable; fell back to plain prose (no graded findings)";
    result.degradations = [...(_a = result.degradations) != null ? _a : [], { step: "synthesis", reason }];
    log(`synthesis \u2014 fell back to plain prose (structured JSON unusable)`);
  }
  return result;
}

// src/session-store.ts
var import_obsidian8 = require("obsidian");

// src/vault-adapters.ts
var import_obsidian7 = require("obsidian");

// src/register-store.ts
async function loadRegister(store, path) {
  return parseRegister(await store.read(path));
}
async function loadRegisterDetailed(store, path) {
  const raw = await store.read(path);
  return { register: parseRegister(raw), raw };
}
async function saveRegister(store, path, register) {
  await store.write(path, serializeRegister(register));
}
function recordPapers(register, papers, base) {
  const occurrence = { note: base.note, date: base.date };
  if (base.project) occurrence.project = base.project;
  const alreadyUsed = [];
  for (const paper of papers) {
    const res = upsertCitation(register, paper, occurrence);
    const elsewhere = res.previousOccurrences.filter((o) => o.note !== base.note);
    if (res.existed && elsewhere.length > 0) {
      alreadyUsed.push({ title: res.record.title, occurrences: elsewhere });
    }
  }
  return { register, alreadyUsed };
}
function describeOccurrence(o) {
  return o.project ? `${o.note} (${o.project})` : o.note;
}
function formatAlreadyUsed(items) {
  return items.map((it) => {
    const where = it.occurrences.map(describeOccurrence).join(", ");
    return `"${it.title}" \u2014 al gebruikt in ${where}`;
  }).join("\n");
}

// src/vault-adapters.ts
var VaultAdapters = class {
  constructor(deps) {
    this.deps = deps;
  }
  /** Obsidian-backed register persistence (creates the parent folder on write). */
  vaultStore() {
    const adapter = this.deps.app.vault.adapter;
    return {
      read: async (path) => await adapter.exists(path) ? adapter.read(path) : null,
      write: async (path, data) => {
        const slash = path.lastIndexOf("/");
        if (slash > 0) {
          const dir = path.slice(0, slash);
          if (!await adapter.exists(dir)) await adapter.mkdir(dir);
        }
        await adapter.write(path, data);
      }
    };
  }
  /**
   * Load the register, guarding against the silent-wipe failure mode (A1): when the file
   * exists with non-trivial content but parses to an empty register (JSON corruption, a
   * truncated sync write), back the raw content up to `<path>.corrupt-<timestamp>` and tell
   * the writer, before handing back the fresh (empty) register the caller will then save over
   * the original — so the corrupt bytes are never lost, only superseded.
   */
  async loadRegisterGuarded(store, path) {
    const { register, raw } = await loadRegisterDetailed(store, path);
    if (shouldBackupCorrupt(raw, register.citations.length === 0)) {
      const backupPath = `${path}.corrupt-${Date.now()}`;
      try {
        await store.write(backupPath, raw);
        new import_obsidian7.Notice(
          `The citation register at "${path}" could not be read and was backed up to "${backupPath}" before starting fresh.`,
          1e4
        );
      } catch (e) {
        console.warn("Parallax: could not back up the corrupt citation register", e);
      }
    }
    return register;
  }
  /**
   * Roll a single backup of `path` before it gets overwritten (A1): if a file already sits
   * there, copy its current content to `<path>.bak` (clobbering any previous `.bak`) before the
   * caller writes the new content. Best-effort — a backup failure must never block the actual
   * save, so it only logs.
   */
  async backupBeforeOverwrite(store, path) {
    try {
      const current = await store.read(path);
      if (current !== null) await store.write(`${path}.bak`, current);
    } catch (e) {
      console.warn(`Parallax: could not write the .bak backup for ${path}`, e);
    }
  }
  /**
   * Path of the persisted resume cache (E43_S2). Lives in the plugin's own config
   * folder (not a vault note), so it survives a reload without cluttering the vault.
   */
  researchCachePath() {
    var _a;
    const dir = (_a = this.deps.manifest.dir) != null ? _a : `${this.deps.app.vault.configDir}/plugins/${this.deps.manifest.id}`;
    return `${dir}/research-cache.json`;
  }
  /** Write the resume cache to disk (E43_S2). Best-effort: failures are logged, not surfaced. */
  async persistResearchCache(cache) {
    if (!cache) return;
    try {
      await this.vaultStore().write(this.researchCachePath(), JSON.stringify(cache));
    } catch (e) {
      console.warn("Parallax: could not persist the resume cache", e);
    }
  }
  /**
   * Delete the persisted resume cache from disk (B6): called only after a FULLY successful
   * run (a synthesis landed with no degradations) — a degraded run must keep the cache, since
   * "Resume last research" is precisely the recovery path for a degraded/interrupted run
   * (E43). Clearing on every completion would turn an accidental "Resume" click into a paid
   * re-run on stale data once the cache no longer matches the note. Best-effort: a missing
   * file or a delete failure is logged, never surfaced (the research itself already succeeded).
   */
  async clearResearchCache() {
    const path = this.researchCachePath();
    try {
      const adapter = this.deps.app.vault.adapter;
      if (await adapter.exists(path)) await adapter.remove(path);
    } catch (e) {
      console.warn("Parallax: could not clear the persisted resume cache", e);
    }
  }
  /**
   * Path of the persisted OA-fulltext cache (AU_E81_S1) — keyed by citation key, so a repeat
   * deepen/reading-list run never refetches a source it already has. Lives beside the resume
   * cache in the plugin's own config folder (not a vault note).
   */
  fulltextCachePath() {
    var _a;
    const dir = (_a = this.deps.manifest.dir) != null ? _a : `${this.deps.app.vault.configDir}/plugins/${this.deps.manifest.id}`;
    return `${dir}/fulltext-cache.json`;
  }
  /** Restore the OA-fulltext cache from disk (AU_E81_S1). A missing/corrupt file yields an empty cache. */
  async loadFulltextCache() {
    try {
      const raw = await this.vaultStore().read(this.fulltextCachePath());
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      console.warn("Parallax: could not load the OA-fulltext cache", e);
      return {};
    }
  }
  /** Persist the OA-fulltext cache to disk (AU_E81_S1). Best-effort: failures are logged, not surfaced. */
  async persistFulltextCache(cache) {
    try {
      await this.vaultStore().write(this.fulltextCachePath(), JSON.stringify(cache));
    } catch (e) {
      console.warn("Parallax: could not persist the OA-fulltext cache", e);
    }
  }
  /** Restore the resume cache from disk on load (E43_S2). A missing/corrupt file is ignored, returning null. */
  async loadResearchCache() {
    var _a, _b;
    try {
      const raw = await this.vaultStore().read(this.researchCachePath());
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const cp = parsed.checkpoint;
      if (cp && typeof cp.question === "string" && Array.isArray(cp.fusedPapers)) {
        return { checkpoint: { ...cp, failedQueries: (_a = cp.failedQueries) != null ? _a : [] }, at: (_b = parsed.at) != null ? _b : 0 };
      }
      return null;
    } catch (e) {
      console.warn("Parallax: could not load the resume cache", e);
      return null;
    }
  }
  /** Path of the research-graph store (E68) — beside the citation register, so they travel together. */
  graphStorePath() {
    const registerPath = this.deps.settings().registerPath;
    const slash = registerPath.lastIndexOf("/");
    const dir = slash > 0 ? registerPath.slice(0, slash) : ".consensus-research";
    return `${dir}/research-graph.json`;
  }
  /**
   * Persist the structured graph record for a session (E68) — the "edges bij generatie"-step. Resolves
   * the synthesis findings to their source citation keys and upserts the record (latest synthesis wins).
   * Best-effort: a store failure is logged, never surfaced (the synthesis itself already landed).
   */
  async persistSessionGraphRecord(file, synthesis, papers, subQuestions) {
    try {
      const store = this.vaultStore();
      const path = this.graphStorePath();
      const current = parseGraphStore(await store.read(path));
      const record = buildSessionGraphRecord(file.path, synthesis, papers, (subQuestions != null ? subQuestions : []).map((s) => s.query));
      await this.backupBeforeOverwrite(store, path);
      await store.write(path, serializeGraphStore(upsertSessionGraphRecord(current, record)));
    } catch (e) {
      console.warn("Parallax: could not persist the research-graph record", e);
    }
  }
  /**
   * Persist a note's structured search-strategy/adoption artefact record (AU_E89_S1 —
   * export-pariteit), MERGING into whatever is already recorded (see {@link
   * upsertSessionArtefactRecord} — search strategy and each copilot's adoption land at
   * different moments, so a later write must not erase an earlier one). Shares the graph
   * store's file (same path, same version) — a separate concern, not a separate file. Best-
   * effort: a store failure is logged, never surfaced (the artefact section itself already
   * landed in the note).
   */
  async persistSessionArtefactRecord(file, patch) {
    try {
      const store = this.vaultStore();
      const path = this.graphStorePath();
      const current = parseGraphStore(await store.read(path));
      await this.backupBeforeOverwrite(store, path);
      await store.write(path, serializeGraphStore(upsertSessionArtefactRecord(current, file.path, patch)));
    } catch (e) {
      console.warn("Parallax: could not persist the session artefact record", e);
    }
  }
  /**
   * Ensure a vault FOLDER exists via the vault API (not the low-level adapter) — so a later
   * `vault.create` knows its parent. Mixing `adapter.mkdir` with `vault.create` is what caused
   * the mobile `FILE_NOTCREATED`: the adapter made the folder on disk but the vault index didn't
   * know it yet. Idempotent and race-tolerant.
   */
  async ensureFolder(path) {
    if (this.deps.app.vault.getAbstractFileByPath(path)) return;
    try {
      await this.deps.app.vault.createFolder(path);
    } catch (e) {
      if (!this.deps.app.vault.getAbstractFileByPath(path)) throw e;
    }
  }
  /** Create or overwrite a vault FILE via the vault API. Returns the resulting TFile. */
  async writeVaultFile(path, content) {
    const existing = this.deps.app.vault.getAbstractFileByPath(path);
    if (existing instanceof import_obsidian7.TFile) {
      await this.deps.app.vault.modify(existing, content);
      return existing;
    }
    return this.deps.app.vault.create(path, content);
  }
};
function safeFileName(raw) {
  return raw.replace(/[\\/:*?"<>|#^[\]]/g, "");
}
function sanitizePathSegment(raw) {
  return raw.replace(/[/\\]/g, "-").replace(/\.{2,}/g, ".").trim();
}

// src/session-store.ts
var SessionStore = class {
  constructor(deps) {
    this.deps = deps;
  }
  /**
   * Upsert a `## heading` section in the session note's body (E46). Uses `vault.process` (A2)
   * rather than a manual read → modify round-trip: `process`'s transform runs against whatever
   * the file holds at write time, so a concurrent edit by the writer (or another copilot flow)
   * is not clobbered by a body read that has since gone stale.
   */
  async writeSessionSection(file, heading, content) {
    await this.deps.vault.process(file, (body) => upsertSection(body, heading, content));
  }
  /**
   * Read the section's current edit state (AU_E87_S2 — bewerkings-respect) WITHOUT writing: feeds
   * the note's live body to the pure {@link sectionEditState}, so a caller can decide whether to
   * ask (Replace/Keep) before calling {@link writeSessionSection}. A plain read (not
   * `vault.process`) is correct here — nothing is mutated, so there is no atomicity concern.
   */
  async sectionEditState(file, headingOrId) {
    const body = await this.deps.vault.read(file);
    return sectionEditState(body, headingOrId);
  }
  /**
   * Append one append-only entry to the session's `## Logboek` (E52): step + time + a one-line
   * summary that names the user's choice, so the research history stays reconstructable. The
   * companion to writeSessionSection — overwrite the artefact state, append the decision history.
   */
  async logEvent(file, step, summary) {
    try {
      const line = formatEvent({ timestamp: Date.now(), step, summary });
      await this.deps.vault.process(file, (body) => appendToSection(body, "logbook", line));
    } catch (e) {
    }
  }
  /** Merge front-matter flow-fields into the session; seeds/lenses are unioned, not overwritten. */
  async setSessionFields(file, fields) {
    await this.deps.fileManager.processFrontMatter(file, (fm) => {
      if (fields.framing !== void 0) fm.framing = fields.framing;
      if (fields.seeds) fm.seeds = unionStrings(fm.seeds, fields.seeds);
      if (fields.lenses) fm.lenses = unionStrings(fm.lenses, fields.lenses);
    });
  }
  /** Read → transform → write the belief list in front-matter, keeping the `## Overtuigingen` section in sync. */
  async mutateBeliefs(file, transform) {
    let next = [];
    await this.deps.fileManager.processFrontMatter(file, (fm) => {
      var _a, _b;
      const current = (_b = (_a = parseSession(fm)) == null ? void 0 : _a.beliefs) != null ? _b : [];
      next = transform(current);
      fm.beliefs = next;
    });
    await this.writeSessionSection(file, "beliefs", renderBeliefs(next));
  }
  /** Merge new beliefs into the session's front-matter (de-duped on claim) and re-render `## Beliefs`. */
  async addBeliefs(file, newBeliefs) {
    await this.mutateBeliefs(file, (current) => mergeBeliefs(current, newBeliefs));
  }
  /** Apply accepted status updates to the session's beliefs and re-render `## Beliefs`. */
  async applyBeliefs(file, updates) {
    await this.mutateBeliefs(file, (current) => applyBeliefStatus(current, updates));
  }
  /**
   * Create a fresh research-session note seeded with `question` in `folderPath` (E50), optionally
   * tied to `project` (front-matter leading — the location is just where it lands, E64). Does NOT
   * open the note, and does NOT catch write failures — the caller (`ParallaxPlugin.createSessionNote`,
   * which also owns `workspace.getLeaf().openFile`) wraps both the write and the open in one
   * try/catch, matching the pre-extraction behaviour where a failure during either step produced
   * the same "Could not create the new session" Notice.
   */
  async createSessionNote(question, folderPath, project, opts = {}) {
    const folder = folderPath && folderPath !== "/" ? `${folderPath}/` : "";
    const slug2 = safeFileName(question).slice(0, 60).trim() || "nieuwe sessie";
    let path = (0, import_obsidian8.normalizePath)(`${folder}${slug2} \u2014 sessie.md`);
    for (let n = 2; this.deps.vault.getAbstractFileByPath(path); n++) {
      path = (0, import_obsidian8.normalizePath)(`${folder}${slug2} \u2014 sessie (${n}).md`);
    }
    const proj = project ? `project: ${JSON.stringify(project)}
` : "";
    const fm = `---
${proj}${SESSION_FLAG}: true
question: ${JSON.stringify(question)}
seeds: []
lenses: []
beliefs: []
---

`;
    let body = "";
    if (opts.parent) {
      const contentLines = [];
      if (opts.parentTopic) contentLines.push(`Vervolgvraag voortkomend uit: _${opts.parentTopic}_.`, "");
      contentLines.push(`Ouder-sessie: [[${opts.parent.basename}]]`);
      body = upsertSection("", "context", contentLines.join("\n"));
    }
    return this.deps.vault.create(path, fm + body);
  }
  /**
   * Move `file` into a just-created project's folder and set its `project:` front-matter
   * (AU_E86_S2) — link-safe via `fileManager.renameFile` (Obsidian rewrites backlinks pointing
   * at the note). The caller has already resolved `newPath` and checked it's free; this never
   * overwrites — the collision check is the caller's, so it can show a note-specific Notice.
   */
  async moveNoteIntoProject(file, newPath, project) {
    await this.deps.fileManager.renameFile(file, newPath);
    await this.deps.fileManager.processFrontMatter(file, (fm) => {
      fm.project = project;
    });
  }
};

// src/command-names.ts
var COMMAND_NAMES = {
  "open-workbench": "Open Parallax (sidebar)",
  "research-question": "Ask a question (AI \xB7 multi-source)",
  "cancel-research": "Stop current research run",
  "explore-problem": "Explore the problem (before researching)",
  "start-research-session": "Start research session (this note)",
  "start-research-project": "Start research project (folder)",
  "new-project-session": "New question in this project",
  "build-knowledge-graph-spike": "Build knowledge graph (spike)",
  "theory-lenses": "Explore theoretical lenses",
  "challenge-framing": "Challenge my framing",
  "resume-research": "Resume last research (rerank + synthesise)",
  "confront-beliefs": "Confront beliefs with the synthesis",
  "methodology-account": "Generate methodological account",
  "research-agenda": "Propose research agenda (from the synthesis)",
  "build-framework": "Build theoretical framework",
  "research-question-cross-sector": "Ask a question \u2014 force cross-sector evidence",
  "deepen-finding": "Deepen selected finding(s)",
  "ask-research-question": "Quick search (single provider)",
  "search-selection": "Quick search \u2014 selected text",
  "register-bibliography-project": "Register \u2014 bibliography (this note's project)",
  "register-bridge-papers": "Register \u2014 bridge papers across projects",
  "register-overview": "Register \u2014 authors & orphans",
  "register-export-bibtex": "Register \u2014 export BibTeX",
  "export-session": "Export research session (portable)",
  "export-project": "Export research project (portable)"
};

// src/workbench-view.ts
var import_obsidian9 = require("obsidian");

// src/evidence-gaps.ts
function deriveEvidenceGaps(project, notes, sources, records) {
  const graph = buildProjectGraph(project, notes, sources, records);
  const gaps = detectGaps(graph);
  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));
  const notesByBronId = new Map(sources.map((s) => [bronNodeId(s.key), s.notes]));
  const toItem = (gap) => {
    var _a, _b, _c, _d;
    const note = (_b = gap.note) != null ? _b : (_a = notesByBronId.get(gap.nodeId)) == null ? void 0 : _a[0];
    if (!note) return null;
    return { text: (_d = (_c = nodeById.get(gap.nodeId)) == null ? void 0 : _c.label) != null ? _d : gap.message, note };
  };
  const unprovenFindings = [];
  const subquestionsWithoutSources = [];
  const sourcesWithoutFinding = [];
  for (const gap of gaps) {
    if (gap.type === "bevinding-zonder-bron") {
      const item = toItem(gap);
      if (item) unprovenFindings.push({ ...item, followUp: { text: item.text, sourcePath: item.note } });
    } else if (gap.type === "vraag-zonder-bron") {
      const item = toItem(gap);
      if (item) subquestionsWithoutSources.push(item);
    } else if (gap.type === "bron-zonder-bevinding") {
      const item = toItem(gap);
      if (item) sourcesWithoutFinding.push(item);
    }
  }
  return { unprovenFindings, subquestionsWithoutSources, sourcesWithoutFinding };
}

// src/source-provenance.ts
function occurrencesElsewhere(register, key, notePath) {
  const record = register.citations.find((c) => c.key === key);
  return record ? record.occurrences.filter((o) => o.note !== notePath).length : 0;
}
function deriveSourceProvenance(notePath, record, register) {
  if (record) {
    const sources2 = record.sources.map((meta) => ({
      key: meta.key,
      title: meta.title,
      year: meta.year,
      occurrencesElsewhere: occurrencesElsewhere(register, meta.key, notePath),
      findings: record.findings.filter((f) => f.sourceKeys.includes(meta.key)).map((f) => ({ claim: f.claim, strength: f.strength }))
    }));
    return { hasRecord: true, sources: sources2 };
  }
  const sources = register.citations.filter((c) => c.occurrences.some((o) => o.note === notePath)).map((c) => ({
    key: c.key,
    title: c.title,
    year: c.year,
    occurrencesElsewhere: occurrencesElsewhere(register, c.key, notePath),
    findings: []
  }));
  return { hasRecord: false, sources };
}

// src/workbench-view.ts
var WORKBENCH_VIEW_TYPE = "consensus-research-workbench";
var WorkbenchView = class extends import_obsidian9.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    /** Path the panel was last rendered for — guards against re-rendering on every focus change (E69). */
    this.lastRenderedPath = null;
    /** Project member note paths from the last render (D10) — a change to one of these also matters. */
    this.lastRenderedProjectMemberPaths = [];
    /** Pending debounce timer for `metadataCache.on("changed")` (D10). */
    this.pendingRerender = null;
    this.plugin = plugin;
  }
  getViewType() {
    return WORKBENCH_VIEW_TYPE;
  }
  getDisplayText() {
    return "Parallax";
  }
  getIcon() {
    return "flask-conical";
  }
  async onOpen() {
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        var _a, _b;
        if (((_b = (_a = this.plugin.activeNoteFile()) == null ? void 0 : _a.path) != null ? _b : null) !== this.lastRenderedPath) void this.render();
      })
    );
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        if (!shouldRerenderOnChange(file.path, this.lastRenderedPath, this.lastRenderedProjectMemberPaths)) return;
        this.scheduleRerender();
      })
    );
    await this.render();
  }
  /** Debounce re-renders ~300ms (D10) so a burst of cache-change events collapses into one render. */
  scheduleRerender() {
    if (this.pendingRerender !== null) window.clearTimeout(this.pendingRerender);
    this.pendingRerender = window.setTimeout(() => {
      this.pendingRerender = null;
      void this.render();
    }, 300);
  }
  /** Re-render on demand (E56): the plugin calls this when the live run phase changes. */
  refresh() {
    void this.render();
  }
  /** Run a plugin command by its short id (prefixed with the plugin id). */
  run(commandId) {
    this.app.commands.executeCommandById(`${this.plugin.manifest.id}:${commandId}`);
  }
  async render() {
    var _a, _b;
    const root = this.contentEl;
    root.empty();
    root.createEl("h3", { text: "Parallax" });
    const banner = formatRunPhase(this.plugin.runPhase);
    if (banner) {
      const bannerEl = root.createEl("div", { cls: "consensus-workbench-running", attr: { "aria-live": "polite" } });
      bannerEl.createSpan({ text: banner });
      const stop = bannerEl.createEl("button", { text: "Stop", cls: "consensus-workbench-stop" });
      stop.addEventListener("click", () => this.plugin.cancelResearch());
    }
    this.renderResume(root);
    const file = this.plugin.activeNoteFile();
    this.lastRenderedPath = (_a = file == null ? void 0 : file.path) != null ? _a : null;
    if (!file) {
      this.lastRenderedProjectMemberPaths = [];
      this.renderOnboarding(root);
      this.renderActions(root, recommendActions(deriveSessionState(null, "")));
      return;
    }
    const session = parseSession((_b = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _b.frontmatter);
    const body = await this.app.vault.cachedRead(file);
    const state = deriveSessionState(session, body);
    const recommended = recommendActions(state);
    this.renderWorkflowStrip(root, state);
    await this.renderProjectPanel(root, file, session);
    this.renderSessionPanel(root, state);
    if (session) await this.renderSourceProvenance(root, file);
    this.renderActions(root, recommended);
    this.renderAllActions(root, state, recommended);
    this.renderArtifacts(root, session, body, file);
    this.renderTrace(root, body);
  }
  /**
   * "Resume last research" (D5/E78) — shown only while a resumable cache exists, independent of
   * which note is active (the cache is a plugin-level rescue, not tied to a single session).
   */
  renderResume(root) {
    if (!this.plugin.hasResumeCache()) return;
    const box = root.createEl("div", { cls: "consensus-workbench-resume" });
    new import_obsidian9.Setting(box).setName("Resume last research").setDesc("Re-run rerank + synthesis on the cached search \u2014 no re-fetching.").addButton((b) => {
      b.setButtonText("Resume").setCta();
      b.onClick(() => this.run("resume-research"));
    });
  }
  /** A short orientation for newcomers — shown when there is no session to steer yet (E55). */
  renderOnboarding(root) {
    const box = root.createEl("div", { cls: "consensus-handoff-hint" });
    box.createEl("p", { text: "Start here if you want to explore a new research idea." });
    box.createEl("p", {
      text: "The Workbench guides the whole process: explore the problem \u2192 choose a framing \u2192 theoretical lenses \u2192 search for evidence \u2192 test your assumptions \u2192 synthesis \u2192 research agenda. Open a note and turn it into a research session to begin."
    });
    box.createEl("p", {
      text: "For a bigger topic: start a research project (a folder). Each research question then becomes its own session note in that project."
    });
    new import_obsidian9.Setting(box).addButton((b) => {
      b.setButtonText("Start research project");
      b.onClick(() => this.run("start-research-project"));
    });
  }
  /**
   * Visual workflow strip (E55): Explore → Frame → Theory → Challenge → Evidence → Design —
   * reordered (D4/E78) to match {@link recommendActions}' order, so this strip's "current" step
   * and the "Next step" panel below always point at the same place.
   */
  renderWorkflowStrip(root, state) {
    const strip = root.createEl("div", { cls: "consensus-workbench-strip" });
    const steps = workflowSteps(state);
    steps.forEach((step, i) => {
      if (i > 0) strip.createSpan({ cls: "consensus-workbench-strip-sep", text: "\u203A", attr: { "aria-hidden": "true" } });
      const cls = ["consensus-workbench-step"];
      if (step.done) cls.push("is-done");
      if (step.current) cls.push("is-current");
      const el = strip.createSpan({ cls: cls.join(" ") });
      if (step.done) el.createSpan({ text: "\u2713 ", attr: { "aria-hidden": "true" } });
      el.appendText(step.label);
      el.setAttr("aria-label", `${step.done ? "Done: " : step.current ? "Current: " : ""}${step.label}`);
    });
  }
  /** Session panel — full but concise: one line per field. */
  renderSessionPanel(root, s) {
    var _a;
    root.createEl("h4", { text: "Research Session" });
    if (!s.isSession) {
      const hint = root.createEl("div", { cls: "consensus-handoff-hint" });
      hint.createEl("p", { text: "This note isn't a session yet." });
      hint.createEl("p", {
        text: "Turn it into a research session to build the chain in this note \u2014 or explore the problem directly (the artefact then lands at the cursor)."
      });
      return;
    }
    const dl = root.createEl("div", { cls: "consensus-workbench-session" });
    const row = (label, value) => {
      if (!value) return;
      const p = dl.createEl("p");
      p.createEl("strong", { text: `${label}: ` });
      p.appendText(value);
    };
    row("Question", s.question);
    row("Framing", (_a = s.framing) != null ? _a : "");
    row("Lenses", s.lenses.join(", "));
    if (s.totalBeliefs > 0) row("Beliefs", `${s.openBeliefs} open of ${s.totalBeliefs}`);
    row("Latest synthesis", s.synthesisSnippet);
  }
  /**
   * "Sources & findings" (E83_S2) — per active session, a compact provenance block: per source a
   * one-line summary (title, bridge-visibility elsewhere, finding count) expanding to its findings
   * with grades. Findings click through to this note's Synthese section. Degraded (no E68 record
   * for this note): shows what the citation register knows the note cites, with a hint that a
   * fresh research run would record the provenance.
   */
  async renderSourceProvenance(root, file) {
    const graphStore = await this.plugin.loadGraphStoreForWorkbench();
    const register = await this.plugin.loadRegisterForWorkbench();
    const provenance = deriveSourceProvenance(file.path, recordForNote(graphStore, file.path), register);
    if (provenance.sources.length === 0) return;
    const details = root.createEl("details", { cls: "consensus-workbench-more" });
    details.createEl("summary", { text: `Sources & findings (${provenance.sources.length})` });
    const wrap = details.createEl("div", { cls: "consensus-workbench-session" });
    if (!provenance.hasRecord) {
      wrap.createEl("p", {
        cls: "consensus-handoff-hint",
        text: "No provenance recorded for this note yet \u2014 showing what the register knows. Run a fresh synthesis to record which finding rests on which source."
      });
    }
    for (const src of provenance.sources) this.renderSourceProvenanceItem(wrap, file, provenance.hasRecord, src);
  }
  /** One source's compact line + expandable findings-with-grade list (E83_S2). */
  renderSourceProvenanceItem(root, file, hasRecord, src) {
    const srcDetails = root.createEl("details", { cls: "consensus-workbench-more" });
    const yearText = src.year ? ` (${src.year})` : "";
    srcDetails.createEl("summary", {
      text: `${src.title}${yearText} \xB7 ${src.occurrencesElsewhere} elsewhere \xB7 ${src.findings.length} finding(s)`
    });
    if (src.findings.length === 0) {
      srcDetails.createEl("p", {
        text: hasRecord ? "No findings recorded for this source yet." : "Findings unknown \u2014 no graph record for this note."
      });
      return;
    }
    const ul = srcDetails.createEl("ul", { cls: "consensus-workbench-artifacts" });
    for (const f of src.findings) {
      const li = ul.createEl("li");
      const link = li.createEl("a", { text: f.claim, href: "#", cls: "consensus-workbench-artifact-link" });
      link.addEventListener("click", (e) => {
        e.preventDefault();
        void this.app.workspace.openLinkText(`#${SECTION_IDS.synthesis}`, file.path, false);
      });
      li.appendText(` \u2014 ${f.strength}`);
    }
  }
  /**
   * Project panel (E64) — shown when the active note is a project hub OR a session that belongs
   * to a project. Lists the project's sessions (each its own note) with a tiny state badge, and a
   * button to add a new question. Membership is LEADING from the front-matter `project:` field;
   * the folder is just where the notes happen to live.
   */
  async renderProjectPanel(root, file, session) {
    var _a, _b, _c;
    const fm = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
    const hub = parseProjectHub(fm);
    const projectId = hub ? resolveProjectId(hub, file.basename) : (_b = session == null ? void 0 : session.project) != null ? _b : "";
    if (!projectId) {
      this.lastRenderedProjectMemberPaths = [];
      root.createEl("h4", { text: "Project" });
      const box = root.createEl("div", { cls: "consensus-workbench-session" });
      box.createEl("p", { text: "This note doesn't belong to a project yet. A project = a folder with one session per question." });
      new import_obsidian9.Setting(box).addButton((b) => {
        b.setButtonText("Start research project").onClick(() => this.run("start-research-project"));
      });
      return;
    }
    const notes = [];
    for (const f of this.app.vault.getMarkdownFiles()) {
      const s = parseSession((_c = this.app.metadataCache.getFileCache(f)) == null ? void 0 : _c.frontmatter);
      if (!s || s.project.toLowerCase() !== projectId.toLowerCase()) continue;
      notes.push({ path: f.path, title: f.basename, session: s, body: await this.app.vault.cachedRead(f) });
    }
    const members = projectMembers(projectId, notes);
    this.lastRenderedProjectMemberPaths = members.map((m) => m.path);
    root.createEl("h4", { text: `Project: ${projectId}` });
    const wrap = root.createEl("div", { cls: "consensus-workbench-session" });
    if (members.length === 0) {
      wrap.createEl("p", { text: "No research questions in this project yet. Add the first one." });
    } else {
      const ul = wrap.createEl("ul", { cls: "consensus-workbench-artifacts" });
      for (const m of members) {
        const li = ul.createEl("li");
        const badge = m.hasSynthesis ? "\u2713" : "\xB7";
        const open = m.openBeliefs > 0 ? ` (${m.openBeliefs} open)` : "";
        li.createSpan({
          text: `${badge} `,
          attr: { "aria-label": m.hasSynthesis ? "Has synthesis" : "No synthesis yet" }
        });
        const isActive = m.path === file.path;
        if (isActive) {
          li.createEl("strong", { text: m.title });
        } else {
          const link = li.createEl("a", { text: m.title, href: "#", cls: "consensus-workbench-artifact-link" });
          link.addEventListener("click", (e) => {
            e.preventDefault();
            void this.app.workspace.openLinkText(m.path, "", false);
          });
        }
        li.appendText(open);
      }
    }
    new import_obsidian9.Setting(wrap).addButton((b) => {
      b.setButtonText("New question in this project");
      b.onClick(() => this.run("new-project-session"));
    });
    const hypotheses = projectHypotheses(projectId, notes);
    if (hypotheses.length > 0) {
      root.createEl("h4", { text: "Open hypotheses & follow-up directions" });
      const list = root.createEl("div", { cls: "consensus-workbench-session" });
      for (const h of hypotheses) {
        const setting = new import_obsidian9.Setting(list).setName(h.text).setDesc(`${h.kind} \xB7 from "${h.sourceTitle}"`);
        setting.addButton((b) => {
          b.setButtonText("Research this");
          b.onClick(() => void this.plugin.startHypothesisFollowUp(h.text, h.sourcePath));
        });
      }
    }
    const memberPaths = new Set(notes.map((n) => n.path));
    const register = await this.plugin.loadRegisterForWorkbench();
    const sources = [];
    for (const c of register.citations) {
      const inProject = c.occurrences.filter((o) => memberPaths.has(o.note)).map((o) => o.note);
      if (inProject.length > 0) sources.push({ key: c.key, title: c.title, year: c.year, notes: inProject });
    }
    const graphStore = await this.plugin.loadGraphStoreForWorkbench();
    const records = graphStore.sessions.filter((r) => memberPaths.has(r.note));
    this.renderEvidenceGaps(root, deriveEvidenceGaps(projectId, notes, sources, records));
  }
  /** "Evidence gaps" (E83_S1) — three collapsible worklists, each item click-through + (for an unproven finding) a "Research this" follow-up (E66 pattern). */
  renderEvidenceGaps(root, gaps) {
    const total = gaps.unprovenFindings.length + gaps.subquestionsWithoutSources.length + gaps.sourcesWithoutFinding.length;
    if (total === 0) return;
    root.createEl("h4", { text: "Evidence gaps" });
    this.renderGapGroup(root, "Unproven findings", gaps.unprovenFindings, true);
    this.renderGapGroup(root, "Sub-questions without sources", gaps.subquestionsWithoutSources, false);
    this.renderGapGroup(root, "Sources without a finding", gaps.sourcesWithoutFinding, false);
  }
  /** One collapsible gap-category group; `withFollowUp` mirrors the E66 "Research this" open-hypotheses pattern. */
  renderGapGroup(root, label, items, withFollowUp) {
    if (items.length === 0) return;
    const details = root.createEl("details", { cls: "consensus-workbench-more" });
    details.createEl("summary", { text: `${label} (${items.length})` });
    const wrap = details.createEl("div", { cls: "consensus-workbench-session" });
    for (const item of items) {
      if (withFollowUp && item.followUp) {
        const followUp = item.followUp;
        const setting = new import_obsidian9.Setting(wrap).setName(item.text).setDesc(`From "${this.noteTitle(item.note)}"`);
        setting.addButton((b) => {
          b.setButtonText("Research this");
          b.onClick(() => void this.plugin.startHypothesisFollowUp(followUp.text, followUp.sourcePath));
        });
      } else {
        const p = wrap.createEl("p");
        const link = p.createEl("a", { text: item.text, href: "#", cls: "consensus-workbench-artifact-link" });
        link.addEventListener("click", (e) => {
          e.preventDefault();
          void this.app.workspace.openLinkText(`#${SECTION_IDS.synthesis}`, item.note, false);
        });
        p.appendText(` \u2014 "${this.noteTitle(item.note)}"`);
      }
    }
  }
  /** Vault-relative path → its basename without the `.md` extension, for a compact "from ..." label. */
  noteTitle(path) {
    var _a;
    const base = (_a = path.split("/").pop()) != null ? _a : path;
    return base.replace(/\.md$/i, "");
  }
  /** Next actions — one primary (CTA) + one alternative, each with a why. */
  renderActions(root, actions) {
    if (actions.length === 0) return;
    root.createEl("h4", { text: "Next step" });
    actions.forEach((a, i) => {
      new import_obsidian9.Setting(root).setName(a.label).setDesc(a.why).addButton((b) => {
        b.setButtonText(i === 0 ? "Run" : "Or this");
        if (i === 0) b.setCta();
        b.onClick(() => this.run(a.commandId));
      });
    });
  }
  /**
   * All workflow actions as buttons (E61) — full control, so you're never boxed into only the
   * recommended step. Excludes whatever is already shown as the primary/alternative above.
   */
  renderAllActions(root, state, recommended) {
    const shown = new Set(recommended.map((a) => a.commandId));
    const rest = allActions(state).filter((a) => !shown.has(a.commandId));
    if (rest.length > 0) {
      root.createEl("h4", { text: "All steps" });
      const wrap = root.createEl("div", { cls: "consensus-workbench-actions" });
      for (const a of rest) {
        const btn = wrap.createEl("button", { text: a.label, cls: "consensus-workbench-action" });
        btn.addEventListener("click", () => this.run(a.commandId));
      }
    }
    this.renderMoreActions(root);
  }
  /**
   * Collapsed "More" group (D5/E78) under "All steps" — the secondary/rescue commands that were
   * previously palette-only (framework-only, cross-sector, deepen, register slices, quick search).
   * A native `<details>` keeps this cheap: collapsed by default so it doesn't compete with the
   * primary workflow, one click away when needed.
   */
  renderMoreActions(root) {
    const details = root.createEl("details", { cls: "consensus-workbench-more" });
    details.createEl("summary", { text: "More" });
    const wrap = details.createEl("div", { cls: "consensus-workbench-actions" });
    for (const a of moreActions()) {
      const btn = wrap.createEl("button", { text: a.label, cls: "consensus-workbench-action" });
      btn.addEventListener("click", () => this.run(a.commandId));
    }
  }
  /** Artefacts — which sections exist; present ones are click-to-jump to their `##` section (E55). */
  renderArtifacts(root, session, body, file) {
    root.createEl("h4", { text: "Artifacts" });
    const ul = root.createEl("ul", { cls: "consensus-workbench-artifacts" });
    for (const a of listArtifacts(session, body)) {
      const li = ul.createEl("li");
      li.createSpan({ text: `${a.present ? "\u2713" : "\xB7"} `, attr: { "aria-label": a.present ? "Present" : "Not present yet" } });
      if (a.navigable) {
        const link = li.createEl("a", { text: a.label, href: "#", cls: "consensus-workbench-artifact-link" });
        link.addEventListener("click", (e) => {
          e.preventDefault();
          void this.app.workspace.openLinkText(`#${a.heading}`, file.path, false);
        });
      } else {
        li.appendText(a.label);
      }
    }
  }
  /** Log / trace — the most recent decision-trail entries from the ## Logboek. */
  renderTrace(root, body) {
    const lines = recentLog(body, 6);
    if (lines.length === 0) return;
    root.createEl("h4", { text: "Logbook (latest steps)" });
    const ul = root.createEl("ul", { cls: "consensus-workbench-trace" });
    for (const line of lines) ul.createEl("li", { text: line.replace(/^- /, "") });
  }
  async onClose() {
    if (this.pendingRerender !== null) window.clearTimeout(this.pendingRerender);
    this.contentEl.empty();
  }
};
async function revealWorkbench(plugin) {
  var _a;
  const { workspace } = plugin.app;
  const leaf = (_a = workspace.getLeavesOfType(WORKBENCH_VIEW_TYPE)[0]) != null ? _a : workspace.getRightLeaf(false);
  await (leaf == null ? void 0 : leaf.setViewState({ type: WORKBENCH_VIEW_TYPE, active: true }));
}

// src/commands.ts
function registerCommands(plugin) {
  plugin.addCommand({
    id: "open-workbench",
    name: COMMAND_NAMES["open-workbench"],
    icon: "flask-conical",
    callback: () => void revealWorkbench(plugin)
  });
  plugin.addCommand({
    id: "research-question",
    name: COMMAND_NAMES["research-question"],
    icon: "sparkles",
    callback: () => plugin.promptAndResearch("")
  });
  plugin.addCommand({
    id: "cancel-research",
    name: COMMAND_NAMES["cancel-research"],
    icon: "square",
    callback: () => plugin.cancelResearch()
  });
  plugin.addCommand({
    id: "explore-problem",
    name: COMMAND_NAMES["explore-problem"],
    icon: "compass",
    callback: () => plugin.promptAndExplore("")
  });
  plugin.addCommand({
    id: "start-research-session",
    name: COMMAND_NAMES["start-research-session"],
    icon: "notebook-pen",
    callback: () => plugin.startResearchSession()
  });
  plugin.addCommand({
    id: "start-research-project",
    name: COMMAND_NAMES["start-research-project"],
    icon: "folder-plus",
    callback: () => plugin.startResearchProject()
  });
  plugin.addCommand({
    id: "new-project-session",
    name: COMMAND_NAMES["new-project-session"],
    icon: "file-plus",
    callback: () => plugin.newProjectSession()
  });
  if (plugin.settings.debugLogging) {
    plugin.addCommand({
      id: "build-knowledge-graph-spike",
      name: COMMAND_NAMES["build-knowledge-graph-spike"],
      icon: "git-fork",
      callback: () => void plugin.buildKnowledgeGraphSpike()
    });
  }
  plugin.addCommand({
    id: "theory-lenses",
    name: COMMAND_NAMES["theory-lenses"],
    icon: "glasses",
    callback: () => plugin.promptAndTheory("")
  });
  plugin.addCommand({
    id: "challenge-framing",
    name: COMMAND_NAMES["challenge-framing"],
    icon: "swords",
    callback: () => plugin.promptAndChallenge("")
  });
  plugin.addCommand({
    id: "resume-research",
    name: COMMAND_NAMES["resume-research"],
    icon: "rotate-ccw",
    callback: () => plugin.resumeResearch()
  });
  plugin.addCommand({
    id: "confront-beliefs",
    name: COMMAND_NAMES["confront-beliefs"],
    icon: "scale",
    callback: () => void plugin.confrontBeliefsFlow()
  });
  plugin.addCommand({
    id: "methodology-account",
    name: COMMAND_NAMES["methodology-account"],
    icon: "scroll-text",
    callback: () => void plugin.generateMethodologyAccount()
  });
  plugin.addCommand({
    id: "research-agenda",
    name: COMMAND_NAMES["research-agenda"],
    icon: "telescope",
    callback: () => void plugin.generateResearchDesign()
  });
  plugin.addCommand({
    id: "build-framework",
    name: COMMAND_NAMES["build-framework"],
    icon: "library",
    callback: () => plugin.promptAndResearch("", { frameworkOnly: true })
  });
  plugin.addCommand({
    id: "research-question-cross-sector",
    name: COMMAND_NAMES["research-question-cross-sector"],
    icon: "git-compare",
    callback: () => plugin.promptAndResearch("", { crossSectorForce: true })
  });
  plugin.addCommand({
    id: "deepen-finding",
    name: COMMAND_NAMES["deepen-finding"],
    icon: "list-tree",
    editorCallback: (editor) => void plugin.deepenSelection(editor)
  });
  plugin.addCommand({
    id: "ask-research-question",
    name: COMMAND_NAMES["ask-research-question"],
    icon: "search",
    callback: () => plugin.promptAndSearch("")
  });
  plugin.addCommand({
    id: "search-selection",
    name: COMMAND_NAMES["search-selection"],
    icon: "search",
    editorCallback: (editor) => {
      const selection = editor.getSelection().trim();
      plugin.promptAndSearch(selection);
    }
  });
  plugin.addCommand({
    id: "register-bibliography-project",
    name: COMMAND_NAMES["register-bibliography-project"],
    callback: () => void plugin.sliceBibliography()
  });
  plugin.addCommand({
    id: "register-bridge-papers",
    name: COMMAND_NAMES["register-bridge-papers"],
    callback: () => void plugin.sliceBridgePapers()
  });
  plugin.addCommand({
    id: "register-overview",
    name: COMMAND_NAMES["register-overview"],
    callback: () => void plugin.sliceOverview()
  });
  plugin.addCommand({
    id: "register-export-bibtex",
    name: COMMAND_NAMES["register-export-bibtex"],
    callback: () => void plugin.sliceBibtex()
  });
  plugin.addCommand({
    id: "export-session",
    name: COMMAND_NAMES["export-session"],
    icon: "package",
    callback: () => void plugin.exportSession()
  });
  plugin.addCommand({
    id: "export-project",
    name: COMMAND_NAMES["export-project"],
    icon: "package-open",
    callback: () => void plugin.exportProject()
  });
}
function registerRibbons(plugin) {
  plugin.addRibbonIcon("sparkles", "Parallax: ask a question (AI)", () => {
    plugin.promptAndResearch("");
  });
  plugin.addRibbonIcon("flask-conical", "Parallax: open the workbench", () => {
    void revealWorkbench(plugin);
  });
}

// src/subquestion-review-modal.ts
var import_obsidian10 = require("obsidian");
function parseSubQuestionLines(text) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const raw of text.split("\n")) {
    const query = raw.trim().replace(/^\d+[.)]\s*/, "");
    if (!query) continue;
    const key = query.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ query });
  }
  return out;
}
function subQuestionsToText(subs) {
  return subs.map((s) => s.query).join("\n");
}
function reconcileHypotheses(edited, original) {
  const norm = (q) => q.toLowerCase().replace(/\s+/g, " ").trim();
  const hypByQuery = new Map(original.map((s) => [norm(s.query), s.hypothesis]));
  return edited.map((s) => {
    const hyp = hypByQuery.get(norm(s.query));
    return hyp ? { query: s.query, hypothesis: hyp } : s;
  });
}
var SubQuestionReviewModal = class extends import_obsidian10.Modal {
  constructor(app, subs, framework, onSubmit) {
    super(app);
    this.resolved = false;
    this.subs = subs;
    this.text = subQuestionsToText(subs);
    this.framework = framework;
    this.onSubmit = onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    applyModalChrome(this);
    contentEl.createEl("h2", { text: "Review sub-questions" });
    contentEl.createEl("p", {
      text: "Edit, add or remove the sub-questions before the search runs. One per line.",
      cls: "consensus-review-hint"
    });
    if (this.framework) {
      const fw = contentEl.createEl("details", { cls: "consensus-review-framework" });
      fw.createEl("summary", { text: `Theoretical framework \u2014 ${this.framework.construct}` });
      if (this.framework.definition) fw.createEl("p", { text: this.framework.definition });
      if (this.framework.dimensions.length > 0) {
        const ul = fw.createEl("ul");
        for (const d of this.framework.dimensions) ul.createEl("li", { text: d });
      }
    }
    new import_obsidian10.Setting(contentEl).setName("Sub-questions").setDesc("One searchable sub-question per line.").addTextArea((ta) => {
      const MIN_ROWS = 6;
      ta.inputEl.rows = rowsForLines(this.text.split("\n").length, MIN_ROWS);
      ta.setValue(this.text).onChange((v) => {
        this.text = v;
        ta.inputEl.rows = rowsForLines(v.split("\n").length, MIN_ROWS);
      });
      ta.inputEl.addClass("consensus-review-input");
      if (!import_obsidian10.Platform.isMobile) window.setTimeout(() => ta.inputEl.focus(), 0);
    });
    new import_obsidian10.Setting(contentEl).addButton(
      (b) => b.setButtonText("Search these").setCta().onClick(() => this.submit())
    ).addButton((b) => b.setButtonText("Cancel").onClick(() => this.cancel()));
  }
  submit() {
    const edited = reconcileHypotheses(parseSubQuestionLines(this.text), this.subs);
    this.resolve(edited.length > 0 ? edited : null);
    this.close();
  }
  cancel() {
    this.resolve(null);
    this.close();
  }
  resolve(edited) {
    if (this.resolved) return;
    this.resolved = true;
    this.onSubmit(edited);
  }
  onClose() {
    this.contentEl.empty();
    this.resolve(null);
  }
};

// src/framework-handoff-modal.ts
var import_obsidian11 = require("obsidian");
function parseDimensionLines(text) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const raw of text.split("\n")) {
    const dim = raw.trim().replace(/^[-*]\s*/, "").trim();
    if (!dim) continue;
    const key = dim.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(dim);
  }
  return out;
}
var FrameworkHandoffModal = class extends import_obsidian11.Modal {
  constructor(app, framework, onChoice) {
    super(app);
    this.resolved = false;
    this.framework = framework;
    this.dimensionsText = framework.dimensions.join("\n");
    this.onChoice = onChoice;
  }
  onOpen() {
    var _a, _b;
    const { contentEl } = this;
    applyModalChrome(this);
    contentEl.createEl("h2", { text: `Theoretical framework \u2014 ${this.framework.construct}` });
    if (this.framework.definition) {
      contentEl.createEl("p", { text: this.framework.definition, cls: "consensus-handoff-definition" });
    }
    const count = (_b = (_a = this.framework.sources) == null ? void 0 : _a.length) != null ? _b : 0;
    contentEl.createEl("p", {
      text: `${count} seminal source(s). Edit the dimensions below, then continue to the literature research or just insert the framework.`,
      cls: "consensus-handoff-hint"
    });
    new import_obsidian11.Setting(contentEl).setName("Dimensions (steer the sub-questions)").setDesc("One analytical dimension per line.").addTextArea((ta) => {
      const MIN_ROWS = 4;
      ta.inputEl.rows = rowsForLines(this.framework.dimensions.length, MIN_ROWS);
      ta.setValue(this.dimensionsText).onChange((v) => {
        this.dimensionsText = v;
        ta.inputEl.rows = rowsForLines(v.split("\n").length, MIN_ROWS);
      });
      ta.inputEl.addClass("consensus-handoff-input");
    });
    new import_obsidian11.Setting(contentEl).addButton(
      (b) => b.setButtonText("Continue to literature research").setCta().onClick(() => this.choose("research"))
    ).addButton((b) => b.setButtonText("Insert framework only").onClick(() => this.choose("insert")));
  }
  choose(action) {
    const dimensions = parseDimensionLines(this.dimensionsText);
    this.resolve({ action, dimensions: dimensions.length > 0 ? dimensions : this.framework.dimensions });
    this.close();
  }
  resolve(choice) {
    if (this.resolved) return;
    this.resolved = true;
    this.onChoice(choice);
  }
  onClose() {
    this.contentEl.empty();
    this.resolve(null);
  }
};

// src/exploration.ts
var MAX_EXPLORATION_ITEMS = 6;
var MAX_SEARCH_TERM_SEEDS = 6;
var MAX_RESEARCH_DIRECTIONS = 3;
var SYSTEM2 = [
  "You are a sharp research advisor \u2014 a sparring partner, not an answer machine.",
  "The writer gives a research question. Do NOT answer it and do NOT search literature.",
  "Instead, EXPLORE the problem so the writer first understands what the question really is.",
  "Return strict JSON of the form:",
  '{"assumptions":["implicit assumptions baked into the question"],',
  '"counter_assumptions":["plausible OPPOSITES of those assumptions, to guard against confirmation bias"],',
  '"question_variants":["alternative framings/reformulations that change the research programme, not just wording"],',
  `"lenses":["discipline + its theoretical TRADITION(S), e.g. 'Criminology \u2192 Social Control Theory, Routine Activity Theory'"],`,
  '"definitions":["competing or conflated definitions of the key terms"],',
  '"search_term_seeds":["terminology you would MISS if you searched only the original phrasing"],',
  '"research_directions":[{"title":"a distinct research programme the question could become","theoretical_basis":"the tradition(s) it draws on","searchability":"how searchable it is internationally","literature_strength":"ESTIMATED chance of a strong literature base \u2014 a guess, the search has not run yet","originality":"how original/underexplored the angle is"}]}.',
  "For counter_assumptions: name the credible way the premise could be WRONG (e.g. the intervention could backfire,",
  "or be a mere correlate rather than a cause) \u2014 not strawmen.",
  "For lenses: end at theoretical TRADITIONS, not just bare discipline names \u2014 this seeds later theory work.",
  "For research_directions: give 2-3 genuinely different programmes; literature_strength is an explicit ESTIMATE,",
  "never stated as fact. The researcher chooses one \u2014 do not pick for them.",
  "Push for genuinely different angles (other disciplines, alternative units of analysis), not paraphrases.",
  "search_term_seeds must be short, SEARCHABLE English terms/phrases (academic indexing language),",
  "even when the question is in another language \u2014 these widen the literature search.",
  "Do NOT invent facts, findings, sources or citations; this is framing help, not evidence.",
  "Write all prose EXCEPT search_term_seeds in the SAME language as the question.",
  "Keep each list to at most 6 concise entries (research_directions: at most 3). Respond with strict JSON only."
].join(" ");
function cleanList(raw, max) {
  if (!Array.isArray(raw)) return [];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const v of raw) {
    const s = typeof v === "string" ? v.trim() : "";
    if (!s) continue;
    const key = s.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= max) break;
  }
  return out;
}
function parseDirections(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const str = (v) => typeof v === "string" ? v.trim() : "";
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry;
    const title = str(e.title);
    if (!title) continue;
    out.push({
      title,
      theoreticalBasis: str(e.theoretical_basis),
      searchability: str(e.searchability),
      literatureStrength: str(e.literature_strength),
      originality: str(e.originality)
    });
    if (out.length >= MAX_RESEARCH_DIRECTIONS) break;
  }
  return out;
}
function parseExploration(raw, log) {
  const p = parseJsonObject(raw, "exploration", log);
  if (!p) return null;
  const result = {
    assumptions: cleanList(p.assumptions, MAX_EXPLORATION_ITEMS),
    counterAssumptions: cleanList(p.counter_assumptions, MAX_EXPLORATION_ITEMS),
    questionVariants: cleanList(p.question_variants, MAX_EXPLORATION_ITEMS),
    lenses: cleanList(p.lenses, MAX_EXPLORATION_ITEMS),
    definitions: cleanList(p.definitions, MAX_EXPLORATION_ITEMS),
    searchTermSeeds: cleanList(p.search_term_seeds, MAX_SEARCH_TERM_SEEDS),
    researchDirections: parseDirections(p.research_directions)
  };
  if (result.questionVariants.length === 0 && result.searchTermSeeds.length === 0 && result.lenses.length === 0) {
    log == null ? void 0 : log("empty result \u2014 exploration: no variants, seeds or lenses");
    return null;
  }
  return result;
}
async function exploreProblem(question, chat, log) {
  const user = `Research question: ${question}`;
  let raw;
  try {
    raw = await chat(
      [
        { role: "system", content: SYSTEM2 },
        { role: "user", content: user }
      ],
      // A little warmth helps divergence here (unlike the reproducible decompose).
      { json: true, temperature: 0.5 }
    );
  } catch (e) {
    log == null ? void 0 : log("chat failure \u2014 exploration", String(e));
    return null;
  }
  return parseExploration(raw, log);
}
function buildExplorationBody(result, choice) {
  const lines = [];
  if (choice.framing) lines.push(`Gekozen framing: ${choice.framing}`, "");
  const section = (heading, items) => {
    if (items.length === 0) return;
    lines.push(`*${heading}*`);
    for (const item of items) lines.push(`- ${item}`);
    lines.push("");
  };
  section("Impliciete aannames", result.assumptions);
  section("Mogelijke tegenaannames", result.counterAssumptions);
  section("Herformuleringen", result.questionVariants);
  section("Disciplines / theoretische tradities", result.lenses);
  section("Concurrerende definities", result.definitions);
  if (result.researchDirections.length > 0) {
    lines.push("*Kansrijke onderzoeksrichtingen*");
    for (const d of result.researchDirections) {
      const facets = [
        d.theoreticalBasis && `theoretische basis: ${d.theoreticalBasis}`,
        d.searchability && `zoekbaarheid: ${d.searchability}`,
        d.literatureStrength && `kans op sterke literatuur (inschatting): ${d.literatureStrength}`,
        d.originality && `originaliteit: ${d.originality}`
      ].filter(Boolean);
      lines.push(`- **${d.title}**${facets.length ? ` \u2014 ${facets.join("; ")}` : ""}`);
    }
    lines.push("");
  }
  section("Zoektermen (gekozen)", choice.searchTermSeeds);
  if (choice.beliefs) lines.push("*Eerste overtuigingen*", choice.beliefs, "");
  return lines.join("\n").trimEnd();
}
function explorationAdoptionRecord(question, choice) {
  return {
    framing: choice.framing && choice.framing !== question ? choice.framing : null,
    seeds: choice.searchTermSeeds,
    beliefsAdded: choice.beliefs ? parseBeliefLines(choice.beliefs).map((b) => b.claim) : []
  };
}

// src/exploration-modal.ts
var import_obsidian12 = require("obsidian");
var ExplorationModal = class extends import_obsidian12.Modal {
  constructor(app, originalQuestion, result, onChoice) {
    super(app);
    this.resolved = false;
    this.beliefs = "";
    this.originalQuestion = originalQuestion;
    this.result = result;
    this.framing = originalQuestion;
    this.selectedSeeds = new Set(result.searchTermSeeds);
    this.onChoice = onChoice;
  }
  onOpen() {
    const { contentEl } = this;
    applyModalChrome(this);
    contentEl.createEl("h2", { text: "Explore the problem" });
    contentEl.createEl("p", {
      text: "Choose the framing to research and the search terms that widen the search. The rest is material to weigh.",
      cls: "consensus-handoff-hint"
    });
    this.renderReadOnly(contentEl, "Implicit assumptions", this.result.assumptions);
    this.renderReadOnly(contentEl, "Possible counter-assumptions", this.result.counterAssumptions);
    this.renderReadOnly(contentEl, "Competing definitions", this.result.definitions);
    this.renderReadOnly(contentEl, "Disciplines / theoretical traditions", this.result.lenses);
    this.renderDirections(contentEl);
    new import_obsidian12.Setting(contentEl).setName("Research question (framing)").setDesc("Edit, or pick a reformulation below.").addTextArea((ta) => {
      this.framingInput = ta;
      ta.setValue(this.framing).onChange((v) => this.framing = v);
      ta.inputEl.addClass("consensus-handoff-input");
      this.resizeFramingInput = makeAutoGrowTextarea(ta.inputEl, 2);
    });
    if (this.result.questionVariants.length > 0) {
      contentEl.createEl("p", { text: "Reformulations (click to use):", cls: "consensus-handoff-hint" });
      for (const variant of this.result.questionVariants) {
        new import_obsidian12.Setting(contentEl).setName(variant).addButton(
          (b) => b.setButtonText("Use").onClick(() => {
            var _a, _b;
            this.framing = variant;
            (_a = this.framingInput) == null ? void 0 : _a.setValue(variant);
            (_b = this.resizeFramingInput) == null ? void 0 : _b.call(this);
          })
        );
      }
    }
    if (this.result.searchTermSeeds.length > 0) {
      contentEl.createEl("h3", { text: "Missed search terms (widen the search)" });
      for (const seed of this.result.searchTermSeeds) {
        new import_obsidian12.Setting(contentEl).setName(seed).addToggle(
          (t) => t.setValue(this.selectedSeeds.has(seed)).onChange((on) => {
            if (on) this.selectedSeeds.add(seed);
            else this.selectedSeeds.delete(seed);
          })
        );
      }
    }
    new import_obsidian12.Setting(contentEl).setName("First beliefs (optional)").setDesc("What do you think now? Lands in the inserted block.").addTextArea((ta) => {
      ta.setValue(this.beliefs).onChange((v) => this.beliefs = v);
      ta.inputEl.addClass("consensus-handoff-input");
      makeAutoGrowTextarea(ta.inputEl, 3);
    });
    new import_obsidian12.Setting(contentEl).addButton(
      (b) => b.setButtonText("Research with these choices").setCta().onClick(() => this.choose("research"))
    ).addButton((b) => b.setButtonText("Insert only").onClick(() => this.choose("insert")));
  }
  renderReadOnly(parent, heading, items) {
    if (items.length === 0) return;
    parent.createEl("h3", { text: heading });
    const ul = parent.createEl("ul");
    for (const item of items) ul.createEl("li", { text: item });
  }
  /** Render the research directions (E44) with their facets — advisory; the writer chooses. */
  renderDirections(parent) {
    const dirs = this.result.researchDirections;
    if (dirs.length === 0) return;
    parent.createEl("h3", { text: "Promising research directions (you choose)" });
    for (const d of dirs) {
      parent.createEl("p", { text: d.title, cls: "consensus-handoff-definition" });
      const ul = parent.createEl("ul");
      const facet = (label, value) => {
        if (value) ul.createEl("li", { text: `${label}: ${value}` });
      };
      facet("Theoretical basis", d.theoreticalBasis);
      facet("Searchability", d.searchability);
      facet("Chance of strong literature (estimate)", d.literatureStrength);
      facet("Originality", d.originality);
    }
  }
  choose(action) {
    const framing = this.framing.trim() || this.originalQuestion;
    const seeds = this.result.searchTermSeeds.filter((s) => this.selectedSeeds.has(s));
    this.resolve({ action, framing, searchTermSeeds: seeds, beliefs: this.beliefs.trim() });
    this.close();
  }
  resolve(choice) {
    if (this.resolved) return;
    this.resolved = true;
    this.onChoice(choice);
  }
  onClose() {
    this.contentEl.empty();
    this.resolve(null);
  }
};

// src/theory.ts
var MAX_THEORY_LENSES = 6;
var MAX_THEORY_ITEMS = 6;
var MAX_ELIMINATED = 5;
var SYSTEM3 = [
  "You are a theoretically sharp research advisor \u2014 like a doctoral supervisor probing a question.",
  "Given a research question, propose the THEORETICAL lenses to think with. Do NOT answer the",
  "question and do NOT search literature. Return strict JSON of the form:",
  '{"lenses":[{"name":"established theory/tradition name","tradition":"discipline it belongs to",',
  '"why":"why it might apply to THIS question","predicts":"what it would predict or explain here"}],',
  '"same_mechanism":["theories that describe the SAME mechanism under different terminology"],',
  '"absent":["a theory/tradition conspicuously ABSENT from how this question is usually framed"],',
  '"competing":["competing explanations that rival the implied one"],',
  '"cross_domain":["deliberately cross-disciplinary connections (e.g. ecology <-> social networks)"],',
  '"eliminated":[{"name":"a theory that looks tempting here","reason":"why it actually explains little"}]}.',
  "Push for genuinely DIFFERENT traditions and semantically less-obvious, cross-disciplinary",
  "associations \u2014 not paraphrases of one perspective.",
  "For 'eliminated': name theories a researcher might reach for but that add little explanatory power",
  "to THIS question, with a one-line reason \u2014 this prevents side-tracks. Be honest, not contrarian.",
  "The lens 'name' and 'same_mechanism'/'absent' theory names should use their ESTABLISHED (usually",
  "English) names so they stay recognisable and searchable; write 'why'/'predicts'/'reason' and the",
  "other prose in the SAME language as the question.",
  "Do NOT invent facts, findings, sources or citations; this is theoretical framing, not evidence.",
  "Keep lenses to at most 6 and eliminated to at most 5. Respond with strict JSON only."
].join(" ");
function cleanList2(raw, max) {
  if (!Array.isArray(raw)) return [];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const v of raw) {
    const s = typeof v === "string" ? v.trim() : "";
    if (!s) continue;
    const key = s.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= max) break;
  }
  return out;
}
function parseLenses(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const str = (v) => typeof v === "string" ? v.trim() : "";
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry;
    const name = str(e.name);
    if (!name) continue;
    const key = name.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ name, tradition: str(e.tradition), why: str(e.why), predicts: str(e.predicts) });
    if (out.length >= MAX_THEORY_LENSES) break;
  }
  return out;
}
function parseEliminated(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const str = (v) => typeof v === "string" ? v.trim() : "";
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry;
    const name = str(e.name);
    const reason = str(e.reason);
    if (!name || !reason) continue;
    out.push({ name, reason });
    if (out.length >= MAX_ELIMINATED) break;
  }
  return out;
}
function parseTheory(raw, log) {
  const p = parseJsonObject(raw, "theory", log);
  if (!p) return null;
  const result = {
    lenses: parseLenses(p.lenses),
    sameMechanism: cleanList2(p.same_mechanism, MAX_THEORY_ITEMS),
    absent: cleanList2(p.absent, MAX_THEORY_ITEMS),
    competing: cleanList2(p.competing, MAX_THEORY_ITEMS),
    crossDomain: cleanList2(p.cross_domain, MAX_THEORY_ITEMS),
    eliminated: parseEliminated(p.eliminated)
  };
  if (result.lenses.length === 0 && result.eliminated.length === 0 && result.crossDomain.length === 0) {
    log == null ? void 0 : log("empty result \u2014 theory: no lenses, eliminated or cross-domain");
    return null;
  }
  return result;
}
async function proposeTheory(question, chat, log) {
  const user = `Research question: ${question}`;
  let raw;
  try {
    raw = await chat(
      [
        { role: "system", content: SYSTEM3 },
        { role: "user", content: user }
      ],
      // A little warmth aids divergence across traditions (cf. exploration).
      { json: true, temperature: 0.5 }
    );
  } catch (e) {
    log == null ? void 0 : log("chat failure \u2014 theory", String(e));
    return null;
  }
  return parseTheory(raw, log);
}
function buildTheoryBody(result, choice) {
  const lines = [];
  if (result.lenses.length > 0) {
    lines.push("*Lenzen*");
    for (const l of result.lenses) {
      const facets = [l.why && `waarom hier: ${l.why}`, l.predicts && `voorspelt: ${l.predicts}`].filter(Boolean);
      lines.push(`- **${l.name}**${l.tradition ? ` (${l.tradition})` : ""}${facets.length ? ` \u2014 ${facets.join("; ")}` : ""}`);
    }
    lines.push("");
  }
  if (result.eliminated.length > 0) {
    lines.push("*Verleidelijk maar verklaart hier weinig*");
    for (const e of result.eliminated) lines.push(`- ${e.name} \u2014 ${e.reason}`);
    lines.push("");
  }
  const section = (heading, items) => {
    if (items.length === 0) return;
    lines.push(`*${heading}*`);
    for (const item of items) lines.push(`- ${item}`);
    lines.push("");
  };
  section("Zelfde mechanisme, andere naam", result.sameMechanism);
  section("Opvallend afwezig", result.absent);
  section("Concurrerende verklaringen", result.competing);
  section("Cross-domein verbindingen", result.crossDomain);
  if (choice.lenses.length > 0) section("Gekozen lenzen", choice.lenses);
  return lines.join("\n").trimEnd();
}
function theoryAdoptionRecord(result, choice) {
  const byName = new Map(result.lenses.map((l) => [l.name.toLowerCase(), l]));
  const chosenLenses = choice.lenses.map((name) => {
    const grounded = byName.get(name.toLowerCase());
    return {
      name,
      ...(grounded == null ? void 0 : grounded.tradition) ? { tradition: grounded.tradition } : {},
      ...(grounded == null ? void 0 : grounded.why) ? { why: grounded.why } : {},
      ...(grounded == null ? void 0 : grounded.predicts) ? { predicts: grounded.predicts } : {}
    };
  });
  return { chosenLenses };
}

// src/theory-modal.ts
var import_obsidian13 = require("obsidian");
var TheoryModal = class extends import_obsidian13.Modal {
  constructor(app, result, onChoice) {
    super(app);
    this.resolved = false;
    this.result = result;
    this.selected = /* @__PURE__ */ new Set();
    this.onChoice = onChoice;
  }
  onOpen() {
    const { contentEl } = this;
    applyModalChrome(this);
    contentEl.createEl("h2", { text: "Theoretical lenses" });
    contentEl.createEl("p", {
      text: "Choose the lenses to continue searching with. The rest is material to weigh \u2014 you choose.",
      cls: "consensus-handoff-hint"
    });
    if (this.result.lenses.length > 0) {
      contentEl.createEl("h3", { text: "Lenses (select to search with)" });
      for (const lens of this.result.lenses) {
        new import_obsidian13.Setting(contentEl).setName(`${lens.name}${lens.tradition ? ` \u2014 ${lens.tradition}` : ""}`).setDesc(
          [lens.why && `Why here: ${lens.why}`, lens.predicts && `Predicts: ${lens.predicts}`].filter(Boolean).join(" \xB7 ")
        ).addToggle(
          (t) => t.setValue(this.selected.has(lens.name)).onChange((on) => {
            if (on) this.selected.add(lens.name);
            else this.selected.delete(lens.name);
          })
        );
      }
    }
    this.renderEliminated(contentEl);
    this.renderReadOnly(contentEl, "Same mechanism, different name", this.result.sameMechanism);
    this.renderReadOnly(contentEl, "Conspicuously absent", this.result.absent);
    this.renderReadOnly(contentEl, "Competing explanations", this.result.competing);
    this.renderReadOnly(contentEl, "Cross-domain connections", this.result.crossDomain);
    new import_obsidian13.Setting(contentEl).addButton(
      (b) => b.setButtonText("Research with these lenses").setCta().onClick(() => this.choose("research"))
    ).addButton((b) => b.setButtonText("Insert only").onClick(() => this.choose("insert")));
  }
  renderEliminated(parent) {
    if (this.result.eliminated.length === 0) return;
    parent.createEl("h3", { text: "Tempting but explains little here" });
    const ul = parent.createEl("ul");
    for (const e of this.result.eliminated) ul.createEl("li", { text: `${e.name} \u2014 ${e.reason}` });
  }
  renderReadOnly(parent, heading, items) {
    if (items.length === 0) return;
    parent.createEl("h3", { text: heading });
    const ul = parent.createEl("ul");
    for (const item of items) ul.createEl("li", { text: item });
  }
  choose(action) {
    const lenses = this.result.lenses.map((l) => l.name).filter((n) => this.selected.has(n));
    this.resolve({ action, lenses });
    this.close();
  }
  resolve(choice) {
    if (this.resolved) return;
    this.resolved = true;
    this.onChoice(choice);
  }
  onClose() {
    this.contentEl.empty();
    this.resolve(null);
  }
};

// src/belief.ts
var SYSTEM4 = [
  "You are a careful research assistant confronting the researcher's beliefs with new evidence.",
  "You are given the researcher's current BELIEFS (numbered) and a SYNTHESIS of the literature.",
  "For EACH belief, judge ONLY from the synthesis whether the evidence supports it, speaks against it,",
  "or is neutral/insufficient. Do NOT decide for the researcher \u2014 you propose, they decide.",
  'Return strict JSON: {"proposals":[{"belief":<the belief number>,"verdict":"ondersteunt|spreekt tegen|neutraal",',
  '"reason":"one line, grounded in the synthesis (name what supports/contradicts it)"}]}.',
  "Use 'neutraal' when the synthesis does not really address the belief \u2014 do not force a verdict.",
  "Do NOT invent findings beyond the synthesis. Write the reason in the SAME language as the beliefs.",
  "Respond with strict JSON only."
].join(" ");
function parseBeliefProposals(raw, beliefs, log) {
  const payload = parseJsonObject(raw, "belief", log);
  if (!payload) return [];
  const list = payload.proposals;
  if (!Array.isArray(list)) {
    log == null ? void 0 : log("empty result \u2014 belief: no proposals array");
    return [];
  }
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const entry of list) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry;
    const n = typeof e.belief === "number" ? e.belief : Number(e.belief);
    if (!Number.isInteger(n) || n < 1 || n > beliefs.length || seen.has(n)) continue;
    const v = typeof e.verdict === "string" ? e.verdict.toLowerCase().trim() : "";
    const verdict = v === "ondersteunt" ? "ondersteunt" : v === "spreekt tegen" ? "spreekt tegen" : "neutraal";
    const reason = typeof e.reason === "string" ? e.reason.trim() : "";
    seen.add(n);
    out.push({ claim: beliefs[n - 1].claim, verdict, reason });
  }
  return out;
}
async function confrontBeliefs(beliefs, synthesis, chat, log) {
  if (beliefs.length === 0 || !synthesis.trim()) return [];
  const numbered = beliefs.map((b, i) => `${i + 1}. ${b.claim}`).join("\n");
  const user = `BELIEFS:
${numbered}

SYNTHESIS:
${synthesis}`;
  let raw;
  try {
    raw = await chat(
      [
        { role: "system", content: SYSTEM4 },
        { role: "user", content: user }
      ],
      { json: true, temperature: 0.2 }
    );
  } catch (e) {
    log == null ? void 0 : log("chat failure \u2014 belief", String(e));
    return [];
  }
  return parseBeliefProposals(raw, beliefs, log);
}

// src/belief-modal.ts
var import_obsidian14 = require("obsidian");
function verdictToStatus(verdict) {
  if (verdict === "ondersteunt") return "ondersteund";
  if (verdict === "spreekt tegen") return "weersproken";
  return null;
}
var VERDICT_LABEL = {
  ondersteunt: "Supports",
  "spreekt tegen": "Contradicts",
  neutraal: "Neutral"
};
var BeliefModal = class extends import_obsidian14.Modal {
  constructor(app, proposals, onChoice) {
    super(app);
    this.resolved = false;
    this.selected = /* @__PURE__ */ new Set();
    this.proposals = proposals;
    this.onChoice = onChoice;
  }
  onOpen() {
    const { contentEl } = this;
    applyModalChrome(this);
    contentEl.createEl("h2", { text: "Beliefs against the synthesis" });
    contentEl.createEl("p", {
      text: "The synthesis has been weighed against each belief. Tick what you want to adopt \u2014 nothing changes on its own. You hold the pen.",
      cls: "consensus-handoff-hint"
    });
    const actionable = this.proposals.filter((p) => verdictToStatus(p.verdict));
    const neutral = this.proposals.filter((p) => !verdictToStatus(p.verdict));
    if (actionable.length > 0) {
      contentEl.createEl("h3", { text: "Proposals (select to adopt)" });
      for (const p of actionable) {
        const status = verdictToStatus(p.verdict);
        new import_obsidian14.Setting(contentEl).setName(`${VERDICT_LABEL[p.verdict]}: ${p.claim}`).setDesc([p.reason, status && `\u2192 status: ${status}`].filter(Boolean).join(" \xB7 ")).addToggle(
          (t) => t.setValue(this.selected.has(p.claim)).onChange((on) => {
            if (on) this.selected.add(p.claim);
            else this.selected.delete(p.claim);
          })
        );
      }
    } else {
      contentEl.createEl("p", { text: "No proposals to change a status." });
    }
    if (neutral.length > 0) {
      contentEl.createEl("h3", { text: "Neutral \u2014 the synthesis doesn't touch this" });
      const ul = contentEl.createEl("ul");
      for (const p of neutral) ul.createEl("li", { text: `${p.claim}${p.reason ? ` \u2014 ${p.reason}` : ""}` });
    }
    new import_obsidian14.Setting(contentEl).addButton(
      (b) => b.setButtonText("Adopt selected").setCta().onClick(() => this.apply())
    ).addButton((b) => b.setButtonText("Cancel").onClick(() => this.resolveAndClose(null)));
  }
  apply() {
    const updates = [];
    for (const p of this.proposals) {
      if (!this.selected.has(p.claim)) continue;
      const status = verdictToStatus(p.verdict);
      if (status) updates.push({ claim: p.claim, status });
    }
    this.resolveAndClose(updates);
  }
  resolveAndClose(updates) {
    this.resolve(updates);
    this.close();
  }
  resolve(updates) {
    if (this.resolved) return;
    this.resolved = true;
    this.onChoice(updates);
  }
  onClose() {
    this.contentEl.empty();
    this.resolve(null);
  }
};

// src/confirm-modal.ts
var import_obsidian15 = require("obsidian");
var ConfirmModal = class extends import_obsidian15.Modal {
  constructor(app, title, message, labels, onChoice) {
    super(app);
    this.title = title;
    this.message = message;
    this.labels = labels;
    this.onChoice = onChoice;
    this.resolved = false;
  }
  onOpen() {
    const { contentEl } = this;
    applyModalChrome(this);
    contentEl.createEl("h2", { text: this.title });
    contentEl.createEl("p", { text: this.message });
    new import_obsidian15.Setting(contentEl).addButton((b) => b.setButtonText(this.labels.confirmText).onClick(() => this.choose(true))).addButton((b) => b.setButtonText(this.labels.cancelText).onClick(() => this.choose(false)));
  }
  choose(confirmed) {
    this.resolve(confirmed);
    this.close();
  }
  resolve(confirmed) {
    if (this.resolved) return;
    this.resolved = true;
    this.onChoice(confirmed);
  }
  onClose() {
    this.contentEl.empty();
    this.resolve(false);
  }
};

// src/search-strategy.ts
function renderSearchStrategy(s) {
  var _a;
  const lines = [];
  const providerLabels = s.providers.map((id) => getProvider(id).label);
  lines.push("*Bronnen*");
  lines.push(providerLabels.length ? `- ${providerLabels.join(", ")}` : "- (geen)");
  lines.push("");
  if (s.resumed) {
    lines.push("*Zoektermen*");
    lines.push("- Hervat op eerder gevonden (gecachte) bronnen \u2014 geen nieuwe zoekronde uitgevoerd.");
    lines.push("");
  } else if (s.queries.length > 0) {
    lines.push(`*Zoektermen (${s.queries.length})*`);
    for (const q of s.queries) lines.push(`- ${q}`);
    lines.push("");
    if (s.seeds.length > 0) {
      lines.push("*Aanvullende zoektermen (uit verkenning/lenzen)*");
      for (const t of s.seeds) lines.push(`- ${t}`);
      lines.push("");
    }
  }
  lines.push("*Selectiecriteria*");
  lines.push(
    `- Relevantie-herordening (embedding-blend) over de gefuseerde kandidaten${s.split ? ", getoetst tegen de deelvragen" : ""}.`
  );
  lines.push("- Beoordeling op basis van titels en abstracts, niet van volledige teksten.");
  if (s.rerankLimit) lines.push(`- Beperkt tot de top ${s.rerankLimit} best scorende bronnen.`);
  if (s.crossSector) {
    lines.push(
      `- Cross-sector transferbewijs toegevoegd${s.transferSectors.length ? ` (sectoren: ${s.transferSectors.join(", ")})` : ""}, apart gelabeld en buiten de synthese gehouden.`
    );
  }
  lines.push("");
  lines.push("*Aantallen (trechter)*");
  if (!s.resumed) lines.push(`- Gefuseerd: ${s.fusedCount} unieke bron(nen)`);
  lines.push(`- Na herordening: ${s.rerankedCount}`);
  lines.push(`- Getoond/behouden: ${s.keptCount}`);
  const failures = ((_a = s.providerFailures) != null ? _a : []).filter((f) => f.failed > 0);
  if (failures.length > 0) {
    lines.push("");
    lines.push("*Zoekfouten per bron*");
    for (const f of failures) {
      const label = getProvider(f.provider).label;
      lines.push(`- ${label}: ${f.failed}/${f.total} zoekactie(s) mislukt (rate limit of netwerkfout).`);
    }
  }
  return lines.join("\n").trimEnd();
}

// src/challenge.ts
var CHALLENGE_DIMENSIONS = [
  "conceptueel",
  "methodologisch",
  "theoretisch",
  "empirisch",
  "praktisch"
];
var MAX_PER_DIMENSION = 2;
var DIMENSION_HINTS = {
  conceptueel: "Is the definition right? Are you justified in calling this an X?",
  methodologisch: "Is this even testable, and how?",
  theoretisch: "Which theory would predict the opposite?",
  empirisch: "What evidence is missing to make this hold?",
  praktisch: "Would a policymaker/practitioner pose the question this way?"
};
var SYSTEM5 = [
  "You are a sharp, fair research supervisor challenging a research question \u2014 to strengthen it, not to win.",
  "Challenge the question along FIVE dimensions, each a different kind of pushback:",
  Object.entries(DIMENSION_HINTS).map(([d, h]) => `- ${d}: ${h}`).join(" "),
  "Give 1\u20132 challenges PER dimension, each with a CONCRETE follow-up action the researcher could take",
  "(reformulate the question / record an assumption as a belief to examine / start a counter-probe).",
  "Also give the sharpest probe as 'inversion': suppose the implied hypothesis is WRONG \u2014 how would you",
  "frame the problem then?",
  'Return strict JSON: {"challenges":[{"dimension":"conceptueel|methodologisch|theoretisch|empirisch|praktisch",',
  '"challenge":"the pointed question","action":"a concrete next step"}],"inversion":"the reframing if the hypothesis is wrong"}.',
  "When BELIEFS are given, aim several challenges squarely at those convictions \u2014 that is where pushback helps most.",
  "Do NOT answer the question, do NOT search literature, do NOT invent findings, sources or citations.",
  "Write in the SAME language as the question. Respond with strict JSON only."
].join(" ");
function isDimension(v) {
  return typeof v === "string" && CHALLENGE_DIMENSIONS.includes(v);
}
function parseChallenges(raw, log) {
  var _a;
  const p = parseJsonObject(raw, "challenge", log);
  if (!p) return null;
  const list = Array.isArray(p.challenges) ? p.challenges : [];
  const out = [];
  const perDim = /* @__PURE__ */ new Map();
  const seen = /* @__PURE__ */ new Set();
  const str = (v) => typeof v === "string" ? v.trim() : "";
  for (const entry of list) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry;
    const dimension = isDimension(e.dimension) ? e.dimension : null;
    const challenge = str(e.challenge);
    if (!dimension || !challenge) continue;
    const used = (_a = perDim.get(dimension)) != null ? _a : 0;
    if (used >= MAX_PER_DIMENSION) continue;
    const key = `${dimension}|${challenge.toLowerCase().replace(/\s+/g, " ")}`;
    if (seen.has(key)) continue;
    seen.add(key);
    perDim.set(dimension, used + 1);
    out.push({ dimension, challenge, action: str(e.action) });
  }
  const inversion = str(p.inversion);
  if (out.length === 0 && !inversion) {
    log == null ? void 0 : log("empty result \u2014 challenge: no challenges and no inversion");
    return null;
  }
  return { challenges: out, inversion };
}
async function challengeFraming(question, beliefs, chat, log) {
  const beliefBlock = beliefs.length > 0 ? `

Current beliefs to push against:
${beliefs.map((b, i) => `${i + 1}. ${b.claim}`).join("\n")}` : "";
  const user = `Research question: ${question}${beliefBlock}`;
  let raw;
  try {
    raw = await chat(
      [
        { role: "system", content: SYSTEM5 },
        { role: "user", content: user }
      ],
      // A little warmth helps the challenges span genuinely different angles.
      { json: true, temperature: 0.5 }
    );
  } catch (e) {
    log == null ? void 0 : log("chat failure \u2014 challenge", String(e));
    return null;
  }
  return parseChallenges(raw, log);
}
var DIMENSION_LABEL = {
  conceptueel: "Conceptueel",
  methodologisch: "Methodologisch",
  theoretisch: "Theoretisch",
  empirisch: "Empirisch",
  praktisch: "Praktisch"
};
function buildChallengeBody(result) {
  var _a;
  const lines = [];
  for (const dim of CHALLENGE_DIMENSIONS) {
    const items = result.challenges.filter((c) => c.dimension === dim);
    if (items.length === 0) continue;
    lines.push(`*${(_a = DIMENSION_LABEL[dim]) != null ? _a : dim}*`);
    for (const c of items) lines.push(`- ${c.challenge}${c.action ? ` \u2014 _actie: ${c.action}_` : ""}`);
    lines.push("");
  }
  if (result.inversion) {
    lines.push("*Als je hypothese onjuist is\u2026*");
    lines.push(result.inversion);
  }
  return lines.join("\n").trimEnd();
}
function challengeAdoptionRecord(result, choice) {
  const dimensionByText = new Map(result.challenges.map((c) => [c.challenge, c.dimension]));
  const adopted = choice.adopted.map((text) => {
    var _a;
    return { dimension: (_a = dimensionByText.get(text)) != null ? _a : "", text };
  });
  return { adopted };
}

// src/challenge-modal.ts
var import_obsidian16 = require("obsidian");
var DIMENSION_LABEL2 = {
  conceptueel: "Conceptual",
  methodologisch: "Methodological",
  theoretisch: "Theoretical",
  empirisch: "Empirical",
  praktisch: "Practical"
};
var ChallengeModal = class extends import_obsidian16.Modal {
  constructor(app, result, onChoice) {
    super(app);
    this.resolved = false;
    this.selected = /* @__PURE__ */ new Set();
    this.result = result;
    this.onChoice = onChoice;
  }
  onOpen() {
    var _a;
    const { contentEl } = this;
    applyModalChrome(this);
    contentEl.createEl("h2", { text: "Challenge \u2014 push back on the framing" });
    contentEl.createEl("p", {
      text: "Five kinds of pushback. Tick the ones that land \u2014 I'll record those as beliefs to examine. You decide.",
      cls: "consensus-handoff-hint"
    });
    for (const dim of CHALLENGE_DIMENSIONS) {
      const items = this.result.challenges.filter((c) => c.dimension === dim);
      if (items.length === 0) continue;
      contentEl.createEl("h3", { text: (_a = DIMENSION_LABEL2[dim]) != null ? _a : dim });
      for (const c of items) this.renderChallenge(contentEl, c);
    }
    if (this.result.inversion) {
      contentEl.createEl("h3", { text: "If your hypothesis is wrong\u2026" });
      contentEl.createEl("p", { text: this.result.inversion });
    }
    new import_obsidian16.Setting(contentEl).addButton(
      (b) => b.setButtonText("Record (+ selected as beliefs)").setCta().onClick(() => this.choose("record"))
    ).addButton((b) => b.setButtonText("Insert only").onClick(() => this.choose("insert")));
  }
  renderChallenge(parent, c) {
    new import_obsidian16.Setting(parent).setName(c.challenge).setDesc(c.action ? `Action: ${c.action}` : "").addToggle(
      (t) => t.setValue(this.selected.has(c.challenge)).onChange((on) => {
        if (on) this.selected.add(c.challenge);
        else this.selected.delete(c.challenge);
      })
    );
  }
  choose(action) {
    const adopted = this.result.challenges.map((c) => c.challenge).filter((t) => this.selected.has(t));
    this.resolve({ action, adopted });
    this.close();
  }
  resolve(choice) {
    if (this.resolved) return;
    this.resolved = true;
    this.onChoice(choice);
  }
  onClose() {
    this.contentEl.empty();
    this.resolve(null);
  }
};

// src/research-design.ts
var MAX_AGENDA_ITEMS = 6;
var MAX_DESIGNS = 5;
var SYSTEM6 = [
  "You are a research-design advisor. The literature SYNTHESIS is given; begin where it ends and",
  "think forward toward a concrete research AGENDA. Do NOT re-summarise the synthesis and do NOT",
  "search literature. Return strict JSON of the form:",
  '{"gaps":["knowledge gaps the synthesis exposed"],',
  '"limitations":["recurring METHODOLOGICAL limitations in the evidence (design, measurement, sampling)"],',
  '"new_questions":["sharp NEW research questions that arise FROM the synthesis"],',
  '"designs":[{"design":"a fitting study design (e.g. longitudinal cohort, RCT, realist evaluation, mixed methods, natural experiment)","rationale":"why it suits the open questions here"}],',
  '"data":["data sources or measurement instruments that would be needed"]}.',
  "When still-open BELIEFS are given, let the new questions and designs target what would actually",
  "test those convictions. Be concrete and specific to THIS topic \u2014 no generic methods boilerplate.",
  "Write in the SAME language as the synthesis. Do NOT invent findings, sources or citations.",
  "Keep each list to at most 6 (designs at most 5). Respond with strict JSON only."
].join(" ");
function cleanList3(raw, max) {
  if (!Array.isArray(raw)) return [];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const v of raw) {
    const s = typeof v === "string" ? v.trim() : "";
    if (!s) continue;
    const key = s.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= max) break;
  }
  return out;
}
function parseDesigns(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const str = (v) => typeof v === "string" ? v.trim() : "";
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry;
    const design = str(e.design);
    if (!design) continue;
    const key = design.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ design, rationale: str(e.rationale) });
    if (out.length >= MAX_DESIGNS) break;
  }
  return out;
}
function parseResearchAgenda(raw, log) {
  const p = parseJsonObject(raw, "design", log);
  if (!p) return null;
  const agenda = {
    gaps: cleanList3(p.gaps, MAX_AGENDA_ITEMS),
    limitations: cleanList3(p.limitations, MAX_AGENDA_ITEMS),
    newQuestions: cleanList3(p.new_questions, MAX_AGENDA_ITEMS),
    designs: parseDesigns(p.designs),
    data: cleanList3(p.data, MAX_AGENDA_ITEMS)
  };
  if (agenda.gaps.length === 0 && agenda.newQuestions.length === 0 && agenda.designs.length === 0) {
    log == null ? void 0 : log("empty result \u2014 design: no gaps, new questions or designs");
    return null;
  }
  return agenda;
}
async function proposeResearchDesign(synthesis, beliefs, chat, log) {
  const openBeliefs = beliefs.filter((b) => {
    var _a;
    return ((_a = b.status) != null ? _a : "open") === "open";
  });
  const beliefBlock = openBeliefs.length > 0 ? `

Still-open beliefs to test:
${openBeliefs.map((b, i) => `${i + 1}. ${b.claim}`).join("\n")}` : "";
  const user = `SYNTHESIS:
${synthesis}${beliefBlock}`;
  let raw;
  try {
    raw = await chat(
      [
        { role: "system", content: SYSTEM6 },
        { role: "user", content: user }
      ],
      { json: true, temperature: 0.4 }
    );
  } catch (e) {
    log == null ? void 0 : log("chat failure \u2014 design", String(e));
    return null;
  }
  return parseResearchAgenda(raw, log);
}
function renderResearchAgenda(agenda) {
  const lines = [];
  const section = (heading, items) => {
    if (items.length === 0) return;
    lines.push(`*${heading}*`);
    for (const item of items) lines.push(`- ${item}`);
    lines.push("");
  };
  section("Kennislacunes", agenda.gaps);
  section("Terugkerende methodologische beperkingen", agenda.limitations);
  section("Nieuwe onderzoeksvragen", agenda.newQuestions);
  if (agenda.designs.length > 0) {
    lines.push("*Passende onderzoeksdesigns*");
    for (const d of agenda.designs) lines.push(`- **${d.design}**${d.rationale ? ` \u2014 ${d.rationale}` : ""}`);
    lines.push("");
  }
  section("Benodigde data / meetinstrumenten", agenda.data);
  return lines.join("\n").trimEnd();
}
function agendaAdoptionRecord(agenda, choice) {
  return {
    newQuestions: agenda.newQuestions,
    ...choice.startSessionWith ? { chosenQuestion: choice.startSessionWith } : {}
  };
}

// src/research-design-modal.ts
var import_obsidian17 = require("obsidian");
var ResearchDesignModal = class extends import_obsidian17.Modal {
  constructor(app, agenda, onChoice) {
    super(app);
    this.resolved = false;
    this.picked = null;
    this.agenda = agenda;
    this.onChoice = onChoice;
  }
  onOpen() {
    const { contentEl } = this;
    applyModalChrome(this);
    contentEl.createEl("h2", { text: "Research agenda" });
    contentEl.createEl("p", {
      text: "Where the synthesis ends, the agenda begins. Choose a new question to start a fresh session with \u2014 the loop closes. You decide.",
      cls: "consensus-handoff-hint"
    });
    this.renderList(contentEl, "Kennislacunes", this.agenda.gaps);
    this.renderList(contentEl, "Terugkerende methodologische beperkingen", this.agenda.limitations);
    if (this.agenda.newQuestions.length > 0) {
      contentEl.createEl("h3", { text: "New research questions" });
      const ul = contentEl.createEl("ul");
      for (const q of this.agenda.newQuestions) ul.createEl("li", { text: q });
      new import_obsidian17.Setting(contentEl).setName("Start new session with").setDesc("Optional \u2014 choose one question to open a fresh research session with.").addDropdown((d) => {
        var _a;
        d.addOption("", "\u2014 none \u2014");
        for (const q of this.agenda.newQuestions) d.addOption(q, q.length > 60 ? `${q.slice(0, 57)}\u2026` : q);
        d.setValue((_a = this.picked) != null ? _a : "").onChange((v) => this.picked = v || null);
      });
    }
    if (this.agenda.designs.length > 0) {
      contentEl.createEl("h3", { text: "Fitting research designs" });
      const ul = contentEl.createEl("ul");
      for (const d of this.agenda.designs) ul.createEl("li", { text: `${d.design}${d.rationale ? ` \u2014 ${d.rationale}` : ""}` });
    }
    this.renderList(contentEl, "Benodigde data / meetinstrumenten", this.agenda.data);
    new import_obsidian17.Setting(contentEl).addButton(
      (b) => b.setButtonText("Add agenda to session").setCta().onClick(() => this.choose("record"))
    ).addButton((b) => b.setButtonText("Insert only").onClick(() => this.choose("insert")));
  }
  renderList(parent, heading, items) {
    if (items.length === 0) return;
    parent.createEl("h3", { text: heading });
    const ul = parent.createEl("ul");
    for (const item of items) ul.createEl("li", { text: item });
  }
  choose(action) {
    const choice = { action };
    if (this.picked) choice.startSessionWith = this.picked;
    this.resolve(choice);
    this.close();
  }
  resolve(choice) {
    if (this.resolved) return;
    this.resolved = true;
    this.onChoice(choice);
  }
  onClose() {
    this.contentEl.empty();
    this.resolve(null);
  }
};

// src/deepen.ts
function normalize4(s) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}
function splitSelectionLines(selection) {
  return selection.split("\n").map((l) => l.replace(/^[\s>]*[-*]\s*/, "").replace(/^\s*\d+[.)]\s*/, "").trim()).filter(Boolean);
}
function matchFindings(selection, findings) {
  const lines = splitSelectionLines(selection).map(normalize4);
  if (lines.length === 0) return [];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const f of findings) {
    const claim = normalize4(f.claim);
    if (!claim || seen.has(claim)) continue;
    if (lines.some((line) => line.includes(claim))) {
      out.push(f);
      seen.add(claim);
    }
  }
  return out;
}
function toSingleLine(text) {
  return text.replace(/\s*\n+\s*/g, " ").replace(/\s+/g, " ").trim();
}
function assembleDeepened(selection, items) {
  const used = /* @__PURE__ */ new Set();
  const out = [];
  const pushBlank = () => {
    if (out.length > 0 && out[out.length - 1] !== "") out.push("");
  };
  for (const raw of selection.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    if (line === "") {
      pushBlank();
      continue;
    }
    out.push(line);
    const norm = normalize4(line);
    const item = items.find((it) => !used.has(it.finding) && norm.includes(normalize4(it.finding.claim)));
    if (item && item.text.trim()) {
      used.add(item.finding);
      pushBlank();
      out.push(`	- ${toSingleLine(item.text)}`);
      pushBlank();
    }
  }
  while (out.length > 0 && out[out.length - 1] === "") out.pop();
  return out.join("\n");
}
function resolveSources(finding, papers) {
  const out = [];
  for (const n of finding.sources) {
    const paper = papers[n - 1];
    if (paper) out.push({ n, paper });
  }
  return out;
}
function identifierTail(paper) {
  if (paper.doi) return ` doi:${paper.doi}`;
  if (paper.isbn) return ` isbn:${paper.isbn}`;
  return "";
}
function transferTag(paper) {
  if (paper.sector !== "transfer") return "";
  if (paper.transferSector) return ` [analoog bewijs uit sector: ${paper.transferSector}]`;
  return " [analoog bewijs uit andere sector]";
}
function buildNumberedSources(papers) {
  return papers.map((paper, i) => ({ n: i + 1, paper }));
}
function buildNumberedSourceBlock(sources, opts = {}) {
  const cap = opts.maxAbstractChars;
  return sources.map(({ n, paper }) => {
    var _a, _b, _c, _d;
    const fulltext = (_b = (_a = opts.fulltext) == null ? void 0 : _a[citationKey(paper)]) == null ? void 0 : _b.text;
    let body;
    if (fulltext) {
      body = opts.maxFulltextChars && fulltext.length > opts.maxFulltextChars ? `${fulltext.slice(0, opts.maxFulltextChars).trimEnd()}\u2026` : fulltext;
    } else {
      let abstract = ((_c = paper.abstract) != null ? _c : "").trim();
      if (cap && abstract.length > cap) abstract = `${abstract.slice(0, cap).trimEnd()}\u2026`;
      body = abstract || NO_ABSTRACT_MARKER;
    }
    return `[${n}] ${paper.title} (${(_d = paper.year) != null ? _d : "n.d."}).${identifierTail(paper)}${transferTag(paper)} ${body}`.trim();
  }).join("\n\n");
}
function renderSourceBasis(sources, fulltext) {
  if (!fulltext || sources.length === 0) return "";
  const anyFulltext = sources.some(({ paper }) => {
    var _a;
    return (_a = fulltext[citationKey(paper)]) == null ? void 0 : _a.text;
  });
  if (!anyFulltext) return "";
  const parts = sources.map(({ n, paper }) => {
    var _a;
    return `[${n}] ${((_a = fulltext[citationKey(paper)]) == null ? void 0 : _a.text) ? "volledige tekst" : "abstract"}`;
  });
  return ` *(basis: ${parts.join(", ")})*`;
}
var DEEPEN_SYSTEM = [
  "You add depth to ONE research finding the reader ALREADY has in front of them, using ONLY the provided sources.",
  "Do NOT restate, paraphrase or summarise the finding \u2014 the reader already has it; repeating it is useless.",
  "Go straight to NEW, concrete detail that is NOT already in the finding: the study design and method, the",
  "mechanism, the exact population/conditions, contrasts between studies, and the caveats or limitations \u2014",
  "and any numbers, effect sizes, confidence intervals or sample sizes THAT THE PROVIDED TEXT ACTUALLY STATES \u2014",
  "for most sources below that text is an abstract, but for some it is the source's FULL TEXT (a richer basis;",
  "still only use what it literally says).",
  "CRITICAL \u2014 NO FABRICATION OF QUANTITIES: only state a number, statistic, effect size, sample size, percentage,",
  "p-value or study-design label if it LITERALLY appears in that source's text below. NEVER estimate,",
  "extrapolate, round, infer or invent any quantitative value \u2014 inventing a plausible-looking number is the worst",
  "possible error here. If a source's text gives no such figures, deepen QUALITATIVELY (mechanism, conditions,",
  "contrasts) or say plainly that the source reports no quantitative detail. Do not turn a qualitative study into a",
  "quantitative one. If two sources conflict, say so rather than averaging or inventing a reconciling figure.",
  "Build first on the finding's PRIMARY sources, but you MAY also draw genuinely relevant detail from the OTHER",
  "numbered sources provided \u2014 do NOT drag in sources that are off-topic for THIS finding.",
  "CITE EVERY statement with the [n] number of the source it rests on (primary or other), exactly as given.",
  "A source marked '[analoog bewijs uit andere sector]' is TRANSFER evidence from an analogous sector, not the",
  "question's own domain \u2014 when citing it, say so explicitly (name it as analogous-sector evidence) and NEVER",
  "present it as domain evidence.",
  "A source marked '[no abstract available \u2026]' gives only a title \u2014 do not infer or invent detail from it.",
  "A source's text below may be TRUNCATED (cut off mid-sentence, whether it is an abstract or a full text);",
  "anything past the cutoff \u2014 including figures, tables, and results reported only later in the paper \u2014 is simply",
  "UNAVAILABLE to you. Never assume, extrapolate or guess what a truncated text would have said next.",
  "If the sources genuinely add nothing beyond the finding, say so in ONE short sentence (e.g. 'the sources give",
  "no further quantitative support') instead of padding with a paraphrase.",
  "Never invent findings, sources or citations.",
  "Stay anchored to the ORIGINAL question; do not drift to adjacent topics.",
  "Write ONE compact paragraph in the SAME language as the question \u2014 no line breaks, no bullets, no heading,",
  "no preamble like 'this finding shows'. Lead with the new specifics."
].join(" ");
var DEFAULT_DEEPEN_FULLTEXT_CHARS = 6e3;
async function deepenFinding(question, finding, sources, chat, opts = {}) {
  const primary = finding.sources.length ? finding.sources.map((n) => `[${n}]`).join("") : "none";
  const user = [
    `Original question: ${question}`,
    `Finding to deepen (primary sources: ${primary}): ${finding.claim}`,
    ``,
    `Sources (cite EVERY statement by these [n] numbers; primary ones are ${primary}):`,
    buildNumberedSourceBlock(sources, {
      maxAbstractChars: 700,
      fulltext: opts.fulltext,
      maxFulltextChars: DEFAULT_DEEPEN_FULLTEXT_CHARS
    })
  ].join("\n");
  return chat(
    [
      { role: "system", content: DEEPEN_SYSTEM },
      { role: "user", content: user }
    ],
    { temperature: 0.2 }
  );
}

// src/mistral-provider.ts
function createMistralProvider(getSettings, http) {
  return {
    id: "mistral",
    label: "Mistral",
    capabilities: {
      reasoningEfforts: REASONING_EFFORTS2,
      embed: true,
      listModels: true
    },
    isConfigured: () => getSettings().mistralApiKey.trim().length > 0,
    chat: (messages, opts, meta = {}) => mistralChat(messages, opts, getSettings(), http, {
      log: meta.log,
      label: meta.label,
      reasoningEffort: meta.reasoningEffort
    }),
    embed: (texts, meta = {}) => mistralEmbed(texts, getSettings(), http, { log: meta.log, label: meta.label }),
    listModels: () => mistralListModels(getSettings(), http)
  };
}

// src/openai-compat-api.ts
function isTransientStatus2(status) {
  return status === 429 || status >= 500 && status < 600;
}
function delay3(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
function extractUsage2(payload) {
  if (payload && typeof payload === "object") {
    const usage = payload.usage;
    if (usage && typeof usage === "object") {
      const u = usage;
      const num = (v) => typeof v === "number" ? v : void 0;
      return { prompt: num(u.prompt_tokens), completion: num(u.completion_tokens), total: num(u.total_tokens) };
    }
  }
  return {};
}
function extractChatContent2(payload) {
  if (!payload || typeof payload !== "object") return "";
  const choices = payload.choices;
  if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== "object") return "";
  const message = choices[0].message;
  if (!message || typeof message !== "object") return "";
  const content = message.content;
  return typeof content === "string" ? content.trim() : "";
}
function errorMessage2(payload) {
  var _a, _b;
  if (!payload || typeof payload !== "object") return "";
  const p = payload;
  const raw = (_b = (_a = p.message) != null ? _a : p.detail) != null ? _b : p.error;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const nested = raw.message;
    if (typeof nested === "string") return nested.replace(/\s+/g, " ").trim().slice(0, 200);
  }
  const text = typeof raw === "string" ? raw : raw != null ? JSON.stringify(raw) : "";
  return text.replace(/\s+/g, " ").trim().slice(0, 200);
}
function baseUrl(settings) {
  return (settings.openaiCompatBaseUrl.trim() || "https://api.openai.com/v1").replace(/\/+$/, "");
}
function authHeaders2(settings) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  const key = settings.openaiCompatApiKey.trim();
  if (key) headers.Authorization = `Bearer ${key}`;
  return headers;
}
async function openAiCompatChat(messages, opts, settings, http, net = {}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const model = opts.model || settings.openaiCompatChatModel;
  if (!model.trim()) {
    throw new SearchApiError("Set a chat model for the OpenAI-compatible provider in the plugin settings.", 0);
  }
  const body = { model, messages };
  if (opts.temperature != null) body.temperature = opts.temperature;
  if (opts.json) body.response_format = { type: "json_object" };
  const retries = (_a = net.retries) != null ? _a : 2;
  const networkRetries = (_b = net.networkRetries) != null ? _b : 4;
  const backoffMs = (_c = net.backoffMs) != null ? _c : 800;
  const label = net.label ? `${net.label} ` : "";
  const url = `${baseUrl(settings)}/chat/completions`;
  const headers = authHeaders2(settings);
  for (let attempt = 0; ; attempt++) {
    let status = 0;
    let reason = "";
    try {
      const res = await http({ url, method: "POST", headers, body: JSON.stringify(body) });
      status = res.status;
      if (status >= 200 && status < 300) {
        const usage = extractUsage2(res.json);
        if (usage.total != null) {
          (_f = net.log) == null ? void 0 : _f.call(net, `LLM ${label}(${model}): ${usage.total} tokens (prompt ${(_d = usage.prompt) != null ? _d : "?"}, completion ${(_e = usage.completion) != null ? _e : "?"})`);
          (_g = net.log) == null ? void 0 : _g.addUsage(usage.total);
        }
        return extractChatContent2(res.json);
      }
      reason = errorMessage2(res.json);
    } catch (e) {
      if (attempt >= networkRetries) throw e;
    }
    if (status !== 0 && (!isTransientStatus2(status) || attempt >= retries)) {
      if (reason) (_h = net.log) == null ? void 0 : _h.call(net, `LLM ${label}(${model}): ${status} \u2014 ${reason}`);
      throw new SearchApiError(`Chat request failed (${status}). Check your endpoint/model and connection.`, status);
    }
    const budget = status === 0 ? networkRetries : retries;
    const wait = Math.min(backoffMs * 2 ** attempt, 8e3);
    (_i = net.log) == null ? void 0 : _i.call(net, `LLM ${label}(${model}): ${status || "network error"} \u2014 retry ${attempt + 1}/${budget} in ${wait}ms`);
    if (wait > 0) await delay3(wait);
  }
}
function indexOf2(entry) {
  if (entry && typeof entry === "object") {
    const idx = entry.index;
    if (typeof idx === "number") return idx;
  }
  return 0;
}
function extractEmbeddings2(payload) {
  const out = [];
  if (payload && typeof payload === "object") {
    const data = payload.data;
    if (Array.isArray(data)) {
      const ordered = [...data].sort((a, b) => indexOf2(a) - indexOf2(b));
      for (const entry of ordered) {
        if (entry && typeof entry === "object") {
          const emb = entry.embedding;
          if (Array.isArray(emb)) {
            out.push(emb.filter((x) => typeof x === "number"));
          }
        }
      }
    }
  }
  return out;
}
async function openAiCompatEmbed(texts, settings, http, net = {}) {
  var _a, _b, _c, _d;
  if (texts.length === 0) return [];
  const model = settings.openaiCompatEmbedModel.trim();
  if (!model) {
    throw new SearchApiError("Set an embedding model for the OpenAI-compatible provider in the plugin settings.", 0);
  }
  const retries = (_a = net.retries) != null ? _a : 2;
  const networkRetries = (_b = net.networkRetries) != null ? _b : 4;
  const backoffMs = (_c = net.backoffMs) != null ? _c : 800;
  const url = `${baseUrl(settings)}/embeddings`;
  const headers = authHeaders2(settings);
  const payload = JSON.stringify({ model, input: texts });
  for (let attempt = 0; ; attempt++) {
    let status = 0;
    try {
      const res = await http({ url, method: "POST", headers, body: payload });
      status = res.status;
      if (status >= 200 && status < 300) return extractEmbeddings2(res.json);
    } catch (e) {
      if (attempt >= networkRetries) throw e;
    }
    if (status !== 0 && (!isTransientStatus2(status) || attempt >= retries)) {
      throw new SearchApiError(`Embeddings request failed (${status}). Check your endpoint/model and connection.`, status);
    }
    const budget = status === 0 ? networkRetries : retries;
    const wait = Math.min(backoffMs * 2 ** attempt, 8e3);
    (_d = net.log) == null ? void 0 : _d.call(net, `LLM embed: ${status || "network error"} \u2014 retry ${attempt + 1}/${budget} in ${wait}ms`);
    if (wait > 0) await delay3(wait);
  }
}
function isOpenAiCompatConfigured(settings) {
  return baseUrl(settings).length > 0 && settings.openaiCompatChatModel.trim().length > 0;
}

// src/openai-compat-provider.ts
function createOpenAiCompatProvider(getSettings, http) {
  return {
    id: "openai-compat",
    label: "OpenAI-compatible",
    capabilities: {
      reasoningEfforts: ["off"],
      embed: true,
      listModels: false
    },
    isConfigured: () => isOpenAiCompatConfigured(getSettings()),
    chat: (messages, opts, meta = {}) => openAiCompatChat(messages, opts, getSettings(), http, {
      log: meta.log,
      label: meta.label,
      reasoningEffort: meta.reasoningEffort
    }),
    embed: (texts, meta = {}) => openAiCompatEmbed(texts, getSettings(), http, { log: meta.log, label: meta.label }),
    listModels: () => (
      // No live catalogue fetch for v1 (task scope: "no live catalogue fetch needed").
      // Many endpoints this adapter targets (Ollama) have no consistent listing API worth
      // building a dropdown around yet; the settings UI uses free-text model fields instead.
      // A rejected promise (not a synchronous throw) — `listModels()` is typed to return
      // one, and call sites (e.g. the settings tab's "Refresh model list" button) await it.
      Promise.reject(new SearchApiError("The OpenAI-compatible provider uses free-text model names \u2014 there is no model list to load.", 0))
    )
  };
}

// src/llm-factory.ts
function createLlmProvider(getSettings, http) {
  const mistral = createMistralProvider(getSettings, http);
  const openaiCompat = createOpenAiCompatProvider(getSettings, http);
  const active = () => getSettings().llmProvider === "openai-compat" ? openaiCompat : mistral;
  return {
    get id() {
      return active().id;
    },
    get label() {
      return active().label;
    },
    get capabilities() {
      return active().capabilities;
    },
    isConfigured: () => active().isConfigured(),
    chat: (messages, opts, meta) => active().chat(messages, opts, meta),
    embed: (texts, meta) => active().embed(texts, meta),
    listModels: () => active().listModels()
  };
}

// src/settings-migration.ts
var LEGACY_MODEL_FIELDS = {
  decompose: "routeCModelDecompose",
  framework: "routeCModelFramework",
  synthesis: "routeCModelSynthesis",
  deepen: "routeCModelDeepen",
  crosssector: "routeCModelCrossSector",
  exploration: "routeCModelExploration",
  theory: "routeCModelTheory",
  belief: "routeCModelBelief",
  challenge: "routeCModelChallenge",
  design: "routeCModelDesign"
};
var LEGACY_REASONING_FIELDS = {
  decompose: "routeCReasoningDecompose",
  framework: "routeCReasoningFramework",
  synthesis: "routeCReasoningSynthesis",
  deepen: "routeCReasoningDeepen",
  crosssector: "routeCReasoningCrossSector",
  exploration: "routeCReasoningExploration",
  theory: "routeCReasoningTheory",
  belief: "routeCReasoningBelief",
  challenge: "routeCReasoningChallenge",
  design: "routeCReasoningDesign"
};
function migrateRouteCStepFields(settings, rawLoaded) {
  if (!rawLoaded || typeof rawLoaded !== "object") return settings;
  const raw = rawLoaded;
  const hasLegacy = Object.values(LEGACY_MODEL_FIELDS).some((f) => f in raw) || Object.values(LEGACY_REASONING_FIELDS).some((f) => f in raw);
  if (!hasLegacy) return settings;
  const stepModels = { ...settings.routeCStepModels };
  const stepReasoning = { ...settings.routeCStepReasoning };
  for (const step of Object.keys(LEGACY_MODEL_FIELDS)) {
    const legacyField = LEGACY_MODEL_FIELDS[step];
    const legacyValue = raw[legacyField];
    if (typeof legacyValue === "string" && legacyValue.trim() && !(step in stepModels)) {
      stepModels[step] = legacyValue;
    }
  }
  for (const step of Object.keys(LEGACY_REASONING_FIELDS)) {
    const legacyField = LEGACY_REASONING_FIELDS[step];
    const legacyValue = raw[legacyField];
    if (typeof legacyValue === "string" && legacyValue.trim() && legacyValue !== "off" && !(step in stepReasoning)) {
      stepReasoning[step] = legacyValue;
    }
  }
  const cleaned = settings;
  for (const f of Object.values(LEGACY_MODEL_FIELDS)) delete cleaned[f];
  for (const f of Object.values(LEGACY_REASONING_FIELDS)) delete cleaned[f];
  return { ...settings, routeCStepModels: stepModels, routeCStepReasoning: stepReasoning };
}

// src/register-slices.ts
function distinct(xs) {
  return [...new Set(xs)];
}
function projectsOf(record) {
  return distinct(
    record.occurrences.map((o) => o.project).filter((p) => p != null && p.length > 0)
  );
}
function notesOf(record) {
  return distinct(record.occurrences.map((o) => o.note));
}
function recordLine(record) {
  const authors = formatAuthors(record.authors);
  const yr = record.year != null ? ` (${record.year})` : "";
  const jr = record.journal ? ` *${record.journal}*.` : "";
  const link = record.url ? ` ${record.url}` : "";
  const marker = identifierMarker(record.identifier);
  const tail = marker ? ` ${marker}` : "";
  return `- ${authors}${yr}. ${record.title}.${jr}${link}${tail}`;
}
function byTitle(a, b) {
  return a.title.localeCompare(b.title);
}
function bibliographyForProject(register, project) {
  const records = register.citations.filter((r) => projectsOf(r).includes(project)).sort(byTitle);
  const header = `# Bibliografie \u2014 ${project}

${records.length} referentie(s).`;
  if (records.length === 0) return `${header}

_Geen referenties voor dit project._
`;
  return `${header}

${records.map(recordLine).join("\n")}
`;
}
function findBridgePapers(register) {
  return register.citations.map((record) => ({ record, projects: projectsOf(record), notes: notesOf(record) })).filter((b) => b.notes.length >= 2 && b.projects.length >= 2).sort((a, b) => b.projects.length - a.projects.length || byTitle(a.record, b.record));
}
function bridgePapersMarkdown(register) {
  const bridges = findBridgePapers(register);
  const header = "# Bridge-papers\n\nBronnen die in \u22652 notities \xE9n \u22652 projecten terugkomen \u2014 kandidaat-dwarsverbanden tussen projecten.";
  if (bridges.length === 0) return `${header}

_Nog geen bridge-papers._
`;
  const blocks = bridges.map(
    (b) => `${recordLine(b.record)}
  - projecten: ${b.projects.join(", ")}
  - notities: ${b.notes.join(", ")}`
  );
  return `${header}

${blocks.join("\n")}
`;
}
function authorIndex(register) {
  var _a;
  const map = /* @__PURE__ */ new Map();
  for (const record of register.citations) {
    for (const author of record.authors) {
      const set = (_a = map.get(author)) != null ? _a : /* @__PURE__ */ new Set();
      set.add(record.title);
      map.set(author, set);
    }
  }
  return [...map.entries()].map(([author, titles]) => ({ author, titles: [...titles].sort() })).sort((a, b) => b.titles.length - a.titles.length || a.author.localeCompare(b.author));
}
function orphans(register) {
  return register.citations.filter((r) => r.occurrences.length === 1).sort(byTitle);
}
function crossCutOverview(register) {
  const authors = authorIndex(register);
  const orphanList = orphans(register);
  const parts = ["# Register-doorsnede \u2014 auteurs & wezen"];
  parts.push(`## Auteurs (${authors.length})`);
  parts.push(
    authors.length === 0 ? "_Nog geen auteurs._" : authors.map((a) => `- **${a.author}** \u2014 ${a.titles.length}\xD7: ${a.titles.join("; ")}`).join("\n")
  );
  parts.push(`## Wezen \u2014 \xE9\xE9n keer gebruikt (${orphanList.length})`);
  parts.push(
    orphanList.length === 0 ? "_Geen wezen._" : orphanList.map(recordLine).join("\n")
  );
  return parts.join("\n\n") + "\n";
}
function bibtexEscape(text) {
  return text.replace(/\\/g, "\\textbackslash{}").replace(/[{}]/g, (c) => `\\${c}`).replace(/([%&#_$])/g, "\\$1").replace(/\^/g, "\\textasciicircum{}");
}
function bibtexEntryType(record) {
  if (record.journal) return "article";
  if (record.isbn) return "book";
  return "misc";
}
function firstAuthorLastName(record) {
  var _a, _b;
  const first = (_a = record.authors[0]) == null ? void 0 : _a.trim();
  if (!first) return "unknown";
  const parts = first.split(/\s+/).filter(Boolean);
  const last = (_b = parts[parts.length - 1]) != null ? _b : first;
  return asciiFold(last);
}
var TITLE_STOPWORDS = /* @__PURE__ */ new Set(["a", "an", "the", "of", "on", "in", "and", "or", "to", "for"]);
function firstTitleWord(record) {
  var _a;
  const words = record.title.split(/\s+/).map((w) => asciiFold(w.replace(/[^a-zA-Z0-9]+/g, ""))).filter((w) => w.length > 0 && !TITLE_STOPWORDS.has(w));
  return (_a = words[0]) != null ? _a : "untitled";
}
function asciiFold(s) {
  return s.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "");
}
function baseKey(record) {
  const author = firstAuthorLastName(record) || "unknown";
  const year = record.year != null ? String(record.year) : "nd";
  const word = firstTitleWord(record) || "untitled";
  return `${author}${year}${word}`;
}
function assignCitationKeys(records) {
  var _a;
  const counts = /* @__PURE__ */ new Map();
  const keys = /* @__PURE__ */ new Map();
  for (const record of records) {
    const base = baseKey(record);
    const n = (_a = counts.get(base)) != null ? _a : 0;
    counts.set(base, n + 1);
    keys.set(record, n === 0 ? base : `${base}${String.fromCharCode(96 + n)}`);
  }
  return keys;
}
function field(name, value) {
  if (value == null) return null;
  const text = String(value).trim();
  if (!text) return null;
  return `  ${name} = {${bibtexEscape(text)}}`;
}
function renderBibtexEntry(record, key) {
  const type = bibtexEntryType(record);
  const fields = [
    field("author", record.authors.length ? record.authors.join(" and ") : void 0),
    field("title", record.title),
    field("journal", record.journal),
    field("year", record.year),
    field("doi", record.doi),
    field("isbn", record.isbn),
    field("url", record.url)
  ].filter((f) => f !== null);
  return `@${type}{${key},
${fields.join(",\n")}
}`;
}
function bibtexExport(register) {
  if (register.citations.length === 0) {
    return "% Parallax citation register \u2014 no references recorded yet.\n";
  }
  const keys = assignCitationKeys(register.citations);
  return register.citations.map((record) => {
    var _a;
    return renderBibtexEntry(record, (_a = keys.get(record)) != null ? _a : baseKey(record));
  }).join("\n\n") + "\n";
}

// src/types.ts
var DEFAULT_SETTINGS = {
  provider: "openalex",
  openAlexMailto: "",
  semanticScholarApiKey: "",
  apiKey: "",
  apiBaseUrl: "https://api.consensus.app/v1",
  apiKeyHeader: "X-API-Key",
  resultLimit: 20,
  defaultFormat: "detailed",
  insertQuestionHeading: true,
  includeAbstract: true,
  registerEnabled: true,
  registerPath: ".consensus-research/citations.json",
  llmProvider: "mistral",
  mistralApiKey: "",
  mistralChatModel: "mistral-small-latest",
  mistralEmbedModel: "mistral-embed",
  mistralModelCatalog: [],
  openaiCompatBaseUrl: "https://api.openai.com/v1",
  openaiCompatApiKey: "",
  openaiCompatChatModel: "",
  openaiCompatEmbedModel: "",
  routeCStepModels: {},
  routeCStepReasoning: {},
  routeCMaxResults: 20,
  routeCMinResults: 5,
  routeCKeepRatio: 0.5,
  routeCRelevanceKeep: 0.5,
  routeCFrameworkPhase: false,
  routeCCrossSector: true,
  routeCSubQuestionCheckpoint: false,
  routeCEvidenceWeighting: true,
  routeCClaimCalibration: true,
  routeCAutoDeepen: false,
  routeCReadingTips: true,
  routeCOutputMode: "balanced",
  debugLogging: false
};

// src/main.ts
var DEGRADATION_STEP_LABEL = {
  decompose: "question splitting",
  framework: "theoretical framework",
  crosssector: "cross-sector search",
  synthesis: "synthesis",
  rerank: "rerank"
};
var ParallaxPlugin = class extends import_obsidian18.Plugin {
  constructor() {
    super(...arguments);
    /**
     * Last route C result (with structured synthesis), for "deepen a finding" (E21). `notePath` is
     * the session note it was generated for (or null when framework-only/no session) — consumers
     * that prefer this over a note's own `## Synthese` section must check it matches the ACTIVE
     * note first (A3): otherwise research run in session A leaks into session B's beliefs/design.
     */
    this.lastResearch = null;
    /**
     * Label of the LLM flow currently running (route C research, explore, theory, challenge,
     * confront beliefs, research design), or null when idle (A2/E39 widened). A long search can
     * look frozen, prompting the writer to start another flow — two overlapping runs would then
     * race on the same session-note sections, notice, and debug log. Only one flow may hold this
     * at a time; see {@link beginFlow}/{@link endFlow}.
     */
    this.flowInFlight = null;
    /**
     * Cached search checkpoint (E43): the fused candidate union + context from the last
     * run's search phase, so a dropped connection can resume only the rerank + synthesis
     * without re-fetching. In-memory (survives the session); `at` is for the staleness hint.
     */
    this.researchCache = null;
    /** Platform adapter: wraps Obsidian's requestUrl as HttpRequestFn. */
    this.httpRequest = async (options) => {
      const response = await (0, import_obsidian18.requestUrl)({
        url: options.url,
        method: options.method,
        headers: options.headers,
        body: options.body,
        // Obsidian throws on non-2xx by default; we want to inspect the body.
        throw: false
      });
      return { status: response.status, json: response.json, text: response.text, headers: response.headers };
    };
    /**
     * The active LLM provider (E53), constructed by the factory (`llm-factory.ts`, AU_E77_S3)
     * from `settings.llmProvider`. Bound to live settings + the HTTP adapter, so the pipeline,
     * copilots and settings UI go through one model-agnostic seam regardless of which adapter
     * (Mistral, openai-compat) is active. `settings` isn't assigned yet at field-initializer
     * time (it's set in {@link loadSettings}), so the factory receives a live getter, not a
     * snapshot — the provider always reflects the current settings, including a mid-session
     * provider switch.
     */
    this.llm = createLlmProvider(() => this.settings, this.httpRequest);
    /** The current route C run phase (E56), shown live in the Workbench sidebar; null when idle. */
    this.runPhase = null;
    /**
     * Status-bar mirror of {@link runPhase} (D8/E74, desktop-only — Obsidian hides status-bar
     * items on mobile automatically). Created once in {@link onload}; emptied/hidden when idle.
     */
    this.statusBarEl = null;
    /**
     * Cancellation token for the ACTIVE route C run (D2/E74), or null when nothing is running.
     * Created in {@link runResearchFlow}, cleared in its `finally` — a "Stop current research
     * run" command/button flips it, which the pipeline notices at its next phase boundary.
     */
    this.currentRunCancellation = null;
    /**
     * The last markdown note that was opened/focused (E60). Tracked explicitly because
     * `getActiveFile()` is unreliable once the sidebar is focused; this is the robust fallback for
     * {@link activeNoteFile} so sidebar-triggered commands attach to the right note.
     */
    this.lastMarkdownFile = null;
  }
  /**
   * Claim the single-flow guard for `label`. Returns false (and shows a Notice) when another
   * flow already holds it — the caller must then bail out without doing any work. Mirrors the
   * pre-E39 `researchInFlight` guard, widened to cover every LLM copilot flow, not just route C.
   */
  beginFlow(label) {
    if (this.flowInFlight) {
      new import_obsidian18.Notice(
        `Another Parallax action is still running (${this.flowInFlight}) \u2014 wait for it to finish.`,
        6e3
      );
      return false;
    }
    this.flowInFlight = label;
    return true;
  }
  /** Release the single-flow guard. Safe to call even when nothing is held. */
  endFlow() {
    this.flowInFlight = null;
  }
  /**
   * The repeated ~15-line copilot-flow skeleton (AU_E76_S1, Cluster C1), extracted from the five
   * one-shot divergent copilots (explore/theory/challenge/confront-beliefs/research-design) — NOT
   * from {@link runResearchFlow}, whose guard/cancellation/checkpoint machinery is materially
   * different and stays untouched (its own, later story). Owns exactly: the {@link beginFlow}
   * guard, the logger, the loading Notice, the try/catch/finally around the LLM call (hide the
   * notice + write the debug log + show the error via {@link notifyError} on failure — the ONE
   * place for the copilot flows, D7 — always release the guard), and the success-path debug-log
   * write. Returns null when the guard was already held (the caller must simply bail, having
   * shown nothing itself) OR when `run` threw (the error notice was already shown here) —
   * otherwise `{ result, log }` so the caller can apply its OWN empty-result check and open its
   * OWN modal, which differ per flow and stay call-site-local.
   */
  async runCopilotStep(opts) {
    if (!this.beginFlow(opts.flowLabel)) return null;
    const log = createLogger(this.settings.debugLogging);
    const loading = new import_obsidian18.Notice(opts.loadingText, 0);
    let result;
    try {
      result = await opts.run(log);
    } catch (e) {
      loading.hide();
      await this.writeDebugLog(log, true);
      notifyError(opts.errorPrefix, e, { log });
      return null;
    } finally {
      this.endFlow();
    }
    loading.hide();
    await this.writeDebugLog(log, false);
    return { result, log };
  }
  async onload() {
    this.sessionStore = new SessionStore({ vault: this.app.vault, fileManager: this.app.fileManager });
    this.vaultAdapters = new VaultAdapters({
      app: this.app,
      manifest: this.manifest,
      settings: () => this.settings
    });
    await this.loadSettings();
    await this.loadResearchCache();
    this.statusBarEl = this.addStatusBarItem();
    this.statusBarEl.addClass("consensus-statusbar-phase");
    this.statusBarEl.hide();
    this.lastMarkdownFile = this.app.workspace.getActiveFile();
    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        if (file && file.extension === "md") this.lastMarkdownFile = file;
      })
    );
    this.registerView(WORKBENCH_VIEW_TYPE, (leaf) => new WorkbenchView(leaf, this));
    registerRibbons(this);
    registerCommands(this);
    this.addSettingTab(new ParallaxSettingTab(this.app, this));
  }
  async loadSettings() {
    const loaded = await this.loadData();
    this.settings = migrateRouteCStepFields(Object.assign({}, DEFAULT_SETTINGS, loaded), loaded);
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  /**
   * Set the live route C run phase (E56) and route it to every progress surface: the
   * status-bar item (D8/E74, desktop) and the Workbench sidebar banner (which reads
   * `runPhase` on render). The Notice stays a separate, call-site concern (D8) — it
   * remains the click-dismissable courtesy signal; this is the canonical one.
   */
  setRunPhase(phase) {
    this.runPhase = phase;
    if (this.statusBarEl) {
      if (phase) {
        this.statusBarEl.setText(phase);
        this.statusBarEl.show();
      } else {
        this.statusBarEl.empty();
        this.statusBarEl.hide();
      }
    }
    for (const leaf of this.app.workspace.getLeavesOfType(WORKBENCH_VIEW_TYPE)) {
      const view = leaf.view;
      if (view instanceof WorkbenchView) view.refresh();
    }
  }
  /**
   * Stop-command handler (D2/E74): flips the active run's cancellation token, which the
   * pipeline notices at its next phase boundary and unwinds via {@link ResearchCancelledError}.
   * A no-op (with a Notice) when nothing is running — mirrors {@link resumeResearch}'s guard style.
   * Public: the Workbench sidebar's run-banner Stop button (D2/E74) calls this directly.
   */
  cancelResearch() {
    if (!this.currentRunCancellation || this.currentRunCancellation.cancelled) {
      new import_obsidian18.Notice("No research is running to stop.", 4e3);
      return;
    }
    this.currentRunCancellation.cancel();
    new import_obsidian18.Notice("Stopping research\u2026", 3e3);
  }
  /** Open the question modal, then run the search on submit. Public: called from {@link registerCommands}. */
  promptAndSearch(initialQuery) {
    const provider = getProvider(this.settings.provider);
    if (provider.requiresApiKey && !this.settings.apiKey) {
      new import_obsidian18.Notice(`Set your ${provider.label} API key in the plugin settings first.`);
      return;
    }
    new SearchModal(
      this.app,
      initialQuery,
      provider.supportsMedicalFilters,
      (submission) => {
        if (!submission) return;
        void this.runSearch(submission.query, submission.filters);
      }
    ).open();
  }
  /** Route C: prompt for a question, then run the multi-source AI pipeline. Public: called from {@link registerCommands}. */
  promptAndResearch(initialQuery, opts = {}) {
    var _a;
    if ((opts.frameworkOnly || opts.crossSectorForce) && !this.llm.isConfigured()) {
      const what = opts.frameworkOnly ? "Building a theoretical framework" : "Forcing cross-sector evidence";
      new import_obsidian18.Notice(`${what} needs a Mistral API key \u2014 set it in the plugin settings first.`);
      return;
    }
    const session = (_a = this.activeSession()) == null ? void 0 : _a.session;
    void this.promptSeed(initialQuery).then((seed) => {
      new SearchModal(this.app, seed, false, (submission) => {
        if (!submission) return;
        const extra = session && !opts.frameworkOnly ? unionStrings(session.seeds, session.lenses) : [];
        void this.runResearchFlow(submission.query, submission.filters, {
          ...opts,
          ...extra.length ? { extraSearchTerms: extra } : {}
        });
      }).open();
    });
  }
  /** Exploration Copilot (E42): prompt for a question, then explore it before searching. Public: called from {@link registerCommands}. */
  promptAndExplore(initialQuery) {
    if (!this.llm.isConfigured()) {
      new import_obsidian18.Notice("Exploring the problem needs a Mistral API key \u2014 set it in the plugin settings first.");
      return;
    }
    void this.promptSeed(initialQuery).then((seed) => {
      new SearchModal(this.app, seed, false, (submission) => {
        if (!submission) return;
        void this.runExploreFlow(submission.query, submission.filters);
      }).open();
    });
  }
  /**
   * Run the Exploration Copilot (E42): explore the problem, let the writer pick a
   * framing + search-term seeds, then either continue to route C with those choices
   * or insert an exploration block. Falls back gracefully when nothing usable comes
   * out (the writer can just run route C directly).
   */
  async runExploreFlow(rawQuestion, filters) {
    const question = rawQuestion.trim();
    if (!question) return;
    const step = await this.runCopilotStep({
      flowLabel: "explore",
      loadingText: "Exploring the problem\u2026",
      errorPrefix: "Exploration failed",
      run: (log) => exploreProblem(question, this.llmChatFn("exploration", log), log)
    });
    if (!step) return;
    const { result } = step;
    if (!result) {
      new import_obsidian18.Notice("Could not explore the problem \u2014 feel free to start research directly.", 6e3);
      return;
    }
    new ExplorationModal(this.app, question, result, (choice) => {
      var _a;
      if (!choice) return;
      const session = this.activeSession();
      const file = this.activeNoteFile();
      const hub = !session && file ? parseProjectHub((_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter) : null;
      const target = artefactLandingTarget(!!hub, !!session);
      if (session && target === "session-note") {
        void this.recordExplorationInSession(session.file, question, result, choice);
      } else if (choice.action === "insert") {
        if (hub && file && target === "new-project-session") {
          void this.recordExplorationAsNewProjectSession(file, hub, question, result, choice);
        } else {
          this.insertExplorationBlock(question, result, choice);
        }
      }
      if (choice.action === "research") {
        void this.runResearchFlow(choice.framing, filters, { extraSearchTerms: choice.searchTermSeeds });
      }
    }).open();
  }
  /** Insert a readable exploration block (framing + material + chosen seeds + beliefs) below the cursor. */
  insertExplorationBlock(question, result, choice) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian18.MarkdownView);
    if (!view) {
      new import_obsidian18.Notice("Open a note to insert the exploration into.");
      return;
    }
    const body = buildExplorationBody(result, choice);
    view.editor.replaceSelection(`**Probleemverkenning** \u2014 *${question}*

${body}
`);
    new import_obsidian18.Notice("Exploration inserted.");
  }
  /** Record the exploration artefact + chosen framing/seeds into the active research session (E46). */
  async recordExplorationInSession(file, question, result, choice) {
    if (!await this.confirmArtefactOverwrite(file, "exploration", "exploration")) return;
    const fields = { seeds: choice.searchTermSeeds };
    if (choice.framing && choice.framing !== question) fields.framing = choice.framing;
    await this.sessionStore.setSessionFields(file, fields);
    const newBeliefs = choice.beliefs ? parseBeliefLines(choice.beliefs) : [];
    if (newBeliefs.length > 0) await this.sessionStore.addBeliefs(file, newBeliefs);
    await this.sessionStore.writeSessionSection(file, "exploration", buildExplorationBody(result, choice));
    const chosen = choice.framing && choice.framing !== question ? choice.framing : question;
    const alts = result.questionVariants.length;
    await this.sessionStore.logEvent(
      file,
      "Probleemverkenning",
      `framing gekozen: "${chosen}"${alts ? `; ${alts} alternatieve formulering(en) overwogen` : ""}`
    );
    await this.vaultAdapters.persistSessionArtefactRecord(file, {
      adoptions: { exploration: explorationAdoptionRecord(question, choice) }
    });
    new import_obsidian18.Notice("Exploration added to the session.");
  }
  /**
   * S1 (AU_E86_S1): an Explore run from a project HUB (no active session) that resolves to
   * "insert only" lands in a NEW session note in the project's folder — not as an edit to the
   * hub. Reuses the shared "create session in a hub's project" step ({@link
   * newSessionInHubProject}, AU_E87_S1) to create the note, then the SAME artefact write an
   * existing session gets ({@link recordExplorationInSession}) for the `## Probleemverkenning`
   * section + framing/seeds/beliefs front-matter — the only difference from the session-aware
   * path is that the note is created first.
   */
  async recordExplorationAsNewProjectSession(hubFile, hub, question, result, choice) {
    const created = await this.newSessionInHubProject(hubFile, hub, question);
    if (!created) return;
    new import_obsidian18.Notice(`Exploration landed in a new session: "${created.basename}".`);
    await this.recordExplorationInSession(created, question, result, choice);
  }
  /**
   * The shared "create a fresh session note in a hub's project" step of the landing protocol's
   * regel 2 (AU_E87_S1, docs/artefacten-architectuur.md §2) — factored out of {@link
   * recordExplorationAsNewProjectSession} (E86_S1) so Theory ({@link
   * recordTheoryAsNewProjectSession}) and Challenge ({@link recordChallengeAsNewProjectSession})
   * don't each recompute the project id + folder and call {@link createSessionNote} themselves.
   * Silent (no generic Notice) — the caller shows its own artefact-specific "landed in a new
   * session" Notice right after, then records its own artefact into it exactly as an
   * existing-session run would (the freshly created note has no section yet, so that record call
   * always proceeds — {@link confirmArtefactOverwrite} sees `"absent"`, no ask).
   */
  async newSessionInHubProject(hubFile, hub, question) {
    const projectId = resolveProjectId(hub, hubFile.basename);
    const folder = hubFile.parent && hubFile.parent.path !== "/" ? hubFile.parent.path : "";
    return this.createSessionNote(question, folder, projectId, { silent: true });
  }
  /**
   * Ask before a machine re-run overwrites a hand-edited THINK-artefact section (AU_E87_S2 —
   * bewerkings-respect, docs/artefacten-architectuur.md §3.3). Reads the section's {@link
   * SectionEditState} via {@link SessionStore.sectionEditState}; `needsOverwriteConfirmation`
   * decides whether that state warrants a Replace/Keep {@link ConfirmModal} ("edited"/
   * "unstamped") or a silent proceed ("machine"/"absent", exactly as before this story). Returns
   * false when the researcher chose Keep — the caller then does nothing further (no front-matter
   * merge, no logbook entry, no Notice), so a kept section isn't half-overwritten by its own
   * side-effects; a "kept" Notice explains how to re-run later.
   */
  async confirmArtefactOverwrite(file, headingOrId, artefactLabel) {
    const state = await this.sessionStore.sectionEditState(file, headingOrId);
    if (!needsOverwriteConfirmation(state)) return true;
    const replace = await new Promise((resolve) => {
      new ConfirmModal(
        this.app,
        `Replace your ${artefactLabel}?`,
        "This section looks hand-edited since Parallax last wrote it here. Replacing it drops your edit in favour of the new proposal.",
        { confirmText: "Replace", cancelText: "Keep" },
        resolve
      ).open();
    });
    if (!replace) new import_obsidian18.Notice(`Kept your edited ${artefactLabel} \u2014 run the copilot again to replace it.`, 6e3);
    return replace;
  }
  // ── ResearchSession (E46) ──
  /**
   * The note the user is working in. When a command is triggered from the Workbench SIDEBAR the
   * active *view* is the sidebar (no MarkdownView), and `getActiveFile()` is unreliable in that
   * state — so we fall back to the explicitly-tracked last-opened markdown note ({@link
   * lastMarkdownFile}, E60). That makes "Start research session" attach to whatever note you were
   * just in, including an existing one.
   */
  activeNoteFile() {
    var _a, _b, _c;
    return (_c = (_b = (_a = this.app.workspace.getActiveViewOfType(import_obsidian18.MarkdownView)) == null ? void 0 : _a.file) != null ? _b : this.app.workspace.getActiveFile()) != null ? _c : this.lastMarkdownFile;
  }
  /**
   * The current editor selection, trimmed — used to seed a research/explore prompt (E69, item 5).
   * Reads the active markdown view first; when a command is triggered from the SIDEBAR (so the
   * markdown view is no longer active) it falls back to the last-opened note's view, whose
   * CodeMirror selection is still intact — so "select text → click Ask a question" works there too.
   */
  activeSelection() {
    var _a;
    const active = this.app.workspace.getActiveViewOfType(import_obsidian18.MarkdownView);
    const fromActive = (_a = active == null ? void 0 : active.editor) == null ? void 0 : _a.getSelection().trim();
    if (fromActive) return fromActive;
    if (this.lastMarkdownFile) {
      for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
        const view = leaf.view;
        if (view instanceof import_obsidian18.MarkdownView && view.file === this.lastMarkdownFile) {
          const sel = view.editor.getSelection().trim();
          if (sel) return sel;
        }
      }
    }
    return "";
  }
  /**
   * The seed for a research/explore/theory/challenge prompt: selection > session topic > the active
   * PROJECT's doelstelling (E71). The last fallback means that from a project hub, Explore/Ask start
   * from the project's aim — so the doelstelling becomes the basis for exploration/questions.
   */
  async promptSeed(initialQuery) {
    var _a, _b;
    const topic = sessionTopic((_b = (_a = this.activeSession()) == null ? void 0 : _a.session) != null ? _b : null) || await this.activeProjectObjective();
    return pickPromptSeed(initialQuery, this.activeSelection(), topic);
  }
  /**
   * The active project's `## Doelstelling` (E71) — read from the project HUB (the active note when it
   * is a hub, else the hub whose `project:` matches the active session). "" when none / still the
   * placeholder. This is the project-level aim that can seed exploration and new questions.
   */
  async activeProjectObjective() {
    var _a, _b, _c, _d;
    const file = this.activeNoteFile();
    if (!file) return "";
    const fm = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
    let hubFile = parseProjectHub(fm) ? file : null;
    if (!hubFile) {
      const projectId = (_c = (_b = parseSession(fm)) == null ? void 0 : _b.project) != null ? _c : "";
      if (!projectId) return "";
      for (const f of this.app.vault.getMarkdownFiles()) {
        const h = parseProjectHub((_d = this.app.metadataCache.getFileCache(f)) == null ? void 0 : _d.frontmatter);
        if (h && resolveProjectId(h, f.basename).toLowerCase() === projectId.toLowerCase()) {
          hubFile = f;
          break;
        }
      }
    }
    if (!hubFile) return "";
    const objective = extractSection(await this.app.vault.cachedRead(hubFile), "objective").trim();
    return objective === DOELSTELLING_PLACEHOLDER ? "" : objective;
  }
  /** Mark the active note as a research session (front-matter), prompting for the question. Public: called from {@link registerCommands}. */
  startResearchSession() {
    const file = this.activeNoteFile();
    if (!file) {
      new import_obsidian18.Notice("Open a note to use as the research session.");
      return;
    }
    new SearchModal(this.app, "", false, (submission) => {
      if (!submission) return;
      const question = submission.query.trim();
      if (!question) return;
      void this.app.fileManager.processFrontMatter(file, (fm) => {
        fm[SESSION_FLAG] = true;
        fm.question = question;
        if (!Array.isArray(fm.seeds)) fm.seeds = [];
        if (!Array.isArray(fm.lenses)) fm.lenses = [];
        if (!Array.isArray(fm.beliefs)) fm.beliefs = [];
      }).then(() => new import_obsidian18.Notice("Research session started \u2014 the copilots now write into this note.")).catch((e) => notifyError("Starting the session", e));
    }).open();
  }
  /** The active note + its parsed session, iff it is a research session — else null. */
  activeSession() {
    var _a;
    const file = this.activeNoteFile();
    if (!file) return null;
    const session = parseSession((_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter);
    return session ? { file, session } : null;
  }
  // ── Belief layer (E47) ──
  /**
   * Belief layer (E47, choice 2A — propose-only): confront the active session's beliefs with the
   * latest synthesis. The model judges each belief (supports / contradicts / neutral); the writer
   * ticks which proposals to apply. Nothing changes on its own — the researcher holds the pen.
   * Public: called from {@link registerCommands}.
   */
  async confrontBeliefsFlow() {
    var _a, _b, _c, _d, _e;
    if (!this.llm.isConfigured()) {
      new import_obsidian18.Notice("Confronting beliefs needs a Mistral API key \u2014 set it in the plugin settings first.");
      return;
    }
    const active = this.activeSession();
    if (!active) {
      new import_obsidian18.Notice('No research session yet \u2014 run "Start research session" first, then confront your beliefs.');
      return;
    }
    const { file, session } = active;
    if (session.beliefs.length === 0) {
      new import_obsidian18.Notice('No beliefs captured yet \u2014 capture some via "Explore the problem" first, then confront them.');
      return;
    }
    let synthesis = shouldPreferLastResearch((_b = (_a = this.lastResearch) == null ? void 0 : _a.notePath) != null ? _b : null, file.path) ? (_e = (_d = (_c = this.lastResearch) == null ? void 0 : _c.summary) == null ? void 0 : _d.trim()) != null ? _e : "" : "";
    if (!synthesis) synthesis = extractSection(await this.app.vault.read(file), "synthesis");
    if (!synthesis) {
      new import_obsidian18.Notice('No synthesis yet \u2014 run "Ask a question" in this session first, then confront your beliefs.');
      return;
    }
    const step = await this.runCopilotStep({
      flowLabel: "confront beliefs",
      loadingText: "Confronting your beliefs with the synthesis\u2026",
      errorPrefix: "Confronting beliefs failed",
      run: (log) => confrontBeliefs(session.beliefs, synthesis, this.llmChatFn("belief", log), log)
    });
    if (!step) return;
    const { result: proposals } = step;
    if (proposals.length === 0) {
      new import_obsidian18.Notice("The synthesis yielded no proposals for your beliefs.", 6e3);
      return;
    }
    new BeliefModal(this.app, proposals, (updates) => {
      if (!updates || updates.length === 0) return;
      const beforeByClaim = new Map(session.beliefs.map((b) => {
        var _a2;
        return [b.claim.toLowerCase(), (_a2 = b.status) != null ? _a2 : "open"];
      }));
      const transitions = updates.map((u) => {
        var _a2;
        return { claim: u.claim, from: (_a2 = beforeByClaim.get(u.claim.toLowerCase())) != null ? _a2 : "open", to: u.status };
      }).filter((t) => t.from !== t.to);
      void this.sessionStore.applyBeliefs(file, updates).then(async () => {
        const summary = appendBeliefTransitions(
          `${updates.length} overtuiging(en) bijgewerkt na toetsing aan de synthese`,
          transitions
        );
        await this.sessionStore.logEvent(file, "Beliefs", summary);
        new import_obsidian18.Notice(`Updated ${updates.length} belief(s).`);
      });
    }).open();
  }
  // ── Methodologische verantwoording (E48_S2) ──
  /**
   * Generate the methodological account (E48_S2): deterministically assemble the audit-trail
   * artefact from the active session's front-matter + body sections, and write it as a separate,
   * publishable note next to the session (re-generating replaces it — derived/reproducible).
   * No LLM call: the document records the methodological choices, it does not narrate the model.
   * Public: called from {@link registerCommands}.
   */
  async generateMethodologyAccount() {
    const active = this.activeSession();
    if (!active) {
      new import_obsidian18.Notice('No research session yet \u2014 run "Start research session" first, then generate the account.');
      return;
    }
    const { file, session } = active;
    const body = await this.app.vault.read(file);
    const doc = assembleMethodologyAccount(session, body, `[[${file.basename}]]`);
    const folder = file.parent && file.parent.path !== "/" ? `${file.parent.path}/` : "";
    const targetPath = (0, import_obsidian18.normalizePath)(`${folder}${file.basename} \u2014 methodologische verantwoording.md`);
    try {
      const existing = this.app.vault.getAbstractFileByPath(targetPath);
      if (existing instanceof import_obsidian18.TFile) await this.app.vault.modify(existing, doc);
      else await this.app.vault.create(targetPath, doc);
    } catch (e) {
      notifyError("Writing the methodological account", e);
      return;
    }
    const written = this.app.vault.getAbstractFileByPath(targetPath);
    if (written instanceof import_obsidian18.TFile) await this.app.workspace.getLeaf(true).openFile(written);
    await this.sessionStore.logEvent(file, "Verantwoording", "methodologische verantwoording gegenereerd");
    new import_obsidian18.Notice("Methodological account generated.");
  }
  // ── Challenge Copilot (E49) ──
  /** Challenge Copilot (E49): prompt for a question, then challenge its framing. Public: called from {@link registerCommands}. */
  promptAndChallenge(initialQuery) {
    if (!this.llm.isConfigured()) {
      new import_obsidian18.Notice("Challenging the framing needs a Mistral API key \u2014 set it in the plugin settings first.");
      return;
    }
    void this.promptSeed(initialQuery).then((seed) => {
      new SearchModal(this.app, seed, false, (submission) => {
        if (!submission) return;
        void this.runChallengeFlow(submission.query);
      }).open();
    });
  }
  /**
   * Run the Challenge Copilot (E49): challenge the framing along five dimensions (sharper when
   * it pushes against the session's beliefs), let the writer pick which cut, record the artefact
   * and adopt the ticked challenges as open beliefs to examine. Falls back gracefully on failure.
   */
  async runChallengeFlow(rawQuestion) {
    const question = rawQuestion.trim();
    if (!question) return;
    const step = await this.runCopilotStep({
      flowLabel: "challenge",
      loadingText: "Challenging the framing (five dimensions)\u2026",
      errorPrefix: "Challenge failed",
      run: (log) => {
        var _a, _b;
        const beliefs = (_b = (_a = this.activeSession()) == null ? void 0 : _a.session.beliefs) != null ? _b : [];
        return challengeFraming(question, beliefs, this.llmChatFn("challenge", log), log);
      }
    });
    if (!step) return;
    const { result } = step;
    if (!result) {
      new import_obsidian18.Notice("Could not challenge the framing \u2014 feel free to start research directly.", 6e3);
      return;
    }
    new ChallengeModal(this.app, result, (choice) => {
      var _a;
      if (!choice) return;
      const session = this.activeSession();
      const file = this.activeNoteFile();
      const hub = !session && file ? parseProjectHub((_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter) : null;
      const target = artefactLandingTarget(!!hub, !!session);
      if (session && target === "session-note") {
        void this.recordChallengeInSession(session.file, question, result, choice);
      } else if (hub && file && target === "new-project-session") {
        void this.recordChallengeAsNewProjectSession(file, hub, question, result, choice);
      } else if (choice.action === "insert") {
        this.insertChallengeBlock(question, result);
      }
    }).open();
  }
  /** Insert a readable challenge block as an editable artefact (no active session). */
  insertChallengeBlock(question, result) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian18.MarkdownView);
    if (!view) {
      new import_obsidian18.Notice("Open a note to insert the challenge into.");
      return;
    }
    view.editor.replaceSelection(`**Challenge** \u2014 *${question}*

${buildChallengeBody(result)}
`);
    new import_obsidian18.Notice("Challenge inserted.");
  }
  /**
   * S1 (AU_E87_S1): a Challenge run from a project HUB (no active session) lands in a NEW
   * session note in the project's folder, mirroring {@link recordExplorationAsNewProjectSession}
   * via the shared {@link newSessionInHubProject} step.
   */
  async recordChallengeAsNewProjectSession(hubFile, hub, question, result, choice) {
    const created = await this.newSessionInHubProject(hubFile, hub, question);
    if (!created) return;
    new import_obsidian18.Notice(`Challenge landed in a new session: "${created.basename}".`);
    await this.recordChallengeInSession(created, question, result, choice);
  }
  /** Record the challenge artefact + adopt the ticked challenges as open beliefs (E49). */
  async recordChallengeInSession(file, _question, result, choice) {
    if (!await this.confirmArtefactOverwrite(file, "challenge", "challenge")) return;
    await this.sessionStore.writeSessionSection(file, "challenge", buildChallengeBody(result));
    const adopted = choice.adopted.map((claim) => ({ claim, status: "open" }));
    if (adopted.length > 0) await this.sessionStore.addBeliefs(file, adopted);
    await this.sessionStore.logEvent(
      file,
      "Challenge",
      `${result.challenges.length} uitdaging(en)${adopted.length ? `; ${adopted.length} als overtuiging vastgelegd` : ""}`
    );
    await this.vaultAdapters.persistSessionArtefactRecord(file, {
      adoptions: { challenge: challengeAdoptionRecord(result, choice) }
    });
    new import_obsidian18.Notice(
      adopted.length > 0 ? `Challenge added; recorded ${adopted.length} belief(s) to examine.` : "Challenge added to the session."
    );
  }
  // ── Research Design Copilot (E50) ──
  /**
   * Research Design Copilot (E50): begin where the synthesis ends and propose a research agenda
   * (gaps, limitations, new questions, fitting designs, data needs) from the session's synthesis
   * and still-open beliefs. The agenda lands as `## Onderzoeksagenda` (which the methodological
   * account picks up); a chosen new question can open a fresh session, closing the loop.
   * Public: called from {@link registerCommands}.
   */
  async generateResearchDesign() {
    var _a, _b, _c, _d, _e;
    if (!this.llm.isConfigured()) {
      new import_obsidian18.Notice("Proposing a research agenda needs a Mistral API key \u2014 set it in the plugin settings first.");
      return;
    }
    const active = this.activeSession();
    if (!active) {
      new import_obsidian18.Notice('No research session yet \u2014 run "Start research session" first, then propose the agenda.');
      return;
    }
    const { file, session } = active;
    let synthesis = shouldPreferLastResearch((_b = (_a = this.lastResearch) == null ? void 0 : _a.notePath) != null ? _b : null, file.path) ? (_e = (_d = (_c = this.lastResearch) == null ? void 0 : _c.summary) == null ? void 0 : _d.trim()) != null ? _e : "" : "";
    if (!synthesis) synthesis = extractSection(await this.app.vault.read(file), "synthesis");
    if (!synthesis) {
      new import_obsidian18.Notice('No synthesis yet \u2014 run "Ask a question" in this session first, then propose the agenda.');
      return;
    }
    const step = await this.runCopilotStep({
      flowLabel: "research design",
      loadingText: "Deriving a research agenda from the synthesis\u2026",
      errorPrefix: "Research agenda failed",
      run: (log) => proposeResearchDesign(synthesis, session.beliefs, this.llmChatFn("design", log), log)
    });
    if (!step) return;
    const { result: agenda } = step;
    if (!agenda) {
      new import_obsidian18.Notice("Could not derive a research agenda from the synthesis.", 6e3);
      return;
    }
    new ResearchDesignModal(this.app, agenda, (choice) => {
      if (!choice) return;
      if (choice.action === "insert") {
        this.insertResearchAgendaBlock(agenda);
        return;
      }
      void (async () => {
        if (!await this.confirmArtefactOverwrite(file, "agenda", "research agenda")) return;
        await this.sessionStore.writeSessionSection(file, "agenda", renderResearchAgenda(agenda));
        await this.sessionStore.logEvent(
          file,
          "Onderzoeksagenda",
          `${agenda.newQuestions.length} nieuwe onderzoeksvraag/vragen${choice.startSessionWith ? "; nieuwe sessie gestart" : ""}`
        );
        await this.vaultAdapters.persistSessionArtefactRecord(file, {
          adoptions: { agenda: agendaAdoptionRecord(agenda, choice) }
        });
        new import_obsidian18.Notice("Research agenda added to the session.");
        if (choice.startSessionWith) this.startFollowUpResearch(choice.startSessionWith, file, session);
      })();
    }).open();
  }
  /** Insert the agenda as an editable block at the cursor (no active session / insert choice). */
  insertResearchAgendaBlock(agenda) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian18.MarkdownView);
    if (!view) {
      new import_obsidian18.Notice("Open a note to insert the research agenda into.");
      return;
    }
    view.editor.replaceSelection(`**Onderzoeksagenda**

${renderResearchAgenda(agenda)}
`);
    new import_obsidian18.Notice("Research agenda inserted.");
  }
  /**
   * Create a fresh research-session note seeded with `question` in `folderPath` (E50), optionally
   * tied to `project` (front-matter leading — the location is just where it lands, E64). Opens it
   * and returns it, or null on failure. Thin wrapper around {@link SessionStore.createSessionNote}
   * (AU_E76_S1): the note-shaping/write lives there, but opening the leaf stays here since it's a
   * `workspace` concern, and the single try/catch is kept HERE (not split across the two) so a
   * failure during EITHER step is still reported through the one {@link notifyError} call
   * (D7), exactly as before extraction. `opts.silent` (E86_S1) skips the generic "New session
   * created." Notice for callers that show their own, more specific one right after.
   */
  async createSessionNote(question, folderPath, project, opts = {}) {
    try {
      const created = await this.sessionStore.createSessionNote(question, folderPath, project, opts);
      await this.app.workspace.getLeaf(true).openFile(created);
      if (!opts.silent) new import_obsidian18.Notice("New session created.");
      return created;
    } catch (e) {
      notifyError("Creating the new session", e);
      return null;
    }
  }
  /**
   * Start a FOLLOW-UP research (E65) — the fix for "a follow-up was just repetition". A chosen
   * follow-up question/hypothesis becomes its OWN new session note (in the parent's project + folder,
   * linked back), then runs a FRESH search on the new angle — never a resume of the parent's cached
   * papers (which only re-synthesised the same sources and never went looking for the new thing).
   * The parent's seeds + lenses ride along as extra search terms so the new angle is searched IN
   * CONTEXT — the writer doesn't have to keep the main question in the field to preserve it.
   */
  startFollowUpResearch(question, parent, parentSession) {
    const topic = sessionTopic(parentSession);
    const extra = unionStrings(parentSession.seeds, parentSession.lenses);
    const hint = topic ? `Follow-up within "${topic}". The question below is your new angle \u2014 keep and sharpen it, or replace it entirely. The parent session's context is carried into the search automatically; you don't need to keep the main question in there too.` : "This is your new question; the parent session's context is carried into the search automatically.";
    new SearchModal(
      this.app,
      question,
      false,
      (submission) => {
        if (!submission) return;
        void (async () => {
          var _a, _b;
          const created = await this.createSessionNote(
            submission.query,
            (_b = (_a = parent.parent) == null ? void 0 : _a.path) != null ? _b : "",
            parentSession.project || void 0,
            { parent, parentTopic: topic }
          );
          if (!created) return;
          const newSession = {
            project: parentSession.project,
            question: submission.query,
            seeds: [],
            lenses: [],
            beliefs: []
          };
          await this.runResearchFlow(submission.query, submission.filters, {
            sessionOverride: { file: created, session: newSession },
            ...extra.length ? { extraSearchTerms: extra } : {}
          });
        })();
      },
      hint
    ).open();
  }
  /**
   * Launch a follow-up from an aggregated project hypothesis (E66): resolve its source session and
   * start a fresh contextualised follow-up (E65) pre-filled with the hypothesis. Public so the
   * Workbench's project backlog buttons can call it directly (a command can't carry the text).
   */
  async startHypothesisFollowUp(text, sourcePath) {
    var _a;
    const file = this.app.vault.getAbstractFileByPath(sourcePath);
    if (!(file instanceof import_obsidian18.TFile)) {
      new import_obsidian18.Notice("Could not find this hypothesis's source session.");
      return;
    }
    const session = parseSession((_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter);
    if (!session) {
      new import_obsidian18.Notice("This hypothesis's source is no longer a research session.");
      return;
    }
    this.startFollowUpResearch(text, file, session);
  }
  // ── Research project (E64) ──
  /** Start a research project: create its folder + hub (index) note and open the hub. Public: called from {@link registerCommands}. */
  startResearchProject() {
    var _a;
    const file = this.activeNoteFile();
    const fm = file ? (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter : void 0;
    const moveEligible = !!file && file.extension === "md" && noteEligibleForProjectMove(fm, file.path);
    new ProjectModal(this.app, moveEligible, (submission) => {
      if (!submission) return;
      void this.createProject(submission.name, submission.objective, submission.moveNote);
    }).open();
  }
  /**
   * Create the project folder + hub note (front-matter `research-project: true` + `project:`).
   * The hub's FIRST artefact is the project's `## Doelstelling` (E70) — the project-level aim the
   * individual question-sessions operationalise. `moveNote` (E86_S2): move the note the project
   * was started from into the new folder — the moved note stays open (not the hub), since it's
   * what the writer was actually working in.
   */
  async createProject(name, objective = "", moveNote = false) {
    const folder = (0, import_obsidian18.normalizePath)(safeFileName(name).trim() || "Project");
    try {
      if (!this.app.vault.getAbstractFileByPath(folder)) await this.app.vault.createFolder(folder);
      const hubPath = (0, import_obsidian18.normalizePath)(`${folder}/${folder} \u2014 overzicht.md`);
      if (this.app.vault.getAbstractFileByPath(hubPath)) {
        new import_obsidian18.Notice("This project already exists.");
        return;
      }
      const hub = await this.app.vault.create(hubPath, renderProjectHub(name, objective));
      const moved = moveNote ? await this.moveNoteIntoProject(name, folder) : null;
      await this.app.workspace.getLeaf(false).openFile(moved != null ? moved : hub);
      new import_obsidian18.Notice(moved ? `Project "${name}" created \u2014 "${moved.basename}" moved in.` : `Project "${name}" created.`);
    } catch (e) {
      notifyError("Creating the project", e);
    }
  }
  /**
   * S2 (AU_E86_S2): move the ACTIVE note into the just-created project's `folder`, link-safe via
   * {@link SessionStore.moveNoteIntoProject} (`fileManager.renameFile` — Obsidian rewrites
   * backlinks). Re-checks eligibility defensively (the modal already gated the checkbox on it,
   * but the active note can change between opening the modal and submitting it). A name collision
   * at the target path keeps the note where it is — never overwrites — with a clear Notice.
   * Returns the moved file, or null when nothing was moved.
   */
  async moveNoteIntoProject(projectName, folder) {
    var _a;
    const file = this.activeNoteFile();
    if (!file || file.extension !== "md") return null;
    const fm = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
    if (!noteEligibleForProjectMove(fm, file.path)) return null;
    const newPath = (0, import_obsidian18.normalizePath)(`${folder}/${file.name}`);
    if (this.app.vault.getAbstractFileByPath(newPath)) {
      new import_obsidian18.Notice(`A note named "${file.name}" already exists in "${projectName}" \u2014 kept "${file.basename}" where it was.`, 6e3);
      return null;
    }
    await this.sessionStore.moveNoteIntoProject(file, newPath, projectName);
    return file;
  }
  /** Add a new research question (session) to the active project (from its hub or a member note). Public: called from {@link registerCommands}. */
  newProjectSession() {
    var _a, _b;
    const file = this.activeNoteFile();
    if (!file) {
      new import_obsidian18.Notice("Open a project note or a session within the project.");
      return;
    }
    const fm = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
    const hub = parseProjectHub(fm);
    const session = parseSession(fm);
    const projectId = hub ? resolveProjectId(hub, file.basename) : (_b = session == null ? void 0 : session.project) != null ? _b : "";
    if (!projectId) {
      new import_obsidian18.Notice("This note doesn't belong to a project \u2014 start a research project first.");
      return;
    }
    const folder = file.parent && file.parent.path !== "/" ? file.parent.path : "";
    void this.activeProjectObjective().then((objective) => {
      const hint = objective ? "Sharpen the project objective into one concrete research question for this session." : void 0;
      new SearchModal(
        this.app,
        objective,
        false,
        (submission) => {
          if (!submission) return;
          const question = submission.query.trim();
          if (question) void this.createSessionNote(question, folder, projectId);
        },
        hint
      ).open();
    });
  }
  /** Theory Copilot (E45): prompt for a question, then propose theoretical lenses. Public: called from {@link registerCommands}. */
  promptAndTheory(initialQuery) {
    if (!this.llm.isConfigured()) {
      new import_obsidian18.Notice("Proposing theoretical lenses needs a Mistral API key \u2014 set it in the plugin settings first.");
      return;
    }
    void this.promptSeed(initialQuery).then((seed) => {
      new SearchModal(this.app, seed, false, (submission) => {
        if (!submission) return;
        void this.runTheoryFlow(submission.query, submission.filters);
      }).open();
    });
  }
  /**
   * Run the Theory Copilot (E45): propose theoretical lenses (incl. eliminative), let the
   * writer pick which to carry forward, then either run route C with those lenses as extra
   * search terms or insert a theory block. Falls back gracefully when nothing usable comes out.
   */
  async runTheoryFlow(rawQuestion, filters) {
    const question = rawQuestion.trim();
    if (!question) return;
    const step = await this.runCopilotStep({
      flowLabel: "theory",
      loadingText: "Exploring theoretical lenses\u2026",
      errorPrefix: "Theory lenses failed",
      run: (log) => proposeTheory(question, this.llmChatFn("theory", log), log)
    });
    if (!step) return;
    const { result } = step;
    if (!result) {
      new import_obsidian18.Notice("Could not propose theoretical lenses \u2014 feel free to start research directly.", 6e3);
      return;
    }
    new TheoryModal(this.app, result, (choice) => {
      var _a;
      if (!choice) return;
      const session = this.activeSession();
      const file = this.activeNoteFile();
      const hub = !session && file ? parseProjectHub((_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter) : null;
      const target = artefactLandingTarget(!!hub, !!session);
      if (session && target === "session-note") {
        void this.recordTheoryInSession(session.file, result, choice);
      } else if (choice.action === "insert") {
        if (hub && file && target === "new-project-session") {
          void this.recordTheoryAsNewProjectSession(file, hub, question, result, choice);
        } else {
          this.insertTheoryBlock(question, result, choice);
        }
      }
      if (choice.action === "research") {
        void this.runResearchFlow(question, filters, { extraSearchTerms: choice.lenses });
      }
    }).open();
  }
  /** Insert a readable theory block (lenses + eliminative + the rest) as an editable artefact. */
  insertTheoryBlock(question, result, choice) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian18.MarkdownView);
    if (!view) {
      new import_obsidian18.Notice("Open a note to insert the theory lenses into.");
      return;
    }
    view.editor.replaceSelection(`**Theoretische lenzen** \u2014 *${question}*

${buildTheoryBody(result, choice)}
`);
    new import_obsidian18.Notice("Theoretical lenses inserted.");
  }
  /**
   * S1 (AU_E87_S1): a Theory run from a project HUB (no active session) that resolves to
   * "insert only" lands in a NEW session note in the project's folder, mirroring {@link
   * recordExplorationAsNewProjectSession} via the shared {@link newSessionInHubProject} step.
   */
  async recordTheoryAsNewProjectSession(hubFile, hub, question, result, choice) {
    const created = await this.newSessionInHubProject(hubFile, hub, question);
    if (!created) return;
    new import_obsidian18.Notice(`Theoretical lenses landed in a new session: "${created.basename}".`);
    await this.recordTheoryInSession(created, result, choice);
  }
  /** Record the lenses artefact + chosen lenses into the active research session (E46_S2). */
  async recordTheoryInSession(file, result, choice) {
    if (!await this.confirmArtefactOverwrite(file, "lenses", "theoretical lenses")) return;
    if (choice.lenses.length > 0) await this.sessionStore.setSessionFields(file, { lenses: choice.lenses });
    await this.sessionStore.writeSessionSection(file, "lenses", buildTheoryBody(result, choice));
    await this.sessionStore.logEvent(
      file,
      "Theoretische lenzen",
      `${choice.lenses.length} lens(en) gekozen${result.eliminated.length ? `; ${result.eliminated.length} ge\xEBlimineerd` : ""}`
    );
    await this.vaultAdapters.persistSessionArtefactRecord(file, { adoptions: { theory: theoryAdoptionRecord(result, choice) } });
    new import_obsidian18.Notice("Theoretical lenses added to the session.");
  }
  async runResearchFlow(question, filters, opts = {}) {
    var _a, _b, _c, _d, _e, _f;
    if (!question.trim()) return;
    const isResume = !!opts.resumeFrom;
    const reentrant = !!opts.presetFramework;
    if (!reentrant) {
      if (this.flowInFlight) {
        new import_obsidian18.Notice(
          "Research is already running \u2014 wait for it to finish. (A long search phase can look frozen; follow progress in the notice bottom-right.)",
          6e3
        );
        return;
      }
      this.flowInFlight = "research";
    }
    if (!opts.frameworkOnly && !isResume && !reentrant && !opts.sessionOverride && !this.activeSession()) {
      const hubFile = this.activeNoteFile();
      const hub = hubFile ? parseProjectHub((_a = this.app.metadataCache.getFileCache(hubFile)) == null ? void 0 : _a.frontmatter) : null;
      if (hubFile && hub) {
        const created = await this.newSessionInHubProject(hubFile, hub, question);
        if (created) {
          new import_obsidian18.Notice(`Landed in a new session: "${created.basename}".`);
          opts = {
            ...opts,
            sessionOverride: {
              file: created,
              session: { project: resolveProjectId(hub, hubFile.basename), question, seeds: [], lenses: [], beliefs: [] }
            }
          };
        }
      }
    }
    const sessionAtStart = opts.frameworkOnly ? null : (_b = opts.sessionOverride) != null ? _b : this.activeSession();
    const sessionFile = (_c = sessionAtStart == null ? void 0 : sessionAtStart.file) != null ? _c : null;
    const sessionHasBeliefs = ((_d = sessionAtStart == null ? void 0 : sessionAtStart.session.beliefs.length) != null ? _d : 0) > 0;
    const log = createLogger(this.settings.debugLogging);
    const note = isResume ? "Resuming (rerank \u2192 synthesis on the found sources)\u2026" : opts.frameworkOnly ? "Building theoretical framework (construct \u2192 conceptual search \u2192 framework)\u2026" : opts.crossSectorForce ? "Researching with forced cross-sector evidence\u2026" : this.llm.isConfigured() ? "Researching (decompose \u2192 search \u2192 rerank \u2192 synthesise)\u2026" : "Searching OpenAlex + Semantic Scholar (set a Mistral key for AI synthesis)\u2026";
    const loading = new import_obsidian18.Notice(note, 0);
    let activeNotice = loading;
    let stepNumber = 0;
    let lastPhase = null;
    const progress = (phase) => {
      if (phase !== lastPhase) {
        stepNumber += 1;
        lastPhase = phase;
      }
      const labelled = `Step ${stepNumber} \u2014 ${phase}`;
      if (activeNotice) activeNotice.setMessage(labelled);
      else activeNotice = new import_obsidian18.Notice(labelled, 0);
      this.setRunPhase(labelled);
    };
    const cancellation = reentrant && this.currentRunCancellation ? this.currentRunCancellation : createCancellationToken();
    if (!reentrant) this.currentRunCancellation = cancellation;
    const reviewSubQuestions = this.settings.routeCSubQuestionCheckpoint && !opts.frameworkOnly && !isResume ? (subs, framework) => this.reviewSubQuestions(subs, framework, () => {
      activeNotice == null ? void 0 : activeNotice.hide();
      activeNotice = null;
    }) : void 0;
    try {
      const result = await runResearch(question, this.settings, this.httpRequest, this.llm, filters, log, {
        ...opts,
        reviewSubQuestions,
        progress,
        // E43 checkpoint: cache the fused union + context so a dropped connection can resume.
        onSearchComplete: (checkpoint) => {
          this.researchCache = { checkpoint, at: Date.now() };
          void this.persistResearchCache();
        },
        cancellation
      });
      activeNotice == null ? void 0 : activeNotice.hide();
      activeNotice = null;
      if (result.papers.length === 0) {
        await this.writeDebugLog(log, true);
        new import_obsidian18.Notice(
          opts.frameworkOnly ? "Could not build a theoretical framework for that question." : "No papers found for that question."
        );
        return;
      }
      if (opts.frameworkOnly && result.framework) {
        const choice = await this.frameworkHandoff(result.framework);
        if ((choice == null ? void 0 : choice.action) === "research") {
          const preset = {
            framework: { ...result.framework, dimensions: choice.dimensions },
            papers: result.papers
          };
          await this.runResearchFlow(question, filters, { presetFramework: preset });
          return;
        }
        if (choice) result.framework = { ...result.framework, dimensions: choice.dimensions };
      }
      if (this.settings.routeCAutoDeepen && !opts.frameworkOnly && !isResume && result.synthesis && result.summary) {
        const deepening = new import_obsidian18.Notice("Deepening findings\u2026", 0);
        try {
          await this.autoDeepen(
            result,
            log,
            (done, total) => deepening.setMessage(`Deepening findings\u2026 (${done}/${total})`),
            cancellation
          );
        } finally {
          deepening.hide();
        }
      }
      await this.writeDebugLog(log, false);
      if (log.totalUsage > 0) {
        const usageLine = `LLM usage: ~${log.totalUsage} tokens over ${log.callCount} call${log.callCount === 1 ? "" : "s"}.`;
        log(usageLine);
        new import_obsidian18.Notice(usageLine, 6e3);
      }
      if (!opts.frameworkOnly && result.degradations && result.degradations.length > 0) {
        const synthesisDegraded = result.degradations.some((d) => d.step === "synthesis");
        const resumeHint = synthesisDegraded && this.researchCache ? " Run \u201CResume last research\u201D once you're back online \u2014 the found sources are reused." : "";
        const summary = result.degradations.map((d) => `${DEGRADATION_STEP_LABEL[d.step]} (${d.reason})`).join("; ");
        new import_obsidian18.Notice(`Research completed with issues: ${summary}. Details in the debug log.${resumeHint}`, 1e4);
      }
      if (!opts.frameworkOnly && result.summary && (!result.degradations || result.degradations.length === 0)) {
        this.researchCache = null;
        void this.vaultAdapters.clearResearchCache();
      }
      if (!opts.frameworkOnly) this.lastResearch = { ...result, notePath: (_e = sessionFile == null ? void 0 : sessionFile.path) != null ? _e : null };
      if (sessionFile && result.searchStrategy) {
        await this.sessionStore.writeSessionSection(sessionFile, "searchstrategy", renderSearchStrategy(result.searchStrategy));
        await this.vaultAdapters.persistSessionArtefactRecord(sessionFile, { searchStrategy: result.searchStrategy });
      }
      if (sessionFile && result.summary && await this.confirmArtefactOverwrite(sessionFile, "synthesis", "synthesis")) {
        await this.sessionStore.writeSessionSection(sessionFile, "synthesis", result.summary);
        if (result.synthesis) {
          await this.vaultAdapters.persistSessionGraphRecord(sessionFile, result.synthesis, result.papers, result.subQuestions);
        }
        const strat = result.searchStrategy;
        await this.sessionStore.logEvent(
          sessionFile,
          "Onderzoek",
          `synthese over ${(_f = strat == null ? void 0 : strat.keptCount) != null ? _f : result.papers.length} bron(nen)${strat && !strat.resumed ? `; ${strat.queries.length} zoekterm(en)` : ""}`
        );
        new import_obsidian18.Notice("Synthesis added to the session.");
        if (sessionHasBeliefs) new import_obsidian18.Notice('Tip: weigh your beliefs via "Confront beliefs".', 6e3);
      }
      if (log.enabled) new import_obsidian18.Notice('Route C debug written to "Parallax debug.md".', 4e3);
      new ResultsModal(
        this.app,
        result,
        this.settings,
        (papers, format, action) => this.handleResult(result, papers, format, action)
      ).open();
    } catch (e) {
      activeNotice == null ? void 0 : activeNotice.hide();
      activeNotice = null;
      if (e instanceof ResearchCancelledError) {
        new import_obsidian18.Notice("Research cancelled.");
        return;
      }
      notifyError("Research", e, { log });
      await this.writeDebugLog(log, true);
    } finally {
      if (!reentrant) {
        this.endFlow();
        this.setRunPhase(null);
        if (this.currentRunCancellation === cancellation) this.currentRunCancellation = null;
      }
    }
  }
  /**
   * Whether a resumable research cache exists (D5/E78) — so the Workbench sidebar can surface
   * "Resume last research" prominently near the top of the actions panel instead of leaving the
   * rescue path palette-only. Public: called from {@link WorkbenchView}.
   */
  hasResumeCache() {
    return this.researchCache !== null;
  }
  /**
   * Resume the last research (E43): re-run only the rerank + synthesis on the cached
   * candidate union from the last search, without re-fetching. For when a dropped
   * connection killed the embeddings/synthesis but the (expensive) search had succeeded.
   * Public: called from {@link registerCommands}.
   */
  resumeResearch() {
    const cache = this.researchCache;
    if (!cache) {
      new import_obsidian18.Notice("No research to resume \u2014 run \u201CAsk a question\u201D first.", 6e3);
      return;
    }
    if (!this.llm.isConfigured()) {
      new import_obsidian18.Notice("Resuming needs a Mistral API key \u2014 set it in the plugin settings first.");
      return;
    }
    void this.runResearchFlow(cache.checkpoint.question, {}, { resumeFrom: cache.checkpoint });
  }
  /**
   * Open the two-step framework handoff (E22_S4): resolves to the writer's choice
   * (continue to research / insert only, with edited dimensions), or null on cancel.
   */
  frameworkHandoff(framework) {
    return new Promise((resolve) => {
      new FrameworkHandoffModal(this.app, framework, (choice) => resolve(choice)).open();
    });
  }
  /**
   * Open the sub-question review modal (E18_S3) and resolve to the edited list,
   * or null when cancelled. Hides the loading notice while the user edits.
   */
  reviewSubQuestions(subs, framework, onBeforeReview) {
    onBeforeReview();
    return new Promise((resolve) => {
      new SubQuestionReviewModal(this.app, subs, framework, (edited) => resolve(edited)).open();
    });
  }
  /**
   * Deepen the selected finding(s) from the last research (E21). Matches the
   * selection to the structured synthesis, grounds each deepening in that
   * finding's own sources (anchored on their DOI/ISBN via the kept synthesis,
   * not the note's `[n]` ordering) and the original question, then inserts the
   * deeper text below the selection. Public: called from {@link registerCommands}.
   */
  async deepenSelection(editor) {
    var _a, _b, _c, _d, _e;
    if (!this.llm.isConfigured()) {
      new import_obsidian18.Notice("Deepening a finding needs a Mistral API key \u2014 set it in the plugin settings first.");
      return;
    }
    const activeSessionNotePath = (_b = (_a = this.activeSession()) == null ? void 0 : _a.file.path) != null ? _b : null;
    if (!canDeepenFromLastResearch((_d = (_c = this.lastResearch) == null ? void 0 : _c.notePath) != null ? _d : null, activeSessionNotePath)) {
      new import_obsidian18.Notice("The last research belongs to another session \u2014 run research in this session first, then deepen.");
      return;
    }
    const last = this.lastResearch;
    if (!(last == null ? void 0 : last.synthesis) || last.synthesis.findings.length === 0) {
      new import_obsidian18.Notice('Run "Research a question" first \u2014 there are no structured findings to deepen yet.');
      return;
    }
    const selection = editor.getSelection().trim();
    if (!selection) {
      new import_obsidian18.Notice("Select the finding(s) you want to deepen.");
      return;
    }
    const findings = matchFindings(selection, last.synthesis.findings);
    if (findings.length === 0) {
      new import_obsidian18.Notice("No matching findings from the last research in the selection.");
      return;
    }
    const loading = new import_obsidian18.Notice(`Deepening ${findings.length} finding(s)\u2026`, 0);
    const allSources = buildNumberedSources(last.papers);
    const chat = this.llmChatFn();
    const fulltext = await this.fetchOaFulltext(last.papers, (_e = last.synthesis.readingRecommendations) != null ? _e : []);
    const items = [];
    try {
      for (const finding of findings) {
        const raw = (await deepenFinding(last.query, finding, allSources, chat, { fulltext })).trim();
        if (raw) {
          const basis = renderSourceBasis(resolveSources(finding, last.papers), fulltext);
          items.push({ finding, text: linkifyCitations(raw, last.papers) + basis });
        }
      }
    } catch (e) {
      loading.hide();
      notifyError("Deepening", e);
      return;
    }
    loading.hide();
    if (items.length === 0) {
      new import_obsidian18.Notice("Could not deepen the selected finding(s).");
      return;
    }
    editor.replaceSelection(assembleDeepened(selection, items));
    const fulltextSourceCount = Object.values(fulltext).filter((e) => e.text).length;
    this.patchAbstractsDisclosureInEditor(editor, fulltextSourceCount);
    new import_obsidian18.Notice(`Inserted ${items.length} deepening(s).`);
  }
  /**
   * Patch the "gebaseerd op abstracts" disclosure line already written earlier in the note
   * (AU_E81_S2 AC2), once ≥1 of the just-fetched sources rests on full text. A plain line scan
   * over the editor: the manual "Deepen selected finding(s)" command only replaces the
   * SELECTION, not the whole note, so this is the one place still needing to reach a line
   * written by an earlier "Research a question" run. A no-op when the count is 0 or the base
   * line can't be found (e.g. reading tips were off for that run).
   */
  patchAbstractsDisclosureInEditor(editor, fulltextSourceCount) {
    if (fulltextSourceCount <= 0) return;
    for (let i = 0; i < editor.lineCount(); i++) {
      const line = editor.getLine(i);
      if (line.trim() === ABSTRACTS_DISCLOSURE_BASE_LINE) {
        editor.replaceRange(abstractsDisclosureLine(fulltextSourceCount), { line: i, ch: 0 }, { line: i, ch: line.length });
        return;
      }
    }
  }
  /**
   * Best-effort OA-fulltext fetch for the reading-recommendation sources ONLY (AU_E81_S1) —
   * loaded from / persisted to the plugin config folder ({@link VaultAdapters}) so a repeat
   * deepen never refetches. Wired into the deepen flow, not the main research pipeline
   * (AU_E81_S2 AC4): a "Research a question" run never calls this, so its duration/behavior
   * is unchanged. A total failure (cache I/O, an unexpected throw) degrades to "no fulltext" —
   * the caller then simply falls back to abstracts everywhere, same as before this epic.
   */
  async fetchOaFulltext(papers, recommendations, log, cancellation) {
    if (recommendations.length === 0) return {};
    try {
      const cache = await this.vaultAdapters.loadFulltextCache();
      const { cache: next, fetchedCount } = await fetchOaTexts(papers, recommendations, cache, this.httpRequest, {
        cancellation,
        log: (label, data) => log == null ? void 0 : log(`fulltext \u2014 ${label}`, data)
      });
      if (fetchedCount > 0) await this.vaultAdapters.persistFulltextCache(next);
      return next;
    } catch (e) {
      console.warn("Parallax: OA fulltext enrichment failed; falling back to abstracts", e);
      return {};
    }
  }
  /**
   * A chat function bound to the active LLM provider (E53), routing the given step's model and
   * reasoning effort (E30/E34) and — when a logger is supplied — logging token usage. The
   * provider seam means this no longer hard-depends on Mistral.
   */
  llmChatFn(step = "deepen", log) {
    const model = resolveStepModel(this.settings, step);
    return (messages, copts) => {
      var _a;
      return this.llm.chat(
        messages,
        { ...copts, model: (_a = copts.model) != null ? _a : model },
        { log, label: step, reasoningEffort: resolveStepReasoning(this.settings, step) }
      );
    };
  }
  /**
   * Auto-deepen (E27): deepen every finding and splice the deepenings into the
   * rendered synthesis, so the inserted output is already deep. Best-effort —
   * a finding that fails to deepen is skipped.
   *
   * Cancellation (D2/E74): checked BETWEEN findings, not mid-finding — a Stop here keeps
   * whatever findings were already deepened (this runs after the synthesis is already
   * written to `result.summary` in-memory; the caller still writes the session section
   * afterward) and simply stops widening further, rather than discarding partial work.
   * The OA-fulltext fetch (AU_E81_S1) shares the same token, checked between sources.
   */
  async autoDeepen(result, log, onProgress, cancellation) {
    var _a;
    if (!result.synthesis || !result.summary) return;
    const chat = this.llmChatFn("deepen", log);
    const allSources = buildNumberedSources(result.papers);
    const fulltext = await this.fetchOaFulltext(
      result.papers,
      (_a = result.synthesis.readingRecommendations) != null ? _a : [],
      log,
      cancellation
    );
    const items = [];
    const total = result.synthesis.findings.length;
    let done = 0;
    for (const finding of result.synthesis.findings) {
      if (cancellation == null ? void 0 : cancellation.cancelled) break;
      onProgress == null ? void 0 : onProgress(done, total);
      try {
        const raw = (await deepenFinding(result.query, finding, allSources, chat, { fulltext })).trim();
        if (raw) {
          const basis = renderSourceBasis(resolveSources(finding, result.papers), fulltext);
          items.push({ finding, text: linkifyCitations(raw, result.papers) + basis });
        }
      } catch (e) {
      }
      done += 1;
    }
    if (items.length > 0) {
      result.summary = assembleDeepened(result.summary, items);
      const fulltextSourceCount = Object.values(fulltext).filter((e) => e.text).length;
      result.summary = nuanceAbstractsDisclosure(result.summary, fulltextSourceCount);
    }
  }
  /**
   * When debug logging is on, write the route C trace to a vault note (mobile-friendly). Thin
   * wrapper (AU_E76_S1): the get-or-create-then-modify write is {@link VaultAdapters.writeVaultFile};
   * opening the leaf stays here (a `workspace` concern), inside the SAME try/catch as the write so
   * a failure at either step still produces the one "Could not write the debug log" Notice.
   */
  async writeDebugLog(log, openIt) {
    if (!log.enabled || log.lines.length === 0) return;
    const path = "Parallax debug.md";
    const body = `# Parallax debug \u2014 last route C run

${log.lines.map((l) => `- ${l}`).join("\n")}
`;
    try {
      const file = await this.vaultAdapters.writeVaultFile(path, body);
      if (openIt) await this.app.workspace.getLeaf(true).openFile(file);
    } catch (e) {
      notifyError("Writing the debug log", e);
    }
  }
  async runSearch(query, filters) {
    const provider = getProvider(this.settings.provider);
    const loading = new import_obsidian18.Notice(`Searching ${provider.label}\u2026`, 0);
    try {
      const result = await provider.search(query, filters, this.settings, this.httpRequest);
      loading.hide();
      if (result.papers.length === 0) {
        new import_obsidian18.Notice("No papers found for that question.");
        return;
      }
      new ResultsModal(
        this.app,
        result,
        this.settings,
        (papers, format, action) => this.handleResult(result, papers, format, action)
      ).open();
    } catch (e) {
      loading.hide();
      notifyError("Search", e);
    }
  }
  /**
   * Verify the selected papers, format them (with trust markers), then insert
   * or copy — and, on insert, record them in the central register.
   */
  async handleResult(result, papers, format, action) {
    const loading = new import_obsidian18.Notice("Verifying references\u2026", 0);
    await this.verifyPapers(papers);
    loading.hide();
    const markdown = formatResult(result, papers, {
      format,
      insertQuestionHeading: this.settings.insertQuestionHeading,
      includeAbstract: this.settings.includeAbstract
    });
    if (action === "copy") {
      await navigator.clipboard.writeText(markdown);
      new import_obsidian18.Notice("References copied to clipboard.");
      return;
    }
    const view = this.app.workspace.getActiveViewOfType(import_obsidian18.MarkdownView);
    if (!view) {
      new import_obsidian18.Notice("Open a note to insert references into.");
      return;
    }
    view.editor.replaceSelection(markdown);
    new import_obsidian18.Notice("References inserted.");
    if (this.settings.registerEnabled) {
      await this.recordInRegister(papers, view);
    }
  }
  /** Run the identifier check on each paper, attaching its outcome in place. */
  async verifyPapers(papers) {
    for (const paper of papers) {
      const res = await verifyIdentifier(paper, this.httpRequest);
      paper.verification = res.status;
      if (res.doi) paper.doi = res.doi;
      if (res.isbn) paper.isbn = res.isbn;
    }
  }
  /** Upsert the inserted papers into the vault register and surface UC8 hints. */
  async recordInRegister(papers, view) {
    var _a;
    const file = view.file;
    if (!file) return;
    const frontmatter = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
    const project = resolveProject(file.path, frontmatter);
    const store = this.vaultAdapters.vaultStore();
    try {
      const register = await this.vaultAdapters.loadRegisterGuarded(store, this.settings.registerPath);
      const { alreadyUsed } = recordPapers(register, papers, {
        note: file.path,
        project,
        date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
      });
      await this.vaultAdapters.backupBeforeOverwrite(store, this.settings.registerPath);
      await saveRegister(store, this.settings.registerPath, register);
      if (alreadyUsed.length > 0) {
        new import_obsidian18.Notice(formatAlreadyUsed(alreadyUsed), 8e3);
      }
    } catch (e) {
      notifyError("Updating the citation register", e);
    }
  }
  /** Write the resume cache to disk (E43_S2). Thin wrapper over {@link VaultAdapters.persistResearchCache}. */
  async persistResearchCache() {
    await this.vaultAdapters.persistResearchCache(this.researchCache);
  }
  /** Restore the resume cache from disk on load (E43_S2). Thin wrapper over {@link VaultAdapters.loadResearchCache}. */
  async loadResearchCache() {
    const restored = await this.vaultAdapters.loadResearchCache();
    if (restored) this.researchCache = restored;
  }
  // ── Register slices (UC6/UC7/UC9) ──
  /** UC7 — bibliography for the active note's project. Public: called from {@link registerCommands}. */
  async sliceBibliography() {
    var _a, _b;
    const file = (_a = this.app.workspace.getActiveViewOfType(import_obsidian18.MarkdownView)) == null ? void 0 : _a.file;
    if (!file) {
      new import_obsidian18.Notice("Open a note to derive its project from.");
      return;
    }
    const project = resolveProject(file.path, (_b = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _b.frontmatter);
    if (!project) {
      new import_obsidian18.Notice("This note has no project (set frontmatter `project:` or put it in a folder).");
      return;
    }
    const register = await this.loadRegisterSafely();
    await this.writeAndOpenSlice(`bibliografie-${project}`, bibliographyForProject(register, project));
  }
  /** UC6 — sources that bridge ≥2 projects. Public: called from {@link registerCommands}. */
  async sliceBridgePapers() {
    const register = await this.loadRegisterSafely();
    await this.writeAndOpenSlice("bridge-papers", bridgePapersMarkdown(register));
  }
  /** UC9 — author landscape + orphan sources. Public: called from {@link registerCommands}. */
  async sliceOverview() {
    const register = await this.loadRegisterSafely();
    await this.writeAndOpenSlice("register-overzicht", crossCutOverview(register));
  }
  /**
   * BibTeX export (E2 — "Transparantie-kleinood"): the whole citation register as a `.bib`
   * file — the bridge toward a reference manager (roadmap-thema C), not a substitute for one.
   * Public: called from {@link registerCommands}.
   */
  async sliceBibtex() {
    const register = await this.loadRegisterSafely();
    await this.writeAndOpenSlice("register", bibtexExport(register), "bib");
  }
  async loadRegisterSafely() {
    return loadRegister(this.vaultAdapters.vaultStore(), this.settings.registerPath);
  }
  /**
   * Load the citation register (public: read access for the Workbench sidebar's evidence-gaps
   * worklist and source-provenance block, AU_E83). Thin wrapper — same read every register slice
   * already uses.
   */
  async loadRegisterForWorkbench() {
    return this.loadRegisterSafely();
  }
  /**
   * Load the research-graph store (public: read access for the Workbench sidebar, AU_E83) — the
   * same E68 records {@link buildKnowledgeGraphSpike} and the session export already read.
   */
  async loadGraphStoreForWorkbench() {
    return parseGraphStore(await this.vaultAdapters.vaultStore().read(this.vaultAdapters.graphStorePath()));
  }
  // ── Portable artefact-export (AU_E82) ──
  /** Gather the {@link buildSessionExport} inputs for `file`, given its already-parsed `session`. */
  async gatherSessionExportInputs(file, session, body, register, exportedAt) {
    var _a;
    const graphStore = parseGraphStore(await this.vaultAdapters.vaultStore().read(this.vaultAdapters.graphStorePath()));
    return buildSessionExport({
      notePath: file.path,
      project: session.project || null,
      isSession: true,
      question: session.question || null,
      framing: (_a = session.framing) != null ? _a : null,
      seeds: session.seeds,
      lenses: session.lenses,
      beliefs: session.beliefs,
      body,
      graphRecord: recordForNote(graphStore, file.path),
      artefactRecord: artefactRecordForNote(graphStore, file.path),
      register,
      exportedAt,
      sourceLink: `[[${file.basename}]]`
    });
  }
  /**
   * Export the active research session as a portable, deterministic bundle (AU_E82_S2): the
   * JSON export (AU_E82_S1), the methodological account as a self-contained cover, and the
   * BibTeX of its bibliography — written to `Exports/<session>/` and opened. No network calls;
   * the export is local and reproducible apart from the `exportedAt` timestamp.
   * Public: called from {@link registerCommands}.
   */
  async exportSession() {
    const active = this.activeSession();
    if (!active) {
      new import_obsidian18.Notice('No research session yet \u2014 run "Start research session" first, then export it.');
      return;
    }
    const { file, session } = active;
    const body = await this.app.vault.read(file);
    const register = await this.loadRegisterSafely();
    const exportDoc = await this.gatherSessionExportInputs(file, session, body, register, (/* @__PURE__ */ new Date()).toISOString());
    const bibtex = bibtexExport(filterRegisterToNote(register, file.path));
    const files = buildSessionBundleFiles(exportDoc, bibtex);
    const safeName = safeFileName(file.basename).trim() || "sessie";
    const folder = `Exports/${safeName}`;
    try {
      await this.vaultAdapters.ensureFolder(folder);
      let accountFile = null;
      for (const f of files) {
        const written = await this.vaultAdapters.writeVaultFile(`${folder}/${f.relativePath}`, f.content);
        if (f.relativePath === SESSION_EXPORT_ACCOUNT_FILE) accountFile = written;
      }
      if (accountFile) await this.app.workspace.getLeaf(true).openFile(accountFile);
      new import_obsidian18.Notice(`Session exported to "${folder}/".`);
    } catch (e) {
      notifyError(`Writing the session export to "${folder}/"`, e);
    }
  }
  /**
   * Export the active note's PROJECT as one portable bundle (AU_E82_S2): every member session
   * (front-matter `project:` match, E64) gets its own subfolder bundle (same three files as
   * {@link exportSession}), plus a Dutch `index.md` listing them with a per-session artefact-
   * presence summary. Written to `Exports/<project>/` and the index is opened.
   * Public: called from {@link registerCommands}.
   */
  async exportProject() {
    var _a, _b, _c, _d, _e;
    const file = this.activeNoteFile();
    if (!file) {
      new import_obsidian18.Notice("Open a project note or a session within the project.");
      return;
    }
    const fm = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
    const hub = parseProjectHub(fm);
    const projectId = hub ? resolveProjectId(hub, file.basename) : (_c = (_b = parseSession(fm)) == null ? void 0 : _b.project) != null ? _c : "";
    if (!projectId) {
      new import_obsidian18.Notice("This note doesn't belong to a project \u2014 start a research project first.");
      return;
    }
    const memberFiles = [];
    let hubFile = hub ? file : null;
    for (const f of this.app.vault.getMarkdownFiles()) {
      const session = parseSession((_d = this.app.metadataCache.getFileCache(f)) == null ? void 0 : _d.frontmatter);
      if (session && sameProject(session.project, projectId)) memberFiles.push({ file: f, session });
      if (!hubFile) {
        const h = parseProjectHub((_e = this.app.metadataCache.getFileCache(f)) == null ? void 0 : _e.frontmatter);
        if (h && resolveProjectId(h, f.basename).toLowerCase() === projectId.toLowerCase()) hubFile = f;
      }
    }
    if (memberFiles.length === 0) {
      new import_obsidian18.Notice("This project has no session notes to export yet.");
      return;
    }
    let hubObjective = "";
    if (hubFile) {
      const obj = extractSection(await this.app.vault.cachedRead(hubFile), "objective").trim();
      if (obj && obj !== DOELSTELLING_PLACEHOLDER) hubObjective = obj;
    }
    const register = await this.loadRegisterSafely();
    const exportedAt = (/* @__PURE__ */ new Date()).toISOString();
    const safeProject = sanitizePathSegment(projectId).trim() || "project";
    const projectFolder = `Exports/${safeProject}`;
    const usedNames = /* @__PURE__ */ new Set();
    const indexEntries = [];
    try {
      for (const { file: memberFile, session } of memberFiles) {
        const body = await this.app.vault.cachedRead(memberFile);
        const exportDoc = await this.gatherSessionExportInputs(memberFile, session, body, register, exportedAt);
        const bibtex = bibtexExport(filterRegisterToNote(register, memberFile.path));
        const baseName = safeFileName(memberFile.basename).trim() || "sessie";
        let folderName = baseName;
        for (let n = 2; usedNames.has(folderName.toLowerCase()); n++) folderName = `${baseName} (${n})`;
        usedNames.add(folderName.toLowerCase());
        const sessionFolder = `${projectFolder}/${folderName}`;
        await this.vaultAdapters.ensureFolder(sessionFolder);
        for (const f of buildSessionBundleFiles(exportDoc, bibtex)) {
          await this.vaultAdapters.writeVaultFile(`${sessionFolder}/${f.relativePath}`, f.content);
        }
        indexEntries.push({ folderName, title: memberFile.basename, exportDoc });
      }
      const indexMd = buildProjectIndexMarkdown(projectId, indexEntries, hubObjective);
      const indexFile = await this.vaultAdapters.writeVaultFile(`${projectFolder}/${PROJECT_EXPORT_INDEX_FILE}`, indexMd);
      await this.app.workspace.getLeaf(true).openFile(indexFile);
      new import_obsidian18.Notice(`Project exported: ${indexEntries.length} session(s) to "${projectFolder}/".`);
    } catch (e) {
      notifyError(`Writing the project export to "${projectFolder}/"`, e);
    }
  }
  /**
   * Kennisgraph-spike (E67) — read-only projectie van het actieve project naar een getypeerde
   * graph + gap-rapport, geschreven naar een wegwerp-map. Test werkbaarheid (parse-pijn), impact
   * (nut van de gaten) en omvang (JSON-grootte) zonder de schrijf-pipeline te raken.
   * Public: called from {@link registerCommands}.
   */
  async buildKnowledgeGraphSpike() {
    var _a, _b, _c, _d;
    const file = this.activeNoteFile();
    if (!file) {
      new import_obsidian18.Notice("Open a project note or a session within the project.");
      return;
    }
    const fm = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
    const hub = parseProjectHub(fm);
    const projectId = hub ? resolveProjectId(hub, file.basename) : (_c = (_b = parseSession(fm)) == null ? void 0 : _b.project) != null ? _c : "";
    if (!projectId) {
      new import_obsidian18.Notice("This note doesn't belong to a project \u2014 start a research project first.");
      return;
    }
    const notes = [];
    const memberPaths = /* @__PURE__ */ new Set();
    for (const f of this.app.vault.getMarkdownFiles()) {
      const session = parseSession((_d = this.app.metadataCache.getFileCache(f)) == null ? void 0 : _d.frontmatter);
      if (!session || !sameProject(session.project, projectId)) continue;
      notes.push({ path: f.path, title: f.basename, session, body: await this.app.vault.cachedRead(f) });
      memberPaths.add(f.path);
    }
    const register = await this.loadRegisterSafely();
    const sources = [];
    for (const c of register.citations) {
      const inProject = c.occurrences.filter((o) => memberPaths.has(o.note)).map((o) => o.note);
      if (inProject.length > 0) sources.push({ key: c.key, title: c.title, year: c.year, notes: inProject });
    }
    const graphStore = parseGraphStore(await this.vaultAdapters.vaultStore().read(this.vaultAdapters.graphStorePath()));
    const records = graphStore.sessions.filter((r) => memberPaths.has(r.note));
    const graph = buildProjectGraph(projectId, notes, sources, records);
    const gaps = detectGaps(graph);
    const json = JSON.stringify(graph, null, 2);
    const report = renderGraphReport(graph, gaps, json.length);
    const safe = sanitizePathSegment(projectId) || "project";
    const folder = "Kennisgraph (spike)";
    try {
      await this.vaultAdapters.ensureFolder(folder);
      await this.vaultAdapters.writeVaultFile(`${folder}/${safe} \u2014 graph.json`, json);
      const note = await this.vaultAdapters.writeVaultFile(`${folder}/${safe} \u2014 kennisgraph.md`, report);
      await this.app.workspace.getLeaf(true).openFile(note);
      new import_obsidian18.Notice(`Knowledge-graph spike: ${graph.nodes.length} nodes, ${graph.edges.length} edges, ${gaps.length} gap(s).`);
    } catch (e) {
      notifyError(
        `Writing the knowledge-graph spike to "${folder}/" (check that the folder is writable and not synced/locked)`,
        e
      );
    }
  }
  /** Write a slice to a visible vault folder and open it in a new pane. `ext` defaults to "md" (E2: BibTeX export needs ".bib"). */
  async writeAndOpenSlice(name, markdown, ext = "md") {
    const folder = "Citation slices";
    const safeName = sanitizePathSegment(name) || "slice";
    const path = `${folder}/${safeName}.${ext}`;
    try {
      await this.vaultAdapters.ensureFolder(folder);
      const file = await this.vaultAdapters.writeVaultFile(path, markdown);
      await this.app.workspace.getLeaf(true).openFile(file);
    } catch (e) {
      notifyError(`Writing the slice to "${folder}/"`, e);
    }
  }
};
