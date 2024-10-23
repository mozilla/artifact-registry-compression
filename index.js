const functions = require('@google-cloud/functions-framework');

const compress = require('@napi-rs/lzma/xz').compress

if (!process.env.PACKAGE_HOST) {
  console.error("Environment variable PACKAGE_HOST must be defined")
  process.exit(1)
}

const PACKAGE_HOST = new URL(process.env.PACKAGE_HOST)
console.log(PACKAGE_HOST)

functions.http('compressXZ', async (req, res) => {
  console.log(req.path)

  if (req.path == "/apt/dists/mozilla/main/binary-all/Packages.xz") {
    const package_response = await fetch(PACKAGE_HOST + "/apt/dists/mozilla/main/binary-all/Packages")

    if (!package_response.ok) {
      throw new Error(`Response status: ${package_response.status}`)
    }

    const arrayBuffer = await package_response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const compressed = await compress(buffer)

    res.type('application/x-xz')
    res.send(compressed)
  } else {
    res.status(400)
    res.send("HTTP request path not allowed")
  }
})
