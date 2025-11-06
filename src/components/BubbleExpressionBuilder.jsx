import { useState, useRef, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { 
  XMarkIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { 
  getAllInvoicingItemNames, 
  getInvoicingItemDetails,
  getAllMoneyMovementNames,
  getMoneyMovementDetails 
} from '../data/referenceData'

const OPERATIONS = [
  { value: '+', label: 'Add (+)', color: 'bg-blue-100 text-blue-800' },
  { value: '-', label: 'Subtract (-)', color: 'bg-purple-100 text-purple-800' },
  { value: '*', label: 'Multiply (*)', color: 'bg-green-100 text-green-800' },
  { value: '/', label: 'Divide (/)', color: 'bg-yellow-100 text-yellow-800' },
]

const COMPARISON_OPS = [
  { value: '>', label: 'Greater than (>)', color: 'bg-pink-100 text-pink-800' },
  { value: '<', label: 'Less than (<)', color: 'bg-pink-100 text-pink-800' },
  { value: '==', label: 'Equals (==)', color: 'bg-pink-100 text-pink-800' },
  { value: '!=', label: 'Not equals (!=)', color: 'bg-pink-100 text-pink-800' },
]

const PROPERTIES = ['grossAmount', 'netAmount', 'amount']

export default function BubbleExpressionBuilder({ isOpen, onClose, expression, onSave }) {
  const [tokens, setTokens] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [editMode, setEditMode] = useState('visual') // 'visual' or 'text'
  const [textExpression, setTextExpression] = useState('')
  const [useOrderTypeMap, setUseOrderTypeMap] = useState(false)
  const [selectedOrderTypes, setSelectedOrderTypes] = useState({
    GEN1: true,
    GEN2: true,
    PICKUP: true
  })
  const [orderTypeExpressions, setOrderTypeExpressions] = useState({
    GEN1: [],
    GEN2: [],
    PICKUP: []
  })
  const [currentOrderType, setCurrentOrderType] = useState('GEN1')
  const [showConditionalBuilder, setShowConditionalBuilder] = useState(false)
  const [validationStatus, setValidationStatus] = useState({ isValid: true, errors: [] })
  const inputRef = useRef(null)

  const allInvoicingItems = getAllInvoicingItemNames()
  const allMoneyMovements = getAllMoneyMovementNames()
  const allItems = [...allInvoicingItems, ...allMoneyMovements]

  useEffect(() => {
    if (isOpen) {
      // Check if expression is an order type map
      const isMapExpression = expression && expression.includes('GEN1') && expression.includes('handlingStrategy')
      
      if (isMapExpression) {
        setUseOrderTypeMap(true)
        setTextExpression(expression || '')
        setEditMode('text')
      } else {
        setUseOrderTypeMap(false)
        parseExpressionToTokens(expression || '')
        setTextExpression(expression || '')
      }
    }
  }, [isOpen, expression])

  const parseExpressionToTokens = (expr) => {
    if (!expr) {
      setTokens([])
      return
    }

    const parts = []
    let lastIndex = 0

    // Parse both invoicing items and money movements
    // Now also handles the wrapping parentheses and ?: 0
    const invoicingPattern = /\(#invoicingItems\['([^']+)'\]\?\.(\w+)\?\.value\s*\?:\s*0\)/g
    const moneyPattern = /\(#moneyMovements\['([^']+)'\]\?\.(\w+)\?\.value\s*\?:\s*0\)/g
    
    // Also match without wrapping (for backward compatibility)
    const invoicingSimplePattern = /#invoicingItems\['([^']+)'\]\?\.(\w+)\?\.value/g
    const moneySimplePattern = /#moneyMovements\['([^']+)'\]\?\.(\w+)\?\.value/g
    
    // Combine all matches with their positions
    const allMatches = []
    
    let match
    while ((match = invoicingPattern.exec(expr)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        type: 'invoicingItem',
        itemName: match[1],
        property: match[2]
      })
    }
    
    while ((match = moneyPattern.exec(expr)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        type: 'moneyMovement',
        itemName: match[1],
        property: match[2]
      })
    }
    
    // Check for simple patterns (without wrapping)
    while ((match = invoicingSimplePattern.exec(expr)) !== null) {
      // Only add if not already matched by wrapped pattern
      const alreadyMatched = allMatches.some(m => 
        m.index <= match.index && m.index + m.length >= match.index + match[0].length
      )
      if (!alreadyMatched) {
        allMatches.push({
          index: match.index,
          length: match[0].length,
          type: 'invoicingItem',
          itemName: match[1],
          property: match[2]
        })
      }
    }
    
    while ((match = moneySimplePattern.exec(expr)) !== null) {
      const alreadyMatched = allMatches.some(m => 
        m.index <= match.index && m.index + m.length >= match.index + match[0].length
      )
      if (!alreadyMatched) {
        allMatches.push({
          index: match.index,
          length: match[0].length,
          type: 'moneyMovement',
          itemName: match[1],
          property: match[2]
        })
      }
    }
    
    // Sort matches by position
    allMatches.sort((a, b) => a.index - b.index)
    
    // Build parts array
    allMatches.forEach(match => {
      // Add text before match
      if (match.index > lastIndex) {
        let beforeText = expr.substring(lastIndex, match.index).trim()
        // Remove common wrapping characters that we're auto-adding
        beforeText = beforeText.replace(/\(\s*$/, '').trim()
        if (beforeText) parts.push({ type: 'text', value: beforeText })
      }
      
      // Add token
      parts.push({
        type: match.type,
        itemName: match.itemName,
        property: match.property
      })
      
      lastIndex = match.index + match.length
    })

    // Add remaining text
    if (lastIndex < expr.length) {
      let remainingText = expr.substring(lastIndex).trim()
      // Remove common wrapping characters
      remainingText = remainingText.replace(/^\s*\?:\s*0\s*\)/, '').trim()
      if (remainingText) parts.push({ type: 'text', value: remainingText })
    }

    setTokens(parts.length > 0 ? parts : [])
  }

  const tokensToExpression = (tokenList) => {
    return tokenList.map(token => {
      if (token.type === 'invoicingItem') {
        // Auto-wrap in parentheses with ?: 0 fallback
        return `(#invoicingItems['${token.itemName}']?.${token.property}?.value ?: 0)`
      } else if (token.type === 'moneyMovement') {
        // Auto-wrap in parentheses with ?: 0 fallback
        return `(#moneyMovements['${token.itemName}']?.${token.property}?.value ?: 0)`
      } else if (token.type === 'operation') {
        return ` ${token.value} `
      } else if (token.type === 'text') {
        return token.value
      }
      return ''
    }).join('').trim()
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)

    // Parse input: invoicingItems.ITEM_NAME.property or moneyMovements.ITEM_NAME.property
    const isInvoicing = value.startsWith('invoicingItems.')
    const isMoneyMovement = value.startsWith('moneyMovements.')
    
    if (isInvoicing || isMoneyMovement) {
      const prefix = isInvoicing ? 'invoicingItems.' : 'moneyMovements.'
      const parts = value.substring(prefix.length)
      const dotIndex = parts.indexOf('.')
      const sourceList = isInvoicing ? allInvoicingItems : allMoneyMovements
      const type = isInvoicing ? 'invoicing' : 'money'
      
      if (dotIndex === -1) {
        // Still typing item name
        const searchTerm = parts
        const matches = sourceList
          .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(item => ({ name: item, type, hasProperty: false }))
        setSuggestions(matches.slice(0, 15))
        setShowSuggestions(matches.length > 0)
        setSelectedSuggestionIndex(0)
      } else {
        // Typing property
        const itemName = parts.substring(0, dotIndex)
        const propertyPart = parts.substring(dotIndex + 1)
        
        if (sourceList.includes(itemName)) {
          const propertyMatches = PROPERTIES.filter(p =>
            p.toLowerCase().startsWith(propertyPart.toLowerCase())
          )
          setSuggestions(propertyMatches.map(p => ({ 
            name: `${itemName}.${p}`, 
            type, 
            hasProperty: true,
            itemName 
          })))
          setShowSuggestions(propertyMatches.length > 0)
          setSelectedSuggestionIndex(0)
        }
      }
    } else if (value.length > 0) {
      // Show both types when just starting to type
      const searchTerm = value.toLowerCase()
      const invoicingMatches = allInvoicingItems
        .filter(item => item.toLowerCase().includes(searchTerm))
        .slice(0, 8)
        .map(item => ({ name: item, type: 'invoicing', hasProperty: false }))
      
      const moneyMatches = allMoneyMovements
        .filter(item => item.toLowerCase().includes(searchTerm))
        .slice(0, 7)
        .map(item => ({ name: item, type: 'money', hasProperty: false }))
      
      const combined = [...invoicingMatches, ...moneyMatches]
      setSuggestions(combined)
      setShowSuggestions(combined.length > 0)
      setSelectedSuggestionIndex(0)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions) {
      if (e.key === 'Enter') {
        e.preventDefault()
        addCurrentInput()
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => prev > 0 ? prev - 1 : 0)
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      selectSuggestion(suggestions[selectedSuggestionIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (suggestion) => {
    if (!suggestion) return

    const prefix = suggestion.type === 'invoicing' ? 'invoicingItems.' : 'moneyMovements.'
    
    if (suggestion.hasProperty) {
      // Complete path (item.property)
      const parts = suggestion.name.split('.')
      addToken({
        type: suggestion.type === 'invoicing' ? 'invoicingItem' : 'moneyMovement',
        itemName: parts[0],
        property: parts[1]
      })
      setInputValue('')
      setShowSuggestions(false)
    } else {
      // Just item name, need property
      const fullPath = `${prefix}${suggestion.name}.`
      setInputValue(fullPath)
      setShowSuggestions(false)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }

  const addCurrentInput = () => {
    if (!inputValue.trim()) return

    // Check if it's a complete invoicing item path
    if (inputValue.startsWith('invoicingItems.')) {
      const parts = inputValue.substring('invoicingItems.'.length).split('.')
      if (parts.length === 2 && allInvoicingItems.includes(parts[0]) && PROPERTIES.includes(parts[1])) {
        addToken({
          type: 'invoicingItem',
          itemName: parts[0],
          property: parts[1]
        })
        setInputValue('')
        return
      }
    }

    // Check if it's a complete money movement path
    if (inputValue.startsWith('moneyMovements.')) {
      const parts = inputValue.substring('moneyMovements.'.length).split('.')
      if (parts.length === 2 && allMoneyMovements.includes(parts[0]) && PROPERTIES.includes(parts[1])) {
        addToken({
          type: 'moneyMovement',
          itemName: parts[0],
          property: parts[1]
        })
        setInputValue('')
        return
      }
    }

    // Otherwise add as text
    addToken({ type: 'text', value: inputValue })
    setInputValue('')
  }

  const canAddItem = (tokenList) => {
    if (tokenList.length === 0) return true
    const lastToken = tokenList[tokenList.length - 1]
    // Can only add item if last token is an operation or text (not another item)
    return lastToken.type === 'operation' || lastToken.type === 'text' || lastToken.value === '?'
  }

  const canAddOperation = (tokenList) => {
    if (tokenList.length === 0) return false
    const lastToken = tokenList[tokenList.length - 1]
    // Can only add operation if last token is an item
    return lastToken.type === 'invoicingItem' || lastToken.type === 'moneyMovement'
  }

  const addToken = (token) => {
    const currentTokens = useOrderTypeMap ? orderTypeExpressions[currentOrderType] : tokens
    
    // Validate token addition
    if ((token.type === 'invoicingItem' || token.type === 'moneyMovement') && !canAddItem(currentTokens)) {
      alert('Please add an operation (+, -, *, /) before adding another item')
      return
    }
    
    if (token.type === 'operation' && !canAddOperation(currentTokens)) {
      alert('Please add an item before the operation')
      return
    }

    if (useOrderTypeMap) {
      // Add to current order type's expressions
      setOrderTypeExpressions({
        ...orderTypeExpressions,
        [currentOrderType]: [...orderTypeExpressions[currentOrderType], token]
      })
    } else {
      setTokens([...tokens, token])
    }
  }

  const removeOrderTypeToken = (orderType, tokenIndex) => {
    setOrderTypeExpressions({
      ...orderTypeExpressions,
      [orderType]: orderTypeExpressions[orderType].filter((_, i) => i !== tokenIndex)
    })
  }

  const addOperation = (operation) => {
    addToken({ type: 'operation', value: operation })
    setTimeout(() => inputRef.current?.focus(), 10)
  }

  const addConditional = (conditionItem, thenItem, elseItem) => {
    // Build ternary expression: condition > 0 ? thenItem : elseItem
    const conditionExpr = `(#${conditionItem.type === 'invoicing' ? 'invoicingItems' : 'moneyMovements'}['${conditionItem.itemName}']?.${conditionItem.property}?.value ?: 0) > 0`
    const thenExpr = `(#${thenItem.type === 'invoicing' ? 'invoicingItems' : 'moneyMovements'}['${thenItem.itemName}']?.${thenItem.property}?.value ?: 0)`
    const elseExpr = `(#${elseItem.type === 'invoicing' ? 'invoicingItems' : 'moneyMovements'}['${elseItem.itemName}']?.${elseItem.property}?.value ?: 0)`
    
    const fullConditional = `${conditionExpr} ? ${thenExpr} : ${elseExpr}`
    
    // Add as a text token
    addToken({ type: 'text', value: fullConditional })
    setShowConditionalBuilder(false)
  }

  const removeToken = (index) => {
    setTokens(tokens.filter((_, i) => i !== index))
  }

  const generateOrderTypeMap = () => {
    const entries = []
    if (selectedOrderTypes.GEN1) {
      const expr = tokensToExpression(orderTypeExpressions.GEN1)
      entries.push(`  'GEN1': (${expr || ''})`)
    }
    if (selectedOrderTypes.GEN2) {
      const expr = tokensToExpression(orderTypeExpressions.GEN2)
      entries.push(`  'GEN2': (${expr || ''})`)
    }
    if (selectedOrderTypes.PICKUP) {
      const expr = tokensToExpression(orderTypeExpressions.PICKUP)
      entries.push(`  'PICKUP': (${expr || ''})`)
    }
    
    return `{\n${entries.join(',\n')}\n}[#input.orderMetadata.handlingStrategy]`
  }

  const validateExpression = (expr) => {
    const errors = []
    
    if (!expr || expr.trim() === '') {
      return { isValid: false, errors: ['Expression is empty'] }
    }

    // Check for balanced parentheses
    let parenCount = 0
    for (const char of expr) {
      if (char === '(') parenCount++
      if (char === ')') parenCount--
      if (parenCount < 0) {
        errors.push('Unbalanced parentheses: too many closing parentheses')
        break
      }
    }
    if (parenCount > 0) {
      errors.push('Unbalanced parentheses: missing closing parentheses')
    }

    // Check for common syntax errors
    if (expr.includes('??')) {
      errors.push('Double question marks (??) detected - use single ? for ternary')
    }
    if (expr.match(/\?\s*\?/)) {
      errors.push('Consecutive operators detected')
    }
    if (expr.includes(':::')) {
      errors.push('Triple colons detected - use ?: for elvis operator')
    }

    // Check for incomplete ternary
    const ternaryMatches = expr.match(/\?[^:]*$/g)
    if (ternaryMatches && !expr.includes('?:')) {
      errors.push('Incomplete ternary operator - missing colon (:)')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const handleSave = () => {
    let finalExpression
    
    if (useOrderTypeMap) {
      finalExpression = generateOrderTypeMap()
    } else {
      finalExpression = editMode === 'visual' 
        ? tokensToExpression(tokens)
        : textExpression
    }

    // Validate before saving
    const validation = validateExpression(finalExpression)
    if (!validation.isValid) {
      const confirmSave = window.confirm(
        `Expression has validation warnings:\n\n${validation.errors.join('\n')}\n\nSave anyway?`
      )
      if (!confirmSave) return
    }
    
    onSave(finalExpression)
    onClose()
  }

  // Validate whenever expression changes
  useEffect(() => {
    if (editMode === 'visual') {
      const expr = useOrderTypeMap ? generateOrderTypeMap() : tokensToExpression(tokens)
      setValidationStatus(validateExpression(expr))
    } else {
      setValidationStatus(validateExpression(textExpression))
    }
  }, [tokens, textExpression, editMode, useOrderTypeMap, orderTypeExpressions])

  const toggleOrderType = (type) => {
    setSelectedOrderTypes({
      ...selectedOrderTypes,
      [type]: !selectedOrderTypes[type]
    })
  }

  const switchToTextMode = () => {
    setTextExpression(tokensToExpression(tokens))
    setEditMode('text')
  }

  const switchToVisualMode = () => {
    parseExpressionToTokens(textExpression)
    setEditMode('visual')
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-5xl w-full bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Expression Builder
              </Dialog.Title>
              <p className="mt-1 text-sm text-gray-500">
                Build expressions using bubbles and autocomplete
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="px-6 pt-4 pb-2 border-b border-gray-200 bg-gray-50">
            <div className="flex space-x-2">
              <button
                onClick={() => editMode === 'text' ? switchToVisualMode() : null}
                disabled={editMode === 'visual'}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  editMode === 'visual'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Visual Mode
              </button>
              <button
                onClick={() => editMode === 'visual' ? switchToTextMode() : null}
                disabled={editMode === 'text'}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  editMode === 'text'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Text Mode
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Order Type Toggle */}
            <div className="mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useOrderTypeMap}
                  onChange={(e) => {
                    setUseOrderTypeMap(e.target.checked)
                    if (e.target.checked) {
                      setEditMode('visual')
                    }
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Use Order Type Map (GEN1/GEN2/PICKUP)
                  </span>
                  <p className="text-xs text-gray-600">
                    Create different expressions for each handling strategy
                  </p>
                </div>
              </label>

              {useOrderTypeMap && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-medium text-gray-700">Select Order Types:</div>
                  <div className="flex space-x-4">
                    {['GEN1', 'GEN2', 'PICKUP'].map(type => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedOrderTypes[type]}
                          onChange={() => toggleOrderType(type)}
                          className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {editMode === 'visual' ? (
              <div className="space-y-6">
                {useOrderTypeMap ? (
                  /* Order Type Map Builder */
                  <div className="space-y-4">
                    {/* Order Type Selector */}
                    <div className="flex space-x-2 bg-white rounded-lg p-2 border border-gray-200">
                      {Object.keys(selectedOrderTypes).filter(type => selectedOrderTypes[type]).map(type => (
                        <button
                          key={type}
                          onClick={() => setCurrentOrderType(type)}
                          className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                            currentOrderType === type
                              ? 'bg-indigo-600 text-white shadow'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    {/* Current Order Type Expression */}
                    <div className="bg-gray-50 border-2 border-dashed border-indigo-300 rounded-lg p-4 min-h-[120px]">
                      <div className="text-sm font-medium text-indigo-900 mb-2">
                        Expression for {currentOrderType}:
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        {orderTypeExpressions[currentOrderType].map((token, index) => (
                          <TokenBubble
                            key={index}
                            token={token}
                            onRemove={() => removeOrderTypeToken(currentOrderType, index)}
                          />
                        ))}
                        
                        {/* Input field */}
                        <div className="relative flex-1 min-w-[200px]">
                          <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Start typing... (e.g., PRODUCTS or invoicingItems.ITEM.property)"
                            className="w-full px-3 py-2 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded text-sm"
                          />
                          
                          {/* Autocomplete dropdown */}
                          {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 mt-1 w-full max-w-lg bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-80 overflow-auto">
                              {suggestions.map((suggestion, index) => {
                                const itemName = suggestion.hasProperty 
                                  ? suggestion.itemName || suggestion.name.split('.')[0]
                                  : suggestion.name
                                
                                const details = suggestion.type === 'invoicing'
                                  ? getInvoicingItemDetails(itemName)
                                  : getMoneyMovementDetails(itemName)
                                
                                const typeLabel = suggestion.type === 'invoicing' ? 'Invoicing Item' : 'Money Movement'
                                const typeBadgeColor = suggestion.type === 'invoicing' 
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-cyan-100 text-cyan-700'
                                
                                return (
                                  <button
                                    key={index}
                                    onClick={() => selectSuggestion(suggestion)}
                                    className={`w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                                      index === selectedSuggestionIndex ? 'bg-indigo-100' : ''
                                    }`}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                          <code className="font-mono text-sm text-gray-900 font-semibold">
                                            {suggestion.name}
                                          </code>
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeBadgeColor}`}>
                                            {typeLabel}
                                          </span>
                                        </div>
                                        {details && (
                                          <div className="text-xs text-gray-600 mt-1">
                                            {details.description}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Regular Expression Builder */
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[120px]">
                  <div className="flex flex-wrap gap-2 items-center">
                    {tokens.map((token, index) => (
                      <TokenBubble
                        key={index}
                        token={token}
                        onRemove={() => removeToken(index)}
                      />
                    ))}
                    
                    {/* Input field */}
                    <div className="relative flex-1 min-w-[200px]">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Start typing... (e.g., PRODUCTS or invoicingItems.ITEM.property)"
                        className="w-full px-3 py-2 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded text-sm"
                      />
                      
                      {/* Autocomplete dropdown */}
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 w-full max-w-lg bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-80 overflow-auto">
                          {suggestions.map((suggestion, index) => {
                            const itemName = suggestion.hasProperty 
                              ? suggestion.itemName || suggestion.name.split('.')[0]
                              : suggestion.name
                            
                            const details = suggestion.type === 'invoicing'
                              ? getInvoicingItemDetails(itemName)
                              : getMoneyMovementDetails(itemName)
                            
                            const typeLabel = suggestion.type === 'invoicing' ? 'Invoicing Item' : 'Money Movement'
                            const typeBadgeColor = suggestion.type === 'invoicing' 
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-cyan-100 text-cyan-700'
                            
                            return (
                              <button
                                key={index}
                                onClick={() => selectSuggestion(suggestion)}
                                className={`w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                                  index === selectedSuggestionIndex ? 'bg-indigo-100' : ''
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <code className="font-mono text-sm text-gray-900 font-semibold">
                                        {suggestion.name}
                                      </code>
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeBadgeColor}`}>
                                        {typeLabel}
                                      </span>
                                    </div>
                                    {details && (
                                      <div className="text-xs text-gray-600 mt-1">
                                        {details.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                )}

                {/* Helper text */}
                <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="font-medium text-blue-900 mb-1">💡 How to use:</div>
                  <ul className="space-y-1 text-blue-800">
                    <li>• Start typing - autocomplete shows both Invoicing Items and Money Movements</li>
                    <li>• Or type <code className="bg-blue-100 px-1 rounded">invoicingItems.</code> or <code className="bg-blue-100 px-1 rounded">moneyMovements.</code></li>
                    <li>• Select item and property, press Enter to create bubble</li>
                    <li>• Click operation buttons below to add between values</li>
                    <li>• Click X on any bubble to remove it</li>
                    <li>• <strong>Note:</strong> All items auto-wrapped in <code className="bg-blue-100 px-1 rounded">(... ?: 0)</code> for safety</li>
                  </ul>
                </div>

                {/* Operations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Add Operations
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {OPERATIONS.map(op => (
                      <button
                        key={op.value}
                        onClick={() => addOperation(op.value)}
                        className={`px-4 py-3 rounded-lg font-medium text-sm transition-all hover:shadow-md ${op.color}`}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional Builder */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Conditional Expression
                  </label>
                  <button
                    onClick={() => setShowConditionalBuilder(!showConditionalBuilder)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-rose-700 transition-colors shadow-md"
                  >
                    {showConditionalBuilder ? 'Close' : 'Build If/Then/Else'}
                  </button>

                  {showConditionalBuilder && (
                    <ConditionalBuilder
                      onAdd={addConditional}
                      onCancel={() => setShowConditionalBuilder(false)}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expression (SpEL Syntax)
                </label>
                <textarea
                  value={textExpression}
                  onChange={(e) => setTextExpression(e.target.value)}
                  rows={12}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-mono"
                  placeholder="Enter expression in SpEL syntax..."
                />
              </div>
            )}

            {/* Validation Status */}
            {!validationStatus.isValid && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <XMarkIcon className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-red-800 mb-1">Validation Errors</div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {validationStatus.errors.map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {validationStatus.isValid && (useOrderTypeMap || tokens.length > 0 || textExpression) && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
                <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Expression is valid</span>
              </div>
            )}

            {/* Preview */}
            <div className="mt-4 bg-gray-900 rounded-lg p-4">
              <div className="text-xs font-medium text-gray-400 mb-2">
                Generated Expression:
              </div>
              <code className="text-sm text-green-400 break-all whitespace-pre-wrap">
                {useOrderTypeMap && editMode === 'visual' 
                  ? generateOrderTypeMap()
                  : editMode === 'visual' 
                    ? tokensToExpression(tokens) 
                    : textExpression}
              </code>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              {useOrderTypeMap ? (
                <>🗺️ Order Type Map: {Object.values(selectedOrderTypes).filter(Boolean).length} types</>
              ) : editMode === 'visual' ? (
                <>✨ {tokens.length} element{tokens.length !== 1 ? 's' : ''} in expression</>
              ) : (
                <>📝 Text editing mode</>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <CheckIcon className="h-4 w-4 inline mr-1" />
                Save Expression
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

function ConditionalBuilder({ onAdd, onCancel }) {
  const [conditionItem, setConditionItem] = useState(null)
  const [comparisonOp, setComparisonOp] = useState('>')
  const [comparisonValue, setComparisonValue] = useState('0')
  const [thenItem, setThenItem] = useState(null)
  const [elseItem, setElseItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selecting, setSelecting] = useState(null) // 'condition', 'then', or 'else'

  const allInvoicingItems = getAllInvoicingItemNames()
  const allMoneyMovements = getAllMoneyMovementNames()
  const allItems = [...allInvoicingItems, ...allMoneyMovements]

  const filteredItems = searchTerm
    ? allItems.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
    : allItems

  const selectItem = (itemName, property) => {
    const isInvoicing = allInvoicingItems.includes(itemName)
    const item = {
      type: isInvoicing ? 'invoicing' : 'money',
      itemName,
      property
    }

    if (selecting === 'condition') setConditionItem(item)
    else if (selecting === 'then') setThenItem(item)
    else if (selecting === 'else') setElseItem(item)
    
    setSelecting(null)
    setSearchTerm('')
  }

  const canAdd = conditionItem && thenItem && elseItem

  return (
    <div className="mt-4 bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300 rounded-lg p-4 space-y-4">
      <div className="text-sm font-medium text-pink-900 mb-2">
        Build: IF (condition) THEN (value1) ELSE (value2)
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          IF (condition check):
        </label>
        {conditionItem ? (
          <div className="flex items-center space-x-2">
            <div className="px-3 py-2 bg-white border border-gray-300 rounded text-sm">
              {conditionItem.itemName}.{conditionItem.property}
            </div>
            <select
              value={comparisonOp}
              onChange={(e) => setComparisonOp(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded text-sm"
            >
              <option value=">">{'>'}</option>
              <option value="<">{'<'}</option>
              <option value="==">==</option>
              <option value="!=">!=</option>
            </select>
            <input
              type="text"
              value={comparisonValue}
              onChange={(e) => setComparisonValue(e.target.value)}
              className="w-20 px-2 py-2 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={() => setConditionItem(null)}
              className="text-red-600 hover:bg-red-50 px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSelecting('condition')}
            className="px-3 py-2 bg-white border-2 border-dashed border-gray-300 rounded text-sm hover:border-pink-400 transition-colors"
          >
            + Select Item
          </button>
        )}
      </div>

      {/* Then */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          THEN (use this value):
        </label>
        {thenItem ? (
          <div className="flex items-center space-x-2">
            <div className="px-3 py-2 bg-white border border-gray-300 rounded text-sm">
              {thenItem.itemName}.{thenItem.property}
            </div>
            <button
              onClick={() => setThenItem(null)}
              className="text-red-600 hover:bg-red-50 px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSelecting('then')}
            className="px-3 py-2 bg-white border-2 border-dashed border-gray-300 rounded text-sm hover:border-pink-400 transition-colors"
          >
            + Select Item
          </button>
        )}
      </div>

      {/* Else */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          ELSE (use this value):
        </label>
        {elseItem ? (
          <div className="flex items-center space-x-2">
            <div className="px-3 py-2 bg-white border border-gray-300 rounded text-sm">
              {elseItem.itemName}.{elseItem.property}
            </div>
            <button
              onClick={() => setElseItem(null)}
              className="text-red-600 hover:bg-red-50 px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSelecting('else')}
            className="px-3 py-2 bg-white border-2 border-dashed border-gray-300 rounded text-sm hover:border-pink-400 transition-colors"
          >
            + Select Item
          </button>
        )}
      </div>

      {/* Item Selector Modal */}
      {selecting && (
        <div className="bg-white border border-pink-300 rounded-lg p-3 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Select item for {selecting.toUpperCase()}
            </span>
            <button
              onClick={() => setSelecting(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
          />

          <div className="max-h-40 overflow-auto space-y-1">
            {filteredItems.slice(0, 10).map(itemName => (
              <div key={itemName} className="border-b border-gray-100 pb-1">
                <div className="text-xs font-semibold text-gray-700 mb-1">{itemName}</div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => selectItem(itemName, 'grossAmount')}
                    className="flex-1 px-2 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded text-xs"
                  >
                    Gross
                  </button>
                  <button
                    onClick={() => selectItem(itemName, 'netAmount')}
                    className="flex-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs"
                  >
                    Net
                  </button>
                  <button
                    onClick={() => selectItem(itemName, 'amount')}
                    className="flex-1 px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded text-xs"
                  >
                    Amount
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2 pt-2">
        <button
          onClick={() => canAdd && onAdd(conditionItem, thenItem, elseItem)}
          disabled={!canAdd}
          className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          Add Conditional
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function TokenBubble({ token, onRemove }) {
  if (token.type === 'invoicingItem' || token.type === 'moneyMovement') {
    const details = token.type === 'invoicingItem'
      ? getInvoicingItemDetails(token.itemName)
      : getMoneyMovementDetails(token.itemName)
    
    const colors = {
      grossAmount: 'bg-green-100 text-green-800 border-green-300',
      netAmount: 'bg-blue-100 text-blue-800 border-blue-300',
      amount: 'bg-purple-100 text-purple-800 border-purple-300'
    }

    const typeIndicator = token.type === 'moneyMovement' ? '💰 ' : ''

    return (
      <div
        className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full border-2 ${colors[token.property]} shadow-sm group hover:shadow-md transition-all`}
        title={details?.description}
      >
        <span className="text-sm font-medium">
          {typeIndicator}{token.itemName}
        </span>
        <span className="text-xs opacity-75">
          .{token.property}
        </span>
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-white/50 rounded-full p-0.5 transition-colors"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      </div>
    )
  }

  if (token.type === 'operation') {
    return (
      <div className="inline-flex items-center space-x-1 px-3 py-2 rounded-lg bg-orange-100 text-orange-800 font-bold shadow-sm">
        <span>{token.value}</span>
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-white/50 rounded-full p-0.5 transition-colors"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      </div>
    )
  }

  if (token.type === 'text') {
    return (
      <div className="inline-flex items-center space-x-1 px-3 py-2 rounded bg-gray-200 text-gray-800 text-sm font-mono shadow-sm">
        <span>{token.value}</span>
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-white/50 rounded-full p-0.5 transition-colors"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      </div>
    )
  }

  return null
}

