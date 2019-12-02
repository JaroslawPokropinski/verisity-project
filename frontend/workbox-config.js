module.exports = {
  "globDirectory": "./",
  "globPatterns": [
    "dist/*.{html,css,js,webmanifest}"
  ],
  "swDest": "dist/sw.js",
  "navigateFallback": "/app/",
  "maximumFileSizeToCacheInBytes": 4 * 1024 * 1024
}
