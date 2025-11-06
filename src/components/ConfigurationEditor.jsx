import { useState } from 'react'
import { 
  DocumentTextIcon, 
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import FieldMappingsEditor from './FieldMappingsEditor'
import ConditionMappingsEditor from './ConditionMappingsEditor'

export default function ConfigurationEditor({ 
  fieldMappings, 
  onFieldMappingsChange, 
  conditionMappings, 
  onConditionMappingsChange 
}) {
  const [showFieldMappings, setShowFieldMappings] = useState(true)
  const [showConditionMappings, setShowConditionMappings] = useState(true)

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Configuration Editor</h2>
        <p className="text-green-100">
          Configure field mappings (1:1 to JSON structure) and condition mappings (items.condition array)
        </p>
      </div>

      {/* Statistics Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Object.keys(fieldMappings).length}
              </div>
              <div className="text-sm text-gray-600">Field Mappings</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <AdjustmentsHorizontalIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {conditionMappings.length}
              </div>
              <div className="text-sm text-gray-600">Condition Mappings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Field Mappings Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <button
          onClick={() => setShowFieldMappings(!showFieldMappings)}
          className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                Field Mappings
              </h3>
              <p className="text-sm text-gray-600">
                Mapped 1:1 to the order payload JSON structure
              </p>
            </div>
          </div>
          {showFieldMappings ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        
        {showFieldMappings && (
          <div className="p-6 border-t border-gray-200">
            <FieldMappingsEditor
              fieldMappings={fieldMappings}
              onChange={onFieldMappingsChange}
            />
          </div>
        )}
      </div>

      {/* Condition Mappings Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <button
          onClick={() => setShowConditionMappings(!showConditionMappings)}
          className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <AdjustmentsHorizontalIcon className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                Condition Mappings
              </h3>
              <p className="text-sm text-gray-600">
                Mapped to 'items.condition' array containing conditionType and conditionValue
              </p>
            </div>
          </div>
          {showConditionMappings ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        
        {showConditionMappings && (
          <div className="p-6 border-t border-gray-200">
            <ConditionMappingsEditor
              conditionMappings={conditionMappings}
              onChange={onConditionMappingsChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

