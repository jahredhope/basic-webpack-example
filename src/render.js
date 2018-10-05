export default function rendera(params) {
  console.log("FIND ME")
  return JSON.stringify({ url: params.url, keys: Object.keys(params) })
}
