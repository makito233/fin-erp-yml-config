# Bubble Expression Builder Guide

## What is the Bubble Builder?

The Bubble Expression Builder transforms complex SpEL expressions into visual, human-readable bubbles that you can easily create, edit, and rearrange.

## Visual Concept

Instead of typing complex SpEL with safety wrappers:
```
(#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value ?: 0) + (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0)
```

You create simple visual bubbles:
```
┌────────────────────────┐   ┌───┐   ┌────────────────────┐
│ PRODUCTS_TO_PARTNER    │   │ + │   │ TIP_TO_CUSTOMER    │
│ .grossAmount           │   └───┘   │ .netAmount         │
└────────────────────────┘           └────────────────────┘
```

**The builder automatically adds** `(... ?: 0)` around each item for null safety - you don't see or manage this boilerplate!

## How to Use

### Step 1: Open the Builder

1. Click the **📝 pencil icon** in any expression field
2. Modal opens in Visual Mode

### Step 1.5: (Optional) Enable Order Type Map

If your expression needs different logic for GEN1, GEN2, and PICKUP:

1. Check the **"Use Order Type Map"** checkbox at the top
2. Select which order types to include (GEN1, GEN2, PICKUP)
3. Builder changes to show tabs for each selected order type
4. Build expressions separately for each type
5. Auto-generates the map structure with `[#input.orderMetadata.handlingStrategy]`

**Skip this step if you don't need order type differentiation!**

### Step 2: Add Invoicing Items

**Using Autocomplete:**

**Quick Start (Auto-detect):**
1. Just start typing the item name (e.g., `PROD`)
2. Autocomplete shows BOTH Invoicing Items and Money Movements
3. Each item has a badge: 🟣 Invoicing Item or 🔵 Money Movement
4. Select the item you want
5. Type `.` for property suggestions
6. Select property (grossAmount, netAmount, or amount)
7. Press **Enter** or **Tab**
8. Beautiful bubble appears! 🎉

**Explicit Typing:**
1. Type `invoicingItems.` OR `moneyMovements.`
2. Autocomplete shows only that type
3. Continue with item name and property as above

**Example:**
```
Type: PROD
  ↓ Shows:
  • PRODUCTS_TO_PARTNER [Invoicing Item]
  • PRODUCTS_BY_CUSTOMER [Money Movement]
  • PRODUCTS_REFUND_... [Invoicing Item]
  ...
```

**Example Typing Sequence:**
```
Type: invoicingItems.PRO
  ↓ (autocomplete shows PRODUCTS_TO_PARTNER, etc.)
Select: PRODUCTS_TO_PARTNER
Type: .
  ↓ (shows grossAmount, netAmount, amount)
Type: g
  ↓ (grossAmount highlighted)
Press: Enter
  ↓ Bubble created!
```

### Step 3: Add Operations

Click operation buttons below the expression area:
- **Add (+)** - Addition
- **Subtract (-)** - Subtraction  
- **Multiply (*)** - Multiplication
- **Divide (/)** - Division

Orange operation bubbles appear between your values.

### Step 4: Add Parentheses and Conditionals

Use "Quick Add" buttons:
- **( Open Parenthesis**
- **) Close Parenthesis**
- **?: 0 (Elvis with fallback)** - Safe null handling
- **? : (Ternary)** - Conditional expression

### Step 5: (Optional) Add Conditional Logic

For if/then/else expressions:

1. Click **"Build If/Then/Else"** button
2. Configure the conditional:
   - **IF**: Select item and comparison (e.g., `DELIVERY_FEE > 0`)
   - **THEN**: Select item to use if true
   - **ELSE**: Select item to use if false
3. Click **"Add Conditional"**
4. Gray bubble appears with complete conditional expression

**Example**: If delivery fee exists, use it, else use service fee

### Step 6: Validation

- ✅ **Green indicator**: Expression is valid
- ❌ **Red indicator**: Shows validation errors
- Prevents common mistakes like unbalanced parentheses

### Step 7: Save

Click **Save Expression** - bubbles convert back to proper SpEL syntax!

## Complete Example Walkthrough

### Goal: Calculate Net Total

**Formula**: (Products Net + Tip Net) with 0 fallback

**Steps:**

1. **Open builder** - Click pencil icon

2. **Add opening parenthesis**:
   - Click "( Open Parenthesis" button
   - Gray bubble appears: `(`

3. **Add first item**:
   - Type: `invoicingItems.PRODUCTS_TO_PARTNER.netAmount`
   - Press Enter
   - Blue bubble appears: **PRODUCTS_TO_PARTNER .netAmount**

4. **Add operation**:
   - Click "Add (+)" button
   - Orange bubble appears: **+**

5. **Add second item**:
   - Type: `invoicingItems.TIP_TO_CUSTOMER.netAmount`
   - Press Enter
   - Blue bubble appears: **TIP_TO_CUSTOMER .netAmount**

6. **Add closing parenthesis**:
   - Click ") Close Parenthesis" button
   - Gray bubble appears: `)`

7. **Add elvis operator**:
   - Click "?: 0 (Elvis with fallback)" button
   - Gray bubble appears: `: 0`

8. **Result**:
```
( PRODUCTS_TO_PARTNER.netAmount + TIP_TO_CUSTOMER.netAmount ) ?: 0
```

9. **Save** - Click "Save Expression"

10. **Generated SpEL**:
```
(#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value + #invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value) ?: 0
```

## Bubble Types

### 🟢 Invoicing Item Bubbles (Green/Blue/Purple)
- **Green**: grossAmount property
- **Blue**: netAmount property  
- **Purple**: amount property

Shows item name and property clearly.

### 🟠 Operation Bubbles (Orange)
Contains: `+`, `-`, `*`, `/`

### ⚫ Text Bubbles (Gray)
Contains: parentheses, elvis operators, numbers, other text

## Features

### Autocomplete

The autocomplete is smart and comprehensive:
- **Dual Source**: Shows both Invoicing Items (68+) and Money Movements (27+)
- **Type Badges**: 🟣 Purple badge for Invoicing Items, 🔵 Cyan badge for Money Movements
- **Filters as you type**: Only shows matching items from both sources
- **Shows descriptions**: See what each item does inline
- **Two-stage**: First item name, then property
- **Keyboard navigation**: Arrow keys + Enter/Tab
- **Case insensitive**: Works with any casing
- **Smart context**: Type prefix (`invoicingItems.` or `moneyMovements.`) for specific type

### Visual vs Text Mode

**Visual Mode** (Default):
- Build with bubbles
- Autocomplete and suggestions
- Click operations to add
- Perfect for learning and complex expressions

**Text Mode**:
- Direct SpEL syntax editing
- For advanced users
- Quick manual edits
- Switch modes anytime

### Edit and Remove

- **Remove bubble**: Click the X on any bubble
- **Reorder**: Remove and re-add (drag-drop coming soon!)
- **Edit**: Switch to Text Mode for fine-tuning

## Keyboard Shortcuts

- `Enter` / `Tab`: Accept autocomplete suggestion
- `↑` / `↓`: Navigate suggestions
- `Escape`: Close suggestions
- `Ctrl/Cmd + Enter`: Save expression (when focused)

## Tips & Tricks

### Tip 1: Use Autocomplete Efficiently
```
invoicingItems.pro  ← Type just a few letters
  ↓
Shows: PRODUCTS_TO_PARTNER
       PROMOTION_PRODUCT_TO_CUSTOMER
       PRODUCTS_REFUND_AFFECTING_COMMISSION_TO_CUSTOMER
       ...
```

### Tip 2: Build Complex Expressions in Chunks

For complex map-based expressions:
1. Build the pattern in **Text Mode**:
```
{
  'GEN1': (),
  'GEN2': (),
  'PICKUP': ()
}[#input.orderMetadata.handlingStrategy] ?: 0
```

2. Switch to **Visual Mode**
3. Add invoicing items inside the `()` placeholders

### Tip 3: Use Parentheses for Clarity

Always group calculations:
```
Good: (item1 + item2) ?: 0
Bad:  item1 + item2 ?: 0  ← Ambiguous precedence
```

### Tip 4: Check the Preview

Bottom of modal shows generated SpEL:
- Verify syntax looks correct
- Check all items are properly referenced
- Ensure operators are in right places

## Common Patterns

### Pattern: Sum Multiple Items
```
Visual: [PRODUCTS_TO_PARTNER.net] + [TIP_TO_CUSTOMER.net] + [DELIVERY_FEE.net]
SpEL:   #invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value + 
        #invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value + 
        #invoicingItems['DELIVERY_FEE_BY_GLOVO']?.netAmount?.value
```

### Pattern: Subtraction with Safety
```
Visual: ( [PRODUCTS.gross] - [PROMOTION.gross] ) ?: 0
SpEL:   (#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value - 
         #invoicingItems['PROMOTION_PRODUCT_TO_CUSTOMER']?.grossAmount?.value) ?: 0
```

### Pattern: Simple Reference
```
Visual: [PRODUCTS_TO_PARTNER.net]
SpEL:   #invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value
```

## Validation

### What's Validated
✅ Invoicing item names (only from Reference Data)  
✅ Property names (grossAmount, netAmount, amount)  
✅ Syntax structure (automatic `?.property?.value`)

### What's NOT Validated
⚠️ Mathematical logic  
⚠️ Parentheses matching  
⚠️ Free-form text in gray bubbles  

## Troubleshooting

### Autocomplete Not Showing
- Ensure you typed `invoicingItems.` (with the dot)
- Check spelling
- Make sure you're in Visual Mode

### Can't Find Item
- Use search in autocomplete
- Check Reference tab for exact spelling
- Item names are UPPERCASE with underscores

### Bubble Won't Create
- Ensure you selected both item AND property
- Press Enter or Tab after typing
- Check that item exists in Reference Data

### Expression Looks Wrong in Preview
- Check bubble order
- Verify all operations are included
- Switch to Text Mode to see raw SpEL
- Compare with examples in this guide

## Advanced: Text Mode

For power users who know SpEL syntax:

1. Click "Text Mode" button
2. Edit SpEL syntax directly
3. Switch back to "Visual Mode"
4. Bubbles automatically created from your expression!

**Supported in conversion:**
- Invoicing item references
- Basic operations (+, -, *, /)
- Parentheses and elvis operators

**Manual editing needed for:**
- Complex map lookups
- Nested ternary operators
- Method calls

## Benefits Over Old Builder

| Feature | Old Builder | New Bubble Builder |
|---------|-------------|-------------------|
| Interface | Tabs with drag-drop | Autocomplete + bubbles |
| Validation | Manual selection | Forced validation |
| Readability | SpEL syntax | Human-readable bubbles |
| Learning curve | Steep | Gentle |
| Error prevention | Medium | High |
| Speed | Medium | Fast with autocomplete |

## Examples from Your YAML

### Example 1: grossFoodValue
```yaml
expression: >
  (#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value ?: 0)
```

**Bubble View:**
```
( [PRODUCTS_TO_PARTNER.grossAmount] ) ?: 0
```

### Example 2: netTotalOrderValue (GEN2)
```yaml
expression: >
  (
    (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0)
    + (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0)
    + (#invoicingItems['DELIVERY_FEE_BY_GLOVO']?.netAmount?.value ?: 0)
  )
```

**Bubble View:**
```
( [PRODUCTS_TO_PARTNER.net] + [TIP_TO_CUSTOMER.net] + [DELIVERY_FEE_BY_GLOVO.net] )
```

Much clearer! 🎯

---

**Next Steps**: Try building a simple expression with the bubble builder to get familiar with the autocomplete and visual interface!

