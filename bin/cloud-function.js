const functions = require('@google-cloud/functions-framework');
const { xz_compress_url } = require('../src/compress')

if (!process.env.PACKAGE_HOST) {
  console.error("Environment variable PACKAGE_HOST must be defined")
  process.exit(1)
}

const PACKAGE_HOST = process.env.PACKAGE_HOST
console.log(PACKAGE_HOST)

functions.http('compressXZ', async (req, res) => {
  console.log(req.path)

  if (req.path == "/apt/dists/mozilla/main/binary-all/Packages.xz") {
    const compressed = await xz_compress_url(PACKAGE_HOST + '/apt/dists/mozilla/main/binary-all/Packages')

    res.type('application/x-xz')
    res.send(compressed)
  } else {
    res.status(400)
    res.send("HTTP request path not allowed")
  }
})
