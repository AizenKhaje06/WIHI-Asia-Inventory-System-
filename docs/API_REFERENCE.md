# API Reference

## Base URL

All API requests are made to your deployed Google Apps Script web app URL:
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Authentication

Currently, the API uses Google Apps Script's built-in authentication. Consider implementing API key authentication for production use.

## Request Format

### GET Requests
```
GET {BASE_URL}?path={endpoint}&{params}
```

### POST Requests
```
POST {BASE_URL}?path={endpoint}
Content-Type: application/json

{body}
```

## Endpoints

### Inventory

#### Get All Inventory Items
```http
GET ?path=inventory
```

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "uuid",
      "name": "Wireless Mouse",
      "sku": "WM-001",
      "quantity": 50,
      "reorderPoint": 10,
      "category": "Electronics",
      "unit": "units",
      "deleted": false,
      "lastModified": "2025-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get Single Inventory Item
```http
GET ?path=inventory&id={item_id}
```

#### Create Inventory Item
```http
POST ?path=inventory

{
  "name": "Wireless Mouse",
  "sku": "WM-001",
  "quantity": 50,
  "reorderPoint": 10,
  "category": "Electronics",
  "unit": "units"
}
```

#### Update Inventory Item
```http
POST ?path=inventory/update

{
  "id": "item_id",
  "quantity": 75,
  "reorderPoint": 15
}
```

#### Delete Inventory Item
```http
POST ?path=inventory/delete

{
  "id": "item_id"
}
```

### Restock Orders

#### Get All Restock Orders
```http
GET ?path=restock
```

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "uuid",
      "inventoryId": "inventory_item_id",
      "quantity": 100,
      "status": "pending",
      "orderedDate": "2025-01-01T00:00:00.000Z",
      "receivedDate": "",
      "notes": "Rush order",
      "deleted": false,
      "lastModified": "2025-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Create Restock Order
```http
POST ?path=restock

{
  "inventoryId": "inventory_item_id",
  "quantity": 100,
  "status": "pending",
  "notes": "Rush order"
}
```

#### Update Restock Order
```http
POST ?path=restock/update

{
  "id": "order_id",
  "status": "received"
}
```

**Note:** When status is changed to "received", the inventory quantity is automatically updated.

### Transactions

#### Get All Transactions
```http
GET ?path=transactions
```

#### Get Transactions by Inventory Item
```http
GET ?path=transactions&inventoryId={item_id}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "uuid",
      "inventoryId": "inventory_item_id",
      "type": "add",
      "quantity": 50,
      "reference": "Initial stock",
      "timestamp": "2025-01-01T00:00:00.000Z",
      "user": "system"
    }
  ],
  "count": 1
}
```

**Transaction Types:**
- `add`: Initial stock addition
- `remove`: Stock removal
- `restock`: Inventory replenishment
- `adjust`: Manual quantity adjustment

### System Logs

#### Get All Logs
```http
GET ?path=logs
```

#### Get Logs by Level
```http
GET ?path=logs&level={INFO|WARN|ERROR}
```

#### Limit Log Results
```http
GET ?path=logs&limit=50
```

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "timestamp": "2025-01-01T00:00:00.000Z",
      "level": "INFO",
      "operation": "write",
      "message": "Wrote to Inventory",
      "details": "{\"id\":\"uuid\"}"
    }
  ],
  "count": 1
}
```

## Error Responses

All errors follow this format:
```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": ["Name is required", "SKU is required"]
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad request (validation error)
- `404`: Not found
- `500`: Server error

## Rate Limits

Google Apps Script has the following quotas:
- **Script runtime**: 6 minutes per execution
- **URL Fetch calls**: 20,000 per day (consumer), unlimited (workspace)
- **Triggers**: 90 minutes total runtime per day

Consider implementing your own rate limiting for production use.
