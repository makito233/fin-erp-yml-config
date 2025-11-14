import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { 
  DocumentArrowDownIcon, 
  DocumentArrowUpIcon,
  Cog6ToothIcon,
  EyeIcon 
} from '@heroicons/react/24/outline'
import yaml from 'js-yaml'
import ConfigurationEditor from './components/ConfigurationEditor'
import PayloadSimulator from './components/PayloadSimulator'
import YamlPreview from './components/YamlPreview'
import InputManager from './components/InputManager'
import ReferenceData from './components/ReferenceData'
import yamlConverterService from './services/yamlConverterService'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function App() {
  const [config, setConfig] = useState({
    fieldMappings: {},
    conditionMappings: []
  })
  const [showPreview, setShowPreview] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const [inputValues, setInputValues] = useState(null)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const handleImportYaml = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const yamlContent = e.target.result
          const parsed = yaml.load(yamlContent)
          setConfig(parsed)
        } catch (error) {
          alert('Error parsing YAML: ' + error.message)
        }
      }
      reader.readAsText(file)
    }
  }

  const handlePreviewYaml = () => {
    try {
      // Use the YAML converter service
      const yamlContent = yamlConverterService.toYaml(config, {
        includeComments: true,
        includeHeader: true
      })
      setPreviewContent(yamlContent)
      setShowPreview(true)
    } catch (error) {
      alert('Error generating YAML preview: ' + error.message)
    }
  }

  const handleExportYaml = () => {
    try {
      // Create custom YAML output with proper formatting using the converter service
      let yamlContent = previewContent || yamlConverterService.toYaml(config, {
        includeComments: true,
        includeHeader: true
      })
      
      const blob = new Blob([yamlContent], { type: 'text/yaml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'sap-order-payload-mapping.yml'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Error exporting YAML: ' + error.message)
    }
  }

  // Legacy method for backward compatibility - now uses converter service
  const generateFormattedYaml = (config) => {
    return yamlConverterService.toYaml(config, {
      includeComments: true,
      includeHeader: true
    })
  }

  // Old implementation kept for reference (can be removed after migration)
  const generateFormattedYamlOld = (config) => {
    let output = ''
    
    // Add header comments
    output += '# A configuration file defining the mapping of order data into the SAP order payload format (JSON).\n'
    output += '# Order payload is sent to SAP for invoicing and accounting purposes.\n'
    output += '#\n'
    output += "# Note: '>' converts newlines to spaces, making multi-line expressions more readable.\n"
    output += '\n'
    output += '# Mapped 1:1 to the order payload JSON structure\n'
    output += '# Possible types are:\n'
    output += '# - string: string value mapped as-is and cannot be null.\n'
    output += '# - optional_string: string value that can be null, in which case it will be sent as an empty string.\n'
    output += '# - double: numeric value mapped with format "0.00" and cannot be null.\n'
    output += '# - local_date_time: date-time value mapped with a specific format (e.g. "yyyy/MM/dd") and cannot be null.\n'
    output += '# - optional_local_date_time: date-time value as above that can be null, in which case it will be sent as an empty string.\n'
    output += '# - array: array of objects, with nested itemsMappings defining the structure of each object.\n'
    
    // Field Mappings
    output += 'fieldMappings:\n'
    if (config.fieldMappings && Object.keys(config.fieldMappings).length > 0) {
      Object.entries(config.fieldMappings).forEach(([fieldName, fieldConfig]) => {
        output += `  ${fieldName}:\n`
        output += `    type: ${fieldConfig.type}\n`
        
        if (fieldConfig.format) {
          output += `    format: ${fieldConfig.format}\n`
        }
        
        if (fieldConfig.expressionsByCountry && fieldConfig.expressionsByCountry.length > 0) {
          output += `    expressionsByCountry:\n`
          fieldConfig.expressionsByCountry.forEach(expr => {
            output += `      - countries: [ ${(expr.countries || []).map(c => `'${c}'`).join(', ')} ]\n`
            
            const expression = expr.expression || ''
            // Check if it's a simple quoted value
            if (expression.startsWith('"') && expression.endsWith('"') && !expression.includes('\n')) {
              output += `        expression: ${expression}\n`
            } else {
              // Use folded style for complex expressions
              output += `        expression: >\n`
              const lines = expression.split('\n')
              lines.forEach(line => {
                const trimmedLine = line.trim()
                if (trimmedLine) {
                  output += `          ${trimmedLine}\n`
                }
              })
            }
          })
        }
        
        if (fieldConfig.itemsMappings && Object.keys(fieldConfig.itemsMappings).length > 0) {
          output += `    itemsMappings:\n`
          Object.entries(fieldConfig.itemsMappings).forEach(([itemFieldName, itemFieldConfig]) => {
            output += `      ${itemFieldName}:\n`
            output += `        type: ${itemFieldConfig.type}\n`
            if (itemFieldConfig.expressionsByCountry && itemFieldConfig.expressionsByCountry.length > 0) {
              output += `        expressionsByCountry:\n`
              itemFieldConfig.expressionsByCountry.forEach(expr => {
                output += `          - countries: [ ${(expr.countries || []).map(c => `'${c}'`).join(', ')} ]\n`
                
                const expression = expr.expression || ''
                // Check if it's a simple quoted value
                if (expression.startsWith('"') && expression.endsWith('"') && !expression.includes('\n')) {
                  output += `            expression: ${expression}\n`
                } else {
                  // Use folded style for complex expressions
                  output += `            expression: >\n`
                  const lines = expression.split('\n')
                  lines.forEach(line => {
                    const trimmedLine = line.trim()
                    if (trimmedLine) {
                      output += `              ${trimmedLine}\n`
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
    
    output += '\n'
    
    // Condition Mappings
    output += '# Mapped to \'items.condition\' array of the order payload, containing conditionType and conditionValue.\n'
    output += '# - conditionType: the key identifying the condition.\n'
    output += '# - conditionValue: the value of the condition, mapped as a double with format "0.00".\n'
    output += 'conditionMappings:\n'
    if (config.conditionMappings && config.conditionMappings.length > 0) {
      config.conditionMappings.forEach(condition => {
        output += `  - conditionType: ${condition.conditionType}\n`
        if (condition.expressionsByCountry && condition.expressionsByCountry.length > 0) {
          output += `    expressionsByCountry:\n`
          condition.expressionsByCountry.forEach(expr => {
            if (expr.countries && expr.countries.length > 0) {
              output += `      - countries: [${expr.countries.map(c => `'${c}'`).join(', ')}]\n`
            } else {
              output += `      - countries: []\n`
            }
            
            // Check if expression is a simple value or complex
            const expression = expr.expression || ''
            const needsMultiline = expression.includes('\n') || expression.length > 60 || 
                                   expression.includes('{') || expression.includes('?')
            
            if (needsMultiline && !expression.startsWith('"')) {
              output += `        expression: >\n`
              const lines = expression.split('\n')
              lines.forEach(line => {
                output += `          ${line.trim()}\n`
              })
            } else {
              output += `        expression: ${expression}\n`
            }
          })
        }
        output += '\n'
      })
    }
    
    return output
  }
  // End of old implementation

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Cog6ToothIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                SAP Order Payload Configuration Editor
              </h1>
            </div>
            <div className="flex space-x-3">
              <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                Import YAML
                <input
                  type="file"
                  accept=".yml,.yaml"
                  onChange={handleImportYaml}
                  className="hidden"
                />
              </label>
              <button
                onClick={handlePreviewYaml}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <EyeIcon className="h-5 w-5 mr-2" />
                Preview
              </button>
              <button
                onClick={handleExportYaml}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Export YAML
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-indigo-900/20 p-1 mb-6">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-indigo-600 hover:bg-white/[0.12] hover:text-indigo-800'
                )
              }
            >
              Configuration
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-indigo-600 hover:bg-white/[0.12] hover:text-indigo-800'
                )
              }
            >
              Input Manager
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-indigo-600 hover:bg-white/[0.12] hover:text-indigo-800'
                )
              }
            >
              Simulator
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-indigo-600 hover:bg-white/[0.12] hover:text-indigo-800'
                )
              }
            >
              Reference
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <ConfigurationEditor
                fieldMappings={config.fieldMappings}
                onFieldMappingsChange={(newFieldMappings) =>
                  setConfig({ ...config, fieldMappings: newFieldMappings })
                }
                conditionMappings={config.conditionMappings}
                onConditionMappingsChange={(newConditionMappings) =>
                  setConfig({ ...config, conditionMappings: newConditionMappings })
                }
              />
            </Tab.Panel>
            <Tab.Panel>
              <InputManager
                fieldMappings={config.fieldMappings}
                conditionMappings={config.conditionMappings}
                onSimulate={(values) => {
                  setInputValues(values)
                  setSelectedTabIndex(2) // Switch to Simulator tab (index 2)
                }}
              />
            </Tab.Panel>
            <Tab.Panel>
              <PayloadSimulator
                fieldMappings={config.fieldMappings}
                conditionMappings={config.conditionMappings}
                providedInputValues={inputValues}
              />
            </Tab.Panel>
            <Tab.Panel>
              <ReferenceData />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>

      <YamlPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        yamlContent={previewContent}
        onConfirmExport={handleExportYaml}
      />
    </div>
  )
}

export default App

