import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Resolve __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getFilePath(file: string): string {
  return path.join(__dirname, '../../data', file)
}

export async function readJson<T = any>(file: string): Promise<T> {
  const data = await fs.readFile(getFilePath(file), 'utf-8')
  return JSON.parse(data)
}

export async function writeJson(file: string, content: any): Promise<void> {
  await fs.writeFile(getFilePath(file), JSON.stringify(content, null, 2))
}