/**
 * Utility functions to parse expressions and extract input variables
 */

/**
 * Extracts all unique input variables from expressions
 * Returns a structured object with input fields and invoicing items
 */
export function extractInputVariables(config) {
  const inputs = {
    inputFields: new Set(),
    invoicingItems: new Set(),
    variables: new Set()
  }

  // Process field mappings
  if (config.fieldMappings) {
    Object.values(config.fieldMappings).forEach(field => {
      if (field.expressionsByCountry) {
        field.expressionsByCountry.forEach(expr => {
          parseExpression(expr.expression, inputs)
        })
      }
      
      // Process array item mappings
      if (field.itemsMappings) {
        Object.values(field.itemsMappings).forEach(itemField => {
          if (itemField.expressionsByCountry) {
            itemField.expressionsByCountry.forEach(expr => {
              parseExpression(expr.expression, inputs)
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
          parseExpression(expr.expression, inputs)
        })
      }
    })
  }

  return {
    inputFields: Array.from(inputs.inputFields).sort(),
    invoicingItems: Array.from(inputs.invoicingItems).sort(),
    variables: Array.from(inputs.variables).sort()
  }
}

/**
 * Parses a single expression and extracts variables
 */
function parseExpression(expression, inputs) {
  if (!expression) return

  // Extract #input.orderMetadata.xxx patterns
  const inputOrderMetadataPattern = /#input\.orderMetadata\.(\w+(?:\.\w+)*)/g
  let matches = expression.matchAll(inputOrderMetadataPattern)
  for (const match of matches) {
    inputs.inputFields.add(`input.orderMetadata.${match[1]}`)
  }

  // Extract #input.xxx patterns (not orderMetadata)
  const inputPattern = /#input\.(?!orderMetadata)(\w+(?:\.\w+)*)/g
  matches = expression.matchAll(inputPattern)
  for (const match of matches) {
    inputs.inputFields.add(`input.${match[1]}`)
  }

  // Extract #invoicingItems['XXX'] patterns
  const invoicingItemsPattern = /#invoicingItems\['([^']+)'\]/g
  matches = expression.matchAll(invoicingItemsPattern)
  for (const match of matches) {
    inputs.invoicingItems.add(match[1])
  }

  // Extract standalone variables like #currencyCodeValue, #cityCodeValue, etc.
  const standaloneVarPattern = /#(\w+(?:Value|Code)(?!\.|\[))/g
  matches = expression.matchAll(standaloneVarPattern)
  for (const match of matches) {
    inputs.variables.add(match[1])
  }

  // Extract #isVatOptimisedOrder
  if (expression.includes('#isVatOptimisedOrder')) {
    inputs.variables.add('isVatOptimisedOrder')
  }

  // Extract #item. patterns (for array mappings)
  const itemPattern = /#item\.(\w+)/g
  matches = expression.matchAll(itemPattern)
  for (const match of matches) {
    inputs.inputFields.add(`item.${match[1]}`)
  }
}

/**
 * Creates a default value structure for inputs
 */
export function createDefaultInputValues(extractedInputs) {
  const values = {
    inputFields: {},
    invoicingItems: {},
    variables: {}
  }

  // Set defaults for input fields
  extractedInputs.inputFields.forEach(field => {
    const path = field.split('.')
    let current = values.inputFields
    
    for (let i = 1; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {}
      }
      current = current[path[i]]
    }
    
    const lastKey = path[path.length - 1]
    
    // Set sensible defaults based on field name
    if (lastKey === 'orderId') current[lastKey] = '67890'
    else if (lastKey === 'orderCode') current[lastKey] = 'ORDER-12345'
    else if (lastKey === 'storeAddressId') current[lastKey] = '123'
    else if (lastKey === 'handlingStrategy') current[lastKey] = 'GEN2'
    else if (lastKey === 'name' && path[path.length - 2] === 'operation') {
      // Special handling for operation.name which should be a function
      current[lastKey] = 'CREATE'
    }
    else if (lastKey.includes('Time') || lastKey.includes('DateTime')) {
      current[lastKey] = new Date().toISOString()
    }
    else if (lastKey === 'vertical') current[lastKey] = 'FOOD'
    else if (lastKey === 'subvertical') current[lastKey] = 'RESTAURANT'
    else if (lastKey === 'partnerFamily') current[lastKey] = 'general'
    else if (lastKey === 'partnerCancellationStrategy') current[lastKey] = 'STANDARD'
    else if (lastKey === 'customerCancellationStrategy') current[lastKey] = 'STANDARD'
    else if (lastKey === 'payments') current[lastKey] = [{ amount: 25.50, paymentMethod: 'CARD' }]
    else current[lastKey] = ''
  })

  // Set defaults for invoicing items
  extractedInputs.invoicingItems.forEach(itemName => {
    values.invoicingItems[itemName] = {
      grossAmount: { value: 0.00 },
      netAmount: { value: 0.00 },
      amount: { value: 0.00 }
    }
  })

  // Common invoicing items with better defaults
  if (values.invoicingItems['PRODUCTS_TO_PARTNER']) {
    values.invoicingItems['PRODUCTS_TO_PARTNER'].grossAmount.value = 20.00
    values.invoicingItems['PRODUCTS_TO_PARTNER'].netAmount.value = 18.00
  }
  if (values.invoicingItems['TIP_TO_CUSTOMER']) {
    values.invoicingItems['TIP_TO_CUSTOMER'].grossAmount.value = 2.00
    values.invoicingItems['TIP_TO_CUSTOMER'].netAmount.value = 2.00
  }
  if (values.invoicingItems['DELIVERY_FEE_BY_GLOVO']) {
    values.invoicingItems['DELIVERY_FEE_BY_GLOVO'].grossAmount.value = 3.50
    values.invoicingItems['DELIVERY_FEE_BY_GLOVO'].netAmount.value = 3.00
  }

  // Set defaults for standalone variables
  extractedInputs.variables.forEach(varName => {
    if (varName === 'financialSourceCountryCodeValue') values.variables[varName] = 'ES'
    else if (varName === 'currencyCodeValue') values.variables[varName] = 'EUR'
    else if (varName === 'cityCodeValue') values.variables[varName] = 'BCN'
    else if (varName === 'isVatOptimisedOrder') values.variables[varName] = false
    else values.variables[varName] = ''
  })

  return values
}

/**
 * Groups input fields by category for better UX
 */
export function groupInputFields(inputFields) {
  const groups = {
    orderMetadata: [],
    operation: [],
    other: [],
    item: []
  }

  inputFields.forEach(field => {
    if (field.startsWith('input.orderMetadata.')) {
      groups.orderMetadata.push(field)
    } else if (field.startsWith('input.operation.')) {
      groups.operation.push(field)
    } else if (field.startsWith('item.')) {
      groups.item.push(field)
    } else {
      groups.other.push(field)
    }
  })

  return groups
}

