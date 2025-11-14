# Spring Expression Language (SpEL) Guide

## Overview

This configuration editor uses **Spring Expression Language (SpEL)** for all YAML expressions. SpEL is a powerful expression language that supports querying and manipulating objects at runtime.

## SpEL Syntax in Our Configuration

### Variable References

SpEL variables are prefixed with `#`:

```spel
#input.orderMetadata.orderCode
#invoicingItems['PRODUCTS_TO_PARTNER']
#currencyCodeValue
```

### Common SpEL Features Used

#### 1. Property Navigation (Dot Notation)

Access nested properties using dots:

```spel
#input.orderMetadata.orderId
#input.operation.name
```

#### 2. Safe Navigation Operator (`?.`)

Prevents NullPointerException by returning null if any part of the chain is null:

```spel
#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value
```

**Without safe navigation:**
```spel
#invoicingItems['PRODUCTS_TO_PARTNER'].grossAmount.value  // ❌ Throws error if null
```

**With safe navigation:**
```spel
#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value  // ✅ Returns null safely
```

#### 3. Elvis Operator (`?:`)

Provides a default value when the left side is null:

```spel
#invoicingItems['TIP_TO_CUSTOMER']?.grossAmount?.value ?: 0
```

This returns `0` if the tip amount is null or not found.

#### 4. Ternary Operator (`? :`)

Conditional expressions (if-then-else):

```spel
#input.orderMetadata.handlingStrategy == 'GEN2' ? 'Glovo' : 'Restaurant'
```

#### 5. Map Literals and Access

Create inline maps and access values:

```spel
{ 'GEN1': 'Restaurant', 'GEN2': 'Glovo', 'PICKUP': 'Selfpick' }[#input.orderMetadata.handlingStrategy]
```

This maps handling strategies to service names.

#### 6. Arithmetic Operations

```spel
#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value + #invoicingItems['DELIVERY_FEE']?.grossAmount?.value
```

Supported operators: `+`, `-`, `*`, `/`, `%`

#### 7. String Operations

```spel
#input.orderMetadata.orderCode.toLowerCase()
#input.orderMetadata.orderId.toString()
#input.orderMetadata.cityCode.toUpperCase()
```

#### 8. Comparison Operators

```spel
#input.orderMetadata.orderId == 12345
#invoicingItems['PRODUCTS']?.grossAmount?.value > 0
#input.orderMetadata.vertical != 'FOOD'
```

Operators: `==`, `!=`, `<`, `>`, `<=`, `>=`

#### 9. Logical Operators

```spel
#isVatOptimisedOrder && #input.orderMetadata.countryCode == 'ES'
#input.orderMetadata.vertical == 'FOOD' || #input.orderMetadata.vertical == 'GROCERIES'
!#isVatOptimisedOrder
```

Operators: `&&` (and), `||` (or), `!` (not)

#### 10. Collection Indexing

Access map entries using square brackets:

```spel
#invoicingItems['PRODUCTS_TO_PARTNER']
#invoicingItems['TIP_TO_CUSTOMER']
#invoicingItems['DELIVERY_FEE_BY_GLOVO']
```

## Common Patterns in Our Configuration

### Pattern 1: Safe Amount Access with Default

```spel
#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value ?: 0.00
```

**Explanation:** Safely access the gross amount, return 0.00 if not found.

### Pattern 2: Handling Strategy Mapping

```spel
{
  'GEN1': 'Restaurant',
  'GEN2': 'Glovo',
  'PICKUP': 'Selfpick'
}[#input.orderMetadata.handlingStrategy]
```

**Explanation:** Maps internal codes to human-readable service names.

### Pattern 3: Conditional Value Selection

```spel
#input.orderMetadata.vertical == 'FOOD' 
  ? #invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value 
  : 0.00
```

**Explanation:** Return product amount only for FOOD orders, otherwise 0.00.

### Pattern 4: Complex Calculation

```spel
(#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value ?: 0) +
(#invoicingItems['DELIVERY_FEE']?.grossAmount?.value ?: 0) +
(#invoicingItems['TIP_TO_CUSTOMER']?.grossAmount?.value ?: 0)
```

**Explanation:** Sum multiple invoicing items with safe defaults.

### Pattern 5: String Conversion

```spel
#input.orderMetadata.orderId.toString()
```

**Explanation:** Convert numeric orderId to string for the payload.

## Variable Types in Our Context

### `#input`
Contains the input order data with nested properties:
- `#input.orderMetadata.*` - Order metadata fields
- `#input.operation.*` - Operation details

### `#invoicingItems`
Map of invoicing items, accessed by item name:
- `#invoicingItems['ITEM_NAME']?.grossAmount?.value`
- `#invoicingItems['ITEM_NAME']?.netAmount?.value`
- `#invoicingItems['ITEM_NAME']?.amount?.value`

### Standalone Variables
- `#currencyCodeValue` - Currency code (e.g., 'EUR')
- `#cityCodeValue` - City code (e.g., 'BCN')
- `#financialSourceCountryCodeValue` - Country code (e.g., 'ES')
- `#isVatOptimisedOrder` - Boolean flag
- `#item.*` - Current item in array mappings

## Best Practices

### ✅ DO

1. **Always use safe navigation** for potentially null values:
   ```spel
   #invoicingItems['ITEM']?.grossAmount?.value ?: 0
   ```

2. **Provide defaults** with Elvis operator:
   ```spel
   #input.orderMetadata.cityCode ?: 'UNKNOWN'
   ```

3. **Use parentheses** for complex expressions:
   ```spel
   (#value1 + #value2) * #multiplier
   ```

4. **Convert types explicitly**:
   ```spel
   #input.orderMetadata.orderId.toString()
   ```

### ❌ DON'T

1. **Don't access potentially null values directly**:
   ```spel
   #invoicingItems['ITEM'].grossAmount.value  // ❌ Can throw error
   ```

2. **Don't forget default values** for numeric calculations:
   ```spel
   #value1 + #value2  // ❌ Error if either is null
   (#value1 ?: 0) + (#value2 ?: 0)  // ✅ Safe
   ```

3. **Don't use string concatenation** without null checks:
   ```spel
   #prefix + #suffix  // ❌ Error if null
   (#prefix ?: '') + (#suffix ?: '')  // ✅ Safe
   ```

## Expression Testing

Use the **Simulator** tab to test your SpEL expressions:
1. Define input values
2. Run simulation
3. Verify output matches expectations

## Additional Resources

- [Spring Expression Language Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#expressions)
- [SpEL Operators Reference](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#expressions-operators)

## SpEL vs Other Expression Languages

Unlike simple template languages, SpEL provides:
- Type-safe operations
- Null-safe navigation
- Rich operator support
- Method invocations
- Collection manipulation
- Spring Framework integration for backend processing

