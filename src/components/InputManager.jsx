import { useState, useEffect } from 'react'
import { Tab, Disclosure } from '@headlessui/react'
import { 
  ChevronUpIcon,
  InformationCircleIcon,
  PlayIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
import { 
  extractInputVariables, 
  createDefaultInputValues, 
  groupInputFields 
} from '../utils/expressionParser'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function InputManager({ fieldMappings, conditionMappings, onSimulate }) {
  const [extractedInputs, setExtractedInputs] = useState(null)
  const [inputValues, setInputValues] = useState(null)

  useEffect(() => {
    // Extract all input variables from expressions
    const extracted = extractInputVariables({ fieldMappings, conditionMappings })
    setExtractedInputs(extracted)
    
    // Create default values
    const defaults = createDefaultInputValues(extracted)
    setInputValues(defaults)
  }, [fieldMappings, conditionMappings])

  if (!extractedInputs || !inputValues) {
    return (
      <div className="text-center py-12">
        <BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">Loading input variables...</p>
      </div>
    )
  }

  const groupedFields = groupInputFields(extractedInputs.inputFields)

  const handleSimulate = () => {
    if (onSimulate) {
      onSimulate(inputValues)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Input Variables Manager</h2>
        <p className="text-purple-100">
          Configure all input values used in your expressions. These inputs drive both field mappings and condition calculations.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              About Input Variables
            </h3>
            <p className="text-sm text-blue-800">
              These are all the variables referenced in your expressions across {Object.keys(fieldMappings).length} field mappings 
              and {conditionMappings.length} condition mappings. Set their values here to test your complete configuration.
            </p>
          </div>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-md py-2.5 text-sm font-medium',
                'transition-colors',
                selected
                  ? 'bg-white shadow text-indigo-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              )
            }
          >
            Input Fields ({extractedInputs.inputFields.length})
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-md py-2.5 text-sm font-medium',
                'transition-colors',
                selected
                  ? 'bg-white shadow text-indigo-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              )
            }
          >
            Invoicing Items ({extractedInputs.invoicingItems.length})
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-md py-2.5 text-sm font-medium',
                'transition-colors',
                selected
                  ? 'bg-white shadow text-indigo-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              )
            }
          >
            Variables ({extractedInputs.variables.length})
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-4">
          {/* Input Fields Panel */}
          <Tab.Panel>
            <div className="space-y-4">
              {groupedFields.orderMetadata.length > 0 && (
                <InputFieldGroup
                  title="Order Metadata"
                  fields={groupedFields.orderMetadata}
                  values={inputValues.inputFields}
                  onChange={(field, value) => {
                    const path = field.split('.').slice(1) // Remove 'input' prefix
                    const newValues = { ...inputValues }
                    let current = newValues.inputFields
                    for (let i = 0; i < path.length - 1; i++) {
                      if (!current[path[i]]) current[path[i]] = {}
                      current = current[path[i]]
                    }
                    current[path[path.length - 1]] = value
                    setInputValues(newValues)
                  }}
                />
              )}

              {groupedFields.other.length > 0 && (
                <InputFieldGroup
                  title="Other Fields"
                  fields={groupedFields.other}
                  values={inputValues.inputFields}
                  onChange={(field, value) => {
                    const path = field.split('.').slice(1)
                    const newValues = { ...inputValues }
                    let current = newValues.inputFields
                    for (let i = 0; i < path.length - 1; i++) {
                      if (!current[path[i]]) current[path[i]] = {}
                      current = current[path[i]]
                    }
                    current[path[path.length - 1]] = value
                    setInputValues(newValues)
                  }}
                />
              )}

              {groupedFields.item.length > 0 && (
                <InputFieldGroup
                  title="Item Fields (Array Elements)"
                  fields={groupedFields.item}
                  values={inputValues.inputFields}
                  onChange={(field, value) => {
                    const path = field.split('.')
                    const newValues = { ...inputValues }
                    let current = newValues.inputFields
                    for (let i = 0; i < path.length - 1; i++) {
                      if (!current[path[i]]) current[path[i]] = {}
                      current = current[path[i]]
                    }
                    current[path[path.length - 1]] = value
                    setInputValues(newValues)
                  }}
                />
              )}
            </div>
          </Tab.Panel>

          {/* Invoicing Items Panel */}
          <Tab.Panel>
            <div className="space-y-3">
              {extractedInputs.invoicingItems.map(itemName => (
                <InvoicingItemEditor
                  key={itemName}
                  itemName={itemName}
                  value={inputValues.invoicingItems[itemName] || {}}
                  onChange={(newValue) => {
                    setInputValues({
                      ...inputValues,
                      invoicingItems: {
                        ...inputValues.invoicingItems,
                        [itemName]: newValue
                      }
                    })
                  }}
                />
              ))}
            </div>
          </Tab.Panel>

          {/* Variables Panel */}
          <Tab.Panel>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="space-y-4">
                {extractedInputs.variables.map(varName => (
                  <div key={varName}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      #{varName}
                    </label>
                    {varName === 'isVatOptimisedOrder' ? (
                      <select
                        value={inputValues.variables[varName] ? 'true' : 'false'}
                        onChange={(e) => {
                          setInputValues({
                            ...inputValues,
                            variables: {
                              ...inputValues.variables,
                              [varName]: e.target.value === 'true'
                            }
                          })
                        }}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="false">false</option>
                        <option value="true">true</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={inputValues.variables[varName] || ''}
                        onChange={(e) => {
                          setInputValues({
                            ...inputValues,
                            variables: {
                              ...inputValues.variables,
                              [varName]: e.target.value
                            }
                          })
                        }}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder={`Enter value for ${varName}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="flex justify-end">
        <button
          onClick={handleSimulate}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors"
        >
          <PlayIcon className="h-5 w-5 mr-2" />
          Run Simulation with These Inputs
        </button>
      </div>
    </div>
  )
}

function InputFieldGroup({ title, fields, values, onChange }) {
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div className="bg-white rounded-lg shadow">
          <Disclosure.Button className="flex w-full justify-between items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors">
            <span className="text-base font-semibold text-gray-900">{title}</span>
            <ChevronUpIcon
              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 transition-transform`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pb-4 pt-2 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(field => {
                const displayName = field.split('.').slice(1).join('.')
                const path = field.split('.').slice(1)
                let currentValue = values
                for (const key of path) {
                  currentValue = currentValue?.[key]
                }

                return (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {displayName}
                    </label>
                    <input
                      type="text"
                      value={currentValue || ''}
                      onChange={(e) => onChange(field, e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder={`Enter ${displayName}`}
                    />
                  </div>
                )
              })}
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}

function InvoicingItemEditor({ itemName, value, onChange }) {
  return (
    <Disclosure>
      {({ open }) => (
        <div className="bg-white rounded-lg shadow">
          <Disclosure.Button className="flex w-full justify-between items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors">
            <div>
              <span className="text-sm font-semibold text-gray-900">{itemName}</span>
              <div className="text-xs text-gray-500 mt-0.5">
                Gross: {value.grossAmount?.value || 0} | Net: {value.netAmount?.value || 0}
              </div>
            </div>
            <ChevronUpIcon
              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 transition-transform`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pb-4 pt-2 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Gross Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={value.grossAmount?.value || 0}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      grossAmount: { value: parseFloat(e.target.value) || 0 }
                    })
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Net Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={value.netAmount?.value || 0}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      netAmount: { value: parseFloat(e.target.value) || 0 }
                    })
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={value.amount?.value || 0}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      amount: { value: parseFloat(e.target.value) || 0 }
                    })
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}

