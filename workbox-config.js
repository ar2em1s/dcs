module.exports = {
  globDirectory: '_site/',
  globPatterns: [
    '**/*.{html,png,ico,svg,css,js,json}'
  ],
  globIgnores: [
    'sw.js',
    'workbox-*.js'
  ],
  swDest: '_site/sw.js',
  ignoreURLParametersMatching: [
    /^utm_/,
    /^fbclid$/
  ]
}
