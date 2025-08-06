<div align="center">

<h1>
  🚀 ArtifactScraper
</h1>
<h2>
  AI-Powered Web Scraping & Research Tool
</h2>

<img src="https://img.shields.io/badge/⚡-Fast-blue" alt="Fast"/>
<img src="https://img.shields.io/badge/🚀-Scalable-orange" alt="Scalable"/>
<img src="https://img.shields.io/badge/🕷️-Web%20Crawling-ff69b4" alt="Web Crawling"/>
<img src="https://img.shields.io/badge/🌐-Site%20Crawling-9cf" alt="Site Crawling"/>
<img src="https://img.shields.io/badge/🔍-SERP%20(Multi%20Engines)-green" alt="SERP"/>
<img src="https://img.shields.io/badge/⚙️-Multi%20Threading-yellow" alt="Multi Threading"/>
<img src="https://img.shields.io/badge/🔄-Multi%20Process-purple" alt="Multi Process"/>
<img src="https://img.shields.io/badge/📦-Batch%20Tasks-red" alt="Batch Tasks"/>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![LLM Ready](https://img.shields.io/badge/LLM-Ready-blueviolet)](https://github.com/EmilyThaHuman/ArtifactScraper)
[![Railway Deploy](https://img.shields.io/badge/Deploy-Railway-purple)](https://railway.app)

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
</p>

</div>

## 📖 Overview

ArtifactScraper is a high-performance web crawling and scraping application designed specifically for AI research and data extraction. Based on the powerful AnyCrawl foundation, it excels in multiple domains:

- **🔍 SERP Crawling**: Support for multiple search engines with batch processing capabilities
- **🕷️ Web Crawling**: Efficient single-page content extraction with JavaScript support
- **🌐 Site Crawling**: Comprehensive full-site crawling with intelligent traversal
- **⚡ High Performance**: Multi-threading and multi-process architecture
- **📦 Batch Processing**: Efficient handling of batch crawling tasks
- **🤖 AI Integration**: Optimized for LLMs and AI research workflows
- **☁️ Cloud Ready**: Designed for Railway deployment with Redis integration

Built with modern architectures and optimized for Large Language Models (LLMs), ArtifactScraper provides a robust foundation for AI-powered research and data collection.

## 🚀 Quick Start

### Railway Deployment (Recommended)

1. **Clone this repository**
2. **Deploy to Railway**: Click the button below to deploy directly to Railway
   
   [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

3. **Add Redis Add-on**: In your Railway dashboard, add a Redis service
4. **Configure Environment Variables**: Set up the required environment variables (see below)

### Local Development

```bash
# Clone the repository
git clone https://github.com/EmilyThaHuman/ArtifactScraper.git
cd ArtifactScraper

# Install dependencies
pnpm install

# Copy environment configuration
cp env.example .env
# Edit .env with your configuration

# Start development server
pnpm dev

# Or run with Docker
docker compose up --build
```

### Environment Variables

| Variable                       | Description                                  | Default                        | Example                                                     |
| ------------------------------ | -------------------------------------------- | ------------------------------ | ----------------------------------------------------------- |
| `NODE_ENV`                     | Runtime environment                          | `production`                   | `production`, `development`                                 |
| `ANYCRAWL_API_PORT`            | API service port                             | `8080`                         | `8080`                                                      |
| `ANYCRAWL_HEADLESS`            | Use headless mode for browser engines        | `true`                         | `true`, `false`                                             |
| `ANYCRAWL_PROXY_URL`           | Proxy server URL (supports HTTP and SOCKS)   | _(none)_                       | `http://proxy:8080`                                         |
| `ANYCRAWL_IGNORE_SSL_ERROR`    | Ignore SSL certificate errors                | `true`                         | `true`, `false`                                             |
| `ANYCRAWL_KEEP_ALIVE`          | Keep connections alive between requests      | `true`                         | `true`, `false`                                             |
| `ANYCRAWL_AVAILABLE_ENGINES`   | Available scraping engines (comma-separated) | `cheerio,playwright,puppeteer` | `playwright,puppeteer`                                      |
| `ANYCRAWL_API_DB_TYPE`         | Database type                                | `sqlite`                       | `sqlite`, `postgresql`                                      |
| `ANYCRAWL_API_DB_CONNECTION`   | Database connection string/path              | `/usr/src/app/db/database.db`  | `/path/to/db.sqlite`, `postgresql://user:pass@localhost/db` |
| `ANYCRAWL_REDIS_URL`           | Redis connection URL                         | `redis://redis:6379`           | `redis://localhost:6379`                                    |
| `ANYCRAWL_API_AUTH_ENABLED`    | Enable API authentication                    | `false`                        | `true`, `false`                                             |
| `ANYCRAWL_API_CREDITS_ENABLED` | Enable credit system                         | `false`                        | `true`, `false`                                             |

## 📚 Usage Examples

💡 **You can use [Playground](https://anycrawl.dev/playground) to test APIs and generate code examples for your preferred programming language.**

> **Note**: If you are self-hosting AnyCrawl, make sure to replace `https://api.anycrawl.dev` with your own server URL.

### 🤖 AI Research Agent Integration

ArtifactScraper is designed for seamless integration with AI research agents and LLMs:

```bash
# Web Scraping for AI Research
curl -X POST https://your-railway-app.railway.app/v1/scrape \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
    "url": "https://example.com",
    "engine": "playwright",
    "formats": ["markdown", "text"],
    "extract": {
      "schema": {
        "type": "object",
        "properties": {
          "title": {"type": "string"},
          "content": {"type": "string"},
          "metadata": {"type": "object"}
        }
      }
    }
  }'
```

#### Parameters

| Parameter | Type              | Description                                                                                                                                                                       | Default  |
| --------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| url       | string (required) | The URL to be scraped. Must be a valid URL starting with http:// or https://                                                                                                      | -        |
| engine    | string            | Scraping engine to use. Options: `cheerio` (static HTML parsing, fastest), `playwright` (JavaScript rendering with modern engine), `puppeteer` (JavaScript rendering with Chrome) | cheerio  |
| proxy     | string            | Proxy URL for the request. Supports HTTP and SOCKS proxies. Format: `http://[username]:[password]@proxy:port`                                                                     | _(none)_ |

### 🔍 Search Engine Integration

Perfect for AI research tasks that require search engine data:

```bash
# SERP Extraction for Research
curl -X POST https://your-railway-app.railway.app/v1/search \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
    "query": "artificial intelligence research 2024",
    "limit": 20,
    "engine": "google",
    "lang": "en"
  }'
```

#### Parameters

| Parameter | Type              | Description                                                | Default |
| --------- | ----------------- | ---------------------------------------------------------- | ------- |
| `query`   | string (required) | Search query to be executed                                | -       |
| `engine`  | string            | Search engine to use. Options: `google`                    | google  |
| `pages`   | integer           | Number of search result pages to retrieve                  | 1       |
| `lang`    | string            | Language code for search results (e.g., 'en', 'zh', 'all') | en-US   |

#### Supported Search Engines

- Google

## 🚀 Railway Deployment Guide

### Step 1: Repository Setup
1. Fork this repository to your GitHub account
2. Connect your GitHub account to Railway

### Step 2: Service Deployment
1. **Main API Service**: Deploy from the root Dockerfile
2. **Redis Service**: Add from Railway marketplace
3. **Worker Services** (Optional): Deploy separate services for different engines

### Step 3: Environment Configuration
Set these environment variables in your Railway dashboard:

| Variable | Description | Required |
|----------|-------------|----------|
| `ANYCRAWL_DOMAIN` | Your Railway app URL | ✅ |
| `ANYCRAWL_REDIS_URL` | Redis connection URL from Railway | ✅ |
| `ANYCRAWL_API_AUTH_ENABLED` | Enable API authentication | ✅ |
| `ANYCRAWL_API_PORT` | API port (use 8080) | ✅ |

### Step 4: Testing Your Deployment
```bash
# Health check
curl https://your-app.railway.app/health

# Test scraping endpoint
curl -X POST https://your-app.railway.app/v1/scrape \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{"url": "https://example.com", "engine": "cheerio"}'
```

## ❓ FAQ

### Common Questions

1. **Q: How do I get API keys?**
   A: API keys are generated automatically when you enable authentication. Check your Railway logs for the initial API key.

2. **Q: Can I use proxies?**
   A: Yes, ArtifactScraper supports both HTTP and SOCKS proxies. Configure them through the `ANYCRAWL_PROXY_URL` environment variable.

3. **Q: How to handle JavaScript-rendered content?**
   A: Use the `playwright` or `puppeteer` engines for JavaScript rendering needs.

4. **Q: How do I scale for high-volume research?**
   A: Deploy separate worker services for each engine type and increase the concurrency settings.

## 🤝 Contributing

We welcome contributions! This project is based on the excellent [AnyCrawl](https://github.com/any4ai/AnyCrawl) foundation and optimized for AI research workflows.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Mission

ArtifactScraper is designed to accelerate AI research by providing robust, scalable web scraping infrastructure that serves as the foundation for data collection and analysis in artificial intelligence applications.

---

<div align="center">
  <sub>Built with ❤️ for AI researchers • Based on AnyCrawl by Any4AI</sub>
</div>
