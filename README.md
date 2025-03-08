# Deploying a React + Vite Website on GitHub Pages

Deploying your React app built with Vite on GitHub Pages is a simple process. Follow this step-by-step guide to get your site live! 🚀

## Prerequisites

Before you begin, make sure you have:
- Node.js and npm installed ✅
- A GitHub account ✅
- A GitHub repository for your project ✅

---

## 1. Update `package.json`

First, update the `package.json` file to specify the homepage of your app. This is necessary for GitHub Pages to know where to serve your app.

```json
"homepage": "https://<GitHub-username>.github.io/<repository-name>"
```

Then, add the following scripts inside `package.json`:

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

**What this does:**
- `predeploy`: Builds the project before deploying.
- `deploy`: Uses `gh-pages` to deploy the `dist` folder.

---

## 2. Update `vite.config.js`

Modify the `vite.config.js` file to set the `base` property.

```javascript
export default {
  base: "./<repository-name>/",
};
```

**Why?**
- This ensures that your app loads correctly when hosted under a subdirectory on GitHub Pages.

---

## 3. Install `gh-pages`

Run the following command in your terminal to install the `gh-pages` package:

```bash
npm install --save-dev gh-pages
```

**Why?**
- This package allows you to deploy your app easily to GitHub Pages.

---

## 4. Build the App

Now, build your app by running:

```bash
npm run build
```

This command will generate a `dist` folder containing the production build of your app.

---

## 5. Push Your Code to GitHub

Make sure your code is committed and pushed to GitHub.

```bash
git add .
git commit -m "Deploying to GitHub Pages"
git push origin main
```

---

## 6. Deploy the App

Run the following command to deploy your app:

```bash
npm run deploy
```

**What happens now?**
- This command will build and deploy your app to the `gh-pages` branch of your repository.

---

## 7. Configure GitHub Pages

Go to your GitHub repository:
1. Navigate to the **Settings** tab.
2. Scroll down to the **Pages** section.
3. Under **Branch**, select `gh-pages`.
4. Click **Save**.

---

## 8. Fix Routing Issues (Optional)

If your app does not load correctly, update your `App.jsx` file to use `HashRouter` instead of `BrowserRouter`.

```jsx
import { HashRouter, Routes, Route } from "react-router-dom";

<HashRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</HashRouter>
```

**Why?**
- GitHub Pages does not support client-side routing by default. Using `HashRouter` helps avoid 404 errors when refreshing pages.

---

## 9. Wait and Verify

- Wait **3-5 minutes**, then refresh the **Pages** section in your repository settings.
- At the top, you should see the URL of your live website!
- Open the URL in your browser and enjoy your deployed React + Vite app! 🎉

---

### 🎯 Summary
✅ Add `homepage` in `package.json`
✅ Update `vite.config.js`
✅ Install `gh-pages`
✅ Build the app
✅ Push to GitHub
✅ Deploy using `npm run deploy`
✅ Configure GitHub Pages settings
✅ Use `HashRouter` if needed
✅ Enjoy your live website!

Now you’re all set! Happy coding! 🚀

