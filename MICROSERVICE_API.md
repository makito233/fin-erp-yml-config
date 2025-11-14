# YAML Converter Microservice API Specification

## Overview

This document specifies the REST API for the YAML Converter Microservice. The service converts configuration objects to YAML format and vice versa, validates configurations, and extracts SpEL variables.

**Base URL:** `/api/v1`

## Endpoints

### 1. Convert Configuration to YAML

Converts a configuration object to YAML string format.

**Endpoint:** `POST /convert/to-yaml`

**Request Body:**
```json
{
  "config": {
    "fieldMappings": {
      "fieldName": {
        "type": "string",
        "format": "optional",
        "expressionsByCountry": [
          {
            "countries": ["ES", "PL"],
            "expression": "#input.orderMetadata.orderCode"
          }
        ],
        "itemsMappings": {
          "itemField": {
            "type": "string",
            "expressionsByCountry": [...]
          }
        }
      }
    },
    "conditionMappings": [
      {
        "conditionType": "CONDITION_TYPE",
        "expressionsByCountry": [...]
      }
    ]
  },
  "options": {
    "includeComments": true,
    "includeHeader": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "yaml": "# YAML content here...",
  "timestamp": "2025-11-14T12:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Conversion successful
- `400 Bad Request` - Invalid configuration format
- `500 Internal Server Error` - Server error

---

### 2. Convert YAML to Configuration

Parses YAML string into a configuration object.

**Endpoint:** `POST /convert/from-yaml`

**Request Body:**
```json
{
  "yaml": "fieldMappings:\n  field1:\n    type: string\n..."
}
```

**Response:**
```json
{
  "success": true,
  "config": {
    "fieldMappings": {...},
    "conditionMappings": [...]
  },
  "timestamp": "2025-11-14T12:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Parsing successful
- `400 Bad Request` - Invalid YAML syntax
- `500 Internal Server Error` - Server error

---

### 3. Validate Configuration

Validates a configuration object against the schema and SpEL syntax rules.

**Endpoint:** `POST /validate`

**Request Body:**
```json
{
  "config": {
    "fieldMappings": {...},
    "conditionMappings": [...]
  }
}
```

**Response:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [],
  "timestamp": "2025-11-14T12:00:00Z"
}
```

**Response (with errors):**
```json
{
  "valid": false,
  "errors": [
    "Field \"orderCode\" is missing type",
    "conditionMappings[0]: Unbalanced braces in SpEL expression"
  ],
  "warnings": [
    "Field \"optionalField\" has no expressionsByCountry"
  ],
  "timestamp": "2025-11-14T12:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Validation completed (check `valid` field)
- `400 Bad Request` - Invalid request format
- `500 Internal Server Error` - Server error

---

### 4. Extract Variables

Extracts all SpEL variables used in expressions within a configuration.

**Endpoint:** `POST /extract-variables`

**Request Body:**
```json
{
  "config": {
    "fieldMappings": {...},
    "conditionMappings": [...]
  }
}
```

**Response:**
```json
{
  "success": true,
  "variables": {
    "inputFields": [
      "input.orderMetadata.orderCode",
      "input.orderMetadata.orderId",
      "input.operation.name"
    ],
    "invoicingItems": [
      "PRODUCTS_TO_PARTNER",
      "TIP_TO_CUSTOMER",
      "DELIVERY_FEE_BY_GLOVO"
    ],
    "standaloneVariables": [
      "currencyCodeValue",
      "cityCodeValue",
      "isVatOptimisedOrder"
    ]
  },
  "timestamp": "2025-11-14T12:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Extraction successful
- `400 Bad Request` - Invalid configuration
- `500 Internal Server Error` - Server error

---

### 5. Health Check

Check service health and availability.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-11-14T12:00:00Z",
  "checks": {
    "yamlParser": "ok",
    "spelValidator": "ok"
  }
}
```

**Status Codes:**
- `200 OK` - Service healthy
- `503 Service Unavailable` - Service unhealthy

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "additional context"
    }
  },
  "timestamp": "2025-11-14T12:00:00Z"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CONFIG` | Configuration object is malformed |
| `INVALID_YAML` | YAML syntax is invalid |
| `VALIDATION_ERROR` | Configuration validation failed |
| `SPEL_SYNTAX_ERROR` | SpEL expression has syntax errors |
| `INTERNAL_ERROR` | Internal server error |

## Implementation Guide

### Technology Stack Recommendations

**Backend:**
- **Java/Spring Boot** (native SpEL support)
- **Node.js/Express** (with spel2js library)
- **Python/FastAPI** (with PySpel library)

**Libraries:**
- YAML parsing: SnakeYAML (Java), js-yaml (Node), PyYAML (Python)
- SpEL: Spring Expression Language (Java), spel2js (Node), PySpel (Python)
- Validation: Spring Validation (Java), Joi (Node), Pydantic (Python)

### Deployment

**Container:**
```dockerfile
FROM openjdk:17-slim
WORKDIR /app
COPY target/yaml-converter-service.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  yaml-converter:
    image: yaml-converter-service:1.0
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=production
      - SERVER_PORT=8080
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

**Kubernetes:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yaml-converter-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: yaml-converter
  template:
    metadata:
      labels:
        app: yaml-converter
    spec:
      containers:
      - name: yaml-converter
        image: yaml-converter-service:1.0
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### Security Considerations

1. **Rate Limiting:** Implement rate limiting to prevent abuse
2. **Authentication:** Use API keys or OAuth 2.0 for production
3. **Input Validation:** Strictly validate all inputs
4. **CORS:** Configure CORS appropriately for frontend access
5. **Logging:** Log all requests and errors (sanitized)
6. **Monitoring:** Implement metrics and alerting

### Example Service Integration

**From Frontend (React):**
```javascript
import yamlConverterClient from './clients/yamlConverterClient'

// Convert to YAML
const result = await yamlConverterClient.toYaml(config, {
  includeComments: true,
  includeHeader: true
})

// Validate configuration
const validation = await yamlConverterClient.validate(config)
if (!validation.valid) {
  console.error('Validation errors:', validation.errors)
}

// Extract variables
const variables = await yamlConverterClient.extractVariables(config)
console.log('Used variables:', variables)
```

**Client Implementation:**
```javascript
// src/clients/yamlConverterClient.js
const API_BASE_URL = process.env.REACT_APP_CONVERTER_API_URL || 'http://localhost:8080/api/v1'

export default {
  async toYaml(config, options = {}) {
    const response = await fetch(`${API_BASE_URL}/convert/to-yaml`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config, options })
    })
    return response.json()
  },

  async fromYaml(yaml) {
    const response = await fetch(`${API_BASE_URL}/convert/from-yaml`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ yaml })
    })
    return response.json()
  },

  async validate(config) {
    const response = await fetch(`${API_BASE_URL}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config })
    })
    return response.json()
  },

  async extractVariables(config) {
    const response = await fetch(`${API_BASE_URL}/extract-variables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config })
    })
    return response.json()
  },

  async health() {
    const response = await fetch(`${API_BASE_URL}/health`)
    return response.json()
  }
}
```

### Migration Path

**Phase 1:** Current state - Frontend handles conversion
**Phase 2:** Deploy microservice alongside frontend (dual-mode)
**Phase 3:** Switch frontend to use microservice API
**Phase 4:** Remove frontend conversion logic

This allows gradual migration with rollback capability.

## Testing

### Example cURL Commands

**Convert to YAML:**
```bash
curl -X POST http://localhost:8080/api/v1/convert/to-yaml \
  -H "Content-Type: application/json" \
  -d @config.json
```

**Validate:**
```bash
curl -X POST http://localhost:8080/api/v1/validate \
  -H "Content-Type: application/json" \
  -d @config.json
```

**Health Check:**
```bash
curl http://localhost:8080/api/v1/health
```

## Performance Considerations

- **Response Time:** < 200ms for typical configurations
- **Throughput:** > 100 requests/second per instance
- **Memory:** < 512MB per instance
- **Concurrency:** Support 50+ concurrent requests

## Monitoring Metrics

- Request count by endpoint
- Response time percentiles (p50, p95, p99)
- Error rate by error code
- Configuration size distribution
- SpEL expression complexity metrics

