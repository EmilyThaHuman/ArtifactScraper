# ArtifactScraper API Documentation

A comprehensive guide for making requests to the ArtifactScraper API for web scraping, search, and AI-powered data extraction.

## Base URL

**Production**: `https://artifactscraper-production.up.railway.app`
**Local Development**: `http://localhost:8080`

## Authentication

All API endpoints (except health and public endpoints) require authentication via API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

**Production API Key**: `sk-prod-artifactscraper-12345678901234567890abcdef`

## API Endpoints Overview

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/health` | GET | No | Health check |
| `/v1/scrape` | POST | Yes | Scrape websites with optional AI extraction |
| `/v1/search` | POST | Yes | Search Google with structured results |
| `/v1/public/storage/file/:path` | GET | No | Access stored files (screenshots, etc.) |

---

## 🕷️ **Web Scraping Endpoint**

### `POST /v1/scrape`

Scrape websites and optionally extract structured data using AI.

#### Request Body

```json
{
  "url": "https://example.com",
  "engine": "cheerio",
  "formats": ["markdown", "html", "screenshot"],
  "json_options": {
    "schema": {
      "type": "object",
      "properties": {
        "title": {"type": "string"},
        "price": {"type": "number"}
      }
    },
    "user_prompt": "Extract product information"
  }
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `url` | string | ✅ | - | The URL to scrape (must be valid URL with http/https) |
| `engine` | string | ❌ | `"cheerio"` | Scraping engine to use |
| `formats` | array | ❌ | `["markdown"]` | Output formats to generate |
| `proxy` | string | ❌ | - | Proxy URL (HTTP/SOCKS supported) |
| `timeout` | number | ❌ | `60000` | Request timeout in milliseconds (1000-600000) |
| `wait_for` | number | ❌ | - | Seconds to wait before processing (1-60000, browser engines only) |
| `retry` | boolean | ❌ | `false` | Enable retry on failure |
| `include_tags` | array | ❌ | - | HTML tags to specifically include |
| `exclude_tags` | array | ❌ | - | HTML tags to exclude |
| `json_options` | object | ❌ | - | AI extraction configuration |

#### Available Engines

| Engine | Description | JavaScript Support | Performance | Resource Usage |
|--------|-------------|-------------------|-------------|----------------|
| `cheerio` | Fast HTML parsing, no JavaScript | ❌ | Highest | Low |
| `playwright` | Modern browser engine, full JS support | ✅ | Good | Medium-High |
| `puppeteer` | Chrome-based engine, full JS support | ✅ | Good | Medium-High |

#### Available Formats

| Format | Description |
|--------|-------------|
| `markdown` | Clean markdown conversion of page content |
| `html` | Raw HTML content |
| `text` | Plain text extraction |
| `screenshot` | Screenshot of visible page area |
| `screenshot@fullPage` | Full page screenshot |
| `rawHtml` | Unprocessed HTML |
| `json` | AI-extracted structured data (requires `json_options`) |

#### AI Extraction (`json_options`)

Enable AI-powered data extraction by providing a JSON schema:

```json
{
  "json_options": {
    "schema": {
      "type": "object",
      "properties": {
        "title": {"type": "string"},
        "price": {"type": "number"},
        "description": {"type": "string"},
        "features": {
          "type": "array",
          "items": {"type": "string"}
        }
      },
      "required": ["title"]
    },
    "user_prompt": "Extract product information from this e-commerce page",
    "schema_name": "Product",
    "schema_description": "E-commerce product details"
  }
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `schema` | object | ❌ | JSON Schema 7 defining the extraction structure |
| `user_prompt` | string | ❌ | Custom prompt for the AI extraction |
| `schema_name` | string | ❌ | Name for the schema (for AI context) |
| `schema_description` | string | ❌ | Description of what to extract |

#### Response Format

```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "status": "completed",
    "jobId": "uuid-string",
    "title": "Page Title",
    "metadata": [
      {
        "name": "viewport",
        "content": "width=device-width, initial-scale=1"
      }
    ],
    "markdown": "# Page Title\n\nPage content...",
    "html": "<html>...</html>",
    "screenshot": "https://domain.com/v1/public/storage/file/screenshot.png",
    "json": {
      "title": "Extracted Title",
      "price": 29.99
    },
    "timestamp": "2025-01-07T12:00:00.000Z"
  }
}
```

#### Example Requests

**Basic Scraping:**
```bash
curl -X POST https://artifactscraper-production.up.railway.app/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-prod-artifactscraper-12345678901234567890abcdef" \
  -d '{
    "url": "https://example.com",
    "engine": "cheerio",
    "formats": ["markdown", "html"]
  }'
```

**AI Data Extraction:**
```bash
curl -X POST https://artifactscraper-production.up.railway.app/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-prod-artifactscraper-12345678901234567890abcdef" \
  -d '{
    "url": "https://news.ycombinator.com",
    "engine": "cheerio",
    "formats": ["markdown", "json"],
    "json_options": {
      "schema": {
        "type": "object",
        "properties": {
          "articles": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "title": {"type": "string"},
                "url": {"type": "string"},
                "score": {"type": "number"}
              }
            }
          }
        }
      },
      "user_prompt": "Extract the top articles with their titles, URLs, and scores"
    }
  }'
```

**Browser Engine with Wait:**
```bash
curl -X POST https://artifactscraper-production.up.railway.app/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-prod-artifactscraper-12345678901234567890abcdef" \
  -d '{
    "url": "https://spa-website.com",
    "engine": "playwright",
    "wait_for": 3,
    "formats": ["markdown", "screenshot"]
  }'
```

---

## 🔍 **Search Endpoint**

### `POST /v1/search`

Search Google and get structured results with suggestions.

#### Request Body

```json
{
  "query": "openai api documentation",
  "engine": "google",
  "pages": 2,
  "limit": 10,
  "lang": "en-US",
  "safeSearch": 1
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | ✅ | - | Search query text |
| `engine` | string | ❌ | `"google"` | Search engine to use |
| `pages` | number | ❌ | `1` | Number of result pages (1-20) |
| `limit` | number | ❌ | `10` | Results per page |
| `offset` | number | ❌ | `0` | Starting offset for results |
| `lang` | string | ❌ | `"en-US"` | Language code for results |
| `country` | string | ❌ | - | Country code for localized results |
| `safeSearch` | number | ❌ | - | Safe search level (0=off, 1=medium, 2=high) |

#### Available Search Engines

| Engine | Description |
|--------|-------------|
| `google` | Google Search with suggestions and related queries |

#### Language Codes

Common language codes include:
- `en-US` - English (United States)
- `en-GB` - English (United Kingdom)
- `es-ES` - Spanish (Spain)
- `fr-FR` - French (France)
- `de-DE` - German (Germany)
- `ja-JP` - Japanese (Japan)
- `zh-CN` - Chinese (China)
- `all` - All languages

#### Response Format

```json
{
  "success": true,
  "data": [
    {
      "title": "OpenAI API Documentation",
      "url": "https://platform.openai.com/docs",
      "description": "Complete guide to using OpenAI's API...",
      "source": "Google Search Result"
    },
    {
      "title": "OpenAI API pricing",
      "source": "Google Suggestions"
    }
  ]
}
```

#### Example Requests

**Basic Search:**
```bash
curl -X POST https://artifactscraper-production.up.railway.app/v1/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-prod-artifactscraper-12345678901234567890abcdef" \
  -d '{
    "query": "machine learning tutorials",
    "limit": 5
  }'
```

**Multi-page Search with Language:**
```bash
curl -X POST https://artifactscraper-production.up.railway.app/v1/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-prod-artifactscraper-12345678901234567890abcdef" \
  -d '{
    "query": "intelligence artificielle",
    "pages": 3,
    "lang": "fr-FR",
    "safeSearch": 1
  }'
```

---

## 🏥 **Health Endpoint**

### `GET /health`

Check API health status.

#### Response
```json
{
  "status": "ok"
}
```

#### Example Request
```bash
curl https://artifactscraper-production.up.railway.app/health
```

---

## 📁 **File Access Endpoint**

### `GET /v1/public/storage/file/:path`

Access stored files like screenshots.

#### Parameters
- `path` (URL param): File path/name

#### Example Request
```bash
curl https://artifactscraper-production.up.railway.app/v1/public/storage/file/screenshot-123.png
```

---

## ⚡ **Rate Limits & Credits**

- **Credits**: Each API key has a credit balance
- **Scrape requests**: 1 credit per request
- **Search requests**: 1 credit per page requested
- **Rate limiting**: Implemented per API key

---

## 📊 **Response Structures & Examples**

All API responses follow a consistent structure with a `success` boolean field and either `data` (on success) or `error`/`message` (on failure).

### Success Response Format

```json
{
  "success": true,
  "data": { /* endpoint-specific data */ }
}
```

### Error Response Format

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "data": { /* optional error details */ }
}
```

### 🕷️ **Scrape Response Examples**

#### Successful Scrape (Basic)

```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "status": "completed",
    "jobId": "7b881578-896d-407d-ba73-9034dc94d167",
    "title": "Example Domain",
    "metadata": [
      {
        "name": "viewport",
        "content": "width=device-width, initial-scale=1"
      }
    ],
    "markdown": "Example Domain\n\nExample Domain\n==============\n\nThis domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.\n\n[More information...](https://www.iana.org/domains/example)",
    "timestamp": "2025-08-07T02:26:30.915Z"
  }
}
```

#### Scrape with Multiple Formats

```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "status": "completed", 
    "jobId": "uuid-here",
    "title": "Page Title",
    "metadata": [
      {
        "name": "description",
        "content": "Page description"
      },
      {
        "name": "keywords", 
        "content": "keyword1, keyword2"
      }
    ],
    "markdown": "# Page Title\n\nPage content in markdown...",
    "html": "<div class='content'><h1>Page Title</h1><p>Content...</p></div>",
    "rawHtml": "<html><head>...</head><body>...</body></html>",
    "text": "Plain text version of content",
    "screenshot": "https://artifactscraper-production.up.railway.app/v1/public/storage/file/screenshot-uuid.jpeg",
    "timestamp": "2025-08-07T02:26:30.915Z"
  }
}
```

#### Scrape with AI JSON Extraction

```json
{
  "success": true,
  "data": {
    "url": "https://store.example.com/product/123",
    "status": "completed",
    "jobId": "uuid-here", 
    "title": "Product Page",
    "metadata": [...],
    "markdown": "Product content...",
    "llm_extraction": {
      "name": "Wireless Headphones",
      "price": 99.99,
      "currency": "USD",
      "description": "High-quality wireless headphones with noise cancellation",
      "availability": "in_stock",
      "rating": 4.5,
      "reviews_count": 1234
    },
    "timestamp": "2025-08-07T02:26:30.915Z"
  }
}
```

#### Failed Scrape Response

```json
{
  "success": false,
  "error": "Scrape task failed",
  "message": "Page is not available: 404",
  "data": {
    "url": "https://httpbin.org/status/404",
    "status": "failed",
    "type": "http_error", 
    "message": "Page is not available: 404",
    "code": 404,
    "metadata": [],
    "jobId": "409c1356-2ab9-4451-9ff1-8f24a14cbb50",
    "title": "",
    "markdown": "",
    "timestamp": "2025-08-07T02:26:50.168Z",
    "statusCode": 404,
    "statusMessage": ""
  }
}
```

### 🔍 **Search Response Examples**

#### Successful Search

```json
{
  "success": true,
  "data": [
    {
      "title": "The Python Tutorial",
      "url": "https://docs.python.org/3/tutorial/index.html",
      "description": "This tutorial introduces the reader informally to the basic concepts and features of the Python language and system.See more",
      "source": "Google Search Result"
    },
    {
      "title": "Python Tutorial",
      "url": "https://www.w3schools.com/python/",
      "description": "Learn Python. Python is a popular programming language. Python can be used on a server to create web applications. Start learning Python now.See more",
      "source": "Google Search Result"
    },
    {
      "title": "Python For Beginners",
      "url": "https://www.python.org/about/gettingstarted/",
      "description": "New to programming? Python is free and easy to learn if you know where to start! Start here if you are a beginner.See more",
      "source": "Google Search Result"
    }
  ]
}
```

### 🚨 **Error Response Examples**

#### Authentication Error

```json
{
  "success": false,
  "error": "Invalid API key"
}
```

#### Validation Error 

```json
{
  "success": false,
  "error": "Validation error",
  "message": "url is required, engine must be one of: cheerio, playwright, puppeteer",
  "data": {
    "type": "validation_error",
    "issues": [
      {
        "field": "url",
        "message": "url is required",
        "code": "invalid_type"
      },
      {
        "field": "engine", 
        "message": "engine must be one of: cheerio, playwright, puppeteer",
        "code": "invalid_enum_value"
      }
    ],
    "message": "url is required, engine must be one of: cheerio, playwright, puppeteer",
    "status": "failed"
  }
}
```

#### Health Check Response

```json
{
  "status": "ok"
}
```

### 📋 **Response Field Reference**

#### Scrape Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request succeeded |
| `data.url` | string | The URL that was scraped |
| `data.status` | string | Job status: "completed", "failed", "pending" |
| `data.jobId` | string | Unique identifier for the scraping job |
| `data.title` | string | Page title extracted from HTML |
| `data.metadata` | array | Meta tags from the page (name/content pairs) |
| `data.markdown` | string | Page content converted to markdown (if requested) |
| `data.html` | string | Cleaned HTML content (if requested) |
| `data.rawHtml` | string | Full original HTML (if requested) |
| `data.text` | string | Plain text content (if requested) |
| `data.screenshot` | string | URL to screenshot file (if requested) |
| `data.llm_extraction` | object | AI-extracted structured data (if requested) |
| `data.timestamp` | string | ISO timestamp of when scrape completed |

#### Search Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request succeeded |
| `data` | array | Array of search results |
| `data[].title` | string | Title of the search result |
| `data[].url` | string | URL of the search result |
| `data[].description` | string | Description/snippet from search |
| `data[].source` | string | Source identifier ("Google Search Result") |

#### Error Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `false` for errors |
| `error` | string | Error category/type |
| `message` | string | Human-readable error description |
| `data` | object | Additional error details (optional) |
| `data.type` | string | Specific error type for programmatic handling |
| `data.issues` | array | Validation error details (for validation errors) |

---

## 🚨 **Error Handling**

### Error Response Format

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message",
  "data": {
    "type": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Types

| Error | Status Code | Description |
|-------|-------------|-------------|
| `Validation error` | 400 | Invalid request parameters |
| `No authorization header provided` | 401 | Missing API key |
| `Invalid API key` | 401 | Invalid or expired API key |
| `Insufficient credits` | 402 | Not enough credits |
| `Internal server error` | 500 | Server-side error |
| `Scrape task failed` | 200 | Scraping failed but request was valid |

---

## 🔧 **Advanced Features**

### Proxy Support

Use HTTP or SOCKS proxies for requests:

```json
{
  "url": "https://example.com",
  "proxy": "http://username:password@proxy-server:port"
}
```

### Custom Headers & Cookies

Currently handled automatically by engines. Contact support for custom header requirements.

### Batch Processing

For multiple URLs, make separate requests. The API is designed for single URL processing with high concurrency.

---

## 📊 **AI Models & Costs**

### Available Models

- **Default**: `gpt-4o-mini` (fastest, most cost-effective)
- **Alternative**: `gpt-4o` (more powerful, higher cost)

### Cost Estimation

AI extraction costs depend on:
- Content length (token count)
- Model used
- Schema complexity

Typical costs:
- Simple extraction: $0.001 - $0.01 per page
- Complex extraction: $0.01 - $0.05 per page

---

## 🛠️ **Integration Examples**

### Python Example

```python
import requests

def scrape_with_ai(url, schema):
    response = requests.post(
        "https://artifactscraper-production.up.railway.app/v1/scrape",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer sk-prod-artifactscraper-12345678901234567890abcdef"
        },
        json={
            "url": url,
            "engine": "cheerio",
            "formats": ["markdown", "json"],
            "json_options": {
                "schema": schema,
                "user_prompt": "Extract structured data from this page"
            }
        }
    )
    return response.json()

# Example usage
schema = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "price": {"type": "number"}
    }
}

result = scrape_with_ai("https://example-shop.com/product", schema)
```

### JavaScript Example

```javascript
async function searchAndScrape(query) {
    // First, search for relevant URLs
    const searchResponse = await fetch(
        "https://artifactscraper-production.up.railway.app/v1/search",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer sk-prod-artifactscraper-12345678901234567890abcdef"
            },
            body: JSON.stringify({
                query: query,
                limit: 5
            })
        }
    );
    
    const searchResults = await searchResponse.json();
    
    // Then scrape the first result
    if (searchResults.success && searchResults.data.length > 0) {
        const firstResult = searchResults.data[0];
        
        const scrapeResponse = await fetch(
            "https://artifactscraper-production.up.railway.app/v1/scrape",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer sk-prod-artifactscraper-12345678901234567890abcdef"
                },
                body: JSON.stringify({
                    url: firstResult.url,
                    engine: "cheerio",
                    formats: ["markdown"]
                })
            }
        );
        
        return await scrapeResponse.json();
    }
}
```

---

## 📋 **Best Practices**

### 🎯 **Engine Selection**

1. **Choose the Right Engine:**
   - Use `cheerio` for static content (fastest, lowest resource usage)
   - Use `playwright` for dynamic content with JavaScript
   - Use `puppeteer` for Chrome-specific features

### 🤖 **AI Extraction Optimization**

2. **Optimize AI Extraction:**
   - Be specific in your JSON schemas with clear property descriptions
   - Use descriptive field names that match the content structure
   - Start with simple schemas and iterate based on results
   - Include `user_prompt` for better extraction accuracy

### 🔧 **Response Handling**

3. **Handle Responses Properly:**
   - **Always check the `success` field** before processing `data`
   - **Check `data.status`** for scrape jobs ("completed", "failed", "pending")
   - **Use `data.jobId`** for tracking and debugging specific requests
   - **Parse error types** from `data.type` for programmatic error handling
   - **Handle validation errors** by checking `data.issues` array

### 🚨 **Error Handling**

4. **Handle Errors Gracefully:**
   - Implement different retry strategies based on error type:
     - `http_error`: Try different engines or proxies
     - `timeout_error`: Increase timeout or retry
     - `validation_error`: Fix request parameters
     - `rate_limit_error`: Implement exponential backoff
   - Monitor your credit usage through API responses
   - Log `jobId` values for debugging failed requests

### ⚡ **Performance Optimization**

5. **Performance Tips:**
   - Cache successful results using `jobId` as cache key
   - Use appropriate timeouts (start with 60s, adjust based on site complexity)
   - Request only needed formats to reduce response size and processing time
   - Use `limit` parameter in search to control result size
   - Consider using proxies for geo-restricted or heavily rate-limited content

### 📊 **Data Processing**

6. **Process Response Data Efficiently:**
   - Use `data.timestamp` for freshness tracking
   - Parse `data.metadata` for additional page information
   - Store `data.screenshot` URLs if visual verification is needed
   - Process `data.llm_extraction` separately from raw content
   - Handle partial failures gracefully (some formats may succeed while others fail)

---

## 🆘 **Support & Troubleshooting**

### Common Issues

1. **"No authorization header provided"**
   - Ensure you're including the Authorization header
   - Check that your API key is correct

2. **"Scrape task failed"**
   - The target website may be blocking requests
   - Try a different engine (e.g., playwright instead of cheerio)
   - Consider using a proxy

3. **AI extraction returns empty results**
   - Check that your JSON schema matches the content structure
   - Ensure the content contains the data you're trying to extract
   - Try simplifying your schema

### API Status

Check the health endpoint for API status:
```bash
curl https://artifactscraper-production.up.railway.app/health
```

---

## 📝 **Changelog & Updates**

This API is actively maintained. Features include:
- Multi-engine web scraping
- AI-powered data extraction
- Google search integration
- Screenshot capture
- Proxy support
- Credit system
- Comprehensive error handling

For the latest updates and feature requests, check the project repository.