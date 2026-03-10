import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are an Elite AI Video Production Agent operating a 10-stage pipeline.
You produce structured JSON output only — no prose, no markdown, no explanation outside the JSON.
Every response must be valid parseable JSON matching the schema requested.
You think like a film director and manage like a producer.
Every decision serves the final video output.

CORE RULES:
- Visual First: every description must be convertible to an image or video prompt
- Self-Contained: every prompt must contain everything needed — no references to other prompts
- Element Registry Before Generation: all recurring elements must be registered before any image prompt
- State Tracking: physical changes must be hardcoded explicitly into every subsequent prompt
- Motion Prompts require actual start frames — never write from assumptions

STORY ENGINE (v5 — Emotion-Driven):
- Story must begin from an EMOTIONAL SITUATION, not from an object or activity
- Objects exist only to express the emotional state of characters
- Emotion Compression: story feels like a 5-minute emotional story compressed into 60 seconds
- Emotional arc: initial state → obstacle → hesitation → interaction → emotional shift
- Visual Hook: within first 3 seconds, one strong signal must be visible
- Two characters only, with clear behavioral contrast
- Describe characters through BEHAVIOR, not abstract traits
- No dialogue — everything through action and visual behavior`;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
  }

  const { stage, context } = req.body
  if (stage === undefined || !context) {
    return res.status(400).json({ error: 'Missing stage or context' })
  }

  const prompt = buildPrompt(stage, context)
  if (!prompt) {
    return res.status(400).json({ error: `Unknown stage: ${stage}` })
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b']

  let lastError
  let success = false
  let parsed

  for (const modelName of modelsToTry) {
    if (success) break

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.8,
            maxOutputTokens: 8192,
          },
          systemInstruction: SYSTEM_PROMPT,
        })

        const result = await model.generateContent(prompt)
        let text = result.response.text()

        // Robust JSON extraction
        const firstBrace = text.indexOf('{')
        if (firstBrace !== -1) text = text.slice(firstBrace)

        try {
          parsed = JSON.parse(text)
        } catch (e) {
          // Repair logic
          let repaired = text.trim()
          repaired = repaired.split('\n').map((line, i, arr) => {
            const trimmed = line.trim()
            if (i < arr.length - 1 && !trimmed.endsWith(',') && !trimmed.endsWith('{') && !trimmed.endsWith('[') && !trimmed.endsWith('}') && !trimmed.endsWith(']')) {
              return line + '\\n'
            }
            return line
          }).join('')

          const quoteCount = (repaired.replace(/\\"/g, '').match(/"/g) || []).length
          if (quoteCount % 2 !== 0) repaired += '"'

          const openBraces = (repaired.match(/\{/g) || []).length
          const closeBraces = (repaired.match(/\}/g) || []).length
          const openBrackets = (repaired.match(/\[/g) || []).length
          const closeBrackets = (repaired.match(/\]/g) || []).length

          if (openBrackets > closeBrackets) repaired += ' ]'.repeat(openBrackets - closeBrackets)
          if (openBraces > closeBraces) repaired += ' }'.repeat(openBraces - closeBraces)

          parsed = JSON.parse(repaired)
        }

        success = true
        break
      } catch (err) {
        lastError = err
        const isQuota = err.message.includes('429') || err.message.includes('quota')
        const isOverload = err.message.includes('503') || err.message.includes('demand')

        console.error(`Model ${modelName} Attempt ${attempt} failed:`, err.message)

        if (attempt < 2 && (isOverload || isQuota)) {
          await sleep(2000 * attempt)
          continue
        }
        // If it's a structural error or we're out of attempts for this model, try next model
        break
      }
    }
  }

  if (success) {
    return res.status(200).json({ ok: true, data: parsed })
  }

  const isQuota = lastError?.message?.includes('429') || lastError?.message?.includes('quota')
  const status = isQuota ? 429 : 500
  const userMessage = isQuota
    ? "Batas penggunaan (quota) Gemini Free Tier tercapai. Mohon tunggu 1-2 menit lalu coba lagi (Regenerate)."
    : `Generation failed: ${lastError?.message}`

  return res.status(status).json({ error: userMessage })
}

// ============================================================
// PROMPT BUILDER — one prompt per stage
// ============================================================
function buildPrompt(stage, ctx) {
  switch (stage) {

    // ── STAGE 0: CREATIVE BRIEF ─────────────────────────────
    case 0:
      return `Generate a Creative Brief for this video project concept:
"${ctx.userInput}"

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
}`

    // ── STAGE 1: STORY GENERATION ───────────────────────────
    case 1:
      return `Using this Creative Brief:
${JSON.stringify(ctx.brief, null, 2)}

Step 1: Generate an Emotional Anchor — one sentence describing the core emotional situation the story begins from (NOT an object or activity — the EMOTIONAL STATE of a character).

Step 2: Generate 10 possible interaction elements that could visually express this emotional situation.

Step 3: Select the best one (visually simple, stable, easy to animate).

Step 4: Write the full story.

Return JSON:
{
  "emotionalAnchor": "one sentence emotional premise",
  "ideas": [
    { "cat": "category name", "idea": "short description" }
  ],
  "selectedIdea": 0,
  "title": "story title",
  "char1": { "name": "NAME", "desc": "behavioral description — what they DO, not abstract traits" },
  "char2": { "name": "NAME", "desc": "behavioral description — what they DO, not abstract traits" },
  "coreIdea": "one sentence",
  "opening": "0-8s — environment, both characters, emotional situation, behavioral contrast",
  "discovery": "8-18s — interaction element appears, both approach it differently",
  "escalation": "18-35s — multiple attempts, trying, failing, reacting to each other",
  "turningPoint": "35-50s — small accident or mistake forces behavioral change",
  "resolution": "50-60s — characters interact in a new emotional way, final image",
  "qualityChecks": ["check 1", "check 2", "check 3", "check 4", "check 5", "check 6"]
}`

    // ── STAGE 2: REFERENCE IMAGE ANALYSIS ───────────────────
    case 2:
      return `Based on the story and brief below, generate a hypothetical reference image analysis for a hyper-stylized CGI animated short film style (Pixar/Laika quality) that would suit this story.

Story: ${ctx.story.title}
Characters: ${ctx.story.char1.name} — ${ctx.story.char1.desc}
Setting implied by story: ${ctx.story.opening}

Return JSON:
{
  "renderingStyle": "description",
  "materiality": "how surfaces feel",
  "overallFinish": "description",
  "proportions": "head-body ratio, limb style",
  "eyes": "size, expressiveness, highlight style",
  "facialFeatures": "exaggeration level",
  "hair": "rendering quality",
  "palette": "dominant colors",
  "lightingType": "lighting description",
  "shadowQuality": "soft/hard/ambient",
  "depthOfField": "description",
  "skin": "quality and feel",
  "fabric": "detail level",
  "environment": "material style",
  "mood": "what this style conveys",
  "styleAnchor": "Render      : ...\nProportions : ...\nEyes        : ...\nLighting    : ...\nTexture     : ...\nPalette     : ...\nMood        : ...\nTechnical   : 1920x1080 | 16:9"
}`

    // ── STAGE 3: ELEMENT REGISTRY ────────────────────────────
    case 3:
      return `Build the Element Registry for this film.

Story: ${JSON.stringify(ctx.story, null, 2)}
Style Anchor:
${ctx.styleAnchor}

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
}`

    // ── STAGE 4: STORYBOARD ──────────────────────────────────
    case 4:
      return `Create the shot breakdown for this film.

Story: ${JSON.stringify(ctx.story, null, 2)}

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
}`

    // ── STAGE 5: IMAGE PROMPTS ───────────────────────────────
    case 5:
      return `Generate one start frame image prompt per shot.

Shots: ${JSON.stringify(ctx.shots, null, 2)}
Element Registry: ${JSON.stringify(ctx.elements, null, 2)}
State Registry: ${JSON.stringify(ctx.stateRegistry, null, 2)}
Style Anchor:
${ctx.styleAnchor}

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
}`

    // ── STAGE 6: MOTION PROMPTS (after user uploads start frames) ──
    case 6:
      return `Write motion prompts for these shots. The user has uploaded and reviewed their generated start frames.

Shots: ${JSON.stringify(ctx.shots, null, 2)}
Start frame notes (what was actually visible in each generated image):
${ctx.startFrameNotes || 'All start frames matched intent — no discrepancies flagged.'}

CRITICAL RULES:
- Begin every prompt with "Continue from start frame."
- Describe ONLY what happens NEXT from the exact visual state in the start frame
- NEVER describe the starting state — it already exists in the image
- NEVER correct visual mistakes from the start frame in the motion prompt
- NEVER reference other shots
- NEVER use conditional language

Return VALID JSON only. Use double quotes and escape any internal quotes:
{
  "motionPrompts": [
    {
      "shotId": "Shot_01",
      "motion": "Continue from start frame.\n\n...",
      "camera": "camera movement instruction",
      "duration": 5,
      "speed": "Normal | Slow | specific instruction"
    }
  ]
}`

    // ── STAGE 7: NARRATION ───────────────────────────────────
    case 7:
      return `Write the narration for this film.

Story: ${JSON.stringify(ctx.story, null, 2)}
Brief: ${JSON.stringify(ctx.brief, null, 2)}

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
}`

    // ── STAGE 8: MUSIC ───────────────────────────────────────
    case 8:
      return `Design the music and sound for this film.

Story: ${JSON.stringify(ctx.story, null, 2)}
Shots: ${JSON.stringify(ctx.shots.map(s => ({ id: s.id, duration: s.duration, motion: s.motion })), null, 2)}

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
}`

    // ── STAGE 9: ASSEMBLY GUIDE ──────────────────────────────
    case 9:
      return `Create the complete assembly guide for this film.

Title: ${ctx.brief.title}
Shots: ${JSON.stringify(ctx.shots.map(s => ({ id: s.id, duration: s.duration })), null, 2)}
Narration lines: ${JSON.stringify(ctx.narration?.lines || [], null, 2)}

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
}`

    default:
      return null
  }
}
