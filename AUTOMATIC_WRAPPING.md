# Automatic Safety Wrapping

## What is Automatic Wrapping?

The Bubble Expression Builder automatically wraps all Invoicing Items and Money Movements in parentheses with an elvis operator (`?: 0`) for null safety. This boilerplate is hidden in the visual interface but generated in the final SpEL expression.

## Why Auto-Wrap?

### The Problem
In SpEL, if an invoicing item doesn't exist or is null, the expression crashes:
```
#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value
```
If PRODUCTS_TO_PARTNER is null → **Error!** 💥

### The Solution
Always add elvis operator with fallback:
```
(#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value ?: 0)
```
If null → safely returns 0 ✅

### The Automation
Instead of making you type `(... ?: 0)` every single time, the builder adds it automatically!

## Visual vs Generated

### What You See (Visual)
```
┌────────────────────────┐
│ PRODUCTS_TO_PARTNER    │
│ .grossAmount           │
└────────────────────────┘
```

Clean and simple!

### What Gets Generated (SpEL)
```
(#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value ?: 0)
```

Complete with safety wrapper!

## Examples

### Example 1: Single Item

**Visual Builder:**
```
[PRODUCTS_TO_PARTNER.netAmount]
```

**Generated SpEL:**
```
(#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0)
```

### Example 2: Addition

**Visual Builder:**
```
[PRODUCTS_TO_PARTNER.net] + [TIP_TO_CUSTOMER.net]
```

**Generated SpEL:**
```
(#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0) + (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0)
```

### Example 3: Complex Calculation

**Visual Builder:**
```
[PRODUCTS.gross] + [TIP.gross] - [PROMOTION_PRODUCT.gross]
```

**Generated SpEL:**
```
(#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value ?: 0) + (#invoicingItems['TIP_TO_CUSTOMER']?.grossAmount?.value ?: 0) - (#invoicingItems['PROMOTION_PRODUCT_TO_CUSTOMER']?.grossAmount?.value ?: 0)
```

## Benefits

### For Users
✅ **Simpler Interface**: Don't see repetitive boilerplate  
✅ **Faster Building**: Less typing required  
✅ **Clearer Intent**: Focus on the calculation logic  
✅ **No Mistakes**: Can't forget the safety wrapper  

### For Safety
✅ **Always Protected**: Every item has null safety  
✅ **Consistent**: All items treated the same way  
✅ **Production Ready**: Generated code follows best practices  

## What About Custom Text?

If you add custom text (gray bubbles), it's NOT auto-wrapped:

**Visual:**
```
( [PRODUCTS.net] + [TIP.net] ) * 0.15
```

**Generated:**
```
( (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0) + (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0) ) * 0.15
```

- The `(` and `)` are text bubbles → kept as-is
- The `* 0.15` is a text bubble → kept as-is
- Only the invoicing items get wrapped

## Order Type Maps

Auto-wrapping works in Order Type Maps too:

**Visual (GEN1 tab):**
```
[PRODUCTS.net] + [TIP.net]
```

**Generated:**
```yaml
{
  'GEN1': ((#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0) + (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0)),
  ...
}[#input.orderMetadata.handlingStrategy]
```

Each item in each order type gets the safety wrapper!

## Parsing Existing Expressions

When you open the builder with an existing expression:

**Input Expression:**
```
(#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value ?: 0) + (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0)
```

**Parsed to Bubbles:**
```
[PRODUCTS_TO_PARTNER.grossAmount] + [TIP_TO_CUSTOMER.netAmount]
```

The wrapper is automatically removed for visual editing, then re-added when saving!

## Edge Cases

### Multiple Parentheses

**Expression:**
```
((#invoicingItems['PRODUCTS_TO_PARTNER']?.grossAmount?.value ?: 0) + (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0))
```

**Parsed:**
```
( [PRODUCTS_TO_PARTNER.grossAmount] + [TIP_TO_CUSTOMER.netAmount] )
```

Outer parentheses become text bubbles, inner wrapping removed.

### Manual Elvis Operators

If you add `?: 0` manually as text, you'll get double wrapping:

**Visual:**
```
[PRODUCTS.net] ?: 0
```

**Generated:**
```
(#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0) ?: 0
```

**Don't do this!** The auto-wrapping already handles it.

## Customizing the Fallback

Currently, all items fallback to `0`. If you need different fallbacks:

1. Switch to **Text Mode**
2. Manually edit the `?: 0` to `?: null` or `?: ''`
3. Stay in Text Mode or the visual parser will reset it to 0

## Technical Details

### What's Added
- **Opening**: `(`
- **Item Reference**: `#invoicingItems['NAME']?.property?.value`
- **Elvis Operator**: `?:`
- **Fallback**: `0`
- **Closing**: `)`

### Pattern Recognition
The parser recognizes both:
- Wrapped: `(#invoicingItems['X']?.prop?.value ?: 0)`
- Unwrapped: `#invoicingItems['X']?.prop?.value`

Both convert to the same bubble, both save with wrapping.

## Comparison

| Aspect | Manual (Old) | Auto-Wrap (New) |
|--------|-------------|-----------------|
| Visual Complexity | High | Low |
| Typing Required | ~80 chars | ~40 chars |
| Error Prone | Yes | No |
| Null Safety | Manual | Automatic |
| Readability | Poor | Excellent |
| Speed | Slow | Fast |

## Why This Matters

In your SAP YAML configuration, you have **hundreds** of invoicing item references. Auto-wrapping:
- Saves you from typing `(... ?: 0)` hundreds of times
- Prevents forgetting it (which causes runtime errors)
- Makes expressions much more readable
- Follows best practices automatically

This is one of the biggest time-savers in the bubble builder! 🚀


