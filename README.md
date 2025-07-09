# mmntr Website

This repository contains the source code for the official mmntr website. The site is built with Eleventy, a modern and flexible static site generator.

## ✨ Tech Stack

* **Static Site Generator:** [Eleventy (11ty)](https://www.11ty.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (loaded via CDN with the Typography plugin)
* **UI Components:** [Material Web](https://github.com/material-components/material-web) (Material Design 3)
* **Templating Language:** [Nunjucks](https://mozilla.github.io/nunjucks/)
* **Deployment:** GitHub Pages via GitHub Actions

---

## 🚀 Getting Started

To run the project locally, you will need [Node.js](https://nodejs.org/) (LTS version recommended) installed on your machine.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/tomveich/mmntr.git](https://github.com/tomveich/mmntr.git)
    cd mmntr
    ```

2.  **Install dependencies:**
    This will install Eleventy and all required plugins listed in `package.json`.
    ```bash
    npm install
    ```

3.  **Start the development server:**
    This command will build the site, start a local server, and automatically watch for any file changes.
    ```bash
    npm start
    ```

4.  **Open the site:**
    The project will now be running at `http://localhost:8080`.

---

## 📜 Available Scripts

* `npm start`: Starts the Eleventy development server with live reloading.
* `npm run build`: Creates a production-ready build of the site in the `_site` folder. This is the command used by the GitHub Actions deployment workflow.

---

## 📁 Project Structure

The project uses a content-driven structure, organized by language.


/
├── _data/
│   └── i18n.json         # Holds all translated text strings for the site.
│
├── _includes/
│   ├── partials/
│   │   └── head-common.njk # Common <head> content (CSS, fonts, scripts).
│   ├── homepage-layout.njk # Layout for the homepage.
│   ├── post-layout.njk     # Layout for blog posts.
│   ├── navigation.html     # Site navigation component.
│   └── footer.html         # Site footer component.
│
├── en/                     # Contains all English content.
│   ├── posts/              # English blog posts (.md files).
│   │   └── posts.json      # Config for English posts (tags, layout).
│   ├── index.html          # English homepage.
│   └── en.json             # Config for the English locale (lang, URL prefix).
│
├── sk/                     # Contains all Slovak content.
│   ├── posts/              # Slovak blog posts (.md files).
│   │   └── posts.json      # Config for Slovak posts.
│   ├── index.html          # Slovak homepage.
│   └── sk.json             # Config for the Slovak locale.
│
├── .eleventy.js            # Main Eleventy configuration file.
└── package.json            # Project dependencies and scripts.


---

## ✍️ Creating and Editing Content

### Adding a New Blog Post

1.  Navigate to the correct language folder (e.g., `en/posts/` or `sk/posts/`).
2.  Create a new Markdown file (e.g., `my-new-post.md`).
3.  Add the required front matter at the top of the file:
    ```markdown
    ---
    title: My Awesome New Post
    description: A brief summary of what this post is about.
    date: YYYY-MM-DD
    ---

    Your article content, written in Markdown, starts here...
    ```
4.  The layout and tag (`post_en` or `post_sk`) are automatically applied by the `posts.json` file in that directory.

### Internationalization (i18n)

The site is fully localized. The structure is controlled by the data files in each language directory.

* **URL Structure:** The `permalink` key in `en/en.json` and `sk/sk.json` controls the URL structure for each language. The default language (`en`) builds to the root (`/`), while other languages are prefixed (e.g., `/sk/`).
* **Translated Text:** To translate text in shared components like the navigation or footer, add a new key-value pair to the `_data/i18n.json` file. Then, use the variable in the template, like `{{ i18n[lang].your_new_key }}`.

---

## ☁️ Deployment

The site is automatically deployed to GitHub Pages on every push to the `main` branch. The deployment workflow is defined in the `.github/workflows/deploy.yml` file. It builds the site using the `npm run build` command and deploys the contents of the generated `_site` folder.