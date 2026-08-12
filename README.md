# AI Placement Interview Assistant — Frontend

React + Vite single-page app for the AI-powered, voice-based placement
interview simulator. This is the **frontend only** — it talks to the
existing Django REST Framework backend over HTTP and contains no server
code of its own.

## 1. Stack

- React 19 + Vite
- React Router (client-side routing)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- `lucide-react` for icons
- `axios` for HTTP
- Browser `MediaRecorder` API to record spoken answers
- Browser `SpeechSynthesis` API to read questions aloud

No backend framework, no server-side code — this is a pure SPA.

## 2. Install & run

```bash
npm install
cp .env.example .env   # edit if your backend isn't on the default URL
npm run dev
```

The app runs at `http://localhost:5173`.

**The backend must already be running separately** (Django, with its own
`GEMINI_API_KEY` configured) at the URL set in `.env`. This frontend never
calls Gemini or a database directly — every AI call goes through the
backend's API.

## 3. Environment variables

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Make sure this origin (`http://localhost:5173` by default) is included in
the backend's `CORS_ALLOWED_ORIGINS`.

## 4. Project structure

```
src/
├── components/       Presentational + reusable UI (see below)
├── pages/            One file per route
├── services/
│   ├── api.js            axios client + error normalization
│   └── interviewApi.js   one function per backend endpoint
├── hooks/
│   ├── useRecorder.js     MediaRecorder + timer + mic-level state machine
│   └── useSpeech.js       SpeechSynthesis wrapper
├── context/
│   └── SelectionContext.jsx   carries the chosen domain from /domains
│                               to /interview/setup (+ sessionStorage,
│                               so a reload on /interview/setup doesn't
│                               lose the selection)
├── utils/
│   ├── domainIcons.js     maps backend `icon` keywords to lucide icons
│   └── copy.js            friendly copy for error codes + score labels
├── App.jsx            routes
└── main.jsx
```

## 5. Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/domains` | Domain selection grid |
| `/interview/setup` | Difficulty / type / question-count config |
| `/interview/:sessionId` | Live voice interview |
| `/interview/:sessionId/result` | Quick post-interview summary |
| `/interview/:sessionId/report` | Full scored report |

## 6. Design notes

The visual identity ("Panel") is built around the product's actual
mechanic — a spoken answer resolving into a scored transcript — rather
than a generic dashboard look:

- **Palette**: an ink-navy interview room (`#14171F`) with a warm brass
  accent (`#C9A15A`), paired with a paper-toned light surface (`#F6F4EF`)
  for the setup/report pages. Semantic green/rust for good/weak scores.
- **Type**: Fraunces (display), Inter (body/UI), IBM Plex Mono (scores,
  timers, transcript-style labels — reinforcing "this is being recorded
  and measured").
- **Signature motif**: an animated waveform that appears on the hero, in
  every loading state, and live (driven by real mic input level) on the
  recorder — the same visual idea threaded through the whole product.
- The live-interview screen is intentionally the ink-dark "interview
  room," while setup/report are the lighter "paper" surface — reinforcing
  that you're *in* the interview only on that one screen.

## 7. Implementation notes & assumptions

A few points the API spec left open, and the decisions made:

- **Selection state between `/domains` and `/interview/setup`**: a small
  `SelectionContext` (not global state management) backed by
  `sessionStorage`, so refreshing `/interview/setup` doesn't lose the
  chosen domain. Landing on `/interview/setup` with nothing selected
  redirects to `/domains`, per the spec.
- **Voice recorder flow**: clicking "Start Answer" begins recording;
  clicking the same button (now "Stop Answer") stops it. If the resulting
  clip is empty (near-zero bytes / under ~1s), the student sees a message
  and a "Re-record" button instead of uploading. Otherwise the recording
  **auto-submits** immediately on stop (`Processing` → `Answer Submitted`),
  matching the state list in the spec (`Start Answer → Recording → Stop
  Answer → Processing → Answer Submitted`) rather than requiring a
  separate manual "Submit" step.
- **Per-answer feedback**: shown as a brief inline card (not a blocking
  modal) for ~2.2s before automatically advancing to the next question or,
  on the last question, calling `/complete/` and navigating to the result
  page — so the student never has to click through it.
- **`MediaRecorder` MIME type**: picked at runtime via
  `MediaRecorder.isTypeSupported()` (`audio/webm;codecs=opus` → `audio/webm`
  → `audio/mp4` → `audio/ogg`), never hardcoded, per the backend accepting
  webm/wav/mp3/ogg/mp4.
- **`already_answered` / `session_completed` errors** on submit: treated as
  recoverable — the UI offers a "Continue" action that re-fetches the
  current question rather than a dead end.
- **Report's `ideal_answer`**: always labeled "One strong way to answer
  this," never "the correct answer," per the spec's instruction not to
  imply it's the only right answer.
- **Speech synthesis** and `MediaRecorder` support are fairly universal in
  modern browsers, but not guaranteed (e.g. some in-app webviews). If
  `SpeechSynthesis` is unavailable, the app degrades silently — the
  question is still shown as text; if microphone access fails, the
  `ErrorMessage` component surfaces a clear retry path.

## 8. Verified

- `npm run build` completes cleanly.
- Ran against a live instance of the documented backend on
  `http://127.0.0.1:8000` — `/api/domains/` loads correctly into the
  selection grid and the app's dev server starts without console errors.
  Full live question-generation/scoring was not exercised end-to-end in
  this environment (no Gemini API key available here) — that path is
  implemented directly against the documented request/response shapes and
  the backend's own passing test suite, not against a live model response.
