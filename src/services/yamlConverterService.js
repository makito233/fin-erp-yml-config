/**
 * YAML Converter Service
 * 
 * This module provides conversion functionality between configuration objects and YAML format.
 * It is designed to be framework-agnostic and can be easily extracted as a microservice.
 * 
 * The service uses SpEL (Spring Expression Language) for expressions and follows the
 * SAP Order Payload Mapping specification.
 * 
 * @module yamlConverterService
 */

/**
 * Configuration object type definition
 * @typedef {Object} Configuration
 * @property {Object<string, FieldMapping>} fieldMappings - Field mappings configuration
 * @property {Array<ConditionMapping>} conditionMappings - Condition mappings configuration
 */

/**
 * @typedef {Object} FieldMapping
 * @property {string} type - Field type (string, double, array, etc.)
 * @property {string} [format] - Optional format string
 * @property {Array<ExpressionByCountry>} [expressionsByCountry] - Expressions per country
 * @property {Object<string, FieldMapping>} [itemsMappings] - Nested item mappings for arrays
 */

/**
 * @typedef {Object} ConditionMapping
 * @property {string} conditionType - Condition type identifier
 * @property {Array<ExpressionByCountry>} expressionsByCountry - Expressions per country
 */

/**
 * @typedef {Object} ExpressionByCountry
 * @property {Array<string>} countries - List of country codes
 * @property {string} expression - SpEL expression
 */

/**
 * Converter Service Class
 * Provides stateless conversion methods
 */
export class YamlConverterService {
  /**
   * Converts a configuration object to YAML string
   * @param {Configuration} config - Configuration object
   * @param {Object} options - Conversion options
   * @param {boolean} options.includeComments - Include documentation comments
   * @param {boolean} options.includeHeader - Include file header
   * @returns {string} YAML string representation
   */
  static toYaml(config, options = { includeComments: true, includeHeader: true }) {
    const parts = []
    
    if (options.includeHeader) {
      parts.push(this._generateHeader())
    }
    
    if (options.includeComments) {
      parts.push(this._generateTypeDocumentation())
    }
    
    parts.push(this._convertFieldMappings(config.fieldMappings))
    
    if (options.includeComments) {
      parts.push(this._generateConditionDocumentation())
    }
    
    parts.push(this._convertConditionMappings(config.conditionMappings))
    
    return parts.filter(Boolean).join('\n')
  }

  /**
   * Parses YAML string to configuration object
   * Note: This requires js-yaml library in the browser environment
   * In a microservice, this would use a backend YAML parser
   * @param {string} yamlString - YAML string
   * @returns {Configuration} Configuration object
   */
  static fromYaml(yamlString) {
    // This method assumes js-yaml is available
    // In a microservice implementation, use appropriate backend YAML parser
    throw new Error('fromYaml should be implemented using appropriate YAML parser for the environment')
  }

  /**
   * Validates a configuration object
   * @param {Configuration} config - Configuration to validate
   * @returns {Object} Validation result with errors array
   */
  static validate(config) {
    const errors = []
    
    // Validate field mappings
    if (config.fieldMappings) {
      Object.entries(config.fieldMappings).forEach(([fieldName, fieldConfig]) => {
        if (!fieldConfig.type) {
          errors.push(`Field "${fieldName}" is missing type`)
        }
        
        if (fieldConfig.expressionsByCountry) {
          fieldConfig.expressionsByCountry.forEach((expr, index) => {
            this._validateExpression(expr, errors, `fieldMappings.${fieldName}[${index}]`)
          })
        }
        
        // Validate nested items mappings
        if (fieldConfig.itemsMappings) {
          Object.entries(fieldConfig.itemsMappings).forEach(([itemFieldName, itemFieldConfig]) => {
            if (!itemFieldConfig.type) {
              errors.push(`Field "${fieldName}.itemsMappings.${itemFieldName}" is missing type`)
            }
            
            if (itemFieldConfig.expressionsByCountry) {
              itemFieldConfig.expressionsByCountry.forEach((expr, index) => {
                this._validateExpression(
                  expr,
                  errors,
                  `fieldMappings.${fieldName}.itemsMappings.${itemFieldName}[${index}]`
                )
              })
            }
          })
        }
      })
    }
    
    // Validate condition mappings
    if (config.conditionMappings) {
      config.conditionMappings.forEach((condition, index) => {
        if (!condition.conditionType) {
          errors.push(`Condition mapping [${index}] is missing conditionType`)
        }
        
        if (condition.expressionsByCountry) {
          condition.expressionsByCountry.forEach((expr, exprIndex) => {
            this._validateExpression(expr, errors, `conditionMappings[${index}][${exprIndex}]`)
          })
        }
      })
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Extracts SpEL variables used in expressions
   * @param {Configuration} config - Configuration object
   * @returns {Object} Object containing categorized variables
   */
  static extractVariables(config) {
    const variables = {
      inputFields: new Set(),
      invoicingItems: new Set(),
      standaloneVariables: new Set()
    }
    
    // Process field mappings
    if (config.fieldMappings) {
      Object.values(config.fieldMappings).forEach(field => {
        if (field.expressionsByCountry) {
          field.expressionsByCountry.forEach(expr => {
            this._extractFromExpression(expr.expression, variables)
          })
        }
        
        // Process array item mappings
        if (field.itemsMappings) {
          Object.values(field.itemsMappings).forEach(itemField => {
            if (itemField.expressionsByCountry) {
              itemField.expressionsByCountry.forEach(expr => {
                this._extractFromExpression(expr.expression, variables)
              })
            }
          })
        }
      })
    }
    
    // Process condition mappings
    if (config.conditionMappings) {
      config.conditionMappings.forEach(condition => {
        if (condition.expressionsByCountry) {
          condition.expressionsByCountry.forEach(expr => {
            this._extractFromExpression(expr.expression, variables)
          })
        }
      })
    }
    
    return {
      inputFields: Array.from(variables.inputFields).sort(),
      invoicingItems: Array.from(variables.invoicingItems).sort(),
      standaloneVariables: Array.from(variables.standaloneVariables).sort()
    }
  }

  // ========== Private Helper Methods ==========

  static _generateHeader() {
    return `# A configuration file defining the mapping of order data into the SAP order payload format (JSON).
# Order payload is sent to SAP for invoicing and accounting purposes.
#
# Expressions use SpEL (Spring Expression Language) syntax.
# Note: '>' converts newlines to spaces, making multi-line expressions more readable.
`
  }

  static _generateTypeDocumentation() {
    return `# Mapped 1:1 to the order payload JSON structure
# Possible types are:
# - string: string value mapped as-is and cannot be null.
# - optional_string: string value that can be null, in which case it will be sent as an empty string.
# - double: numeric value mapped with format "0.00" and cannot be null.
# - local_date_time: date-time value mapped with a specific format (e.g. "yyyy/MM/dd") and cannot be null.
# - optional_local_date_time: date-time value as above that can be null, in which case it will be sent as an empty string.
# - array: array of objects, with nested itemsMappings defining the structure of each object.
`
  }

  static _generateConditionDocumentation() {
    return `
# Mapped to 'items.condition' array of the order payload, containing conditionType and conditionValue.
# - conditionType: the key identifying the condition.
# - conditionValue: the value of the condition, mapped as a double with format "0.00".
`
  }

  static _convertFieldMappings(fieldMappings) {
    if (!fieldMappings || Object.keys(fieldMappings).length === 0) {
      return 'fieldMappings: {}'
    }
    
    let output = 'fieldMappings:\n'
    
    Object.entries(fieldMappings).forEach(([fieldName, fieldConfig]) => {
      output += `  ${fieldName}:\n`
      output += `    type: ${fieldConfig.type}\n`
      
      if (fieldConfig.format) {
        output += `    format: ${fieldConfig.format}\n`
      }
      
      if (fieldConfig.expressionsByCountry && fieldConfig.expressionsByCountry.length > 0) {
        output += `    expressionsByCountry:\n`
        fieldConfig.expressionsByCountry.forEach(expr => {
          output += this._formatExpressionByCountry(expr, 6)
        })
      }
      
      if (fieldConfig.itemsMappings && Object.keys(fieldConfig.itemsMappings).length > 0) {
        output += `    itemsMappings:\n`
        Object.entries(fieldConfig.itemsMappings).forEach(([itemFieldName, itemFieldConfig]) => {
          output += `      ${itemFieldName}:\n`
          output += `        type: ${itemFieldConfig.type}\n`
          
          if (itemFieldConfig.format) {
            output += `        format: ${itemFieldConfig.format}\n`
          }
          
          if (itemFieldConfig.expressionsByCountry && itemFieldConfig.expressionsByCountry.length > 0) {
            output += `        expressionsByCountry:\n`
            itemFieldConfig.expressionsByCountry.forEach(expr => {
              output += this._formatExpressionByCountry(expr, 10)
            })
          }
        })
      }
    })
    
    return output
  }

  static _convertConditionMappings(conditionMappings) {
    let output = 'conditionMappings:\n'
    
    if (!conditionMappings || conditionMappings.length === 0) {
      return output + '  []'
    }
    
    conditionMappings.forEach(condition => {
      output += `  - conditionType: ${condition.conditionType}\n`
      
      if (condition.expressionsByCountry && condition.expressionsByCountry.length > 0) {
        output += `    expressionsByCountry:\n`
        condition.expressionsByCountry.forEach(expr => {
          output += this._formatExpressionByCountry(expr, 6)
        })
      }
      
      output += '\n'
    })
    
    return output
  }

  static _formatExpressionByCountry(expr, baseIndent) {
    const indent = ' '.repeat(baseIndent)
    let output = ''
    
    // Format countries array
    const countriesFormatted = expr.countries && expr.countries.length > 0
      ? `[ ${expr.countries.map(c => `'${c}'`).join(', ')} ]`
      : '[]'
    
    output += `${indent}- countries: ${countriesFormatted}\n`
    
    // Format expression
    output += this._formatExpression(expr.expression, baseIndent + 2)
    
    return output
  }

  static _formatExpression(expression, indent) {
    const indentStr = ' '.repeat(indent)
    
    if (!expression) {
      return `${indentStr}expression: ""\n`
    }
    
    const trimmedExpr = expression.trim()
    
    // Simple quoted strings
    if (trimmedExpr.startsWith('"') && trimmedExpr.endsWith('"') && !trimmedExpr.includes('\n')) {
      return `${indentStr}expression: ${trimmedExpr}\n`
    }
    
    // Single line, short expressions
    if (!trimmedExpr.includes('\n') && trimmedExpr.length < 60 && 
        !trimmedExpr.includes('{') && !trimmedExpr.includes('?')) {
      return `${indentStr}expression: ${trimmedExpr}\n`
    }
    
    // Multi-line or complex expressions use folded style (>)
    let output = `${indentStr}expression: >\n`
    const lines = trimmedExpr.split('\n')
    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine) {
        output += `${indentStr}  ${trimmedLine}\n`
      }
    })
    
    return output
  }

  static _validateExpression(expr, errors, path) {
    if (!expr.countries || !Array.isArray(expr.countries)) {
      errors.push(`${path}: countries must be an array`)
    }
    
    if (!expr.expression || typeof expr.expression !== 'string') {
      errors.push(`${path}: expression must be a non-empty string`)
    }
    
    // Basic SpEL syntax validation
    if (expr.expression) {
      const expression = expr.expression
      
      // Check for balanced braces
      const openBraces = (expression.match(/\{/g) || []).length
      const closeBraces = (expression.match(/\}/g) || []).length
      if (openBraces !== closeBraces) {
        errors.push(`${path}: Unbalanced braces in SpEL expression`)
      }
      
      // Check for balanced brackets
      const openBrackets = (expression.match(/\[/g) || []).length
      const closeBrackets = (expression.match(/\]/g) || []).length
      if (openBrackets !== closeBrackets) {
        errors.push(`${path}: Unbalanced brackets in SpEL expression`)
      }
      
      // Check for balanced parentheses
      const openParens = (expression.match(/\(/g) || []).length
      const closeParens = (expression.match(/\)/g) || []).length
      if (openParens !== closeParens) {
        errors.push(`${path}: Unbalanced parentheses in SpEL expression`)
      }
    }
  }

  static _extractFromExpression(expression, variables) {
    if (!expression) return
    
    // Extract #input.orderMetadata.xxx patterns
    const inputOrderMetadataPattern = /#input\.orderMetadata\.(\w+(?:\.\w+)*)/g
    let matches = expression.matchAll(inputOrderMetadataPattern)
    for (const match of matches) {
      variables.inputFields.add(`input.orderMetadata.${match[1]}`)
    }
    
    // Extract #input.xxx patterns (not orderMetadata)
    const inputPattern = /#input\.(?!orderMetadata)(\w+(?:\.\w+)*)/g
    matches = expression.matchAll(inputPattern)
    for (const match of matches) {
      variables.inputFields.add(`input.${match[1]}`)
    }
    
    // Extract #invoicingItems['XXX'] patterns
    const invoicingItemsPattern = /#invoicingItems\['([^']+)'\]/g
    matches = expression.matchAll(invoicingItemsPattern)
    for (const match of matches) {
      variables.invoicingItems.add(match[1])
    }
    
    // Extract standalone variables like #currencyCodeValue, #cityCodeValue, etc.
    const standaloneVarPattern = /#(\w+(?:Value|Code|Order)(?!\.|\[))/g
    matches = expression.matchAll(standaloneVarPattern)
    for (const match of matches) {
      variables.standaloneVariables.add(match[1])
    }
    
    // Extract #item. patterns (for array mappings)
    const itemPattern = /#item\.(\w+)/g
    matches = expression.matchAll(itemPattern)
    for (const match of matches) {
      variables.inputFields.add(`item.${match[1]}`)
    }
  }
}

/**
 * Default export provides singleton instance
 */
export default {
  toYaml: (config, options) => YamlConverterService.toYaml(config, options),
  fromYaml: (yamlString) => YamlConverterService.fromYaml(yamlString),
  validate: (config) => YamlConverterService.validate(config),
  extractVariables: (config) => YamlConverterService.extractVariables(config)
}

