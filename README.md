# SAP Order Payload Configuration UI

A beautiful and intuitive graphical interface for configuring SAP order payload mapping YAML files. Built with Vite.js, React.js, and Headless UI components.

## Features

- 📝 **Visual Editor**: Edit field mappings and condition mappings with an intuitive UI
- 🎯 **Bubble Expression Builder**: Build expressions with autocomplete and visual bubbles/pills
- 🔧 **SpEL Expression Support**: Full support for Spring Expression Language (SpEL) with safe navigation and Elvis operators
- 📚 **Reference Data**: Complete catalog of all valid Money Movements and Invoicing Items with descriptions and tooltips
- 🎛️ **Input Manager**: Automatically extracts all input variables from expressions for centralized configuration
- 🧪 **Payload Simulator**: Test your configuration with real values and see the generated payload
- 🌍 **Country-Specific Expressions**: Manage expressions for different countries (ES, PL, IT, PT, RO, UA, KE, GE, HR)
- 📊 **Type Support**: Full support for all field types (string, optional_string, double, local_date_time, optional_local_date_time, array)
- 🔄 **Import/Export**: Seamlessly import existing YAML files and export your changes
- 👁️ **YAML Preview**: Preview formatted output before exporting to ensure correctness
- 🎨 **Modern UI**: Built with Tailwind CSS and Headless UI for a beautiful, accessible interface
- 📦 **Array Fields**: Special support for array fields with nested item mappings
- 🚀 **Microservice-Ready**: Converter logic extracted into standalone module for easy microservice deployment

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

## Usage

### Development Mode

Start the development server:

```bash
npm run dev
```

This will start the application at `http://localhost:3000` and automatically open it in your browser.

The app has four main tabs:
1. **Configuration** - Edit field mappings and condition mappings in one place
2. **Input Manager** - Manage all input variables (recommended for testing)
3. **Simulator** - Generate and preview payloads
4. **Reference** - Browse all valid Money Movements and Invoicing Items

### Building for Production

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## How to Use the Configuration UI

### Importing a Configuration

1. Click the **"Import YAML"** button in the top right
2. Select your `sap-order-payload-mapping.yml` file
3. The configuration will be loaded and displayed in the editor

### Editing Field Mappings

1. Navigate to the **Configuration** tab
2. Expand the **"Field Mappings"** section if collapsed
3. Click on any field to expand its configuration
4. Edit the following properties:
   - **Type**: Select from available types (string, optional_string, double, local_date_time, optional_local_date_time, array)
   - **Format**: For date-time fields, specify the format (e.g., `yyyy/MM/dd`)
   - **Expressions by Country**: Add country-specific expressions
   - **Array Items**: For array fields, define nested item mappings

### Adding a New Field

1. In the **Configuration** tab, expand the "Field Mappings" section
2. Find the "Add New Field" section at the top
3. Enter the field name (e.g., `countryCode`, `orderId`)
4. Click **"Add Field"**
5. Configure the field properties as needed

### Editing Condition Mappings

1. Navigate to the **Configuration** tab
2. Expand the **"Condition Mappings"** section
3. Click on any condition to expand its configuration
4. Edit:
   - **Condition Type**: The identifier for the condition
   - **Expressions by Country**: Country-specific expressions for the condition

### Adding a New Condition

1. In the **Configuration** tab, expand the "Condition Mappings" section
2. Find the "Add New Condition" section
3. Enter the condition type (e.g., `netTotalOrderValue`, `grossFoodValue`)
4. Click **"Add Condition"**
5. Configure the expressions as needed

### Managing Expressions by Country

For both field and condition mappings, you can:

1. Click **"Add Expression"** to create a new country-specific expression
2. Select countries by clicking the country buttons (they'll turn blue when selected)
3. Enter the expression in the text area
4. Use the trash icon to delete an expression

### Using the Bubble Expression Builder

The bubble expression builder provides an intuitive, visual way to build expressions:

1. Click the **📝 pencil icon** in any expression field
2. Modal opens showing a **bubble canvas**
3. Type in human-readable format: `invoicingItems.ITEM_NAME.property`
4. **Autocomplete suggestions** appear as you type
5. Press **Enter** to create a colored bubble
6. Click **operation buttons** to add math operators
7. Repeat to build complex expressions
8. Click **Save Expression** when done

**How It Works:**

```
Type: invoicingItems.PRODUCTS_TO_PARTNER.grossAmount
  ↓ (autocomplete shows matching items)
Press Enter
  ↓
┌──────────────────────────────┐
│ PRODUCTS_TO_PARTNER          │  ← Green bubble (gross)
│ .grossAmount                 │     Auto-wrapped in (... ?: 0)
└──────────────────────────────┘

Click: Add (+) button
  ↓
┌──────────────────┐  ┌───┐
│ PRODUCTS...      │  │ + │  ← Orange operation bubble
└──────────────────┘  └───┘

Type: invoicingItems.TIP_TO_CUSTOMER.netAmount
Press Enter
  ↓
┌──────────────────┐  ┌───┐  ┌──────────────────┐
│ PRODUCTS...      │  │ + │  │ TIP_TO_CUSTOMER  │  ← Blue bubble (net)
└──────────────────┘  └───┘  │ .netAmount       │     Auto-wrapped
                              └──────────────────┘

Generated SpEL:
(#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value ?: 0) + 
(#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0)
```

**Key Features:**

- 🎨 **Color-Coded Bubbles**: Green (gross), Blue (net), Purple (amount)
- 🔍 **Smart Autocomplete**: Searches 68+ Invoicing Items AND 27+ Money Movements as you type
- 🏷️ **Type Badges**: Purple badge for Invoicing Items, Cyan badge for Money Movements
- ✅ **Validated Only**: Can only use items from Reference Data
- ℹ️ **Inline Descriptions**: See what each item does in autocomplete dropdown
- 🎯 **Visual Clarity**: Complex expressions become readable bubbles
- 🔄 **Dual Mode**: Switch between Visual (bubbles) and Text (SpEL) modes
- 📝 **Live Preview**: See generated SpEL at bottom with real-time validation
- 💰 **Money Movement Support**: Money movements show with 💰 icon in bubbles
- 🗺️ **Order Type Maps**: Optional mode to create GEN1/GEN2/PICKUP expressions separately
- 🎛️ **Conditional Builder**: Visual if/then/else builder for conditional logic
- ✅ **Expression Validation**: Real-time validation with error messages
- 🚦 **Operator Enforcement**: Prevents syntax errors by requiring operators between items

### Using the Input Manager (Recommended Workflow)

The Input Manager automatically extracts all variables referenced in your expressions and provides a unified interface to configure them:

1. Navigate to the **"Input Manager"** tab
2. See all variables organized into three categories:
   - **Input Fields**: Order metadata, operation details, etc.
   - **Invoicing Items**: All invoicing line items with gross/net amounts
   - **Variables**: Standalone variables like country codes, flags
3. Configure values for the extracted variables
4. Click **"Run Simulation with These Inputs"** to see the generated payload
5. This automatically switches to the Simulator tab with your values

**Benefits:**
- No need to manually track which variables are used
- Configure inputs once, see all outputs (fields + conditions)
- Automatically updates when you add new expressions
- Groups related inputs for better organization

### Using the Simulator

The Simulator displays the generated payload based on Input Manager values:

1. **Configure inputs in Input Manager first** (see above)
2. Click **"Run Simulation with These Inputs"** in Input Manager
3. **Automatically switches to Simulator tab** showing:
   - Summary of input values used
   - Invoicing items with their values
   - Generated JSON payload
   - Any errors or warnings
4. Use **"Copy"** to copy the payload to your clipboard
5. Click **"Regenerate Payload"** to recalculate if needed

**Note**: The Simulator tab is read-only. All input configuration must be done in the Input Manager tab.

### Using the Reference Data

Browse and search all valid Money Movements and Invoicing Items:

1. Navigate to the **"Reference"** tab
2. Choose between **Invoicing Items** or **Money Movements**
3. Use the **search bar** to find specific items
4. **Hover over any item** to see detailed tooltip with:
   - Full description
   - Money flow direction
   - Taxation type
   - Amount type
   - Additional details
5. Click on categories to expand/collapse
6. When building expressions, only these valid items can be used

**Features:**
- Organized by category (e.g., "GLOVO issues to CUSTOMER", "COURIER → GLOVO")
- Color-coded badges for taxation and amount types
- Search across all items
- Tooltips with comprehensive information
- Item counts per category

### Previewing and Exporting Configuration

**Preview Before Export:**

1. Click the **"Preview"** button in the top right to see the formatted YAML
2. Review the output to ensure it matches the expected format
3. Use the "Copy to clipboard" button to copy the YAML content
4. Click "Download YAML" from the preview dialog, or close and use the "Export YAML" button

**Direct Export:**

1. Click the **"Export YAML"** button in the top right
2. The file will be downloaded as `sap-order-payload-mapping.yml`
3. You can now use this file in your application

**Format Guarantees:**

The exported YAML maintains the exact format of the original specification:
- ✅ Header comments explaining the file structure
- ✅ Multi-line expressions use the `>` folded scalar style
- ✅ Proper indentation (2 spaces per level)
- ✅ Country arrays formatted as `[ 'ES', 'PL' ]`
- ✅ Simple values like `"0.00"` preserved as-is
- ✅ Section comments for `fieldMappings` and `conditionMappings`
- ✅ Blank lines between condition entries

## Project Structure

```
fin-erp-yml-config/
├── src/
│   ├── components/
│   │   ├── ConfigurationEditor.jsx         # Unified configuration editor
│   │   ├── ConditionMappingsEditor.jsx     # Condition mappings editor
│   │   ├── ExpressionsByCountryEditor.jsx  # Country expressions editor
│   │   ├── FieldMappingsEditor.jsx         # Field mappings editor
│   │   ├── VisualExpressionBuilder.jsx     # SpEL-aware expression builder
│   │   ├── InputManager.jsx                # Input variables manager
│   │   ├── PayloadSimulator.jsx            # Payload testing simulator
│   │   ├── YamlPreview.jsx                 # YAML preview modal
│   │   └── ReferenceData.jsx               # Money Movements & Invoicing Items reference
│   ├── services/
│   │   ├── yamlConverterService.js         # 🚀 Microservice-ready YAML converter
│   │   └── README.md                       # Service documentation & migration guide
│   ├── utils/
│   │   ├── expressionParser.js             # Extracts SpEL variables from expressions
│   │   └── yamlFormatter.js                # YAML formatting utilities
│   ├── data/
│   │   └── referenceData.js                # Money Movements & Invoicing Items catalog
│   ├── App.jsx                              # Main application component
│   ├── main.jsx                             # Application entry point
│   └── index.css                            # Global styles with Tailwind
├── index.html                               # HTML template
├── package.json                             # Dependencies
├── vite.config.js                           # Vite configuration (GitHub Pages ready)
├── tailwind.config.js                       # Tailwind CSS configuration
├── postcss.config.js                        # PostCSS configuration
├── SPEL_GUIDE.md                            # 📖 Complete SpEL syntax reference
├── MICROSERVICE_API.md                      # 🚀 REST API specification for microservice
└── DEPLOYMENT_INSTRUCTIONS.md               # GitHub Pages deployment guide
```

## Technologies Used

- **Vite**: Fast build tool and development server
- **React 18**: Modern React with hooks
- **Headless UI**: Unstyled, accessible UI components
- **Heroicons**: Beautiful hand-crafted SVG icons
- **Tailwind CSS**: Utility-first CSS framework
- **js-yaml**: YAML parser and stringifier
- **@dnd-kit**: Modern drag-and-drop toolkit for React

## Field Types

The editor supports the following field types:

- `string`: Required string value
- `optional_string`: Optional string value (can be null, sent as empty string)
- `double`: Numeric value with format "0.00"
- `local_date_time`: Required date-time with custom format
- `optional_local_date_time`: Optional date-time with custom format
- `array`: Array of objects with nested item mappings

## Expression Syntax (SpEL)

All expressions use **Spring Expression Language (SpEL)** syntax. See **[SPEL_GUIDE.md](SPEL_GUIDE.md)** for complete reference.

**Common patterns:**

- Variable reference: `#input.orderMetadata.orderCode`
- Safe navigation: `#invoicingItems['ITEM']?.grossAmount?.value`
- Elvis operator (default): `#value ?: 0`
- Ternary conditional: `#condition ? value1 : value2`
- Map lookups: `{ 'GEN1': 'Restaurant', 'GEN2': 'Glovo' }[#input.handlingStrategy]`
- Method calls: `#input.orderId.toString()`
- Arithmetic: `(#value1 + #value2) * 1.5`

**SpEL Features:**
- ✅ Null-safe navigation with `?.`
- ✅ Default values with `?:`
- ✅ Method invocations
- ✅ Map/Collection literals
- ✅ Arithmetic & logical operations
- ✅ Type-safe conversions

See the Visual Expression Builder for SpEL-aware autocomplete and syntax help.

## Microservice Architecture

The YAML conversion logic has been extracted into a framework-agnostic module that can be deployed as a standalone microservice. This allows for:

- **Centralized Logic**: Update conversion rules in one place
- **Backend Validation**: Validate configurations server-side
- **Scalability**: Process large configurations without frontend limitations
- **Security**: Keep sensitive logic on the backend

**Documentation:**
- **[src/services/README.md](src/services/README.md)** - Module documentation and migration guide
- **[MICROSERVICE_API.md](MICROSERVICE_API.md)** - Complete REST API specification
- **[SPEL_GUIDE.md](SPEL_GUIDE.md)** - SpEL syntax reference

**Current State:** Frontend-only (no backend required)  
**Future State:** Can be migrated to use backend microservice

## Tips

- Use the disclosure panels to keep your workspace organized
- Color-coded badges help distinguish between field types and conditions
- The interface preserves all YAML comments when exporting
- You can have multiple expression groups for different country combinations
- Array fields allow full nesting of item mappings
- Hover over expression builder blocks to see SpEL syntax hints
- Use the SpEL Quick Reference in the expression builder for syntax help

## Troubleshooting

### YAML Import Issues

If you encounter issues importing a YAML file:
- Ensure the file is valid YAML syntax
- Check that the file follows the expected schema
- Look at the browser console for specific error messages

### Expression Validation

- The UI does not validate expressions - ensure they follow SpEL syntax
- Test your exported configuration in your application to validate expressions

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

