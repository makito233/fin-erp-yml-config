import { useState } from 'react'
import { PlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import BubbleExpressionBuilder from './BubbleExpressionBuilder'

const AVAILABLE_COUNTRIES = ['ES', 'PL', 'IT', 'PT', 'RO', 'UA', 'KE', 'GE', 'HR']

export default function ExpressionsByCountryEditor({ expressionsByCountry, onChange }) {
  const [editingExpressionIndex, setEditingExpressionIndex] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddExpression = () => {
    onChange([
      ...expressionsByCountry,
      {
        countries: [],
        expression: ''
      }
    ])
  }

  const handleDeleteExpression = (index) => {
    const updated = expressionsByCountry.filter((_, i) => i !== index)
    onChange(updated)
  }

  const handleUpdateExpression = (index, field, value) => {
    const updated = [...expressionsByCountry]
    updated[index] = {
      ...updated[index],
      [field]: value
    }
    onChange(updated)
  }

  const handleToggleCountry = (index, country) => {
    const expression = expressionsByCountry[index]
    const countries = expression.countries || []
    const hasCountry = countries.includes(country)
    
    const newCountries = hasCountry
      ? countries.filter(c => c !== country)
      : [...countries, country]
    
    handleUpdateExpression(index, 'countries', newCountries)
  }

  const openExpressionBuilder = (index) => {
    setEditingExpressionIndex(index)
    setIsModalOpen(true)
  }

  const saveExpression = (newExpression) => {
    if (editingExpressionIndex !== null) {
      handleUpdateExpression(editingExpressionIndex, 'expression', newExpression)
    }
  }

  return (
    <div className="space-y-3">
      {expressionsByCountry.map((expr, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-3 bg-white space-y-3"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Countries
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COUNTRIES.map((country) => (
                  <button
                    key={country}
                    onClick={() => handleToggleCountry(index, country)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      (expr.countries || []).includes(country)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => handleDeleteExpression(index)}
              className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Expression
            </label>
            <div className="relative">
              <textarea
                value={expr.expression || ''}
                onChange={(e) => handleUpdateExpression(index, 'expression', e.target.value)}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono pr-10"
                placeholder="Enter expression or click the icon to use visual builder..."
              />
              <button
                onClick={() => openExpressionBuilder(index)}
                className="absolute top-2 right-2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                title="Open Visual Expression Builder"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddExpression}
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-dashed border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Expression
      </button>

      {/* Expression Builder Modal */}
      <BubbleExpressionBuilder
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expression={editingExpressionIndex !== null ? expressionsByCountry[editingExpressionIndex]?.expression : ''}
        onSave={saveExpression}
      />
    </div>
  )
}
