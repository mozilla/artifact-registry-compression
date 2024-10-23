const xz_compress = require('@napi-rs/lzma/xz').compress

xz_compress_url = async (url) => {
  const package_response = await fetch(url)

  if (!package_response.ok) {
    throw new Error(`Response status: ${package_response.status}`)
  }

  const arrayBuffer = await package_response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const compressed = await xz_compress(buffer)

  return compressed
}

module.exports = { xz_compress_url }
