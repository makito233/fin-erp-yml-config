# Visual Expression Builder Guide

## Overview

The Visual Expression Builder is a modal-based tool that helps you create SpEL (Spring Expression Language) expressions using only validated Money Movements and Invoicing Items from your reference data.

## Opening the Builder

1. Navigate to **Configuration** tab
2. Expand **Field Mappings** or **Condition Mappings** section
3. Click on a field/condition to expand it
4. In any expression field, click the **📝 pencil icon** in the top-right corner
5. The Visual Expression Builder modal opens

## Builder Interface

### Layout

```
┌──────────────────────────────────────────────────────┐
│  Visual Expression Builder                      [X]  │
├──────────────────────────────────────────────────────┤
│  ┌─ Building Blocks ──┐  ┌─ Expression Editor ─┐   │
│  │ [Invoicing Items]  │  │                      │   │
│  │ [Input Fields]     │  │  Textarea with       │   │
│  │ [Operations]       │  │  live expression     │   │
│  │ [Methods]          │  │                      │   │
│  │                    │  │  [Clear Expression]  │   │
│  │ Click to insert → │  │                      │   │
│  └────────────────────┘  └──────────────────────┘   │
├──────────────────────────────────────────────────────┤
│  [Cancel]                    [Save Expression]      │
└──────────────────────────────────────────────────────┘
```

## Tabs Explained

### Tab 1: Invoicing Items ⭐

**Purpose**: Select only validated invoicing items from Reference Data

**Features**:
- 🔍 **Search bar**: Filter items by name
- 📜 **Scrollable list**: All 68+ valid invoicing items
- ℹ️ **Description**: See what the selected item does
- 🎨 **Property selector**: Choose Gross Amount, Net Amount, or Amount
- ➕ **Insert button**: Adds properly formatted reference

**Example Workflow**:
1. Type "PRODUCTS" in search → filters to product-related items
2. Select "PRODUCTS_TO_PARTNER"
3. See description: "Glovo pays the partner for products sold"
4. Choose property: "Gross Amount"
5. Click "Insert Invoicing Item"
6. Expression gets: `#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value`

**Why This Matters**:
- ✅ No typos in invoicing item names
- ✅ Only use items that actually exist
- ✅ See what each item does before using it
- ✅ Consistent syntax (?.property?.value)

### Tab 2: Input Fields

**Purpose**: Insert references to order input data

**Available Fields**:
- Order Code
- Order ID  
- Handling Strategy
- Vertical / Subvertical
- Partner Family
- Order Creation Time
- Final Status Date Time
- Order Dispatching Time
- Processing Time
- Operation Name

**Usage**: Click any field to insert its template (e.g., `#input.orderMetadata.orderCode`)

### Tab 3: Operations

**Purpose**: Mathematical and logical operations

**Available Operations**:
- **Math**: `+`, `-`, `*`, `/`
- **Grouping**: `()`
- **Conditional**: `?:` (elvis), `? :` (ternary)
- **Null Safe**: `?.`

**Usage**: Click to insert the operator

**Example**: Building `(value1 + value2) ?: 0`
1. Click "Parentheses ()" → `()`
2. Add invoicing item for value1
3. Click "Add (+)" → ` + `
4. Add invoicing item for value2
5. Move cursor after `)`
6. Click "Elvis (?:)" → ` ?: `
7. Type `0`

### Tab 4: Methods

**Purpose**: String manipulation methods

**Available Methods**:
- `.toString()` - Convert to string
- `.toLowerCase()` - Convert to lowercase
- `.toUpperCase()` - Convert to uppercase

**Usage**: Click to append to expression

**Example**: `#input.orderMetadata.partnerFamily?.toLowerCase()`

## Common Patterns

### Pattern 1: Simple Invoicing Item Reference

**Goal**: Get the net amount of products sold

**Steps**:
1. Tab: Invoicing Items
2. Search: "PRODUCTS_TO_PARTNER"
3. Select it
4. Property: Net Amount
5. Click Insert

**Result**: `#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value`

### Pattern 2: Sum of Multiple Items

**Goal**: Calculate total: products + tips

**Steps**:
1. Insert PRODUCTS_TO_PARTNER (net)
2. Click "Add (+)"
3. Insert TIP_TO_CUSTOMER (net)

**Result**: 
```
#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value + #invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value
```

### Pattern 3: Conditional with Fallback

**Goal**: Use value if exists, otherwise 0

**Steps**:
1. Click "Parentheses ()"
2. Insert invoicing item inside parentheses
3. Click "Elvis (?:)"
4. Type `0`

**Result**: `(#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value) ?: 0`

### Pattern 4: Map Lookup by Handling Strategy

**Goal**: Different values for GEN1, GEN2, PICKUP

**Steps**:
1. Type `{ 'GEN1': `
2. Insert expression for GEN1
3. Type `, 'GEN2': `
4. Insert expression for GEN2
5. Type `, 'PICKUP': `
6. Insert expression for PICKUP
7. Type `}`
8. Click "Parentheses ()" → moves cursor
9. Insert Handling Strategy field
10. Type `]`

**Result**:
```
{
  'GEN1': value1,
  'GEN2': value2,
  'PICKUP': value3
}[#input.orderMetadata.handlingStrategy]
```

### Pattern 5: String Comparison

**Goal**: Check if partner family is McDonald's

**Steps**:
1. Type `'mcdonalds' == `
2. Insert Partner Family field
3. Click ".toLowerCase()"

**Result**: `'mcdonalds' == #input.orderMetadata.partnerFamily?.toLowerCase()`

## Validation

### What's Validated

✅ **Invoicing Items**: Only items from Reference Data can be selected  
✅ **Syntax**: Proper `?.property?.value` structure automatically applied  
✅ **No Typos**: Can't misspell item names  

### What's NOT Validated

⚠️ **Expression Logic**: You're responsible for correct logic  
⚠️ **Parentheses Matching**: Builder doesn't check if they match  
⚠️ **Variable Names**: Free-form input fields aren't validated  

## Tips

### Best Practices

1. **Use Search**: Don't scroll through 68 items - search for what you need
2. **Read Descriptions**: Make sure you're using the right invoicing item
3. **Test Often**: Use Input Manager to test after building expressions
4. **Check Reference**: When unsure, check Reference tab for item details
5. **Save Frequently**: Click Save after each major edit

### Keyboard Shortcuts

- `Ctrl/Cmd + F` (in search): Find invoicing items quickly
- `Escape`: Close modal
- `Tab`: Navigate between fields

### Common Mistakes

❌ **Missing Elvis Operator**: `#invoicingItems['X']?.value` → will crash if null  
✅ **With Elvis**: `#invoicingItems['X']?.value ?: 0` → safe fallback

❌ **Wrong Property**: Using `amount` when you mean `netAmount`  
✅ **Check Description**: See which property the item has

❌ **Case Sensitivity**: `products_to_partner` (wrong)  
✅ **Exact Match**: `PRODUCTS_TO_PARTNER` (correct)

## Advanced Usage

### Complex Expressions

For very complex expressions, combine manual typing with the builder:

1. **Structure First**: Type the overall structure manually
```
{
  'GEN1': (...),
  'GEN2': (...),
  'PICKUP': (...)
}[#input.orderMetadata.handlingStrategy] ?: 0
```

2. **Fill with Builder**: Use builder to insert invoicing items in the `(...)` parts

3. **Review**: Check in Reference tab that all items are valid

### Reusable Patterns

Save common patterns in a text file for quick reference:

- **Elvis with 0**: ` ?: 0`
- **Null safe access**: `?.`
- **Gross value**: `?.grossAmount?.value`
- **Net value**: `?.netAmount?.value`

## Troubleshooting

### Modal Won't Open
- Ensure you clicked the pencil icon, not the textarea
- Check browser console for errors

### Can't Find Invoicing Item
- Use the search bar (case-insensitive)
- Check Reference tab to verify item exists
- Ensure you're looking in Invoicing Items, not Money Movements

### Expression Not Working in Simulator
- Check console for evaluation errors
- Verify all invoicing items exist in Reference
- Test with simple expression first
- Add elvis operators for null safety

## Comparison: Old vs New

### Old Inline Builder
- ❌ Cluttered interface
- ❌ Could type any item name (typos possible)
- ❌ No validation
- ❌ Hard to find items

### New Modal Builder
- ✅ Clean, focused interface
- ✅ Only valid items selectable
- ✅ Search and filter
- ✅ Descriptions and tooltips
- ✅ Dedicated screen space

---

**Pro Tip**: Keep the Reference tab open in another browser tab for quick lookups while building expressions!

