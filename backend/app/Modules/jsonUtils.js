const fs = require('fs/promises')
const path = require('path')

function getFilePath(file) {
  return path.join(__dirname, '../../data', file)
}

async function readJson(file) {
  const data = await fs.readFile(getFilePath(file), 'utf-8')
  return JSON.parse(data)
}

async function writeJson(file, content) {
  return fs.writeFile(getFilePath(file), JSON.stringify(content, null, 2))
}

module.exports = { readJson, writeJson }