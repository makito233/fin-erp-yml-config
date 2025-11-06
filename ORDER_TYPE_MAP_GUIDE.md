# Order Type Map Feature

## What is an Order Type Map?

Many expressions in your SAP configuration need different logic based on the handling strategy (GEN1, GEN2, or PICKUP). The Order Type Map feature makes it easy to build these conditional expressions.

## When to Use It

Use Order Type Map when your expression needs to:
- Calculate different values for restaurant delivery (GEN1) vs Glovo delivery (GEN2)
- Exclude certain items for PICKUP orders
- Apply different formulas per handling strategy

## How to Enable

1. Open the Expression Builder (click 📝 icon)
2. Check **"Use Order Type Map (GEN1/GEN2/PICKUP)"** at the top
3. Select which order types to include (checkboxes)
4. Builder switches to Order Type mode

## Interface in Order Type Mode

```
┌─────────────────────────────────────────┐
│ ☑ Use Order Type Map                   │
│   Select: ☑ GEN1  ☑ GEN2  ☑ PICKUP     │
├─────────────────────────────────────────┤
│ Tabs: [ GEN1 ] [ GEN2 ] [ PICKUP ]     │
├─────────────────────────────────────────┤
│ Expression for GEN1:                    │
│ ┌─────────────────────────────────────┐ │
│ │ [Bubbles for GEN1 expression]       │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Step-by-Step Example

### Goal: Net Total with Different Logic per Type

**Requirements:**
- GEN1: Products + Tips + Marketplace Delivery Fee
- GEN2: Products + Tips + Delivery Fee
- PICKUP: Products only

### Steps:

1. **Enable Order Type Map**
   - Check "Use Order Type Map"
   - All three types selected by default

2. **Build GEN1 Expression**
   - GEN1 tab is active
   - Type: `PRODUCTS_TO_PARTNER.netAmount` → Enter
   - Click: **Add (+)**
   - Type: `TIP_TO_CUSTOMER.netAmount` → Enter
   - Click: **Add (+)**
   - Type: `MPL_DELIVERY_FEE_BY_GLOVO.netAmount` → Enter

3. **Build GEN2 Expression**
   - Click **GEN2** tab
   - Type: `PRODUCTS_TO_PARTNER.netAmount` → Enter
   - Click: **Add (+)**
   - Type: `TIP_TO_CUSTOMER.netAmount` → Enter
   - Click: **Add (+)**
   - Type: `DELIVERY_FEE_BY_GLOVO.netAmount` → Enter

4. **Build PICKUP Expression**
   - Click **PICKUP** tab
   - Type: `PRODUCTS_TO_PARTNER.netAmount` → Enter

5. **Save**
   - Click "Save Expression"

### Generated Output

```yaml
{
  'GEN1': (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value + #invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value + #invoicingItems['MPL_DELIVERY_FEE_BY_GLOVO']?.netAmount?.value),
  'GEN2': (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value + #invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value + #invoicingItems['DELIVERY_FEE_BY_GLOVO']?.netAmount?.value),
  'PICKUP': (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value)
}[#input.orderMetadata.handlingStrategy]
```

## Selective Order Types

You can include only specific order types:

### Example: GEN1 and GEN2 Only

1. Check "Use Order Type Map"
2. **Uncheck** PICKUP
3. Only GEN1 and GEN2 tabs show
4. Build expressions for each
5. Generates:

```yaml
{
  'GEN1': (expression1),
  'GEN2': (expression2)
}[#input.orderMetadata.handlingStrategy]
```

### Example: PICKUP Different, GEN1/GEN2 Same

If GEN1 and GEN2 use the same logic but PICKUP is different:

1. Build GEN1 expression fully
2. Switch to GEN2 tab
3. Re-build same expression (or copy from preview)
4. Switch to PICKUP tab
5. Build different expression

**Tip**: For same expressions, you can switch to Text Mode and edit directly.

## Visual Feedback

### Tab Buttons
- **Active tab**: Blue background with white text
- **Inactive tabs**: Gray background
- Switch freely between tabs while building

### Preview
The bottom preview shows the complete map structure:
```
{
  'GEN1': (your expression),
  'GEN2': (your expression),
  'PICKUP': (your expression)
}[#input.orderMetadata.handlingStrategy]
```

## Common Patterns

### Pattern 1: Different Items per Type
```
GEN1:   item1 + item2 + item3
GEN2:   item1 + item2 + item4
PICKUP: item1
```

### Pattern 2: Zero for PICKUP
```
GEN1:   complex calculation
GEN2:   complex calculation
PICKUP: 0
```

Just type `0` in PICKUP tab (creates text bubble).

### Pattern 3: Only Two Types
```
Uncheck PICKUP

GEN1:   expression
GEN2:   expression
```

Generates only GEN1 and GEN2 in map.

## Benefits

✅ **Organized**: Build each type separately without confusion  
✅ **Clear Structure**: Auto-generates proper map syntax  
✅ **Visual Tabs**: Easy to see which type you're editing  
✅ **Flexible**: Include 1, 2, or all 3 order types  
✅ **No Syntax Errors**: Map structure is generated correctly  

## Switching Modes

### Visual → Text
- Click "Text Mode"
- See complete map with all expressions
- Edit directly if needed
- Can't switch back to Visual for maps (too complex to parse)

### Disable Order Type Map
- Uncheck "Use Order Type Map"
- Returns to simple expression builder
- Current map work is lost (switches modes)
- Use Text Mode to preserve complex maps

## Tips

1. **Build Simple First**: Create expressions for each type, then add complexity
2. **Use Same Bubbles**: Copy common items across types for consistency
3. **Test Each Type**: Use Input Manager with different handlingStrategy values
4. **Preview Often**: Check the generated output looks correct
5. **Common Pattern**: Most condition mappings in your YAML use this pattern!

## Example from Your YAML

### netTotalOrderValue

**Current YAML:**
```yaml
{
  'GEN1': (
    (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0)
    + (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0)
    + (#invoicingItems['MPL_DELIVERY_FEE_BY_GLOVO']?.netAmount?.value ?: 0)
    ...
  ),
  'GEN2': (
    (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0)
    + (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0)
    + (#invoicingItems['DELIVERY_FEE_BY_GLOVO']?.netAmount?.value ?: 0)
    ...
  ),
  'PICKUP': (
    (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0)
  )
}[#input.orderMetadata.handlingStrategy] ?: 0
```

**Using Bubble Builder:**
1. Enable Order Type Map
2. Build each type's expression with bubbles
3. Save - generates perfect YAML!

Much easier than manual typing! 🚀


