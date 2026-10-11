# HabHab Ta Bai! website.

A static site (HTML, CSS, JavaScript) that also works as an installable, offline-ready app (PWA).
No build step, no frameworks.

## Put it online with GitHub Pages
1. Create a new repository on GitHub (for example `habhab-ta-bai`).
2. Upload everything in this folder so that `index.html` sits at the top level of the repository.
3. Go to Settings > Pages. Under "Build and deployment", choose "Deploy from a branch", pick `main` and `/ (root)`, then Save.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/habhab-ta-bai/`.

Install and offline mode only work on the live `https://` address, not when you open the files directly.

## Add your business details
Open `js/config.js` and fill in your phone, Messenger link, social pages, address and opening hours.
Anything left empty is hidden.

**Facebook page button:** set `messenger` to `https://m.me/` plus your page username
(for example `https://m.me/habhabtabai`). The order sheet and the "Show this to our crew" screen then get a
**Send to our Facebook page** button. It copies the order (with the customer's name and arrival time) and opens your
page chat, and the customer pastes it and sends. Your Facebook page must have messaging turned on.
Without a Messenger link, a phone number gives a "Send by text" button instead.

## Name and arrival time
Customers can type a name and choose Now, In 15 min or In 30 min. These show in large letters on the
"Show this to our crew" screen, on the saved order image, and in the copied Messenger text.

## Change a price or add a dish
Open `index.html` and find the dish. Edit `data-price="..."`. The price coin, the order total and the
"Show at the cart" list all update from that one number. To swap a photo, replace the file in `images/`
with one of the same name.

## When you publish changes
Open `sw.js` and raise the number in `const VERSION = 'habhab-v1'` (for example to `habhab-v2`).
This makes phones that saved the old copy download the new files.

## After publishing
In `index.html`, change the `og:image` line to the full web address of `images/og-image.jpg`
so link previews on Facebook and Messenger show your logo.
