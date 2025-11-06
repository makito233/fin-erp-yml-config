# YAML Format Specification

This document describes how the application ensures exported YAML files match the exact format of `sap-order-payload-mapping.yml`.

## Format Rules

### 1. File Header

Every exported file includes the standard header comments:

```yaml
# A configuration file defining the mapping of order data into the SAP order payload format (JSON).
# Order payload is sent to SAP for invoicing and accounting purposes.
#
# Note: '>' converts newlines to spaces, making multi-line expressions more readable.

# Mapped 1:1 to the order payload JSON structure
# Possible types are:
# - string: string value mapped as-is and cannot be null.
# - optional_string: string value that can be null, in which case it will be sent as an empty string.
# - double: numeric value mapped with format "0.00" and cannot be null.
# - local_date_time: date-time value mapped with a specific format (e.g. "yyyy/MM/dd") and cannot be null.
# - optional_local_date_time: date-time value as above that can be null, in which case it will be sent as an empty string.
# - array: array of objects, with nested itemsMappings defining the structure of each object.
```

### 2. Field Mappings Structure

```yaml
fieldMappings:
  fieldName:
    type: string
    format: yyyy/MM/dd  # Optional, only for date-time types
    expressionsByCountry:
      - countries: [ 'ES', 'PL' ]
        expression: >
          #input.orderMetadata.orderCode
```

**Key Points:**
- 2-space indentation throughout
- Countries array with spaces: `[ 'ES', 'PL' ]` not `['ES','PL']`
- Single quotes around country codes
- Expression uses folded scalar style (`>`) for multi-line content

### 3. Expression Formatting

**Simple Expressions (quoted strings):**
```yaml
expression: "0.00"
```

**Complex Expressions (use folded style):**
```yaml
expression: >
  #input.orderMetadata.orderCode
```

**Multi-line Complex Expressions:**
```yaml
expression: >
  {
    'GEN1': 'Restaurant',
    'GEN2': 'Glovo',
    'PICKUP': 'Selfpick'
  }[#input.orderMetadata.handlingStrategy]
```

### 4. Array Field Mappings

When a field has `type: array`, it includes nested `itemsMappings`:

```yaml
Payments:
  type: array
  expressionsByCountry:
    - countries: [ 'ES', 'PL' ]
      expression: >
        #input.orderMetadata?.payments
  itemsMappings:
    amount:
      type: double
      expressionsByCountry:
        - countries: [ 'ES', 'PL' ]
          expression: >
            #item.amount
```

### 5. Condition Mappings Structure

```yaml
# Mapped to 'items.condition' array of the order payload, containing conditionType and conditionValue.
# - conditionType: the key identifying the condition.
# - conditionValue: the value of the condition, mapped as a double with format "0.00".
conditionMappings:
  - conditionType: netTotalOrderValue
    expressionsByCountry:
      - countries: ['ES', 'PL']
        expression: >
          {
            'GEN1': (
              (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0)
              + (#invoicingItems['TIP_TO_CUSTOMER']?.netAmount?.value ?: 0)
            ),
            'GEN2': (
              (#invoicingItems['PRODUCTS_TO_PARTNER']?.netAmount?.value ?: 0)
            )
          }[#input.orderMetadata?.handlingStrategy] ?: 0

  - conditionType: grossTotalOrderValue
    expressionsByCountry:
      - countries: [ 'ES', 'PL' ]
        expression: "0.00"

```

**Key Points:**
- Blank line after each condition entry
- Section header comment before `conditionMappings:`
- Dash (`-`) for list items at proper indentation

## Implementation

The custom formatter in `App.jsx` (`generateFormattedYaml` function) handles:

1. **Header Generation**: Adds all required comments
2. **Field Processing**: Iterates through fieldMappings with proper indentation
3. **Expression Detection**: Determines whether to use quoted or folded style
4. **Array Handling**: Recursively processes itemsMappings
5. **Condition Processing**: Adds blank lines and proper formatting

## Testing the Format

To verify the format is correct:

1. Import your original `sap-order-payload-mapping.yml`
2. Click "Preview" to see the formatted output
3. Compare the preview with your original file
4. Check that:
   - Indentation matches (2 spaces)
   - Comments are preserved
   - Expressions use `>` for multi-line content
   - Country arrays have proper spacing
   - Simple values are quoted correctly

## Format Comparison Example

**Original Format:**
```yaml
  orderDate:
    type: local_date_time
    format: yyyy/MM/dd
    expressionsByCountry:
      - countries: [ 'ES', 'PL' ]
        expression: >
          #input.orderMetadata.orderCreationTime
```

**Generated Format (matches exactly):**
```yaml
  orderDate:
    type: local_date_time
    format: yyyy/MM/dd
    expressionsByCountry:
      - countries: [ 'ES', 'PL' ]
        expression: >
          #input.orderMetadata.orderCreationTime
```

✅ **Perfect Match!**

