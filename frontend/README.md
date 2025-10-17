# Getting Started with Create React App

Purpose:
- Quick reference for running the frontend dev server, tests, and building
	production output. See the repo root `README.md` for full-stack setup notes.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Social preview & PWA assets

This project includes a set of social preview images and a large PWA icon used by the web manifest. They live in `frontend/public/` and are intended to be small, fast-loading images used by social platforms and when the site is installed as a PWA.

Files (now stored in `frontend/public/og/`):
- `og/og-image-1200x630-with-badge.png` — primary Open Graph / Twitter large image (1200×630) with logo badge overlay. Used in `index.html` meta tags and JSON-LD.
- `og/og-600x315.png` — medium-sized social preview (600×315) used where smaller previews are preferred.
- `og/og-1024x1024.png` — square high-resolution icon used in the `manifest.json` for installed icons.
- `og/og-1200x1200.png` — optional splash / high-res image.

How to replace the image:
1. Place your new image in `frontend/public/og/` (recommended size 1200×630 for OG, 1024×1024 for manifest icon).
2. If you want a logo badge, upload the logo to `backend/uploads/` and use the admin Media module to select/capture it.
3. Update `frontend/public/index.html` `og:image` and `twitter:image` meta tags (they use `%PUBLIC_URL%/filename`).
4. Rebuild with `npm run build` and redeploy.

Notes:
- For production, ensure the manifest icons and OG images are served from your production origin. `%PUBLIC_URL%` will resolve correctly at build time.
- I converted the 1024×1024 icon to PNG for broader compatibility; if you prefer JPG for smaller size, we can switch back.

