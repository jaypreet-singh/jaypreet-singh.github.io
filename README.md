# Jaypreet Singh — Portfolio

Static portfolio website (HTML, CSS, JavaScript). No build step. Free to host on GitHub Pages.

## What's inside
| File | What to edit there |
|---|---|
| `index.html` | Page text: Home, About (story, journey, education, certifications), Experience, Skills, Contact |
| `js/projects.js` | **All projects and case studies.** Copy one `{ ... }` block to add a project |
| `js/main.js` | Your email / LinkedIn / GitHub links (top of file) and logo file paths |
| `css/style.css` | Colors for dark and light themes (top of file) |
| `assets/` | Photo, résumés, logos, favicon, social-share image |

## Deploy free on GitHub Pages (5 minutes)
1. Sign in at github.com (username: jaypreet-singh).
2. Click **New repository** → name it exactly **`jaypreet-singh.github.io`** → **Public** → **Create repository**.
3. Click **uploading an existing file** → drag in *everything inside this folder* (index.html, README.md and the `css`, `js`, `assets` folders) → **Commit changes**.
4. Go to **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main** / **(root)** → **Save**.
5. In 1–2 minutes your site is live at **https://jaypreet-singh.github.io**

## Updating later
- Open any file on GitHub → pencil icon → edit → **Commit changes**. The site updates in about a minute.
- **Logos** live in `assets/logos/` (square PNGs on white, 256×256). To replace one, upload a new file with the same name.
- **Replace a résumé:** upload a new PDF into `assets/` with the same file name.
- **Add a project:** in `js/projects.js` copy a project block, change the text. `cat` sets the filter: `eng`, `bi`, `ml`, `hw`.

## Optional: custom domain
Buy a domain (e.g. jaypreetsingh.com) → **Settings → Pages → Custom domain** → follow GitHub's DNS steps.

## Contact form
Messages are delivered to s.jaypreet@gmail.com through FormSubmit (free, no account).
The **first** message ever sent triggers a one-time "Activate form" email from FormSubmit. Click **Activate Form** in that email once; after that every message arrives automatically.
To change the address, edit `email` at the top of `js/main.js`.

## Interactive features (js/features.js)
- **Ask-about-me assistant** (chat bubble): answers from the `KB` list and the skills list. Add or edit answers in `KB`.
- **Job-match checker** (Skills page): skills you have are in `SKILLS_HAVE` (with proof links); common skills you don't list are in `SKILLS_GAP`. Learn a new tool? Move it from `SKILLS_GAP` to `SKILLS_HAVE`.
- **Port Authority insights** (Projects page): figures are in `VIEWS`.
- **Cmd/Ctrl + K search** (keyboard shortcut): pages, projects, résumés and quick actions.
- **Optional AI mode**: see AI-SETUP.md (free Gemini + Cloudflare Worker).
All run in the browser: free, no API keys, nothing sent anywhere.
