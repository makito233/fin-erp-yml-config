# YAML Converter Service Module

## Overview

This module contains the **YAML Converter Service**, a framework-agnostic converter that transforms configuration objects to/from YAML format. It's designed to be easily extractable as a standalone microservice.

## Files

- **`yamlConverterService.js`** - Main converter service with all conversion logic
- **`README.md`** - This file

## Features

- ✅ Convert configuration objects to YAML
- ✅ Parse YAML to configuration objects (interface defined)
- ✅ Validate configuration structure and SpEL syntax
- ✅ Extract SpEL variables from expressions
- ✅ Framework-agnostic design
- ✅ Fully documented with JSDoc

## Usage

### In the Frontend (Current)

```javascript
import yamlConverterService from './services/yamlConverterService'

// Convert to YAML
const yamlString = yamlConverterService.toYaml(config, {
  includeComments: true,
  includeHeader: true
})

// Validate configuration
const validation = yamlConverterService.validate(config)
if (!validation.valid) {
  console.error('Validation errors:', validation.errors)
}

// Extract variables used in expressions
const variables = yamlConverterService.extractVariables(config)
console.log('Input fields:', variables.inputFields)
console.log('Invoicing items:', variables.invoicingItems)
console.log('Standalone variables:', variables.standaloneVariables)
```

### As a Microservice (Future)

See `../../MICROSERVICE_API.md` for the complete REST API specification.

The service can be deployed as:
- **Spring Boot** application (recommended for SpEL support)
- **Node.js/Express** application
- **Python/FastAPI** application

## Extracting as Microservice

### Step 1: Copy the Module

```bash
# Create new microservice project
mkdir yaml-converter-service
cd yaml-converter-service

# Copy the converter logic
cp src/services/yamlConverterService.js ./
```

### Step 2: Implement API Endpoints

Create REST endpoints that wrap the converter service methods:

```javascript
// Example Express.js implementation
const express = require('express')
const { YamlConverterService } = require('./yamlConverterService')

const app = express()
app.use(express.json())

app.post('/api/v1/convert/to-yaml', (req, res) => {
  try {
    const { config, options } = req.body
    const yaml = YamlConverterService.toYaml(config, options)
    res.json({ success: true, yaml, timestamp: new Date().toISOString() })
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: { message: error.message } 
    })
  }
})

app.post('/api/v1/validate', (req, res) => {
  try {
    const { config } = req.body
    const result = YamlConverterService.validate(config)
    res.json({ ...result, timestamp: new Date().toISOString() })
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: { message: error.message } 
    })
  }
})

app.listen(8080, () => console.log('Service running on port 8080'))
```

### Step 3: Containerize

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
```

### Step 4: Deploy

Deploy to your cloud provider:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- Kubernetes cluster

## Design Principles

### 1. Stateless
All methods are static and don't maintain internal state. This makes the service:
- Easy to scale horizontally
- Thread-safe
- Simple to test

### 2. Framework-Agnostic
The core logic doesn't depend on any frontend framework (React, Vue, etc.) or backend framework (Express, Spring, etc.). This makes it:
- Portable
- Reusable
- Easy to integrate

### 3. Single Responsibility
Each method has a clear, single purpose:
- `toYaml()` - Conversion to YAML
- `fromYaml()` - Conversion from YAML
- `validate()` - Configuration validation
- `extractVariables()` - Variable extraction

### 4. Well-Documented
JSDoc comments provide:
- Type information
- Parameter descriptions
- Return value descriptions
- Usage examples

## Testing

### Unit Tests Example

```javascript
import { YamlConverterService } from './yamlConverterService'

describe('YamlConverterService', () => {
  test('toYaml converts config to YAML', () => {
    const config = {
      fieldMappings: {
        orderCode: {
          type: 'string',
          expressionsByCountry: [
            {
              countries: ['ES'],
              expression: '#input.orderMetadata.orderCode'
            }
          ]
        }
      },
      conditionMappings: []
    }
    
    const yaml = YamlConverterService.toYaml(config)
    expect(yaml).toContain('fieldMappings:')
    expect(yaml).toContain('orderCode:')
  })
  
  test('validate catches missing type', () => {
    const config = {
      fieldMappings: {
        orderCode: {
          // Missing type!
          expressionsByCountry: []
        }
      },
      conditionMappings: []
    }
    
    const result = YamlConverterService.validate(config)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })
  
  test('extractVariables finds all SpEL variables', () => {
    const config = {
      fieldMappings: {
        orderCode: {
          type: 'string',
          expressionsByCountry: [
            {
              countries: ['ES'],
              expression: "#input.orderMetadata.orderCode + #invoicingItems['PRODUCTS']?.grossAmount?.value"
            }
          ]
        }
      },
      conditionMappings: []
    }
    
    const variables = YamlConverterService.extractVariables(config)
    expect(variables.inputFields).toContain('input.orderMetadata.orderCode')
    expect(variables.invoicingItems).toContain('PRODUCTS')
  })
})
```

## Migration Path

### Phase 1: Current (Frontend)
- ✅ Module used directly in React app
- ✅ All conversion happens in browser
- ✅ No backend dependency

### Phase 2: Parallel (Hybrid)
- Deploy microservice
- Frontend can use either local module OR microservice
- Feature flag controls which to use
- Allows gradual migration and A/B testing

### Phase 3: Microservice (Backend)
- Frontend uses only microservice API
- Remove local converter module from frontend
- All conversion happens on backend
- Better for:
  - Large configurations
  - Security (validate on server)
  - Centralized updates

## Performance Considerations

### Current (Frontend)
- **Pros:**
  - No network latency
  - Works offline
  - Instant feedback
- **Cons:**
  - Bundle size increased
  - CPU usage on client

### Microservice (Backend)
- **Pros:**
  - Smaller frontend bundle
  - Centralized logic
  - Easier updates
- **Cons:**
  - Network latency
  - Requires backend
  - No offline support

## SpEL Support

This module extracts and validates SpEL (Spring Expression Language) expressions. For full SpEL evaluation, you'll need:

- **Java/Spring:** Native SpEL support via `org.springframework:spring-expression`
- **Node.js:** Use `spel2js` library
- **Python:** Use `PySpel` library

See `../../SPEL_GUIDE.md` for SpEL syntax reference.

## Contributing

When modifying this module:
1. Keep it framework-agnostic
2. Add JSDoc comments
3. Update tests
4. Update this README if API changes

## License

Same as parent project.

