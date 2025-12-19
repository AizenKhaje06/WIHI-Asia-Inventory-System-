# Inventory Management System - Architecture Documentation

## System Overview

This is a production-grade Inventory Management System using Google Sheets as the primary database. The system follows clean architecture principles with clear separation of concerns.

## Architecture Layers

### 1. Data Layer (Google Sheets)
- **Inventory Tab**: Master product catalog with stock levels
- **Restock Tab**: Restock orders and history
- **Transactions Tab**: All inventory movements and operations
- **Logs Tab**: System-wide audit trail and error logging

### 2. Backend API Layer (Google Apps Script)
Deployed as a web app exposing REST-like endpoints:
- `GET/POST /inventory` - Inventory operations
- `GET/POST /restock` - Restock management
- `GET /transactions` - Transaction history
- `GET /logs` - System logs

### 3. Service Layer (Google Apps Script)
- **SheetService**: Core CRUD operations with error handling
- **ValidationService**: Centralized data validation
- **LogService**: Audit logging to Logs tab
- **TransactionService**: Transaction recording

### 4. Frontend Application (Next.js)
- **API Client Layer**: Type-safe HTTP client for Google Apps Script endpoints
- **Service Layer**: Business logic and data transformation
- **UI Components**: Reusable React components with shadcn/ui
- **Pages**: Feature-based routing (inventory, restock, transactions, logs)

## Data Flow

1. User interacts with Next.js UI
2. UI calls frontend service layer
3. Service layer calls API client
4. API client makes HTTP request to Google Apps Script
5. Google Apps Script validates and processes request
6. SheetService performs CRUD operations on Google Sheets
7. LogService records operation in Logs tab
8. Response flows back through layers to UI

## Security Considerations

### Google Apps Script
- Deploy as web app with authentication required
- Use ScriptApp.getOAuthToken() for server-side auth
- Validate all inputs before processing
- Implement rate limiting via script properties
- Use content service for JSON responses only

### Next.js Application
- Store API endpoint and credentials in environment variables
- Implement API route handlers as middleware
- Never expose Google Apps Script URL directly to client
- Add CORS validation in Google Apps Script
- Implement request signing/API key validation

### Data Validation
- Server-side validation in Google Apps Script
- Client-side validation in Next.js for UX
- Type checking with TypeScript
- Schema validation for all operations

## Scalability Considerations

- Batch operations for multiple row updates
- Caching strategy for frequently accessed data
- Pagination for large datasets
- Soft delete instead of hard delete for audit trail
- Index-like lookup using sheet formulas
- Consider migrating to proper database when sheet size exceeds 10k rows

## Error Handling

- All errors logged to Logs tab with timestamp, operation, and stack trace
- Frontend displays user-friendly error messages
- Retry logic for transient failures
- Validation errors return specific field-level feedback

## Monitoring & Audit

- All operations logged with user, timestamp, and changes
- Transaction history preserved indefinitely
- Soft delete maintains data integrity
- Logs tab provides complete audit trail
</parameter>
