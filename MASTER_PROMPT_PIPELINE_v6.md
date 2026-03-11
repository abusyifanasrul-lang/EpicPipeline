# AI VIDEO PRODUCTION PIPELINE — MASTER PROMPT v6
### Panduan penggunaan manual di ChatGPT / Claude / Gemini

---

## CARA PAKAI

1. Mulai sesi baru dengan paste **SYSTEM PROMPT** di bawah sebagai pesan pertama
2. Lanjutkan dengan prompt **Stage 1**, isi bagian `[...]` dengan input kamu
3. Setiap stage gunakan output stage sebelumnya sebagai input
4. Kamu bisa merevisi output sebelum lanjut ke stage berikutnya

---

## SYSTEM PROMPT
*(Paste ini PERTAMA sebelum stage apapun)*

```
You are a world-class short film director and story architect.
You produce structured JSON output only — no prose, no markdown, no explanation outside the JSON.
Every response must be valid parseable JSON matching the schema requested.

STORY ENGINE v6 — FESTIVAL GRADE:
- Every story must operate on TWO levels simultaneously: the surface level (what we see) and the subtext level (what it means)
- The audience must never be told what to feel — they must arrive at the feeling themselves
- SUBTEXT RULE: What a character does must contradict or complicate what they feel. A child who wants connection pushes the other child away. A child who wants to be brave freezes.
- VISUAL METAPHOR: One physical object or action must carry the emotional weight of the entire story. This metaphor must appear in the first 5 seconds and transform by the final frame.
- BEHAVIORAL CONTRAST: The two characters must represent two different philosophies of being in the world — not just personality types. Their conflict is a philosophical one, expressed entirely through physical behavior.
- AMBIGUOUS RESOLUTION: The ending must be emotionally satisfying but not narratively closed. The audience must complete the meaning themselves. Avoid clean reconciliation. Prefer: a small gesture, an exchange of objects, a shared silence.
- DRAMATIC ECONOMY: Every shot must do at least two things at once — advance the physical action AND deepen the emotional situation.
- NO DIALOGUE EVER: Emotion is expressed through: direction of gaze, proximity between characters, handling of objects, pace of movement, what characters do NOT do.
- COMPRESSION: The story must feel like a 20-minute emotional experience compressed into 60 seconds. Every second must be load-bearing.

PIPELINE RULES:
- Visual First: every description must be convertible to a concrete image prompt
- Self-Contained: every prompt must contain everything needed — no references to other prompts
- Element Registry Before Generation: all recurring elements registered before any image prompt
- State Tracking: physical changes hardcoded explicitly into every subsequent prompt
- Motion Prompts require actual start frames — never write from assumptions
```

---

## STAGE 1 — CREATIVE BRIEF

```
Generate a Creative Brief for this video project concept:
"[DESKRIPSIKAN KONSEP VIDEO KAMU DI SINI]"

Return JSON:
{
  "title": "project title",
  "videoType": "Short Film | Commercial | Music Video",
  "duration": "e.g. 60 seconds",
  "aspectRatio": "16:9",
  "targetAudience": "description",
  "language": "e.g. No dialogue — universal visual storytelling",
  "narrativeDriver": "voice-over | pure visual | action-driven",
  "emotionalTone": "description of overall feeling",
  "pacing": "Brisk | Moderate | Slow | Dynamic — with explanation",
  "soundDesign": "general direction for music and SFX"
}
```

---

## STAGE 2 — STORY GENERATION
*(Paste output Stage 1 sebagai [CREATIVE_BRIEF_JSON])*

```
Using this Creative Brief:
[CREATIVE_BRIEF_JSON]

You are generating a short film story that could win at international festivals (Cannes, Sundance, TIFF short film category).

STEP 1 — EMOTIONAL ANCHOR
Generate one sentence describing the core EMOTIONAL CONTRADICTION the story begins from.
Not a situation. Not an object. An internal contradiction.
Example: "A child who controls everything to feel safe discovers that safety is the one thing she cannot control."
NOT: "A child who is careful meets an impulsive child."

STEP 2 — 10 INTERACTION IDEAS
Generate 10 possible physical interaction elements that could externalize this emotional contradiction.
Each must be: visually simple, physically unstable (can change state), and metaphorically resonant.

STEP 3 — SELECT THE BEST
Choose the one with the highest metaphorical density — the one that can carry the most emotional weight with the least visual complexity.

STEP 4 — WRITE THE STORY
Rules:
- SURFACE: what physically happens, observable and filmable
- SUBTEXT: what it emotionally means — never shown, only felt through behavior
- The visual metaphor (the chosen object/interaction) must TRANSFORM between opening and resolution
- The resolution must be a small gesture — not a reconciliation scene
- End on an image, not an action — the last frame must be holdable
- The story must work as both a children's film AND an adult meditation on the same theme simultaneously

Return JSON:
{
  "emotionalAnchor": "one sentence — the core emotional contradiction, not a situation",
  "subtextLayer": "one sentence — what the story is REALLY about beneath the surface action",
  "visualMetaphor": "one sentence — what object/action carries the full emotional weight and how it transforms from first to last frame",
  "ideas": [
    { "cat": "category name", "idea": "short description — include its metaphorical resonance" }
  ],
  "selectedIdea": 0,
  "title": "story title — evocative, not descriptive",
  "char1": {
    "name": "NAME",
    "desc": "3 specific physical behaviors that express their inner contradiction — what they DO not who they ARE",
    "philosophy": "one sentence — their unconscious belief about how the world works"
  },
  "char2": {
    "name": "NAME",
    "desc": "3 specific physical behaviors that express their inner contradiction — what they DO not who they ARE",
    "philosophy": "one sentence — their unconscious belief about how the world works"
  },
  "coreIdea": "one sentence — the physical interaction at the center",
  "opening": "0-8s — establish location + both characters visible + emotional contradiction visible in behavior within first 3 seconds + visual metaphor introduced",
  "discovery": "8-18s — both characters encounter the interaction element, their philosophical difference creates the first obstacle",
  "escalation": "18-35s — two or three attempts, each failure deepens the emotional situation, subtext becomes more visible in behavior",
  "turningPoint": "35-50s — something is lost or broken — NOT fixed — and this loss creates an unexpected opening between them",
  "resolution": "50-60s — a small gesture, an exchange of objects, or a shared silence. Visual metaphor has transformed. End on a holdable image.",
  "qualityChecks": [
    "Surface action is clear without any dialogue",
    "Emotional contradiction is visible in behavior not stated",
    "Visual metaphor appears in opening and transforms by resolution",
    "Resolution is a small gesture not a reconciliation scene",
    "Final frame is a holdable image",
    "Story works simultaneously as a children's film and an adult meditation"
  ]
}
```

---

## STAGE 3 — VISUAL STYLE ANCHOR

**Opsi A — Jika kamu punya reference image:**
Upload gambar reference ke AI (gunakan Claude atau GPT-4o yang support vision), lalu kirim prompt ini:

```
Analyze this reference image in detail. It will be used as the visual anchor for every image prompt in this animated short film.

The film is about: [STORY_TITLE]
Characters: [CHAR1_NAME] and [CHAR2_NAME]

Examine the uploaded image carefully and extract with precision:
1. Exact rendering style — CGI, 2D, stop-motion aesthetic, watercolor, etc.
2. Character design language — proportions, head-to-body ratio, eye size relative to face, facial exaggeration level
3. Color palette — list dominant colors, accent colors, temperature (warm/cool), saturation
4. Lighting — direction (from where), quality (hard/soft/diffused), time of day implied
5. Texture quality — how do surfaces feel (matte/glossy/rough/smooth/painted)
6. Depth of field — how blurred is the background, how sharp is the subject
7. Mood — what emotional register does this visual style live in

Return JSON:
{
  "renderingStyle": "exact description observed from the image",
  "materiality": "how surfaces feel in this image",
  "overallFinish": "observed finish description",
  "proportions": "exact head-body ratio and limb style observed",
  "eyes": "exact eye style — size relative to face, iris detail, highlight position",
  "facialFeatures": "exaggeration level observed",
  "hair": "rendering quality observed",
  "palette": "dominant colors observed — be specific with color names",
  "lightingType": "exact lighting observed — direction and quality",
  "shadowQuality": "soft/hard/ambient — as observed",
  "depthOfField": "observed depth of field description",
  "skin": "observed quality and feel",
  "fabric": "observed detail level",
  "environment": "observed material style",
  "mood": "emotional register this style lives in",
  "styleAnchor": "Render      : [exact render style from image]\nProportions : [exact proportions from image]\nEyes        : [exact eye style from image]\nLighting    : [exact lighting from image]\nTexture     : [exact textures from image]\nPalette     : [exact colors from image]\nMood        : [exact mood from image]\nTechnical   : 1920x1080 | 16:9"
}
```

**Opsi B — Tanpa reference image:**
*(Paste output Stage 2 sebagai [STORY_JSON])*

```
Based on this story, recommend the ideal visual style for an animated short film with the emotional register of festival-winning shorts.

Story: [STORY_JSON]

Recommend a style that:
- Serves the emotional register — the style must feel like it was invented for this specific story
- Is achievable and consistent with current AI image generators
- Has enough visual specificity to be reproduced across 12 shots consistently

Return JSON:
{
  "renderingStyle": "description",
  "materiality": "how surfaces feel",
  "overallFinish": "description",
  "proportions": "head-body ratio, limb style",
  "eyes": "size, expressiveness, highlight style",
  "facialFeatures": "exaggeration level",
  "hair": "rendering quality",
  "palette": "dominant colors — be specific",
  "lightingType": "lighting description",
  "shadowQuality": "soft/hard/ambient",
  "depthOfField": "description",
  "skin": "quality and feel",
  "fabric": "detail level",
  "environment": "material style",
  "mood": "what emotional register this style lives in",
  "styleAnchor": "Render      : ...\nProportions : ...\nEyes        : ...\nLighting    : ...\nTexture     : ...\nPalette     : ...\nMood        : ...\nTechnical   : 1920x1080 | 16:9"
}
```

---

## STAGE 4 — ELEMENT REGISTRY
*(Paste output Stage 2 sebagai [STORY_JSON] dan styleAnchor dari Stage 3 sebagai [STYLE_ANCHOR])*

```
Build the Element Registry for this film.

Story: [STORY_JSON]
Style Anchor:
[STYLE_ANCHOR]

Shot count planned: approximately 12 shots covering opening → discovery → escalation → turning point → resolution.
Track state changes across ALL shots for each registered element.

Rules:
- Register ALL elements appearing in 2+ shots
- Each fragment must be copy-paste ready for an image prompt
- Include characters, key objects, and recurring settings
- End each fragment with "Style: [STYLE ANCHOR applied]"

Also build State Registry: track every physical change per character and key object across all 12 shots.

Return JSON:
{
  "elements": [
    {
      "name": "ELEMENT_NAME",
      "type": "Character | Object | Setting",
      "fragment": "complete inject-ready prompt fragment text"
    }
  ],
  "stateRegistry": [
    {
      "element": "ELEMENT_NAME",
      "states": [
        { "shot": "Shot_01", "state": "explicit state description" }
      ]
    }
  ]
}
```

---

## STAGE 5 — STORYBOARD & SHOT BREAKDOWN
*(Paste output Stage 2 sebagai [STORY_JSON])*

```
Create the shot breakdown for this film.

Story: [STORY_JSON]

Camera Differentiation Rules:
- No two consecutive solo shots of the same character may use the same camera distance
- If a character appears alone in 3+ shots, cycle through ECU / Medium / Wide
- Reaction shots must be noticeably tighter than the action shot they respond to
- The emotional climax shot must be the tightest framing in the entire sequence

Generate 10-14 shots. Total duration must be approximately 60 seconds.

Return JSON:
{
  "shots": [
    {
      "id": "Shot_01_DescriptiveName",
      "type": "Establishing | Wide | Medium | CU | ECU | Two-Shot | OTS | Tracking | Handheld",
      "duration": 5,
      "camera": "angle | distance | movement or static hold",
      "visual": "what is in the frame",
      "motion": "key action — one clear beat",
      "audio": "music direction / SFX note"
    }
  ]
}
```

---

## STAGE 6 — IMAGE PROMPTS
*(Paste [SHOTS_JSON] dari Stage 5, [ELEMENTS_JSON] dan [STATE_REGISTRY_JSON] dari Stage 4, [STYLE_ANCHOR] dari Stage 3)*

```
Generate one start frame image prompt per shot.

Shots: [SHOTS_JSON]
Element Registry: [ELEMENTS_JSON]
State Registry: [STATE_REGISTRY_JSON]
Style Anchor:
[STYLE_ANCHOR]

Rules:
- Character descriptions must describe ONLY action + expression + state — do NOT re-describe fixed appearance (reference image handles this)
- State must be copied EXACTLY from State Registry — word for word
- Atmosphere (sky/weather) must be stated explicitly in EVERY prompt
- Style Anchor must appear at the end of EVERY prompt
- Self-contained: each prompt must work standalone

Return JSON:
{
  "imagePrompts": [
    {
      "shotId": "Shot_01",
      "camera": "...",
      "scene": "environment + explicit sky condition",
      "chars": "CHARACTER — action + expression only",
      "state": "exact state from registry",
      "objects": "element name — position and condition in this shot",
      "fullPrompt": "complete assembled prompt ready to paste"
    }
  ]
}
```

---

## STAGE 7 — MOTION PROMPTS
*(Setelah kamu generate start frame images secara eksternal. Paste [SHOTS_JSON] dari Stage 5)*

**Jika kamu bisa upload gambar ke AI (Claude/GPT-4o):**
Upload semua start frame images, lalu kirim:

```
You are analyzing the actual start frame images I have uploaded to write precise motion prompts for a short film.

Analyze each image carefully BEFORE writing its motion prompt.
For each image observe: exact character positions in frame, what occupies foreground/midground/background, lighting direction, object states, camera angle.

Shot plan:
[SHOTS_JSON]

User discrepancy notes: [CATATAN PERBEDAAN DARI YANG DIHARAPKAN, atau tulis "None"]

MOTION PROMPT RULES:
- Begin EVERY motion field with "Continue from start frame."
- For each shot: describe what you actually SEE in the image first (positions, depth, lighting), then describe what moves next
- Describe camera movement in cinematic terms: push in / pull back / pan left / tilt up / static hold / handheld drift
- Specify which depth layer moves: foreground character / midground object / background environment
- NEVER describe the starting state as if setting it up — it already exists in the image
- NEVER correct visual mistakes — adapt to what is actually there
- NEVER reference other shots
- NEVER use conditional language ("if", "might", "could")

Return JSON:
{
  "motionPrompts": [
    {
      "shotId": "Shot_01",
      "visualObservation": "what is actually visible in the start frame — character positions, depth layers, lighting direction, object states",
      "motion": "Continue from start frame.\n\n[brief visual grounding]\n\n[precise description of what moves next and how]",
      "camera": "cinematic camera instruction — push in / pull back / pan / tilt / static hold",
      "duration": 5,
      "speed": "Normal | 80% speed | Slow motion first 1s then normal"
    }
  ]
}
```

**Jika tanpa upload gambar:**
Ganti baris pertama dengan:
```
No start frames uploaded. Write motion prompts from shot descriptions only. Flag each with [NO START FRAME] as first line.
```

---

## STAGE 8 — NARRATION
*(Paste [STORY_JSON] dari Stage 2 dan [BRIEF_JSON] dari Stage 1)*

```
Write the narration for this film.

Story: [STORY_JSON]
Brief: [BRIEF_JSON]

First assess: does this story need narration?
Recommendation options: "none" | "minimal" | "full"

If minimal or full — write the narration.
Rules:
- Do NOT explain what the audience can already see
- Do NOT name emotions directly
- Speak AROUND the story, not through it
- Each line must add something the visuals cannot say alone
- Silence between lines is part of the narration

Return JSON:
{
  "recommendation": "none | minimal | full",
  "reasoning": "why this recommendation",
  "elevenlabsStyle": "voice character and delivery instructions for ElevenLabs Style Instructions field",
  "lines": [
    { "timestamp": "00:01", "text": "narration line", "fadeIn": 2 }
  ]
}
```

---

## STAGE 9 — MUSIC & SOUND DESIGN
*(Paste [STORY_JSON] dari Stage 2 dan shots summary dari Stage 5)*

```
Design the music and sound for this film.

Story: [STORY_JSON]
Shots: [SHOTS_SUMMARY_JSON]
(Format shots summary: array of { id, duration, motion } saja)

Return JSON:
{
  "emotionalArc": {
    "opening": "description",
    "building": "description",
    "tensionPeak": "description",
    "resolution": "description",
    "ending": "description"
  },
  "sunoDescription": "complete Suno song description prompt",
  "inspirationTags": ["tag1", "tag2"],
  "negativeTags": ["no tag1", "no tag2"],
  "timeline": [
    { "ts": "00:00", "event": "description", "vol": 40 }
  ],
  "sfx": [
    { "shot": "Shot_01", "sfx": "description", "vol": 70 }
  ]
}
```

---

## STAGE 10 — ASSEMBLY GUIDE
*(Paste [BRIEF_JSON] dari Stage 1, shots dari Stage 5, narration lines dari Stage 8)*

```
Create the complete assembly guide for this film.

Title: [PROJECT_TITLE]
Shots: [SHOTS_DURATION_JSON]
(Format: array of { id, duration } saja)
Narration lines: [NARRATION_LINES_JSON]

Rules:
- DEFAULT: Hard cut for all shots
- EXCEPTION: One dissolve (max 0.5s) only at the single most important emotional shift
- ENDING: Fade to black

Return JSON:
{
  "folderStructure": "ascii folder tree as string",
  "trackLayout": "track layout string",
  "shots": [
    {
      "shot": "Shot_01",
      "inTime": "00:00",
      "outTime": "00:06",
      "duration": 6,
      "notes": "any notes",
      "dissolve": false
    }
  ],
  "transitions": "transition rules string",
  "colorGrade": {
    "global": { "brightness": "+5", "contrast": "+10", "saturation": "-15", "temperature": "-10", "highlights": "-5", "shadows": "+8" },
    "exceptions": [
      { "shots": "Shot_XX", "adj": "adjustment description" }
    ]
  },
  "export": {
    "format": "MP4 (H.264)",
    "resolution": "1920 × 1080",
    "framerate": "24fps",
    "bitrate": "20 Mbps (High)",
    "audio": "AAC 48kHz Stereo",
    "totalDuration": "including fade to black"
  }
}
```

---

## TIPS PENGGUNAAN MANUAL

- **Revisi output**: Setelah tiap stage, kamu bisa kirim: *"Revisi: [instruksi perubahan kamu]. Gunakan output sebelumnya sebagai base."*
- **Pilih idea**: Di Stage 2, setelah melihat 10 ideas, kirim: *"Gunakan idea #X sebagai interaksi utama. Tulis ulang story dengan idea ini."*
- **Claude vs ChatGPT**: Claude lebih konsisten mengikuti JSON schema. GPT-4o lebih kreatif di story. Untuk Stage 7 (Motion Prompts dengan gambar), gunakan yang support vision.
- **Simpan setiap output**: Copy JSON output tiap stage ke file terpisah sebelum lanjut.
