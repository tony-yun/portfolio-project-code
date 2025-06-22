import NdsCore from '@doublenc-inc/nds-core'
import fs from 'fs'
import path from 'path'

const colors = NdsCore.color

const extractColorMappings = (
  colors: Record<string, Record<string, string>>,
): Record<string, string> => {
  const mappings = {}

  Object.entries(colors).forEach(([variant, colorSet]) => {
    Object.entries(colorSet).forEach(([key, value]) => {
      mappings[value] = `${variant}.${key}`
    })
  })

  return mappings
}

const updateESLintRuleFile = (mappings: Record<string, string>) => {
  const ruleFilePath = path.join(__dirname, '../rules/no-restricted-syntax.ts')
  const ruleFileContent = fs.readFileSync(ruleFilePath, 'utf8')
  const mappingString = `const colorMapping = ${JSON.stringify(
    mappings,
    null,
    6,
  )
    .replace(/\n}/, '\n    }')
    .replace(/"([^"]+)":/g, "'$1':")
    .replace(/: "([^"]+)"/g, ": '$1'")}`
  const updatedContent = ruleFileContent.replace(
    /const colorMapping = {[\s\S]*?}/,
    mappingString,
  )

  fs.writeFileSync(ruleFilePath, updatedContent, 'utf8')
}

updateESLintRuleFile(
  extractColorMappings(
    colors as unknown as Record<string, Record<string, string>>,
  ),
)
