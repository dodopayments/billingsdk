// Populate public/r/usage-based-pricing.json with the latest source contents.
// - Reads src/registry/billingsdk/usage-based-pricing.tsx
// - Reads src/registry/billingsdk/demo/usage-based-pricing-demo.tsx
// - Writes their contents into files[].content with proper JSON escaping
// - Validates JSON round-trip

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const jsonPath = path.join(root, 'public', 'r', 'usage-based-pricing.json')
const compPath = path.join(root, 'src', 'registry', 'billingsdk', 'usage-based-pricing.tsx')
const demoPath = path.join(root, 'src', 'registry', 'billingsdk', 'demo', 'usage-based-pricing-demo.tsx')

function readFileStr(p) {
  return fs.readFileSync(p, 'utf8')
}

function main() {
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Registry JSON not found: ${jsonPath}`)
  }
  const raw = fs.readFileSync(jsonPath, 'utf8')
  let data
  try {
    data = JSON.parse(raw)
  } catch (e) {
    throw new Error(`Invalid JSON in ${jsonPath}: ${e.message}`)
  }

  const compSrc = readFileStr(compPath)
  const demoSrc = readFileStr(demoPath)

  if (!Array.isArray(data.files)) {
    throw new Error(`Missing files[] in ${jsonPath}`)
  }

  // Update files[].content by matching path
  let updated = 0
  for (const f of data.files) {
    if (f.path === 'src/registry/billingsdk/usage-based-pricing.tsx') {
      f.content = compSrc
      updated++
    }
    if (f.path === 'src/registry/billingsdk/demo/usage-based-pricing-demo.tsx') {
      f.content = demoSrc
      updated++
    }
  }
  if (updated < 2) {
    throw new Error(`Did not find both file entries to update in ${jsonPath}. Updated: ${updated}`)
  }

  // Stringify with stable spacing
  const out = JSON.stringify(data, null, 2) + '\n'

  // Validate round-trip again
  JSON.parse(out)

  fs.writeFileSync(jsonPath, out, 'utf8')
  console.log(`Updated ${jsonPath} with ${updated} entries.`)
}

main()
