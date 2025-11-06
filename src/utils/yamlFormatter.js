/**
 * Utility functions for formatting YAML output to match the exact format
 * used in sap-order-payload-mapping.yml
 */

/**
 * Formats an expression for YAML output
 * - Simple quoted strings are output as-is
 * - Complex expressions use the folded scalar style (>)
 */
export function formatExpression(expression, indent) {
  if (!expression) return `${' '.repeat(indent)}expression: ""\n`
  
  const trimmedExpr = expression.trim()
  
  // Simple quoted values
  if (trimmedExpr.startsWith('"') && trimmedExpr.endsWith('"') && !trimmedExpr.includes('\n')) {
    return `${' '.repeat(indent)}expression: ${trimmedExpr}\n`
  }
  
  // Single line, short expressions
  if (!trimmedExpr.includes('\n') && trimmedExpr.length < 60 && 
      !trimmedExpr.includes('{') && !trimmedExpr.includes('?')) {
    return `${' '.repeat(indent)}expression: ${trimmedExpr}\n`
  }
  
  // Multi-line or complex expressions use folded style
  let output = `${' '.repeat(indent)}expression: >\n`
  const lines = trimmedExpr.split('\n')
  lines.forEach(line => {
    const trimmedLine = line.trim()
    if (trimmedLine) {
      output += `${' '.repeat(indent + 2)}${trimmedLine}\n`
    }
  })
  
  return output
}

/**
 * Formats a countries array
 */
export function formatCountries(countries) {
  if (!countries || countries.length === 0) {
    return '[]'
  }
  return `[ ${countries.map(c => `'${c}'`).join(', ')} ]`
}

/**
 * Checks if a field should have spaces after the colon
 */
export function shouldHaveSpaceInArray(countries) {
  // In the original format, countries arrays sometimes have spaces after brackets
  // [ 'ES', 'PL' ] vs ['ES', 'PL']
  // We use spaces for consistency with the original
  return countries && countries.length > 0
}

