# Simulator Usage Guide

## How the Simulator Works

The simulator evaluates SpEL (Spring Expression Language) expressions using your input values to generate the final payload.

### Expression Evaluation Flow

1. **Input Manager** → User sets values (e.g., `PRODUCTS_TO_PARTNER = 10`)
2. **Expression Parser** → Replaces all variable references with actual values
3. **Calculator** → Evaluates arithmetic and logical operations
4. **Output** → Generates the final payload with calculated values

### Example Walkthrough

Let's say you have this expression in a condition mapping:
```yaml
conditionType: netTotalOrderValue
expression: >
  (
    (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0)
    + (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0)
  )
```

#### Step 1: Set Input Values in Input Manager

Navigate to **Input Manager** tab and set:
- **PRODUCTS_TO_PARTNER**:
  - Net Amount: `18.00`
  - Gross Amount: `20.00`
- **TIP_TO_CUSTOMER**:
  - Net Amount: `2.00`
  - Gross Amount: `2.00`

#### Step 2: Run Simulation

Click **"Run Simulation with These Inputs"**

#### Step 3: Expression Evaluation

The simulator transforms the expression:
```
Original:
(
  (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0)
  + (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0)
)

Step 1 - Replace invoicing items:
( (18.00 || 0) + (2.00 || 0) )

Step 2 - Evaluate:
18.00 + 2.00 = 20.00

Result: 20.00
```

#### Step 4: View Results

In the **Simulator** tab, you'll see:
```json
{
  "items": [
    {
      "conditionType": "netTotalOrderValue",
      "conditionValue": "20.00"
    }
  ]
}
```

## Supported Expression Types

### 1. Invoicing Items
```
#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value ?: 0
```
Returns the value you set in Input Manager, or 0 if not set.

### 2. Input Fields
```
#input.orderMetadata.orderCode
```
Returns the value you set for orderCode in Input Manager.

### 3. Method Calls
```
#input.orderMetadata.orderId.toString()
#input.orderMetadata.vertical.toLowerCase()
#input.operation.name()
```
Executes the method on the value.

### 4. Map Lookups
```
{
  'GEN1': 'Restaurant',
  'GEN2': 'Glovo',
  'PICKUP': 'Selfpick'
}[#input.orderMetadata.handlingStrategy]
```
If handlingStrategy = 'GEN2', returns 'Glovo'.

### 5. Arithmetic Operations
```
(#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0)
+ (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0)
- (#invoicingItems['PROMOTION_PRODUCT_TO_CUSTOMER']?.netAmount?.value ?: 0)
```
Performs addition, subtraction, multiplication, division.

### 6. Conditional Expressions
```
#input.orderMetadata?.vertical == null ? 'UNDEFINED' : #input.orderMetadata.vertical
```
Returns 'UNDEFINED' if vertical is null, otherwise returns the actual value.

### 7. Map with Complex Values
```
{
  'GEN1': (
    (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0)
    + (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0)
  ),
  'GEN2': (
    (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0)
  )
}[#input.orderMetadata.handlingStrategy] ?: 0
```
Evaluates the expression for the matching key.

## Complete Example

### Configuration
You have field and condition mappings that reference:
- `PRODUCTS_TO_PARTNER`
- `TIP_TO_CUSTOMER`
- `DELIVERY_FEE_BY_GLOVO`
- `orderCode`, `orderId`, `handlingStrategy`
- `financialSourceCountryCodeValue`, `currencyCodeValue`

### Input Manager Setup

**Input Fields Tab:**
- `orderMetadata.orderCode` = "ORDER-12345"
- `orderMetadata.orderId` = "67890"
- `orderMetadata.handlingStrategy` = "GEN2"

**Invoicing Items Tab:**
- **PRODUCTS_TO_PARTNER**:
  - Gross: 20.00
  - Net: 18.00
- **TIP_TO_CUSTOMER**:
  - Gross: 2.00
  - Net: 2.00
- **DELIVERY_FEE_BY_GLOVO**:
  - Gross: 3.50
  - Net: 3.00

**Variables Tab:**
- `financialSourceCountryCodeValue` = "ES"
- `currencyCodeValue` = "EUR"
- `cityCodeValue` = "BCN"

### Generated Payload

```json
{
  "orderId": "ORDER-12345",
  "glovoOrderId": "67890",
  "currency": "EUR",
  "orderCity": "BCN",
  "deliveryServiceProvider": "Glovo",
  "items": [
    {
      "conditionType": "netTotalOrderValue",
      "conditionValue": "23.00"
    },
    {
      "conditionType": "grossTotalOrderValue",
      "conditionValue": "25.50"
    },
    {
      "conditionType": "grossFoodValue",
      "conditionValue": "20.00"
    },
    {
      "conditionType": "netFoodValue",
      "conditionValue": "18.00"
    },
    {
      "conditionType": "grossTipValue",
      "conditionValue": "2.00"
    },
    {
      "conditionType": "netTipValue",
      "conditionValue": "2.00"
    },
    {
      "conditionType": "netDeliveryFee",
      "conditionValue": "3.00"
    }
  ]
}
```

## Tips for Testing

1. **Start Simple**: Set basic values first, then add complexity
2. **Check Console**: Open browser console (F12) to see evaluation steps
3. **Test Incrementally**: Change one value at a time to see its effect
4. **Use Realistic Values**: Match your production data patterns
5. **Test All Countries**: Change `financialSourceCountryCodeValue` to test different country expressions
6. **Verify Calculations**: Manually verify a few calculations to ensure accuracy

## Troubleshooting

### Expression Doesn't Evaluate
- **Check Console**: Look for "Eval error" messages
- **Verify Syntax**: Ensure expression has matching parentheses/brackets
- **Check Values**: Ensure all referenced invoicing items have values set

### Wrong Calculation
- **Check Data Types**: Ensure numeric values are numbers, not strings
- **Check Operator Precedence**: Use parentheses to control evaluation order
- **Verify Map Keys**: Ensure handlingStrategy matches map keys exactly

### Field Shows "null" or "undefined"
- **Set Values**: Ensure you've set values in Input Manager
- **Check Path**: Verify the field path matches your expression
- **Use Elvis Operator**: Add `?: 0` or `?: ''` as fallback

## Advanced: How It Works Internally

The simulator performs these transformations in order:

1. **Normalize Whitespace**: Collapses multi-line expressions
2. **Replace Invoicing Items**: `#invoicingItems['X']?.prop?.value` → actual value
3. **Replace Method Calls**: `.toString()`, `.toLowerCase()` → executed
4. **Replace Input Fields**: `#input.orderMetadata.field` → actual value
5. **Replace Variables**: `#currencyCodeValue` → actual value
6. **Handle Elvis Operator**: `?:` → `||`
7. **Evaluate Map Lookups**: Parse maps and lookup by key
8. **Final Evaluation**: Use JavaScript `eval()` for arithmetic

This allows complex SpEL expressions to be evaluated entirely in the browser!

---

**Note**: The simulator is a simplified evaluator. Some very complex SpEL features may not be supported. For production validation, always test with your actual backend system.

