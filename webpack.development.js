module.exports = {
  "target": "webworker",
  "devtool": "cheap-module-source-map", // avoid 'eval': Workers environment doesn't allow it
  "entry": "./index.js",
  "mode": "development"
}
