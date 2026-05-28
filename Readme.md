# Log Analyzer Tool

### A lightweight log analyzer tool built with Node.js and JavaScript. Users can upload log files, and the system processes them to generate useful analytics, insights, and visualizations from the log data. This project is currently a prototype version focused on log parsing, analytics generation, and dashboard integration.

---

# Features

* Upload and process `.txt` files
* Parse multiple log formats
* Extract:
  * Timestamps
  * IP addresses
  * HTTP methods
  * Status codes
  * Response times
* Detect malformed log entries
* Generate analytics and insights
* API-ready architecture for dashboard integration

---

# Tech Stack

* Node.js
* Express.js
* Multer
* JavaScript
* REST APIs

---

# Getting Started

## 1. Clone the Repository

```bash
git clone <https://github.com/enmfarooq85/Log-Analyzer.git>
```

---

## 2. Install Dependencies

Navigate to the project directory and install the required packages: Please make sure you have Node.js and npm installed on your machine.

```bash
npm install
```

---

## 3. Start the Development Server

```bash
npm start
```

---

# Application URLs

## Local Development

Backend API:

```bash
http://localhost:5000
```

---

## Production

Backend API:

```bash
https://your-production-backend-url.com
```

---

# Usage

1. Start the backend server
2. Access the API endpoint for uploading log files
3. Upload one or multiple log files
4. The tool will:
   * Parse logs
   * Analyze traffic
   * Detect errors
   * Generate insights
   * Return processed analytics

---

# API Endpoints

## Upload and Analyze Logs

### Endpoint

```http
POST /api/uploadFiles
```

### Local URL

```bash
http://localhost:5000/api/uploadFiles
```

### Description

Upload one or multiple log files using `multipart/form-data`.

The API will:

* Process the uploaded files
* Parse log entries
* Generate analytics
* Return structured JSON results

---

## Health Check Endpoint

### Endpoint

```http
GET /api
```

### Local URL

```bash
http://localhost:5000/api
```

### Description

Test whether the backend server is running correctly.

---

# Example Log Format

```txt
2024-03-15T14:23:01Z 192.168.1.42 GET /api/users 200 142ms
2024-03-15T14:23:02Z 10.0.0.7 POST /api/login 401 89ms
```
