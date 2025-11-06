import { useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { 
  ChevronUpIcon, 
  PlusIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline'
import ExpressionsByCountryEditor from './ExpressionsByCountryEditor'

export default function ConditionMappingsEditor({ conditionMappings, onChange }) {
  const [newConditionType, setNewConditionType] = useState('')

  const handleAddCondition = () => {
    if (newConditionType) {
      onChange([
        ...conditionMappings,
        {
          conditionType: newConditionType,
          expressionsByCountry: []
        }
      ])
      setNewConditionType('')
    }
  }

  const handleDeleteCondition = (index) => {
    const updated = conditionMappings.filter((_, i) => i !== index)
    onChange(updated)
  }

  const handleUpdateCondition = (index, updatedCondition) => {
    const updated = [...conditionMappings]
    updated[index] = updatedCondition
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Condition</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newConditionType}
            onChange={(e) => setNewConditionType(e.target.value)}
            placeholder="Condition type (e.g., netTotalOrderValue)"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            onClick={handleAddCondition}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Condition
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {conditionMappings.map((condition, index) => (
          <ConditionEditor
            key={index}
            condition={condition}
            onUpdate={(updated) => handleUpdateCondition(index, updated)}
            onDelete={() => handleDeleteCondition(index)}
          />
        ))}
      </div>
    </div>
  )
}

function ConditionEditor({ condition, onUpdate, onDelete }) {
  return (
    <Disclosure>
      {({ open }) => (
        <div className="bg-white rounded-lg shadow">
          <Disclosure.Button className="flex w-full justify-between items-center px-4 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-base font-semibold">{condition.conditionType}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Condition
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`Delete condition "${condition.conditionType}"?`)) {
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
                  Condition Type
                </label>
                <input
                  type="text"
                  value={condition.conditionType}
                  onChange={(e) =>
                    onUpdate({ ...condition, conditionType: e.target.value })
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expressions by Country
                </label>
                <ExpressionsByCountryEditor
                  expressionsByCountry={condition.expressionsByCountry || []}
                  onChange={(updated) =>
                    onUpdate({ ...condition, expressionsByCountry: updated })
                  }
                />
              </div>
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}

