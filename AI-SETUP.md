# Turn on "answer anything" AI mode (free)

The assistant already answers portfolio questions on its own. These steps let it also answer
**any** other question (for example "What is a star schema?" or "How would he design a pipeline?")
using Google Gemini's free tier, through a free Cloudflare Worker that keeps your API key secret.

Cost: $0 on both free plans. If the free daily quota is ever used up, the assistant automatically
falls back to its built-in answers, so the site never breaks.

## 1. Get a free Gemini API key (about 3 minutes)
1. Go to **aistudio.google.com** and sign in with your Google account.
2. Click **Get API key** → **Create API key** → copy the key (starts with `AIza…`).
3. Keep it private. Never paste it into your website files.

## 2. Create the free Cloudflare Worker (about 10 minutes)
1. Go to **dash.cloudflare.com** and sign up (free, no card needed).
2. Left menu: **Compute (Workers)** → **Workers & Pages** → **Create** → **Create Worker** (Start with "Hello World").
3. Name it `jaypreet-portfolio-ai` → **Deploy**.
4. Click **Edit code**. Delete everything in the editor, then paste the whole contents of `ai/worker.js` from this folder. Click **Deploy**.
5. Go back to the Worker → **Settings** → **Variables and Secrets** → **Add**:
   - Type: **Secret**
   - Variable name: `GEMINI_API_KEY`
   - Value: your key from step 1 → **Deploy / Save**.
6. Copy your Worker's URL from the top of its page, e.g. `https://jaypreet-portfolio-ai.<your-name>.workers.dev`.

## 3. Connect your website (2 minutes)
1. On GitHub, open `js/main.js` → pencil icon.
2. Near the top, change `aiEndpoint: ""` to your Worker URL, e.g.
   `aiEndpoint: "https://jaypreet-portfolio-ai.your-name.workers.dev"`
3. **Commit changes**. After about a minute, open your site, click **Ask about me** and ask something general like "What is a star schema?".

## How it behaves
- Portfolio questions (jobs, projects, skills, education, location) are still answered instantly from the built-in answers, which saves your free quota.
- Other questions go to the AI, which is instructed to use only your profile for facts about you, never to invent details, and to send salary and visa questions to your email.
- AI answers carry a small "AI answer" label.
- Only requests from `https://jaypreet-singh.github.io` are accepted (set in `ai/worker.js`).

## Updating what the AI knows
Edit the `PROFILE` text in your Cloudflare Worker (**Edit code** → change → **Deploy**). Keep a copy in `ai/worker.js` too.
