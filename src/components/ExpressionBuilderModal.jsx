import { useState, useEffect } from 'react'
import { Dialog, Tab, Listbox, Combobox } from '@headlessui/react'
import { 
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  PlusIcon,
  CalculatorIcon,
  CodeBracketIcon,
  CubeIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { 
  getAllInvoicingItemNames, 
  getInvoicingItemDetails,
  getAllMoneyMovementNames 
} from '../data/referenceData'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const PROPERTIES = [
  { id: 'grossAmount', label: 'Gross Amount', color: 'green' },
  { id: 'netAmount', label: 'Net Amount', color: 'blue' },
  { id: 'amount', label: 'Amount', color: 'purple' }
]

const OPERATIONS = [
  { id: 'add', label: 'Add (+)', template: ' + ', icon: PlusIcon },
  { id: 'subtract', label: 'Subtract (-)', template: ' - ', icon: CalculatorIcon },
  { id: 'multiply', label: 'Multiply (*)', template: ' * ', icon: CalculatorIcon },
  { id: 'divide', label: 'Divide (/)', template: ' / ', icon: CalculatorIcon },
  { id: 'parentheses', label: 'Parentheses ()', template: '()', icon: CodeBracketIcon },
  { id: 'elvis', label: 'Elvis (?:)', template: ' ?: ', icon: QuestionMarkCircleIcon },
  { id: 'ternary', label: 'Ternary (? :)', template: ' ? : ', icon: QuestionMarkCircleIcon },
  { id: 'nullSafe', label: 'Null Safe (?.)', template: '?.', icon: QuestionMarkCircleIcon },
]

const INPUT_FIELDS = [
  { id: 'orderCode', label: 'Order Code', template: '#input.orderMetadata.orderCode' },
  { id: 'orderId', label: 'Order ID', template: '#input.orderMetadata.orderId' },
  { id: 'handlingStrategy', label: 'Handling Strategy', template: '#input.orderMetadata.handlingStrategy' },
  { id: 'vertical', label: 'Vertical', template: '#input.orderMetadata.vertical' },
  { id: 'subvertical', label: 'Subvertical', template: '#input.orderMetadata.subvertical' },
  { id: 'partnerFamily', label: 'Partner Family', template: '#input.orderMetadata.partnerFamily' },
  { id: 'orderCreationTime', label: 'Order Creation Time', template: '#input.orderMetadata.orderCreationTime' },
  { id: 'finalStatusDateTime', label: 'Final Status Date Time', template: '#input.orderMetadata.finalStatusDateTime' },
  { id: 'orderDispatchingTime', label: 'Order Dispatching Time', template: '#input.orderMetadata.orderDispatchingTime' },
  { id: 'processingTime', label: 'Processing Time', template: '#input.processingTime' },
  { id: 'operationName', label: 'Operation Name', template: '#input.operation.name()' },
]

const STRING_METHODS = [
  { id: 'toString', label: '.toString()', template: '.toString()' },
  { id: 'toLowerCase', label: '.toLowerCase()', template: '.toLowerCase()' },
  { id: 'toUpperCase', label: '.toUpperCase()', template: '.toUpperCase()' },
]

export default function ExpressionBuilderModal({ isOpen, onClose, expression, onSave }) {
  const [currentExpression, setCurrentExpression] = useState('')
  const [selectedInvoicingItem, setSelectedInvoicingItem] = useState('')
  const [selectedProperty, setSelectedProperty] = useState('grossAmount')
  const [invoicingItemSearch, setInvoicingItemSearch] = useState('')

  useEffect(() => {
    if (isOpen) {
      setCurrentExpression(expression || '')
    }
  }, [isOpen, expression])

  const handleSave = () => {
    onSave(currentExpression)
    onClose()
  }

  const insertText = (text) => {
    setCurrentExpression(currentExpression + text)
  }

  const insertInvoicingItem = () => {
    if (selectedInvoicingItem) {
      const template = `#invoicingItems['${selectedInvoicingItem}']?.${selectedProperty}?.value`
      insertText(template)
    }
  }

  const allInvoicingItems = getAllInvoicingItemNames()
  const filteredInvoicingItems = invoicingItemSearch
    ? allInvoicingItems.filter(item => 
        item.toLowerCase().includes(invoicingItemSearch.toLowerCase())
      )
    : allInvoicingItems

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-6xl w-full bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Visual Expression Builder
              </Dialog.Title>
              <p className="mt-1 text-sm text-gray-500">
                Build expressions using validated Money Movements and Invoicing Items
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Building blocks */}
              <div className="lg:col-span-2">
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-4">
                    <Tab className={({ selected }) =>
                      classNames(
                        'w-full rounded-md py-2 text-sm font-medium transition-colors',
                        selected ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-800'
                      )
                    }>
                      Invoicing Items
                    </Tab>
                    <Tab className={({ selected }) =>
                      classNames(
                        'w-full rounded-md py-2 text-sm font-medium transition-colors',
                        selected ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-800'
                      )
                    }>
                      Input Fields
                    </Tab>
                    <Tab className={({ selected }) =>
                      classNames(
                        'w-full rounded-md py-2 text-sm font-medium transition-colors',
                        selected ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-800'
                      )
                    }>
                      Operations
                    </Tab>
                    <Tab className={({ selected }) =>
                      classNames(
                        'w-full rounded-md py-2 text-sm font-medium transition-colors',
                        selected ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-800'
                      )
                    }>
                      Methods
                    </Tab>
                  </Tab.List>

                  <Tab.Panels>
                    {/* Invoicing Items Tab */}
                    <Tab.Panel>
                      <div className="space-y-4">
                        <div className="relative">
                          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search invoicing items..."
                            value={invoicingItemSearch}
                            onChange={(e) => setInvoicingItemSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <select
                          value={selectedInvoicingItem}
                          onChange={(e) => setSelectedInvoicingItem(e.target.value)}
                          size={10}
                          className="w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        >
                          {filteredInvoicingItems.map(item => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>

                        {selectedInvoicingItem && getInvoicingItemDetails(selectedInvoicingItem) && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="text-xs font-semibold text-blue-900 mb-1">
                              {selectedInvoicingItem}
                            </div>
                            <div className="text-xs text-blue-800">
                              {getInvoicingItemDetails(selectedInvoicingItem).description}
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Property
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => setSelectedProperty('grossAmount')}
                              className={classNames(
                                'px-3 py-2 text-xs font-medium rounded-md transition-colors',
                                selectedProperty === 'grossAmount'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              )}
                            >
                              Gross Amount
                            </button>
                            <button
                              onClick={() => setSelectedProperty('netAmount')}
                              className={classNames(
                                'px-3 py-2 text-xs font-medium rounded-md transition-colors',
                                selectedProperty === 'netAmount'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              )}
                            >
                              Net Amount
                            </button>
                            <button
                              onClick={() => setSelectedProperty('amount')}
                              className={classNames(
                                'px-3 py-2 text-xs font-medium rounded-md transition-colors',
                                selectedProperty === 'amount'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                              )}
                            >
                              Amount
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={insertInvoicingItem}
                          disabled={!selectedInvoicingItem}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Insert Invoicing Item
                        </button>
                      </div>
                    </Tab.Panel>

                    {/* Input Fields Tab */}
                    <Tab.Panel>
                      <div className="grid grid-cols-2 gap-2">
                        {INPUT_FIELDS.map(field => (
                          <button
                            key={field.id}
                            onClick={() => insertText(field.template)}
                            className="text-left px-3 py-2 bg-white border border-gray-200 hover:border-indigo-400 rounded-lg transition-all hover:shadow-md"
                          >
                            <div className="text-sm font-medium text-gray-900">{field.label}</div>
                            <div className="text-xs text-gray-500 font-mono truncate">{field.template}</div>
                          </button>
                        ))}
                      </div>
                    </Tab.Panel>

                    {/* Operations Tab */}
                    <Tab.Panel>
                      <div className="grid grid-cols-2 gap-2">
                        {OPERATIONS.map(op => {
                          const Icon = op.icon
                          return (
                            <button
                              key={op.id}
                              onClick={() => insertText(op.template)}
                              className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 hover:border-indigo-400 rounded-lg transition-all hover:shadow-md"
                            >
                              <Icon className="h-5 w-5 text-indigo-600" />
                              <span className="text-sm font-medium text-gray-900">{op.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </Tab.Panel>

                    {/* Methods Tab */}
                    <Tab.Panel>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 mb-3">
                          String methods to append to fields:
                        </div>
                        {STRING_METHODS.map(method => (
                          <button
                            key={method.id}
                            onClick={() => insertText(method.template)}
                            className="w-full text-left px-3 py-2 bg-white border border-gray-200 hover:border-indigo-400 rounded-lg transition-all hover:shadow-md"
                          >
                            <div className="text-sm font-medium text-gray-900">{method.label}</div>
                            <div className="text-xs text-gray-500 font-mono">{method.template}</div>
                          </button>
                        ))}
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>

              {/* Expression Editor */}
              <div className="lg:col-span-1">
                <div className="sticky top-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expression
                  </label>
                  <textarea
                    value={currentExpression}
                    onChange={(e) => setCurrentExpression(e.target.value)}
                    rows={15}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-mono"
                    placeholder="Build your expression using the blocks on the left..."
                  />
                  <button
                    onClick={() => setCurrentExpression('')}
                    className="mt-2 w-full px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Clear Expression
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              💡 Only validated Money Movements and Invoicing Items can be used
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

