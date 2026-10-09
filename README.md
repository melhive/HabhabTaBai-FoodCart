# HabHab Ta Bai! website

A static site (HTML, CSS, JavaScript). No build step, no frameworks.

## Put it online with GitHub Pages
1. Create a new repository on GitHub (for example `habhab-ta-bai`).
2. Upload everything in this folder so that `index.html` sits at the top level of the repository.
3. Go to Settings > Pages. Under "Build and deployment", choose "Deploy from a branch", pick `main` and `/ (root)`, then Save.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/habhab-ta-bai/`.

## Add your business details
Open `js/config.js` and fill in your phone, Messenger link, social pages, address and opening hours.
Anything left empty is hidden, so the site never shows blank boxes.

## Change a price or a dish
Open `index.html`, find the dish, and edit the number inside `<span class="dish__price">`.
To swap a photo, replace the file in `images/` with one of the same name.

## After publishing
In `index.html`, change the `og:image` line to the full web address of `images/og-image.jpg`
so link previews on Facebook and Messenger show your logo.
