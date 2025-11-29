# Communication Aggregator System

A 3-microservice system that routes messages to appropriate communication channels (Email, SMS, WhatsApp) with distributed tracing and logging.

## Architecture Overview

### Services

1. **Task Router Service** (Port 4000)

   - Accepts `POST /messages` REST API
   - Validates payload and routes based on `channel` field
   - Implements retry logic (3 attempts) and duplicate detection
   - Forwards messages to Delivery Service
   - Sends logs to Logging Service with traceId/spanId

2. **Delivery Service** (Port 4001)

   - Endpoints: `POST /send/email`, `POST /send/sms`, `POST /send/whatsapp`
   - Simulates message delivery
   - Stores messages in SQLite database
   - Sends logs to Logging Service

3. **Logging Service** (Port 4002)
   - Endpoint: `POST /logs`
   - Centralized log collection from all services
   - Stores logs in Elasticsearch for Kibana visualization

### Data Flow

```
Client → Task Router → Delivery Service → SQLite DB
         ↓              ↓
      Logging Service → Elasticsearch
```

1. Client sends message to Task Router with `channel`, `to`, `message`
2. Task Router validates, generates traceId, and routes to Delivery Service
3. Delivery Service simulates sending and stores in SQLite
4. Both services send logs to Logging Service with trace context
5. Logging Service stores logs in Elasticsearch for observability

## Communication Method and Reasoning

**REST over HTTP** is used for inter-service communication:

- **Simple setup**: No additional infrastructure (message queues) required
- **Easy debugging**: Can inspect requests with Postman/curl
- **Clear service boundaries**: Each service is independently deployable
- **Sufficient for assignment**: Demonstrates microservices architecture

**For production**, we would evolve to:

- Async messaging (RabbitMQ/Kafka) for better decoupling
- Message queues for retry handling and dead-letter queues
- Circuit breakers for fault tolerance

## Setup & Run Instructions

### Prerequisites

- Node.js (v14+)
- npm
- (Optional) Elasticsearch for log storage

### Installation

**Option 1: Install all services at once**

```bash
npm run install:all
```

**Option 2: Install each service separately**

```bash
cd task-router-service && npm install && cd ..
cd delivery-service && npm install && cd ..
cd logging-service && npm install && cd ..
```

Each service will have its own `node_modules` folder, making them independently deployable.

### Running Services

Start services in separate terminals (order matters):

**Terminal 1 - Logging Service:**

```bash
npm run start:logging
```

**Terminal 2 - Delivery Service:**

```bash
npm run start:delivery
```

**Terminal 3 - Task Router Service:**

```bash
npm run start:router
```

### Health Checks

- Task Router: `GET http://localhost:4000/health`
- Delivery: `GET http://localhost:4001/health`
- Logging: `GET http://localhost:4002/health`

## Postman Collection

Import `communication-aggregator.postman_collection.json` into Postman to test all endpoints:

- Health checks for all services
- Send messages (Email, SMS, WhatsApp)
- Duplicate message detection
- Validation error handling
- View stored messages

## Example Payloads

### Send Email Message

```http
POST http://localhost:4000/messages
Content-Type: application/json

{
  "channel": "email",
  "to": "user@example.com",
  "message": "Hello from Communication Aggregator!"
}
```

**Response:**

```json
{
  "status": "delivered",
  "attempts": 1,
  "messageId": "uuid-here",
  "delivery": {
    "id": "uuid-here",
    "channel": "email",
    "to": "user@example.com",
    "message": "Hello from Communication Aggregator!",
    "status": "sent"
  }
}
```

### Duplicate Detection

Send the same message with the same `id` - returns:

```json
{
  "status": "duplicate_ignored",
  "messageId": "uuid-here"
}
```

### View Stored Messages

```http
GET http://localhost:4001/messages
```

Returns all messages stored in SQLite database.

## Elasticsearch Setup (Optional)

If you want to store logs in Elasticsearch for Kibana visualization:

ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_INDEX=service-logs

If Elasticsearch is not available, logs will still be printed to console.
