## 1. How to Run the Project?

### Requirements

Make sure the following tools are installed on your machine:

* Node.js (v18 or higher recommended)
* npm

You can verify installation using:

```bash
node -v
npm -v
```

---

## Backend Setup

### Clone the repository

```bash
git clone git@github.com:enmfarooq85/Log-Analyzer.git
```

---

### Navigate into the project

```bash
cd Log-Analyzer
```

---

### Install dependencies

```bash
npm install
```

---

### Start the backend server

```bash
npm start
```

The backend server will start on:

```bash
http://localhost:5000
```

---

## API Endpoint

Upload log files using:

## Local URL

```http
POST http://localhost:5000/api/uploadFiles
```

## Production URL

```bash
https://log-analyzer-r54h.onrender.com/api/uploadFiles
```

---

# 2. Stack Choice

I selected Node.js with Express.js because this task is heavily focused on file processing, asynchronous operations, and API handling. I am working on node js and javascript based environment for past 2.5 years.

A worse choice for this task would have been using a heavy monolithic framework such as Java Spring Boot or Laravel for a prototype-level log analyzer. Those frameworks would introduce unnecessary setup complexity, slower iteration speed, and more boilerplate for a task primarily focused on parsing and analytics.

---

# 3. One Real Edge Case

One important edge case handled correctly is malformed or broken log lines.

Example malformed logs:

```txt
POST /api/broken line without proper format
random corrupted text
```

Handled in:

```txt
index.js
```

Relevant handling:

```js
if (!line.trim()) continue;
```

and:

```js
if (
  line.startsWith("at ") ||
  line.startsWith("Error:")
) {
  continue;
}
```

This prevents:

* stack traces from breaking parsing
* empty lines from creating invalid objects
* malformed entries from crashing analytics generation

Without this handling:

* the parser could generate invalid analytics
* response calculations would become inaccurate
* the API might throw runtime errors while processing large files

---

# 4. AI Usage

I used Stackoverflow, Google browsing and ChatGPT during development for:

* refining log parsing strategies
* writing regex patterns
* handling multiple timestamp formats
* improving API response structures
* creating README documentation

Example prompts:
* "Write Regex pattern to check valid API, timestamp and response code in log lines"
* "Handle malformed log entries in Node.js"
* "Improve API analytics structure"

One important modification I made to AI-generated code was restructuring the parsing logic.

I manually refactored the code by:

* moving helper functions outside loops
* storing parsed logs correctly in arrays
* adding safer validations for malformed lines

This reduced unnecessary computation and made the parser scalable for larger files.

---

# 5. Honest Gap

One major limitation in the current submission is scalability for extremely large log files.

Currently:

* the server reads entire files into memory using:

```js
fs.readFileSync()
```

This is acceptable for prototype-level testing, but not ideal for production-scale log processing.
