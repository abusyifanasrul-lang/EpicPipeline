# AI Video Production Pipeline

Live pipeline app powered by Gemini 1.5 Flash.

## Deploy ke Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Push ke GitHub dulu (atau deploy langsung)
```bash
git init
git add .
git commit -m "init"
```

### 3. Deploy
```bash
vercel
```
Ikuti prompt — pilih default untuk semua.

### 4. Set Environment Variable
Di Vercel dashboard → Settings → Environment Variables:
```
GEMINI_API_KEY = your_gemini_api_key_here
```

Atau via CLI:
```bash
vercel env add GEMINI_API_KEY
```

### 5. Redeploy setelah set env
```bash
vercel --prod
```

## Local Development
```bash
npm install
vercel dev
```
`vercel dev` menjalankan Vite + serverless functions secara bersamaan.

## Struktur Project
```
/
├── index.html          # Frontend — full pipeline UI
├── api/
│   └── generate.js     # Serverless function — Gemini API proxy
├── package.json
├── vite.config.js
├── vercel.json
└── .gitignore
```

## Environment Variables
| Variable | Keterangan |
|----------|-----------|
| `GEMINI_API_KEY` | Google AI Studio API key |

Dapatkan API key di: https://aistudio.google.com/app/apikey
