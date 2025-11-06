import { useState } from 'react'
import { Disclosure, Listbox } from '@headlessui/react'
import { 
  ChevronUpIcon, 
  PlusIcon, 
  TrashIcon,
  CheckIcon,
  ChevronUpDownIcon 
} from '@heroicons/react/24/outline'
import ExpressionsByCountryEditor from './ExpressionsByCountryEditor'

const FIELD_TYPES = [
  'string',
  'optional_string',
  'double',
  'local_date_time',
  'optional_local_date_time',
  'array'
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function FieldMappingsEditor({ fieldMappings, onChange }) {
  const [newFieldName, setNewFieldName] = useState('')

  const handleAddField = () => {
    if (newFieldName && !fieldMappings[newFieldName]) {
      onChange({
        ...fieldMappings,
        [newFieldName]: {
          type: 'string',
          expressionsByCountry: []
        }
      })
      setNewFieldName('')
    }
  }

  const handleDeleteField = (fieldName) => {
    const newMappings = { ...fieldMappings }
    delete newMappings[fieldName]
    onChange(newMappings)
  }

  const handleUpdateField = (fieldName, updatedField) => {
    onChange({
      ...fieldMappings,
      [fieldName]: updatedField
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Field</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="Field name (e.g., countryCode)"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            onClick={handleAddField}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Field
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(fieldMappings).map(([fieldName, fieldConfig]) => (
          <FieldEditor
            key={fieldName}
            fieldName={fieldName}
            fieldConfig={fieldConfig}
            onUpdate={(updated) => handleUpdateField(fieldName, updated)}
            onDelete={() => handleDeleteField(fieldName)}
          />
        ))}
      </div>
    </div>
  )
}

function FieldEditor({ fieldName, fieldConfig, onUpdate, onDelete }) {
  const handleTypeChange = (newType) => {
    const updated = { ...fieldConfig, type: newType }
    if (newType === 'array' && !updated.itemsMappings) {
      updated.itemsMappings = {}
    } else if (newType !== 'array') {
      delete updated.itemsMappings
      delete updated.format
    }
    if (newType.includes('local_date_time') && !updated.format) {
      updated.format = 'yyyy/MM/dd'
    }
    onUpdate(updated)
  }

  const handleFormatChange = (format) => {
    onUpdate({ ...fieldConfig, format })
  }

  return (
    <Disclosure>
      {({ open }) => (
        <div className="bg-white rounded-lg shadow">
          <Disclosure.Button className="flex w-full justify-between items-center px-4 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-base font-semibold">{fieldName}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {fieldConfig.type}
              </span>
              {fieldConfig.format && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {fieldConfig.format}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`Delete field "${fieldName}"?`)) {
                    onDelete()
                  }
                }}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-gray-500 transition-transform`}
              />
            </div>
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pb-4 pt-2 border-t border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <TypeSelector
                  value={fieldConfig.type}
                  onChange={handleTypeChange}
                />
              </div>

              {fieldConfig.type?.includes('local_date_time') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format
                  </label>
                  <input
                    type="text"
                    value={fieldConfig.format || ''}
                    onChange={(e) => handleFormatChange(e.target.value)}
                    placeholder="e.g., yyyy/MM/dd"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expressions by Country
                </label>
                <ExpressionsByCountryEditor
                  expressionsByCountry={fieldConfig.expressionsByCountry || []}
                  onChange={(updated) => 
                    onUpdate({ ...fieldConfig, expressionsByCountry: updated })
                  }
                />
              </div>

              {fieldConfig.type === 'array' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Array Items Mappings
                  </label>
                  <ArrayItemsMappingsEditor
                    itemsMappings={fieldConfig.itemsMappings || {}}
                    onChange={(updated) =>
                      onUpdate({ ...fieldConfig, itemsMappings: updated })
                    }
                  />
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}

function TypeSelector({ value, onChange }) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm">
          <span className="block truncate">{value}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {FIELD_TYPES.map((type) => (
            <Listbox.Option
              key={type}
              className={({ active }) =>
                classNames(
                  active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                  'relative cursor-pointer select-none py-2 pl-10 pr-4'
                )
              }
              value={type}
            >
              {({ selected, active }) => (
                <>
                  <span
                    className={classNames(
                      selected ? 'font-medium' : 'font-normal',
                      'block truncate'
                    )}
                  >
                    {type}
                  </span>
                  {selected && (
                    <span
                      className={classNames(
                        active ? 'text-white' : 'text-indigo-600',
                        'absolute inset-y-0 left-0 flex items-center pl-3'
                      )}
                    >
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}

function ArrayItemsMappingsEditor({ itemsMappings, onChange }) {
  const [newItemFieldName, setNewItemFieldName] = useState('')

  const handleAddItemField = () => {
    if (newItemFieldName && !itemsMappings[newItemFieldName]) {
      onChange({
        ...itemsMappings,
        [newItemFieldName]: {
          type: 'string',
          expressionsByCountry: []
        }
      })
      setNewItemFieldName('')
    }
  }

  const handleDeleteItemField = (fieldName) => {
    const newMappings = { ...itemsMappings }
    delete newMappings[fieldName]
    onChange(newMappings)
  }

  const handleUpdateItemField = (fieldName, updatedField) => {
    onChange({
      ...itemsMappings,
      [fieldName]: updatedField
    })
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
      <div className="flex space-x-2">
        <input
          type="text"
          value={newItemFieldName}
          onChange={(e) => setNewItemFieldName(e.target.value)}
          placeholder="Item field name"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <button
          onClick={handleAddItemField}
          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        {Object.entries(itemsMappings).map(([fieldName, fieldConfig]) => (
          <Disclosure key={fieldName}>
            {({ open }) => (
              <div className="bg-white rounded border border-gray-200">
                <Disclosure.Button className="flex w-full justify-between items-center px-3 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{fieldName}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                      {fieldConfig.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm(`Delete item field "${fieldName}"?`)) {
                          handleDeleteItemField(fieldName)
                        }
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                    <ChevronUpIcon
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-4 w-4 text-gray-500 transition-transform`}
                    />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="px-3 pb-3 pt-2 border-t border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <TypeSelector
                        value={fieldConfig.type}
                        onChange={(newType) =>
                          handleUpdateItemField(fieldName, {
                            ...fieldConfig,
                            type: newType
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Expressions by Country
                      </label>
                      <ExpressionsByCountryEditor
                        expressionsByCountry={fieldConfig.expressionsByCountry || []}
                        onChange={(updated) =>
                          handleUpdateItemField(fieldName, {
                            ...fieldConfig,
                            expressionsByCountry: updated
                          })
                        }
                      />
                    </div>
                  </div>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  )
}

