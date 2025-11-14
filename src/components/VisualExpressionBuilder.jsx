import { useState } from 'react'
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  PlusIcon, 
  TrashIcon, 
  CodeBracketIcon,
  CubeIcon,
  CalculatorIcon,
  QuestionMarkCircleIcon,
  ListBulletIcon,
  FunnelIcon,
  InformationCircleIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import { Tab, Listbox } from '@headlessui/react'
import { getAllInvoicingItemNames, getInvoicingItemDetails } from '../data/referenceData'

// Get all valid invoicing items
const VALID_INVOICING_ITEMS = getAllInvoicingItemNames()

// Expression building blocks with SpEL descriptions
const CONCEPTS = [
  { 
    id: 'input', 
    label: 'Input Field', 
    icon: CubeIcon, 
    template: '#input.',
    description: 'SpEL: Access input properties with #input.propertyName'
  },
  { 
    id: 'invoicingItems', 
    label: 'Invoicing Item (Select)', 
    icon: ListBulletIcon, 
    template: null, 
    isSelector: true,
    description: 'SpEL: Access invoicing items map with square brackets'
  },
  { 
    id: 'orderMetadata', 
    label: 'Order Metadata', 
    icon: CubeIcon, 
    template: '#input.orderMetadata.',
    description: 'SpEL: Nested property navigation using dots'
  },
  { 
    id: 'handlingStrategy', 
    label: 'Handling Strategy', 
    icon: FunnelIcon, 
    template: '#input.orderMetadata.handlingStrategy',
    description: 'SpEL: Direct access to handling strategy variable'
  },
  { 
    id: 'variable', 
    label: 'Variable', 
    icon: CubeIcon, 
    template: '#',
    description: 'SpEL: All variables start with # prefix'
  },
]

const OPERATIONS = [
  { 
    id: 'add', 
    label: 'Add (+)', 
    icon: PlusIcon, 
    template: ' + ',
    description: 'SpEL: Arithmetic addition operator'
  },
  { 
    id: 'subtract', 
    label: 'Subtract (-)', 
    icon: CalculatorIcon, 
    template: ' - ',
    description: 'SpEL: Arithmetic subtraction operator'
  },
  { 
    id: 'multiply', 
    label: 'Multiply (*)', 
    icon: CalculatorIcon, 
    template: ' * ',
    description: 'SpEL: Arithmetic multiplication operator'
  },
  { 
    id: 'divide', 
    label: 'Divide (/)', 
    icon: CalculatorIcon, 
    template: ' / ',
    description: 'SpEL: Arithmetic division operator'
  },
  { 
    id: 'ternary', 
    label: 'Condition (?:)', 
    icon: QuestionMarkCircleIcon, 
    template: ' ? : ',
    description: 'SpEL: Ternary conditional (condition ? ifTrue : ifFalse)'
  },
  { 
    id: 'elvis', 
    label: 'Elvis Operator (?:)', 
    icon: QuestionMarkCircleIcon, 
    template: ' ?: ',
    description: 'SpEL: Elvis operator - returns right if left is null'
  },
  { 
    id: 'nullSafe', 
    label: 'Null Safe (?.)', 
    icon: QuestionMarkCircleIcon, 
    template: '?.',
    description: 'SpEL: Safe navigation - prevents NullPointerException'
  },
  { 
    id: 'mapLookup', 
    label: 'Map Lookup', 
    icon: ListBulletIcon, 
    template: "{ '': }[]",
    description: 'SpEL: Inline map literal with key-value lookup'
  },
  { 
    id: 'parentheses', 
    label: 'Grouping ()', 
    icon: CalculatorIcon, 
    template: '()',
    description: 'SpEL: Group expressions for precedence'
  },
  { 
    id: 'toString', 
    label: 'To String', 
    icon: CodeBracketIcon, 
    template: '.toString()',
    description: 'SpEL: Method call - convert value to string'
  },
  { 
    id: 'toLowerCase', 
    label: 'To Lower', 
    icon: CodeBracketIcon, 
    template: '.toLowerCase()',
    description: 'SpEL: Method call - convert string to lowercase'
  },
  { 
    id: 'toUpperCase', 
    label: 'To Upper', 
    icon: CodeBracketIcon, 
    template: '.toUpperCase()',
    description: 'SpEL: Method call - convert string to uppercase'
  },
]

const COMMON_EXPRESSIONS = [
  { 
    id: 'orderCode', 
    label: 'Order Code',
    expression: '#input.orderMetadata.orderCode',
    description: 'SpEL: Simple property access'
  },
  { 
    id: 'orderId', 
    label: 'Order ID',
    expression: '#input.orderMetadata.orderId.toString()',
    description: 'SpEL: Property access with method call'
  },
  { 
    id: 'deliveryFeeMap', 
    label: 'Delivery Service Map',
    expression: "{ 'GEN1': 'Restaurant', 'GEN2': 'Glovo', 'PICKUP': 'Selfpick' }[#input.orderMetadata.handlingStrategy]",
    description: 'SpEL: Map literal with dynamic key lookup'
  },
  { 
    id: 'productsGross', 
    label: 'Products Gross Amount',
    expression: "#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value ?: 0",
    description: 'SpEL: Safe navigation with Elvis operator default'
  },
  { 
    id: 'productsNet', 
    label: 'Products Net Amount',
    expression: "#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0",
    description: 'SpEL: Safe navigation with Elvis operator default'
  },
  { 
    id: 'tipGross', 
    label: 'Tip Gross Amount',
    expression: "#invoicingItems['TIP_TO_CUSTOMER']?.grossAmount?.value ?: 0",
    description: 'SpEL: Safe navigation with Elvis operator default'
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function VisualExpressionBuilder({ expression, onChange }) {
  const [activeId, setActiveId] = useState(null)
  const [mode, setMode] = useState('visual') // 'visual' or 'text'
  const [selectedInvoicingItem, setSelectedInvoicingItem] = useState(VALID_INVOICING_ITEMS[0])
  const [showItemSelector, setShowItemSelector] = useState(false)

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    setActiveId(null)
    
    if (event.over) {
      const draggedItem = [...CONCEPTS, ...OPERATIONS, ...COMMON_EXPRESSIONS].find(
        item => item.id === event.active.id
      )
      
      if (draggedItem) {
        const template = draggedItem.expression || draggedItem.template
        onChange(expression ? expression + template : template)
      }
    }
  }

  const insertAtCursor = (template) => {
    onChange(expression ? expression + template : template)
  }

  const insertInvoicingItem = (itemName, property = 'grossAmount', includeValue = true) => {
    const template = includeValue 
      ? `#invoicingItems['${itemName}']?.${property}?.value`
      : `#invoicingItems['${itemName}']`
    onChange(expression ? expression + template : template)
    setShowItemSelector(false)
  }

  const clearExpression = () => {
    onChange('')
  }

  return (
    <div className="space-y-3">
      {/* SpEL Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-2">
        <BookOpenIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900">SpEL Expression Builder</h3>
          <p className="text-xs text-blue-700 mt-1">
            Build expressions using <strong>Spring Expression Language (SpEL)</strong>. 
            All variables start with <code className="bg-blue-100 px-1 rounded">#</code>. 
            Use safe navigation <code className="bg-blue-100 px-1 rounded">?.</code> and 
            Elvis operator <code className="bg-blue-100 px-1 rounded">?:</code> for null safety.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setMode('visual')}
            className={classNames(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              mode === 'visual'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Visual Builder
          </button>
          <button
            onClick={() => setMode('text')}
            className={classNames(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              mode === 'text'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Text Editor
          </button>
        </div>
        <button
          onClick={clearExpression}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <TrashIcon className="h-4 w-4 mr-1" />
          Clear
        </button>
      </div>

      {mode === 'visual' ? (
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Building blocks palette */}
            <div className="lg:col-span-2 space-y-4">
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-md py-2 text-sm font-medium',
                        selected
                          ? 'bg-white shadow'
                          : 'text-gray-600 hover:text-gray-800'
                      )
                    }
                  >
                    Concepts
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-md py-2 text-sm font-medium',
                        selected
                          ? 'bg-white shadow'
                          : 'text-gray-600 hover:text-gray-800'
                      )
                    }
                  >
                    Operations
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-md py-2 text-sm font-medium',
                        selected
                          ? 'bg-white shadow'
                          : 'text-gray-600 hover:text-gray-800'
                      )
                    }
                  >
                    Common
                  </Tab>
                </Tab.List>
                <Tab.Panels className="mt-2">
                  <Tab.Panel>
                    <div className="grid grid-cols-2 gap-2">
                      {CONCEPTS.map((concept) => (
                        concept.isSelector ? (
                          <div
                            key={concept.id}
                            onClick={() => setShowItemSelector(!showItemSelector)}
                            className="cursor-pointer bg-white border-2 border-gray-200 hover:border-indigo-400 rounded-lg p-3 transition-all hover:shadow-md"
                          >
                            <div className="flex items-center space-x-2">
                              <ListBulletIcon className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {concept.label}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <DraggableBlock
                            key={concept.id}
                            item={concept}
                            onClick={() => insertAtCursor(concept.template)}
                          />
                        )
                      ))}
                    </div>
                    
                    {/* Invoicing Item Selector */}
                    {showItemSelector && (
                      <div className="mt-3 bg-white border border-indigo-300 rounded-lg p-4 shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-900">Select Invoicing Item</h4>
                          <button
                            onClick={() => setShowItemSelector(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <select
                            value={selectedInvoicingItem}
                            onChange={(e) => setSelectedInvoicingItem(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                          >
                            {VALID_INVOICING_ITEMS.map(item => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>

                          {getInvoicingItemDetails(selectedInvoicingItem) && (
                            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                              {getInvoicingItemDetails(selectedInvoicingItem).description}
                            </div>
                          )}

                          <div className="text-xs font-medium text-gray-700 mb-1">Property:</div>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => insertInvoicingItem(selectedInvoicingItem, 'grossAmount')}
                              className="px-3 py-2 text-xs bg-green-100 hover:bg-green-200 text-green-800 rounded-md transition-colors"
                            >
                              Gross Amount
                            </button>
                            <button
                              onClick={() => insertInvoicingItem(selectedInvoicingItem, 'netAmount')}
                              className="px-3 py-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors"
                            >
                              Net Amount
                            </button>
                            <button
                              onClick={() => insertInvoicingItem(selectedInvoicingItem, 'amount')}
                              className="px-3 py-2 text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-md transition-colors"
                            >
                              Amount
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="grid grid-cols-2 gap-2">
                      {OPERATIONS.map((operation) => (
                        <DraggableBlock
                          key={operation.id}
                          item={operation}
                          onClick={() => insertAtCursor(operation.template)}
                        />
                      ))}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="space-y-2">
                      {COMMON_EXPRESSIONS.map((expr) => (
                        <DraggableBlock
                          key={expr.id}
                          item={expr}
                          onClick={() => insertAtCursor(expr.expression)}
                          fullWidth
                        />
                      ))}
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>

            {/* Drop zone / Expression preview */}
            <div className="lg:col-span-1">
              <DropZone expression={expression} onChange={onChange} />
            </div>
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="bg-indigo-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
                Dragging...
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div>
          <textarea
            value={expression || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={8}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
            placeholder="Enter expression or use visual builder..."
          />
        </div>
      )}

      {/* Expression preview */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="text-xs font-medium text-gray-500 mb-1">Current SpEL Expression:</div>
        <code className="text-sm text-gray-900 break-all">
          {expression || '(empty)'}
        </code>
      </div>

      {/* SpEL Quick Reference */}
      <details className="bg-white border border-gray-200 rounded-lg">
        <summary className="px-3 py-2 text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
          📖 SpEL Quick Reference
        </summary>
        <div className="px-3 pb-3 pt-1 text-xs text-gray-600 space-y-1">
          <div><code className="bg-gray-100 px-1 rounded">#variable</code> - Variable reference</div>
          <div><code className="bg-gray-100 px-1 rounded">?.</code> - Safe navigation (null-safe)</div>
          <div><code className="bg-gray-100 px-1 rounded">?:</code> - Elvis operator (default value)</div>
          <div><code className="bg-gray-100 px-1 rounded">? :</code> - Ternary (if-then-else)</div>
          <div><code className="bg-gray-100 px-1 rounded">{'{ }'}</code> - Map literal</div>
          <div><code className="bg-gray-100 px-1 rounded">[]</code> - Collection/map access</div>
          <div><code className="bg-gray-100 px-1 rounded">.method()</code> - Method invocation</div>
        </div>
      </details>
    </div>
  )
}

function DraggableBlock({ item, onClick, fullWidth = false }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const Icon = item.icon || CubeIcon

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      title={item.description || item.label}
      className={classNames(
        'cursor-move bg-white border-2 border-gray-200 hover:border-indigo-400 rounded-lg p-3 transition-all hover:shadow-md',
        fullWidth ? 'col-span-2' : ''
      )}
    >
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-indigo-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {item.label}
          </div>
          {item.expression && (
            <div className="text-xs text-gray-500 font-mono truncate">
              {item.expression}
            </div>
          )}
          {item.description && !item.expression && (
            <div className="text-xs text-gray-400 truncate">
              {item.description}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DropZone({ expression, onChange }) {
  return (
    <div className="h-full min-h-[400px] border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-lg p-4">
      <div className="text-sm font-medium text-indigo-900 mb-3">
        Expression Builder
      </div>
      <div className="bg-white rounded-lg p-3 border border-indigo-200 min-h-[200px]">
        <textarea
          value={expression || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Drag blocks here or click them to add to expression..."
          className="w-full h-full min-h-[180px] border-0 focus:ring-0 text-sm font-mono resize-none"
        />
      </div>
      <div className="mt-3 text-xs text-indigo-700">
        💡 Tip: Drag blocks from the left or click them to add to your expression
      </div>
    </div>
  )
}

