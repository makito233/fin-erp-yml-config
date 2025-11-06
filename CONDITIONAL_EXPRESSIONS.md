# Conditional Expressions Guide

## Overview

The Bubble Expression Builder now supports building conditional expressions (if/then/else logic) visually, making it easy to create expressions like:

"If money movement > 0, use invoicing item X, else use money movement Y"

## How to Build Conditionals

### Step 1: Open Conditional Builder

1. Open the Expression Builder (click 📝 pencil icon)
2. Scroll to **"Conditional Expression"** section
3. Click **"Build If/Then/Else"** button
4. Conditional builder panel appears

### Step 2: Configure the Condition

The **IF** part checks whether a condition is true:

1. Click **"+ Select Item"** under IF section
2. Search and select an item (e.g., `DELIVERY_FEE_BY_CUSTOMER`)
3. Choose property (Gross/Net/Amount)
4. Set comparison operator (`>`, `<`, `==`, `!=`)
5. Set comparison value (default: `0`)

**Example**: IF `DELIVERY_FEE_BY_CUSTOMER.netAmount > 0`

### Step 3: Configure THEN Value

The **THEN** part specifies what to use if condition is true:

1. Click **"+ Select Item"** under THEN section
2. Select the item to use (e.g., `DELIVERY_FEE_TO_CUSTOMER.grossAmount`)

### Step 4: Configure ELSE Value

The **ELSE** part specifies what to use if condition is false:

1. Click **"+ Select Item"** under ELSE section
2. Select the fallback item (e.g., `SERVICE_FEE_TO_CUSTOMER.netAmount`)

### Step 5: Add to Expression

1. Click **"Add Conditional"** button
2. Complete conditional expression appears as a gray bubble
3. Continue building expression if needed

## Complete Example

### Scenario
Use delivery fee if customer paid for delivery, otherwise use service fee.

### Steps:

1. **IF Condition**:
   - Select: `DELIVERY_FEE_BY_CUSTOMER`
   - Property: `netAmount`
   - Operator: `>`
   - Value: `0`

2. **THEN**:
   - Select: `DELIVERY_FEE_TO_CUSTOMER`
   - Property: `grossAmount`

3. **ELSE**:
   - Select: `SERVICE_FEE_TO_CUSTOMER`
   - Property: `netAmount`

4. Click **"Add Conditional"**

### Visual Result
```
┌─────────────────────────────────────────────────────┐
│ IF DELIVERY_FEE_BY_CUSTOMER.net > 0 THEN           │
│ DELIVERY_FEE_TO_CUSTOMER.gross                      │
│ ELSE SERVICE_FEE_TO_CUSTOMER.net                    │
└─────────────────────────────────────────────────────┘
```

### Generated SpEL
```
(#invoicingItems['DELIVERY_FEE_BY_CUSTOMER']?.netAmount?.value ?: 0) > 0 
? (#invoicingItems['DELIVERY_FEE_TO_CUSTOMER']?.grossAmount?.value ?: 0) 
: (#invoicingItems['SERVICE_FEE_TO_CUSTOMER']?.netAmount?.value ?: 0)
```

## Comparison Operators

- **`>`** Greater than - Use when checking if value exists and is positive
- **`<`** Less than - Use when checking if value is below threshold
- **`==`** Equals - Use when checking for exact match
- **`!=`** Not equals - Use when checking for difference

## Common Use Cases

### Use Case 1: Check if Item Exists
```
IF: PROMOTION_DELIVERY_FEE_BY_GLOVO.netAmount > 0
THEN: Use the promotion amount
ELSE: Use 0 (no promotion)
```

### Use Case 2: Choose Between Two Sources
```
IF: DELIVERY_FEE_TO_CUSTOMER.grossAmount > 0
THEN: Courier billed customer directly
ELSE: Use Glovo's delivery fee
```

### Use Case 3: Threshold Check
```
IF: COMMISSION_TO_PARTNER.netAmount > 100
THEN: Use high-value processing fee
ELSE: Use standard processing fee
```

## Combining with Operations

You can combine conditionals with arithmetic:

**Example**: Base amount + conditional bonus

1. Add first item bubble: `PRODUCTS_TO_PARTNER.netAmount`
2. Click: **Add (+)**
3. Build conditional for bonus
4. Result: `baseAmount + (condition ? bonus : 0)`

## Multiple Conditionals

To add multiple conditionals:

1. Build first conditional → Click "Add Conditional"
2. Click **Add (+)** operation
3. Click "Build If/Then/Else" again
4. Build second conditional → Click "Add Conditional"

**Result**: `(condition1 ? value1 : value2) + (condition2 ? value3 : value4)`

## Visual Indicators

- **Gray Bubble**: Conditional expressions appear as gray text bubbles
- **Can Edit**: Click X to remove, or switch to Text Mode to edit
- **Validation**: Expression validator checks syntax

## Tips

1. **Keep It Simple**: Complex nested conditionals are hard to read - use Text Mode
2. **Test Thoroughly**: Use Input Manager to test with different values
3. **Common Pattern**: Most conditionals check `> 0` to see if value exists
4. **Clear Labels**: The builder shows IF/THEN/ELSE clearly

## Limitations

- Conditionals are added as text bubbles (can't edit parts individually after creation)
- To modify: Remove the bubble and rebuild, or switch to Text Mode
- Complex nested conditionals: Better to use Text Mode

## Real YAML Example

From `sap-order-payload-mapping.yml`:

```yaml
expression: >
  (#invoicingItems['DELIVERY_FEE_BY_CUSTOMER']?.netAmount?.value ?: 0) > 0
  ? (#invoicingItems['DELIVERY_FEE_TO_CUSTOMER']?.grossAmount?.value ?: 0)
  : (#invoicingItems['SERVICE_FEE_TO_CUSTOMER']?.netAmount?.value ?: 0)
```

**Building with Conditional Builder:**
- IF: `DELIVERY_FEE_BY_CUSTOMER.netAmount > 0`
- THEN: `DELIVERY_FEE_TO_CUSTOMER.grossAmount`
- ELSE: `SERVICE_FEE_TO_CUSTOMER.netAmount`

Much easier than typing manually! 🎯


