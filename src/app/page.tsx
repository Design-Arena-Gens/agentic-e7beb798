"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type AddOnOptions = {
  voiceover: boolean;
  dialogue: boolean;
  thumbnail: boolean;
  captions: boolean;
  music: boolean;
};

type GenerationTheme = {
  mood: string;
  emotion: string;
  style: string;
  palette: string;
  lightingTone: string;
  music: string;
};

type Scene = {
  title: string;
  setting: string;
  cameraAngle: string;
  cameraMovement: string;
  characterAction: string;
  lighting: string;
  colors: string;
  atmosphere: string;
  importantObjects: string;
};

type GeneratedPackage = {
  title: string;
  logline: string;
  moodEmotion: string;
  style: string;
  scenes: Scene[];
  fullPrompt: string;
  voiceover?: string[];
  dialogue?: string[];
  thumbnail?: string;
  captions?: string[];
  tags?: string[];
  music?: string;
};

const DEFAULT_ADD_ONS: AddOnOptions = {
  voiceover: true,
  dialogue: false,
  thumbnail: true,
  captions: true,
  music: true,
};

const SAMPLE_IDEAS = [
  "Lonely astronaut mapping the first sunrise on Mars",
  "A phoenix festival reviving a flooded coastal village",
  "Teen street dancer rediscovering rhythm after injury",
];

const STOP_WORDS = new Set([
  "the",
  "and",
  "with",
  "from",
  "into",
  "that",
  "this",
  "over",
  "after",
  "into",
  "their",
  "through",
  "across",
  "about",
  "once",
  "for",
  "your",
  "ours",
  "ourselves",
  "hers",
  "his",
  "her",
  "him",
  "them",
  "they",
  "have",
  "has",
  "had",
  "will",
  "would",
  "could",
  "should",
  "been",
  "being",
  "but",
  "because",
  "while",
  "where",
  "when",
  "amid",
  "amidst",
  "ever",
  "each",
  "such",
  "more",
  "most",
  "make",
  "made",
  "make",
  "makes",
  "every",
  "ever",
  "upon",
  "under",
  "between",
]);

const MOOD_LIBRARY: { keywords: string[]; theme: GenerationTheme }[] = [
  {
    keywords: ["love", "romance", "heart", "wedding", "tender", "affection"],
    theme: {
      mood: "Tender and hopeful",
      emotion: "Warm longing",
      style: "Soft-focus cinematic romance with floating dust motes",
      palette: "Rose gold, blush pink, candlelit ivory tones.",
      lightingTone: "Lantern-like sidelights carve delicate contrast.",
      music: "Gentle piano and airy strings with a slow pulse.",
    },
  },
  {
    keywords: ["battle", "war", "storm", "hero", "rebellion", "uprising"],
    theme: {
      mood: "Epic and relentless",
      emotion: "Fierce resolve",
      style: "High-contrast anamorphic drama with kinetic energy",
      palette: "Gunmetal blues, ember orange, sprayed sparks.",
      lightingTone: "Hard-edged backlights ignite sharp silhouettes.",
      music: "Hybrid orchestral percussion with driving low brass.",
    },
  },
  {
    keywords: ["forest", "wild", "nature", "growth", "rebirth", "earth"],
    theme: {
      mood: "Verdant and restorative",
      emotion: "Quiet awe",
      style: "Lush naturalistic cinematography with macro accents",
      palette: "Emerald greens, moss textures, sunlit amber.",
      lightingTone: "Dappled beams filter through leaves, soft fog drifts.",
      music: "Organic strings, wooden percussion, distant birdsong rhythm.",
    },
  },
  {
    keywords: ["future", "cyber", "neon", "city", "tech", "digital"],
    theme: {
      mood: "Futuristic and electric",
      emotion: "Charged anticipation",
      style: "Neon-drenched cyber cinematic with mirror reflections",
      palette: "Cobalt blues, magenta streaks, chrome highlights.",
      lightingTone: "Vivid signage baths faces in shifting color swells.",
      music: "Synthwave pulses with expansive pads and sub bass.",
    },
  },
  {
    keywords: ["myth", "legend", "ancient", "ritual", "prophecy"],
    theme: {
      mood: "Mythic and reverent",
      emotion: "Sacred intensity",
      style: "Epic widescreen fantasy with textured practical effects",
      palette: "Burnished gold, deep crimson, veiled shadow blues.",
      lightingTone: "Torchlight and dawn halos crown the scene.",
      music: "Choral swells with hand drums and deep horns.",
    },
  },
  {
    keywords: ["city", "urban", "street", "dance", "movement"],
    theme: {
      mood: "Energetic and intimate",
      emotion: "Electric confidence",
      style: "Handheld street cinematography with rhythmic edits",
      palette: "Concrete neutrals contrasted with vapor pink and teal.",
      lightingTone: "Practical streetlights streak across the lens.",
      music: "Percussive beats with textured vocals and bass hits.",
    },
  },
  {
    keywords: ["space", "star", "galaxy", "comet", "astronaut"],
    theme: {
      mood: "Cosmic and contemplative",
      emotion: "Epic wonder",
      style: "Immersive cosmic cinematography with floating debris",
      palette: "Deep indigo, stardust silver, solar flares.",
      lightingTone: "Sharp rimlight from distant suns, ambient nebula glow.",
      music: "Slow-building ambient orchestra with ethereal pads.",
    },
  },
];

const DEFAULT_THEME: GenerationTheme = {
  mood: "Poetic and immersive",
  emotion: "Lyrical momentum",
  style: "Cinematic realism with painterly composition",
  palette: "Muted neutrals enriched with cinematic color accents.",
  lightingTone: "Soft key light balanced by atmospheric backsilhouettes.",
  music: "Textural strings layered with subtle electronic pulses.",
};

const SCENE_BLUEPRINTS = [
  {
    title: "Opening Image",
    setting:
      "Dawn mist reveals {focus}, the horizon breathing awake around every contour.",
    cameraAngle: "Wide aerial frame embracing the full environment.",
    cameraMovement: "Slow, deliberate glide sinking toward the hero.",
    characterAction:
      "Hero absorbs {concept}, shoulders rising with quiet resolve.",
    lightingDetail:
      "Gentle bloom crowns the figure as dust motes shimmer in suspension.",
    colorDetail:
      "Morning desaturations transition into {paletteLower} accents.",
    atmosphereDetail: "Air vibrates with fragile stillness.",
    objectsDetail:
      "Close on a symbolic relic tied to {concept}, warmed by breath.",
  },
  {
    title: "Rising Pulse",
    setting:
      "The world tightens around {focus}, foreground and midground layered in motion.",
    cameraAngle:
      "Handheld shoulder-level shot riding the protagonist's breath.",
    cameraMovement: "Measured forward creep with organic micro jitters.",
    characterAction:
      "Hands trace guiding lines, translating {concept} into motion.",
    lightingDetail:
      "Side light carves bold shapes while shadows deepen and stretch.",
    colorDetail: "Rich midtones ignite against {paletteLower} highlights.",
    atmosphereDetail: "Tempo quickens, tension hums inside the frame.",
    objectsDetail:
      "Holographic or practical overlays illustrate the rhythm of {concept}.",
  },
  {
    title: "Crescendo",
    setting:
      "Storm of movement erupts around {focus}, depth layers pulsing alive.",
    cameraAngle: "Low sweeping angle amplifying scale and raw momentum.",
    cameraMovement: "Dynamic arc orbiting the subject in a single take.",
    characterAction:
      "Hero commits fully, merging with the unstoppable flow of {concept}.",
    lightingDetail:
      "Hard backlights flare across the lens, volumetric beams cut through haze.",
    colorDetail: "High contrast interplay streaks across {paletteLower}.",
    atmosphereDetail: "Adrenaline peaks; every element surges forward.",
    objectsDetail: "Fragments and motifs collide, sculpting {concept}.",
  },
  {
    title: "Resolution",
    setting:
      "Twilight calm settles over {focus}, details breathing with relief.",
    cameraAngle:
      "Intimate close shot with shallow depth pulling focus to the eyes.",
    cameraMovement: "Feather-light dolly-out releasing the final tension.",
    characterAction:
      "Hero exhales and lets {concept} rest gently in open hands.",
    lightingDetail:
      "Soft practicals glow; silhouettes relax into evening shadow.",
    colorDetail: "Muted shadows cradle lingering {paletteLower} sparks.",
    atmosphereDetail: "Silence returns, only distant ambience remains.",
    objectsDetail:
      "Final insert on the symbolic relic, forever changed by {concept}.",
  },
];

const VOICEOVER_BLUEPRINTS = [
  "We wake with {focus}, the whole world holding its breath.",
  "Every heartbeat sketches {concept} in living light.",
  "In the surge, I become the storm of {concept}.",
  "{concept} finally rests; the night remembers for us.",
];

export default function Home() {
  const [idea, setIdea] = useState("");
  const [options, setOptions] = useState<AddOnOptions>(DEFAULT_ADD_ONS);
  const [result, setResult] = useState<GeneratedPackage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedIdea = normalizeIdea(idea);
    if (!normalizedIdea) {
      setResult(null);
      setError("Share an idea so we can shape the cinematic blueprint.");
      return;
    }
    setError(null);
    setResult(generatePackage(normalizedIdea, options));
  };

  const handleToggle = (key: keyof AddOnOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSample = (sample: string) => {
    setIdea(sample);
    setResult(generatePackage(sample, options));
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-910 to-slate-900 px-4 py-12 text-slate-100 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Agentic Prompt Lab
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Craft cinematic text-to-video instructions from any idea.
          </h1>
          <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
            Drop a concept, pick the add-ons you need, and receive a polished
            sequence ready for AI video tools. Each blueprint keeps visuals
            coherent, language punchy, and emotion high.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-8"
        >
          <label className="flex flex-col gap-3 text-sm sm:text-base">
            <span className="text-slate-200">Concept or seed idea</span>
            <textarea
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              placeholder="Example: A drifting lighthouse keeper guiding spectral ships through a midnight storm."
              rows={3}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </label>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-slate-300">
              Optional add-ons
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["voiceover", "Voiceover narration cues"],
                  ["dialogue", "Sample dialogue lines"],
                  ["thumbnail", "Poster & thumbnail prompt"],
                  ["captions", "Captions and tags"],
                  ["music", "Music direction"],
                ] as [keyof AddOnOptions, string][]
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900/60"
                >
                  <input
                    type="checkbox"
                    checked={options[key]}
                    onChange={() => handleToggle(key)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-cyan-400 focus:ring-cyan-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-300">
              Try a sample idea
            </p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_IDEAS.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => handleSample(sample)}
                  className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200 transition hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:text-white"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex max-w-xs items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-cyan-300"
          >
            Generate Blueprint
          </button>

          {error ? (
            <p className="text-sm text-rose-300">{error}</p>
          ) : null}
        </form>

        {result ? (
          <section className="flex flex-col gap-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                Cinematic Blueprint
              </h2>
              <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                Ready for AI video tools
              </span>
            </div>

            <div className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6 sm:grid-cols-2">
              <ConceptLine label="Title" value={result.title} />
              <ConceptLine label="One-line idea" value={result.logline} />
              <ConceptLine label="Mood & emotion" value={result.moodEmotion} />
              <ConceptLine label="Style" value={result.style} />
            </div>

            <div className="flex flex-col gap-5">
              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                Scene Breakdown
              </h3>
              <div className="grid gap-5 lg:grid-cols-2">
                {result.scenes.map((scene) => (
                  <SceneCard key={scene.title} scene={scene} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                Full Text-to-Video Prompt
              </h3>
              <p className="text-sm leading-7 text-slate-200 sm:text-base">
                {result.fullPrompt}
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {result.voiceover ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                  <h4 className="text-lg font-semibold text-white">
                    Voiceover Script
                  </h4>
                  <ul className="flex list-decimal flex-col gap-2 pl-5 text-sm text-slate-200 sm:text-base">
                    {result.voiceover.map((line, index) => (
                      <li key={index} className="marker:text-cyan-300">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {result.dialogue ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                  <h4 className="text-lg font-semibold text-white">
                    Dialogue Moments
                  </h4>
                  <ul className="flex list-none flex-col gap-2 text-sm text-slate-200 sm:text-base">
                    {result.dialogue.map((line, index) => (
                      <li key={index} className="rounded-xl bg-slate-900/60 px-4 py-2">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {result.thumbnail ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                  <h4 className="text-lg font-semibold text-white">
                    Thumbnail & Poster Prompt
                  </h4>
                  <p className="text-sm leading-7 text-slate-200 sm:text-base">
                    {result.thumbnail}
                  </p>
                </div>
              ) : null}

              {result.captions || result.tags ? (
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                  {result.captions ? (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-lg font-semibold text-white">
                        Captions
                      </h4>
                      <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-slate-200 sm:text-base">
                        {result.captions.map((caption, index) => (
                          <li key={index} className="marker:text-cyan-300">
                            {caption}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {result.tags ? (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-lg font-semibold text-white">
                        Tags
                      </h4>
                      <p className="flex flex-wrap gap-2 text-sm text-cyan-200 sm:text-base">
                        {result.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {result.music ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                  <h4 className="text-lg font-semibold text-white">
                    Music Direction
                  </h4>
                  <p className="text-sm leading-7 text-slate-200 sm:text-base">
                    {result.music}
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function ConceptLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-slate-900/50 p-4">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      <p className="text-sm text-slate-100 sm:text-base">{value}</p>
    </div>
  );
}

function SceneCard({ scene }: { scene: Scene }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
      <h4 className="text-lg font-semibold text-cyan-200">{scene.title}</h4>
      <SceneDetail label="Setting" value={scene.setting} />
      <SceneDetail label="Camera angle" value={scene.cameraAngle} />
      <SceneDetail label="Camera movement" value={scene.cameraMovement} />
      <SceneDetail label="Character actions" value={scene.characterAction} />
      <SceneDetail label="Lighting" value={scene.lighting} />
      <SceneDetail label="Colors" value={scene.colors} />
      <SceneDetail label="Atmosphere" value={scene.atmosphere} />
      <SceneDetail label="Important objects" value={scene.importantObjects} />
    </article>
  );
}

function SceneDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        {label}
      </span>
      <p className="text-sm text-slate-100 sm:text-base">{value}</p>
    </div>
  );
}

function generatePackage(idea: string, options: AddOnOptions): GeneratedPackage {
  const theme = deriveTheme(idea);
  const title = buildTitle(idea);
  const logline = buildLogline(idea, theme);
  const moodEmotion = `Mood: ${theme.mood}. Emotion: ${theme.emotion}.`;
  const style = theme.style;
  const scenes = buildScenes(idea, theme);
  const fullPrompt = buildFullPrompt(idea, theme, scenes);
  const keywords = extractKeywords(idea);

  const payload: GeneratedPackage = {
    title,
    logline,
    moodEmotion,
    style,
    scenes,
    fullPrompt,
  };

  if (options.voiceover) {
    payload.voiceover = buildVoiceover(scenes, idea);
  }
  if (options.dialogue) {
    payload.dialogue = buildDialogue(idea);
  }
  if (options.thumbnail) {
    payload.thumbnail = buildThumbnailPrompt(idea, theme);
  }
  if (options.captions) {
    payload.captions = buildCaptions(scenes);
    payload.tags = buildTags(keywords, theme);
  }
  if (options.music) {
    payload.music = buildMusicDirection(theme);
  }

  return payload;
}

function deriveTheme(idea: string): GenerationTheme {
  const lower = idea.toLowerCase();
  for (const entry of MOOD_LIBRARY) {
    if (entry.keywords.some((keyword) => lower.includes(keyword))) {
      return entry.theme;
    }
  }
  return DEFAULT_THEME;
}

function buildTitle(idea: string): string {
  const cleaned = toTitleCase(idea.replace(/[^\w\s]/g, " "));
  if (!cleaned) {
    return "Cinematic Vision — Prompt Blueprint";
  }
  return `${cleaned} — Cinematic Blueprint`;
}

function buildLogline(idea: string, theme: GenerationTheme): string {
  const focus = ensureArticle(toLowerFirst(idea));
  return `A ${theme.mood.toLowerCase()} journey where ${focus} ignites ${theme.emotion.toLowerCase()}.`;
}

function buildScenes(idea: string, theme: GenerationTheme): Scene[] {
  const focus = ensureArticle(toLowerFirst(idea));
  const params = {
    focus,
    concept: toSentenceFragment(idea),
    paletteLower: theme.palette.toLowerCase(),
  };

  return SCENE_BLUEPRINTS.map((template) => ({
    title: template.title,
    setting: finalizeSentence(injectTemplate(template.setting, params)),
    cameraAngle: finalizeSentence(injectTemplate(template.cameraAngle, params)),
    cameraMovement: finalizeSentence(
      injectTemplate(template.cameraMovement, params),
    ),
    characterAction: finalizeSentence(
      injectTemplate(template.characterAction, params),
    ),
    lighting: finalizeSentence(
      `${theme.lightingTone} ${injectTemplate(template.lightingDetail, params)}`,
    ),
    colors: finalizeSentence(
      `${theme.palette} ${injectTemplate(template.colorDetail, params)}`,
    ),
    atmosphere: finalizeSentence(
      injectTemplate(template.atmosphereDetail, params),
    ),
    importantObjects: finalizeSentence(
      injectTemplate(template.objectsDetail, params),
    ),
  }));
}

function buildFullPrompt(
  idea: string,
  theme: GenerationTheme,
  scenes: Scene[],
): string {
  const focus = ensureArticle(toLowerFirst(idea));
  const sentences = [
    `Ultra cinematic storytelling with ${theme.style.toLowerCase()}`,
    `Focus on ${focus}`,
    ...scenes.map(
      (scene, index) =>
        `Scene ${index + 1}: ${scene.setting} ${scene.cameraAngle} ${scene.cameraMovement} ${scene.characterAction} ${scene.lighting} ${scene.colors} ${scene.atmosphere} Important detail: ${scene.importantObjects}`,
    ),
    `${theme.palette}`,
    `Maintain ${theme.mood.toLowerCase()} tone infused with ${theme.emotion.toLowerCase()}`,
    "Keep sentences short and visual, avoid abstract language",
  ];

  return sentences.map(finalizeSentence).join(" ");
}

function buildVoiceover(scenes: Scene[], idea: string): string[] {
  const focus = ensureArticle(toLowerFirst(idea));
  return scenes.map((_, index) => {
    const template =
      VOICEOVER_BLUEPRINTS[index] ?? "We breathe inside {concept}.";
    return finalizeSentence(
      injectTemplate(template, {
        focus,
        concept: toSentenceFragment(idea),
        paletteLower: "",
      }),
    );
  });
}

function buildDialogue(idea: string): string[] {
  const focus = ensureArticle(toLowerFirst(idea));
  const fragment = toSentenceFragment(idea);
  return [
    `Protagonist (whisper): "${capitalizeFirst(
      `I let ${focus} shape every frame.`,
    )}"`,
    `Companion (steady): "${capitalizeFirst(
      `${fragment} belongs to all of us now.`,
    )}"`,
  ];
}

function buildThumbnailPrompt(
  idea: string,
  theme: GenerationTheme,
): string {
  const focus = ensureArticle(toLowerFirst(idea));
  return finalizeSentence(
    `Cinematic poster depicting ${focus} at the story's peak, ${theme.style.toLowerCase()}, ${theme.palette.toLowerCase()} colorway, dramatic rim light, ultra-detailed texture, 3:4 ratio`,
  );
}

function buildCaptions(scenes: Scene[]): string[] {
  return scenes.map(
    (scene, index) =>
      `Scene ${index + 1} — ${scene.title}: ${scene.setting}`,
  );
}

function buildTags(keywords: string[], theme: GenerationTheme): string[] {
  const baseTags = ["cinematic", "texttovideo", "storyboard", "video"];
  const themed = [
    theme.mood.split(" ")[0]?.toLowerCase() ?? "mood",
    theme.emotion.split(" ")[0]?.toLowerCase() ?? "emotion",
  ];
  const keywordTags = keywords.slice(0, 6);
  const set = new Set<string>();
  for (const tag of [...keywordTags, ...baseTags, ...themed]) {
    if (!tag) continue;
    const formatted = `#${tag.replace(/[^a-z0-9]/g, "")}`;
    if (formatted.length > 1) {
      set.add(formatted);
    }
  }
  return Array.from(set).slice(0, 8);
}

function buildMusicDirection(theme: GenerationTheme): string {
  return finalizeSentence(
    `${theme.music} Layer in rising swells that mirror the scene structure and finish with a lingering tail on the resolution.`,
  );
}

function normalizeIdea(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

function toSentenceFragment(value: string): string {
  const trimmed = normalizeIdea(value);
  if (!trimmed) {
    return "the concept";
  }
  return trimmed;
}

function injectTemplate(
  template: string,
  params: { focus: string; concept: string; paletteLower: string },
): string {
  return template
    .replaceAll("{focus}", params.focus)
    .replaceAll("{concept}", params.concept)
    .replaceAll("{paletteLower}", params.paletteLower);
}

function finalizeSentence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (/[.!?]$/.test(trimmed)) {
    return trimmed;
  }
  return `${trimmed}.`;
}

function toTitleCase(value: string): string {
  return normalizeIdea(value)
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function toLowerFirst(value: string): string {
  const trimmed = normalizeIdea(value);
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

function capitalizeFirst(value: string): string {
  const trimmed = normalizeIdea(value);
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function ensureArticle(value: string): string {
  const trimmed = normalizeIdea(value);
  if (!trimmed) {
    return "the concept";
  }
  const lower = trimmed.toLowerCase();
  const articles = ["the", "a", "an", "this", "these", "those", "that"];
  if (articles.some((article) => lower.startsWith(`${article} `))) {
    return trimmed;
  }
  return `the ${trimmed}`;
}

function extractKeywords(value: string): string[] {
  const words = normalizeIdea(value)
    .toLowerCase()
    .match(/\b[a-z]{3,}\b/g);
  if (!words) {
    return [];
  }
  const unique: string[] = [];
  for (const word of words) {
    if (STOP_WORDS.has(word)) continue;
    if (!unique.includes(word)) {
      unique.push(word);
    }
  }
  return unique.slice(0, 8);
}
