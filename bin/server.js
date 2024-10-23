const { createServer } = require('node:http')
const { xz_compress_url } = require('../src/compress')

if (!process.env.PACKAGE_HOST) {
  console.error("Environment variable PACKAGE_HOST must be defined")
  process.exit(1)
}

const LISTEN_ADDRESS = process.env.LISTEN_ADDRESS || '127.0.0.1'
const LISTEN_PORT = process.env.PORT || '3000'
const PACKAGE_HOST = process.env.PACKAGE_HOST
console.log(PACKAGE_HOST)

const server = createServer(async (req, res) => {
  const path = new URL(req.url, `http://${req.headers.host}`).pathname

  switch (path) {
    case '/apt/dists/mozilla/main/binary-all/Packages.xz':
      const compressed = await xz_compress_url(PACKAGE_HOST + '/apt/dists/mozilla/main/binary-all/Packages')

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/x-xz')
      res.end(compressed)
      break
    default:
      res.statusCode = 400
      res.setHeader('Content-Type', 'text/plain')
      res.end('HTTP request path not allowed')
      break
  }

  console.log(path)
})

server.listen(LISTEN_PORT, LISTEN_ADDRESS, () => {
  console.log(`Server listening at http://${LISTEN_ADDRESS}:${LISTEN_PORT}/`)
})
