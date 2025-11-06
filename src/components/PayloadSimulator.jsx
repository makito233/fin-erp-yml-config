import React, { useState, useEffect } from 'react'
import { 
  PlayIcon, 
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

export default function PayloadSimulator({ fieldMappings, conditionMappings, providedInputValues }) {
  const [inputValues, setInputValues] = useState(null)
  const [invoicingItems, setInvoicingItems] = useState(null)
  const [variables, setVariables] = useState(null)

  // Only use provided input values from Input Manager
  useEffect(() => {
    if (providedInputValues) {
      // Ensure we're extracting proper structure from Input Manager
      const inputFields = providedInputValues.inputFields || {}
      const invoicingItemsData = providedInputValues.invoicingItems || {}
      const variablesData = providedInputValues.variables || {}
      
      console.log('Received from Input Manager:', {
        inputFields,
        invoicingItemsData,
        variablesData
      })
      
      setInputValues(inputFields)
      setInvoicingItems(invoicingItemsData)
      setVariables(variablesData)
      
      // Auto-generate payload when inputs are received
      setTimeout(() => {
        if (inputFields && invoicingItemsData && variablesData) {
          generatePayloadWithContext(inputFields, invoicingItemsData, variablesData)
        }
      }, 100)
    }
  }, [providedInputValues])

  const [generatedPayload, setGeneratedPayload] = useState(null)
  const [errors, setErrors] = useState([])
  const [copied, setCopied] = useState(false)

  // Helper to safely extract primitive values from potentially nested objects
  const toPrimitive = (value) => {
    if (value === null || value === undefined) return null
    if (typeof value !== 'object') return value
    // If it's an object, try to extract a primitive value
    if (value.toString && typeof value.toString === 'function') {
      const str = value.toString()
      if (str !== '[object Object]') return str
    }
    // If it has a value property, use that
    if ('value' in value) return value.value
    // Last resort
    return JSON.stringify(value)
  }

  const evaluateExpression = (expression, context) => {
    if (!expression) return null
    
    try {
      // Remove newlines and extra whitespace for easier processing
      let result = expression.trim().replace(/\s+/g, ' ')
      
      // STEP 1: Handle SpEL-specific syntax that doesn't exist in JavaScript
      // Replace 'or' with '||'
      result = result.replace(/\bor\b/g, '||')
      // Replace 'and' with '&&'
      result = result.replace(/\band\b/g, '&&')
      // Replace SpEL collection projection ?.![] (not supported, return empty array)
      result = result.replace(/\?\.\!\[([^\]]*)\]/g, '[]')
      
      // STEP 2: Replace invoicing items (these are safe numeric values)
      result = result.replace(/#invoicingItems\['([^']+)'\]\?\.(\w+)\?\.value/g, (match, itemKey, prop) => {
        const value = context.invoicingItems?.[itemKey]?.[prop]?.value
        return value !== undefined && value !== null ? value : 0
      })
      
      //  STEP 3: Handle elvis operator EARLY (before other replacements might break it)
      result = result.replace(/\?\s*:/g, ' || ')
      
      // STEP 4: NOW process map lookups BEFORE replacing the variables inside them
      // This way the map pattern is still intact
      // Handle map lookups with bracket notation
      // Example: { 'GEN1': value1, 'GEN2': value2 }[key]
      const mapLookupPattern = /\{([^}]+)\}\[([^\]]+)\]/g
      let mapMatch
      while ((mapMatch = mapLookupPattern.exec(result)) !== null) {
        try {
          const fullMatch = mapMatch[0]
          const mapContent = mapMatch[1]
          const keyExpr = mapMatch[2].trim()
          
          console.log('Map lookup found:', { fullMatch, mapContent, keyExpr })
          
          // Evaluate the key - need to handle variable references
          let keyValue
          let keyExprProcessed = keyExpr
          
          // Replace variable references in the key expression
          keyExprProcessed = keyExprProcessed.replace(/#input\.orderMetadata\?\.(\w+)/g, (match, field) => {
            const val = context.input?.orderMetadata?.[field]
            return val !== undefined && val !== null ? (typeof val === 'string' ? `"${val}"` : val) : 'null'
          })
          
          try {
            keyValue = eval(keyExprProcessed)
            console.log('Key evaluated to:', keyValue, 'from:', keyExprProcessed)
          } catch (e) {
            keyValue = keyExpr.replace(/["']/g, '')
            console.log('Key eval failed, using raw:', keyValue)
          }
          
          // Parse the map - handle both simple values and complex expressions
          const mapObj = {}
          
          // Split by commas that are not inside parentheses
          let depth = 0
          let currentEntry = ''
          const entries = []
          
          for (let i = 0; i < mapContent.length; i++) {
            const char = mapContent[i]
            if (char === '(' || char === '{') depth++
            else if (char === ')' || char === '}') depth--
            else if (char === ',' && depth === 0) {
              entries.push(currentEntry.trim())
              currentEntry = ''
              continue
            }
            currentEntry += char
          }
          if (currentEntry.trim()) entries.push(currentEntry.trim())
          
          // Parse each entry
          entries.forEach(entry => {
            const colonIndex = entry.indexOf(':')
            if (colonIndex > 0) {
              const key = entry.substring(0, colonIndex).trim().replace(/['"]/g, '')
              const value = entry.substring(colonIndex + 1).trim()
              
              // Try to evaluate the value
              try {
                mapObj[key] = eval(value)
              } catch (e) {
                // If evaluation fails, store as-is (might be a string)
                mapObj[key] = value.replace(/['"]/g, '')
              }
            }
          })
          
          const resultValue = mapObj[keyValue]
          
          console.log('Map result for key', keyValue, ':', resultValue)
          
          if (resultValue !== undefined && resultValue !== null) {
            // Replace the entire map lookup with the result
            const replacement = typeof resultValue === 'string' ? `"${resultValue}"` : resultValue
            result = result.replace(fullMatch, replacement)
            console.log('Replaced with:', replacement)
          } else {
            result = result.replace(fullMatch, 0)
            console.log('Key not found, replaced with 0')
          }
          
          // Reset regex index after replacement
          mapLookupPattern.lastIndex = 0
        } catch (e) {
          console.error('Map lookup error:', e)
          // Replace with 0 as safe default
          result = result.replace(mapMatch[0], 0)
          mapLookupPattern.lastIndex = 0
        }
      }
      
      // STEP 5: NOW replace all remaining variables
      // Handle method calls that might not exist (like shouldIncludeMarketplaceItemsOnly())
      result = result.replace(/#input\.(\w+)\(\)/g, (match, method) => {
        // Check if it's a known method
        if (method === 'shouldIncludeMarketplaceItemsOnly') {
          return 'false'
        }
        return 'false'
      })
      
      // Handle #input.operation.name() method call
      result = result.replace(/#input\.operation\.name\(\)/g, (match) => {
        const opValue = context.input?.operation?.name
        if (typeof opValue === 'function') {
          return `"${opValue()}"`
        }
        return `"${opValue || 'CREATE'}"`
      })
      
      // Handle method calls with safe navigation
      result = result.replace(/#input\.orderMetadata\?\.(\w+)\?\.toLowerCase\(\)/g, (match, field) => {
        const primitiveValue = toPrimitive(context.input?.orderMetadata?.[field])
        return primitiveValue !== undefined && primitiveValue !== null ? `"${String(primitiveValue).toLowerCase()}"` : 'null'
      })
      
      result = result.replace(/#input\.orderMetadata\?\.(\w+)\?\.toUpperCase\(\)/g, (match, field) => {
        const primitiveValue = toPrimitive(context.input?.orderMetadata?.[field])
        return primitiveValue !== undefined && primitiveValue !== null ? `"${String(primitiveValue).toUpperCase()}"` : 'null'
      })
      
      // Handle method calls without safe navigation
      result = result.replace(/#input\.orderMetadata\.(\w+)\.toString\(\)/g, (match, field) => {
        const primitiveValue = toPrimitive(context.input?.orderMetadata?.[field])
        return primitiveValue !== undefined && primitiveValue !== null ? `"${primitiveValue}"` : '""'
      })
      
      result = result.replace(/#input\.(\w+)\.toString\(\)/g, (match, field) => {
        const primitiveValue = toPrimitive(context.input?.[field])
        return primitiveValue !== undefined && primitiveValue !== null ? `"${primitiveValue}"` : '""'
      })
      
      result = result.replace(/#input\.orderMetadata\.(\w+)\.toLowerCase\(\)/g, (match, field) => {
        const primitiveValue = toPrimitive(context.input?.orderMetadata?.[field])
        return primitiveValue !== undefined && primitiveValue !== null ? `"${String(primitiveValue).toLowerCase()}"` : '""'
      })
      
      result = result.replace(/#input\.orderMetadata\.(\w+)\.toUpperCase\(\)/g, (match, field) => {
        const primitiveValue = toPrimitive(context.input?.orderMetadata?.[field])
        return primitiveValue !== undefined && primitiveValue !== null ? `"${String(primitiveValue).toUpperCase()}"` : '""'
      })
      
      // Handle #input.orderMetadata?.field with safe navigation
      result = result.replace(/#input\.orderMetadata\?\.(\w+)/g, (match, field) => {
        const value = toPrimitive(context.input?.orderMetadata?.[field])
        if (value === undefined || value === null) return 'null'
        return typeof value === 'string' ? `"${value}"` : value
      })
      
      // Handle #input.orderMetadata.field references (without safe nav)
      result = result.replace(/#input\.orderMetadata\.(\w+)/g, (match, field) => {
        const value = toPrimitive(context.input?.orderMetadata?.[field])
        if (value === undefined || value === null) return 'null'
        return typeof value === 'string' ? `"${value}"` : value
      })
      
      // Handle #input.operation.field references
      result = result.replace(/#input\.operation\.(\w+)/g, (match, field) => {
        const value = context.input?.operation?.[field]
        if (value === undefined || value === null) return 'null'
        return typeof value === 'string' ? `"${value}"` : value
      })
      
      // Handle other #input.field references
      result = result.replace(/#input\.(\w+)/g, (match, field) => {
        const value = context.input?.[field]
        if (value === undefined || value === null) return 'null'
        return typeof value === 'string' ? `"${value}"` : value
      })
      
      // Handle standalone variables like #currencyCodeValue, #cityCodeValue
      result = result.replace(/#(\w+Value|isVatOptimisedOrder)/g, (match, field) => {
        const value = context[field]
        if (value === undefined || value === null) return 'null'
        if (typeof value === 'boolean') return value
        return typeof value === 'string' ? `"${value}"` : value
      })
      
      // Clean up any remaining undefined
      result = result.replace(/undefined/g, 'null')
      
      // Try to evaluate the final expression
      try {
        const evaluated = eval(result)
        return evaluated
      } catch (e) {
        console.error('Eval error for expression:', expression, '\nTransformed to:', result, '\nError:', e)
        // Return a safe default based on expected type
        return 0
      }
    } catch (error) {
      console.error('Expression evaluation error:', error, '\nExpression:', expression)
      return 0
    }
  }

  const getExpressionForCountry = (expressionsByCountry, country) => {
    if (!expressionsByCountry || expressionsByCountry.length === 0) return null
    
    const match = expressionsByCountry.find(expr => 
      expr.countries && expr.countries.includes(country)
    )
    
    return match?.expression || null
  }

  const generatePayloadWithContext = (inputVals, invoicingItemsVals, variablesVals) => {
    setErrors([])
    const newErrors = []
    
    // Create operation object with name function if needed
    const operationObj = inputVals.operation || { name: () => 'CREATE' }
    if (typeof operationObj.name === 'string') {
      const nameValue = operationObj.name
      operationObj.name = () => nameValue
    }
    
    const context = {
      input: {
        ...inputVals,
        operation: operationObj
      },
      invoicingItems: invoicingItemsVals,
      ...variablesVals
    }
    
    const payload = {}
    const country = variablesVals.financialSourceCountryCodeValue || 'ES'
    
    // Process field mappings
    if (fieldMappings && typeof fieldMappings === 'object') {
      Object.entries(fieldMappings).forEach(([fieldName, fieldConfig]) => {
        try {
          const expression = getExpressionForCountry(fieldConfig.expressionsByCountry, country)
          if (expression) {
            const value = evaluateExpression(expression, context)
            payload[fieldName] = value
          }
        } catch (error) {
          newErrors.push(`Error in field "${fieldName}": ${error.message}`)
        }
      })
    }
    
    // Process condition mappings
    const items = []
    if (conditionMappings && Array.isArray(conditionMappings)) {
      conditionMappings.forEach((condition) => {
        try {
          const expression = getExpressionForCountry(condition.expressionsByCountry, country)
          if (expression) {
            const value = evaluateExpression(expression, context)
            items.push({
              conditionType: condition.conditionType,
              conditionValue: typeof value === 'number' ? value.toFixed(2) : value
            })
          }
        } catch (error) {
          newErrors.push(`Error in condition "${condition.conditionType}": ${error.message}`)
        }
      })
    }
    
    payload.items = items
    
    setGeneratedPayload(payload)
    setErrors(newErrors)
  }

  const generatePayload = () => {
    if (!inputValues || !invoicingItems || !variables) {
      setErrors(['No input values provided. Please use Input Manager to set values.'])
      return
    }
    generatePayloadWithContext(inputValues, invoicingItems, variables)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(generatedPayload, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!providedInputValues || !inputValues || !invoicingItems || !variables) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Payload Simulator</h2>
          <p className="text-indigo-100">
            Generate and preview SAP payload based on your configuration
          </p>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-12 text-center">
          <InformationCircleIcon className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-yellow-900 mb-2">
            No Input Values Configured
          </h3>
          <p className="text-yellow-800 mb-6 max-w-md mx-auto">
            Please go to the <strong>Input Manager</strong> tab to configure your input values, 
            then click "Run Simulation with These Inputs" to see the generated payload.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-900">
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Input Manager → Run Simulation → View Results Here
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Payload Simulator Results</h2>
        <p className="text-indigo-100">
          Generated payload based on Input Manager configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Summary Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              Input Values Used
            </h3>
            
            <div className="space-y-3 text-sm">
              <SummaryItem label="Country" value={variables.financialSourceCountryCodeValue} />
              <SummaryItem label="Currency" value={variables.currencyCodeValue} />
              <SummaryItem label="City" value={variables.cityCodeValue} />
              <SummaryItem label="Order Code" value={inputValues.orderMetadata?.orderCode} />
              <SummaryItem label="Order ID" value={inputValues.orderMetadata?.orderId} />
              <SummaryItem label="Handling Strategy" value={inputValues.orderMetadata?.handlingStrategy} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoicing Items</h3>
            
            <div className="space-y-2 text-sm">
              {Object.entries(invoicingItems).map(([key, value]) => (
                value && (value.grossAmount?.value || value.netAmount?.value || value.amount?.value) ? (
                  <div key={key} className="border-b border-gray-100 pb-2">
                    <div className="font-medium text-gray-700">{key}</div>
                    <div className="grid grid-cols-3 gap-2 mt-1 text-xs text-gray-600">
                      {value.grossAmount?.value !== undefined && (
                        <div>Gross: <span className="font-semibold">{value.grossAmount.value}</span></div>
                      )}
                      {value.netAmount?.value !== undefined && (
                        <div>Net: <span className="font-semibold">{value.netAmount.value}</span></div>
                      )}
                      {value.amount?.value !== undefined && (
                        <div>Amount: <span className="font-semibold">{value.amount.value}</span></div>
                      )}
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          </div>

          <button
            onClick={generatePayload}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <PlayIcon className="h-5 w-5 mr-2" />
            Regenerate Payload
          </button>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <ExclamationCircleIcon className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Errors</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {generatedPayload && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Generated Payload
                  </h3>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-4">
                <pre className="text-sm bg-gray-50 rounded-lg p-4 overflow-auto max-h-[600px] border border-gray-200">
                  <code>{JSON.stringify(generatedPayload, null, 2)}</code>
                </pre>
              </div>
            </div>
          )}

          {!generatedPayload && errors.length === 0 && (
            <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
              <PlayIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                Configure your inputs and click "Generate Payload" to see the result
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryItem({ label, value }) {
  // Convert value to string safely
  const displayValue = React.useMemo(() => {
    if (value === null || value === undefined) return '(not set)'
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return String(value)
  }, [value])

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="text-gray-900 font-semibold truncate">{displayValue}</span>
    </div>
  )
}

