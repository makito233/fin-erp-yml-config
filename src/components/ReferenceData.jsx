import { useState } from 'react'
import { Tab, Disclosure } from '@headlessui/react'
import { 
  ChevronUpIcon,
  InformationCircleIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { INVOICING_ITEMS, MONEY_MOVEMENTS } from '../data/referenceData'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ReferenceData() {
  const [searchTerm, setSearchTerm] = useState('')

  const filterItems = (items, search) => {
    if (!search) return items
    return items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg p-6 text-white">
        <div className="flex items-center mb-2">
          <BookOpenIcon className="h-8 w-8 mr-3" />
          <h2 className="text-2xl font-bold">Reference Data</h2>
        </div>
        <p className="text-blue-100">
          Complete reference of all valid Money Movements and Invoicing Items that can be used in your expressions
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-md py-2.5 text-sm font-medium flex items-center justify-center',
                'transition-colors',
                selected
                  ? 'bg-white shadow text-indigo-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              )
            }
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Invoicing Items
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-md py-2.5 text-sm font-medium flex items-center justify-center',
                'transition-colors',
                selected
                  ? 'bg-white shadow text-indigo-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              )
            }
          >
            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
            Money Movements
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-4">
          {/* Invoicing Items */}
          <Tab.Panel>
            <div className="space-y-4">
              {Object.entries(INVOICING_ITEMS).map(([categoryKey, category]) => {
                const filteredItems = filterItems(category.items, searchTerm)
                if (filteredItems.length === 0) return null

                return (
                  <CategorySection
                    key={categoryKey}
                    category={category}
                    items={filteredItems}
                    type="invoicing"
                  />
                )
              })}
            </div>
          </Tab.Panel>

          {/* Money Movements */}
          <Tab.Panel>
            <div className="space-y-4">
              {Object.entries(MONEY_MOVEMENTS).map(([categoryKey, category]) => {
                const filteredItems = filterItems(category.items, searchTerm)
                if (filteredItems.length === 0) return null

                return (
                  <CategorySection
                    key={categoryKey}
                    category={category}
                    items={filteredItems}
                    type="money"
                  />
                )
              })}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

function CategorySection({ category, items, type }) {
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div className="bg-white rounded-lg shadow">
          <Disclosure.Button className="flex w-full justify-between items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <span className="text-base font-semibold text-gray-900">{category.label}</span>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {items.length} items
              </span>
            </div>
            <ChevronUpIcon
              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 transition-transform`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pb-4 pt-2 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-3">
              {items.map(item => (
                <ItemCard key={item.name} item={item} type={type} />
              ))}
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}

function ItemCard({ item, type }) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative">
      <div
        className="border border-gray-200 rounded-lg p-3 hover:border-indigo-400 transition-all cursor-help bg-gray-50"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <code className="text-sm font-semibold text-indigo-700">
                {item.name}
              </code>
              {type === 'invoicing' && (
                <>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    {item.taxation}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    {item.amountType}
                  </span>
                </>
              )}
              {type === 'money' && (
                <>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {item.taxType}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {item.source}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-700">{item.description}</p>
            {type === 'invoicing' && item.moneyFlow && (
              <div className="mt-1 text-xs text-gray-500">
                Money Flow: {item.moneyFlow}
              </div>
            )}
          </div>
          <InformationCircleIcon className="h-5 w-5 text-indigo-500 flex-shrink-0 ml-2" />
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-gray-900 text-white text-sm rounded-lg p-4 shadow-xl">
            <div className="font-semibold mb-2">{item.name}</div>
            <div className="mb-2">{item.description}</div>
            {item.details && (
              <div className="text-gray-300 text-xs mb-2">{item.details}</div>
            )}
            {type === 'invoicing' && (
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-700">
                <div>
                  <span className="text-gray-400">Money Flow:</span>
                  <br />
                  <span className="text-white">{item.moneyFlow}</span>
                </div>
                <div>
                  <span className="text-gray-400">Taxation:</span>
                  <br />
                  <span className="text-white">{item.taxation}</span>
                </div>
                <div>
                  <span className="text-gray-400">Amount Type:</span>
                  <br />
                  <span className="text-white">{item.amountType}</span>
                </div>
              </div>
            )}
            {type === 'money' && (
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-700">
                <div>
                  <span className="text-gray-400">Tax Type:</span>
                  <br />
                  <span className="text-white">{item.taxType}</span>
                </div>
                <div>
                  <span className="text-gray-400">Source:</span>
                  <br />
                  <span className="text-white">{item.source}</span>
                </div>
              </div>
            )}
            <div className="absolute -top-2 left-8 w-4 h-4 bg-gray-900 transform rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  )
}

