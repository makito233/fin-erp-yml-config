# Workflow Guide

## Recommended Workflow for Using the Configuration UI

### 1. Import Your Configuration
- Click **"Import YAML"** button
- Select your `sap-order-payload-mapping.yml` file
- The configuration loads into the editor

### 2. Edit Expressions (Optional)
Navigate to **Configuration** tab to:
- Expand **Field Mappings** or **Condition Mappings** sections
- Add new fields or conditions
- Edit existing expressions using the visual builder
- Drag and drop concepts and operations
- Use pre-built common expressions with valid invoicing items

### 3. Configure Input Values
Navigate to the **Input Manager** tab:
- View all extracted input variables automatically
- See three organized categories:
  - **Input Fields**: `input.orderMetadata.*`, `input.operation.*`, etc.
  - **Invoicing Items**: All `invoicingItems['XXX']` references
  - **Variables**: Standalone variables like `#currencyCodeValue`
- Enter test values for each variable
- Click **"Run Simulation with These Inputs"**

### 4. Review Generated Payload
The **Simulator** tab opens automatically showing:
- Summary of input values used (read-only)
- Invoicing items configured
- Generated field mappings
- Generated condition values
- Complete JSON payload with calculations
- Any errors or warnings

The simulator automatically generates the payload when you arrive from Input Manager.

### 5. Export Your Configuration
- Click **"Preview"** to review the YAML format
- Verify it matches the expected format
- Click **"Download YAML"** to save

## Key Benefits of This Workflow

### Input Manager Advantages
✅ **Automatic Discovery**: Extracts all variables from your expressions  
✅ **No Manual Tracking**: Don't need to remember which variables you used  
✅ **Centralized Configuration**: One place to set all input values  
✅ **Organized by Type**: Groups related inputs together  
✅ **Dynamic Updates**: Automatically includes new variables when you add expressions

### Example: Testing a New Expression

**Old Way (without Input Manager):**
1. Add expression `#invoicingItems['NEW_FEE']?.grossAmount?.value ?: 0`
2. Remember you need to add NEW_FEE to simulator
3. Manually find the right place in simulator
4. Add the values
5. Run simulation

**New Way (with Input Manager):**
1. Add expression `#invoicingItems['NEW_FEE']?.grossAmount?.value ?: 0`
2. Go to Input Manager tab
3. NEW_FEE automatically appears in Invoicing Items
4. Set the values
5. Click "Run Simulation"

## Tab Overview

### Tab 1: Configuration
**Purpose**: Unified editor for both field and condition mappings

**Use for**:
- Adding/editing fields like `orderId`, `countryCode`, etc.
- Setting field types (string, double, local_date_time, array)
- Configuring format for date-time fields
- Managing array item mappings
- Adding/editing conditions like `netTotalOrderValue`, `grossFoodValue`
- Complex calculations with multiple invoicing items
- Map-based expressions for different handling strategies

**Features**:
- Collapsible sections for Field Mappings and Condition Mappings
- Statistics showing count of each type
- All configuration in one place

### Tab 2: Input Manager ⭐ (Recommended for Testing)
**Purpose**: Centralized input variable configuration

**Use for**:
- Setting test values for all variables at once
- Seeing what variables your configuration uses
- Quickly testing different scenarios
- Organized input configuration

### Tab 3: Simulator
**Purpose**: Generate and preview payloads

**Use for**:
- Validating your configuration
- Seeing the actual JSON output
- Debugging expression issues
- Copying test payloads

### Tab 4: Reference
**Purpose**: Browse all valid Money Movements and Invoicing Items

**Use for**:
- Looking up valid invoicing item names
- Understanding what each item represents
- Finding money flow directions
- Checking taxation types
- Searching across all items

## Common Use Cases

### Use Case 1: Adding a New Field
1. Go to **Configuration** tab
2. Expand **Field Mappings** section
3. Add new field with expression (use invoicing item selector)
4. Go to **Input Manager** tab
5. Input Manager automatically shows new variables
6. Set values and simulate

### Use Case 2: Testing Different Countries
1. Go to **Input Manager** tab
2. Change `financialSourceCountryCodeValue` to different country
3. Click "Run Simulation"
4. See how payload changes for that country

### Use Case 3: Debugging an Expression
1. Expression shows error in simulator
2. Go to **Configuration** tab
3. Expand relevant section (Field or Condition Mappings)
4. Use visual builder to see expression structure
5. Check **Reference** tab for valid invoicing items
6. Fix the expression
7. Go to **Input Manager** to verify variables
8. Re-simulate to confirm fix

### Use Case 4: Creating Test Scenarios
1. Configure first scenario in Input Manager
2. Run simulation and copy payload
3. Change values for second scenario
4. Run simulation and compare payloads
5. Export configuration when satisfied

## Tips & Best Practices

### Expression Building
- Click the **pencil icon** to open Visual Builder modal
- Use **Invoicing Items** tab to select validated items
- Search for specific invoicing items quickly
- See descriptions to ensure correct item
- Use **Input Fields** tab for order metadata
- Use **Operations** tab for math and logic
- Type directly in the expression field for manual editing

### Input Configuration
- Use **Input Manager** as your primary testing interface
- Set realistic values that match your production data
- Test with multiple country codes
- Verify all invoicing items have values

### Validation
- Always preview YAML before exporting
- Check for errors in simulator
- Test with edge cases (empty values, nulls)
- Verify output matches expected format

### Organization
- Group related fields together
- Use consistent naming conventions
- Document complex expressions with comments (in YAML)
- Keep test values realistic

## Troubleshooting

### Variables Not Showing in Input Manager
- Check that expressions are properly formatted
- Ensure you're using `#` prefix for variables
- Verify country is selected in expressions

### Simulation Errors
- Check that all required variables have values
- Verify expression syntax
- Ensure invoicing items have grossAmount/netAmount structure
- Check country code matches expression countries

### Export Format Issues
- Use Preview to verify before downloading
- Check indentation is 2 spaces
- Verify expressions use `>` folded style
- Ensure countries are formatted as `[ 'ES', 'PL' ]`

## Quick Reference

| Task | Tab | Action |
|------|-----|--------|
| Add field | Configuration | Expand Field Mappings, Click "Add Field" |
| Add condition | Configuration | Expand Condition Mappings, Click "Add Condition" |
| Build expression | Configuration | Use Visual Builder with item selector |
| Look up valid items | Reference | Browse or search |
| Set input values | Input Manager | Fill in forms |
| Test configuration | Input Manager | Click "Run Simulation" |
| View output | Simulator | Auto-generated |
| Export config | Top bar | Click "Preview" or "Export YAML" |

## Keyboard Shortcuts

While the UI doesn't have custom shortcuts, you can use standard browser shortcuts:
- `Ctrl/Cmd + F`: Find in page
- `Ctrl/Cmd + C`: Copy (in preview/simulator)
- `Tab`: Navigate between fields
- `Enter`: Submit when in input fields

---

**Need Help?** Check the main [README.md](README.md) for detailed documentation.

