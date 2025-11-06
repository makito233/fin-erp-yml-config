# Simulator Fixes - November 2025

## Issues Fixed

### 1. React Rendering Objects Error
**Error**: `Objects are not valid as a React child (found: object with keys {toString})`

**Cause**: Input Manager was creating objects with `toString` methods instead of primitive values

**Fix**: 
- Created `toPrimitive()` helper function to safely extract primitive values from objects
- Updated `SummaryItem` component to use React.useMemo and convert objects to strings
- Applied toPrimitive to all variable extractions

### 2. SpEL "or" Keyword Error
**Error**: `SyntaxError: Unexpected identifier 'or'`

**Cause**: SpEL uses `or` and `and` keywords, JavaScript uses `||` and `&&`

**Fix**: Added conversions in STEP 1:
```javascript
result = result.replace(/\bor\b/g, '||')
result = result.replace(/\band\b/g, '&&')
```

### 3. SpEL Collection Projection Error
**Error**: `SyntaxError: Unexpected token '!'` from `?.![]`

**Cause**: SpEL collection projection syntax `?.![field]` doesn't exist in JavaScript

**Fix**: Replace with empty array:
```javascript
result = result.replace(/\?\.\!\[([^\]]*)\]/g, '[]')
```

### 4. Map Lookup Evaluation Order
**Error**: Variables inside map keys were being replaced before map lookup, breaking the pattern

**Fix**: Reordered evaluation steps:
1. Handle SpEL syntax
2. Replace invoicing items
3. Handle elvis operator
4. **Process map lookups FIRST** (before replacing variables)
5. Then replace remaining variables

### 5. Simulator Tab Made Read-Only
**Issue**: Confusing to have two places to input data

**Fix**:
- Removed all input fields from Simulator
- Simulator now only works with Input Manager values
- Shows helpful message when no inputs configured
- Auto-generates payload when inputs received
- Auto-switches tabs when "Run Simulation" clicked

## Evaluation Order (Critical!)

```
Step 1: SpEL syntax conversions (or→||, and→&&, ?.![]→[])
Step 2: Replace invoicing items with values
Step 3: Handle elvis operator (?:→||)
Step 4: Process map lookups (evaluate keys, lookup values)
Step 5: Replace all remaining variables
  - Method calls (.toString(), .toLowerCase(), etc.)
  - input.orderMetadata.* references
  - input.operation.* references  
  - Standalone variables (#currencyCodeValue, etc.)
Step 6: Clean up undefined
Step 7: Evaluate final JavaScript expression
```

## New Helper Functions

### toPrimitive(value)
Safely extracts primitive values from potentially nested objects:
- Returns null/undefined as-is
- Returns primitives as-is
- For objects: tries toString(), then .value property, then JSON.stringify()

### generatePayloadWithContext(inputVals, invoicingItemsVals, variablesVals)
Separated from generatePayload() to allow calling from useEffect with explicit params

## Workflow Improvements

### Before:
1. Configure Input Manager
2. Click "Run Simulation"
3. Manually go to Simulator tab
4. Click "Generate Payload"
5. See results

### After:
1. Configure Input Manager
2. Click "Run Simulation"
3. **Automatically switches to Simulator tab**
4. **Payload automatically generated**
5. See results immediately

## Testing Checklist

- [ ] Import YAML file
- [ ] Go to Input Manager
- [ ] Set PRODUCTS_TO_PARTNER net/gross amounts
- [ ] Set other invoicing items
- [ ] Set input fields (orderCode, orderId, handlingStrategy)
- [ ] Set variables (country, currency, city)
- [ ] Click "Run Simulation"
- [ ] Verify automatic tab switch
- [ ] Check payload shows calculated values
- [ ] Verify netTotalOrderValue = sum of net amounts
- [ ] Verify grossTotalOrderValue = sum of gross amounts
- [ ] Check no React errors in console
- [ ] Check evaluation logs show proper transformations

## Known Limitations

The simulator is a simplified SpEL evaluator. Not supported:
- Complex SpEL collection operations (stream(), distinct(), count())
- SpEL Elvis operator on method calls (use `|| 0` instead)
- SpEL type conversion functions
- SpEL bean references
- SpEL advanced regex patterns

For these cases, the simulator returns safe defaults (0, null, false) to prevent crashes.

## Debug Mode

The simulator includes extensive console logging:
- "Received from Input Manager" - shows raw input structure
- "Map lookup found" - shows each map expression being processed
- "Key evaluated to" - shows what the key resolves to
- "Map result for key" - shows the value found in map
- "Eval error" - shows any expression evaluation errors

To debug:
1. Open browser console (F12)
2. Run simulation
3. Check logs to see transformation steps
4. Identify where evaluation fails
5. Fix expressions or input values

