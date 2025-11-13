## Agentic Prompt Lab

The Agentic Prompt Lab converts any idea into a cinematic, text-to-video blueprint tailored for modern AI video generators. Drop a concept, choose the optional assets you need, and receive:

- A polished video concept with title, logline, mood, and style direction
- A four-scene cinematic breakdown with camera, lighting, and object cues
- A concise long-form prompt ready for text-to-video pipelines
- Optional voiceover narration beats, dialogue, captions, poster prompt, and music direction

Everything is written in short, visual sentences so the output slots directly into AI video tools such as Runway, Pika, or Luma.

## Local Development

Run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to interact with the generator.

## Production Build

```bash
npm run build
npm run start
```

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS with translucent UI styling
- Stateless generation logic—no external APIs required

## Deployment

The project is optimized for Vercel. Run `npm run build` to verify locally, then deploy with `vercel deploy --prod`.
