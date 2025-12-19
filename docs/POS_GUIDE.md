# POS System Guide

## Overview

The Point of Sale (POS) system is designed for selling products from your inventory with built-in financial tracking and profit calculations.

## Key Features

### 1. Stock Validation
- **Real-time stock checking**: System blocks transactions if inventory is insufficient
- **Atomic operations**: Inventory deduction happens in a single transaction to prevent race conditions
- **Immediate feedback**: Users see available stock before completing sale

### 2. Financial Calculations
- **Cost tracking**: Record cost price per unit (defaults to 0 if not tracked)
- **Revenue calculation**: Total revenue = selling price × quantity
- **Profit calculation**: Profit = total revenue - total cost
- **Precision handling**: All monetary calculations rounded to 2 decimal places to avoid floating point errors

### 3. Live Profit Preview
The POS interface shows real-time calculations as you enter sale details:
- Total Revenue
- Total Cost
- Net Profit
- Profit Margin %

### 4. Department Tracking
All sales must be assigned to a department:
- Sales
- Retail
- Wholesale
- Online
- Counter

This enables department-level analytics and reporting.

## How to Use the POS

1. **Select Item**: Choose the product from the dropdown (shows available stock)
2. **Enter Quantity**: Specify how many units to sell
3. **Set Selling Price**: Enter the price per unit
4. **Select Department**: Choose which department is making the sale
5. **Review Preview**: Check the profit preview on the right
6. **Complete Sale**: Click "Complete Sale" to process

## Data Flow

### When a Sale is Processed:

1. **Validation**:
   - Checks if item exists and is not deleted
   - Verifies sufficient stock is available
   - Validates all required fields (quantity, price, department)

2. **Financial Calculation**:
   - Calculates: `totalCost = costPrice × quantity`
   - Calculates: `totalRevenue = sellingPrice × quantity`
   - Calculates: `profit = totalRevenue - totalCost`
   - Rounds all values to 2 decimal places

3. **Inventory Update**:
   - Atomically deducts quantity from inventory
   - Updates the Inventory sheet with new stock level

4. **Record Keeping**:
   - Creates sale record in Sales sheet with full details
   - Creates transaction record in Transactions sheet
   - Logs operation to Logs sheet with readable message

5. **Response**:
   - Returns success with sale details
   - Or returns error with specific message (e.g., "Insufficient stock")

## Cash Flow Analytics

The Cash Flow dashboard provides financial insights:

### Summary Metrics
- **Total Revenue**: Sum of all sales revenue
- **Total Cost**: Sum of all costs of goods sold
- **Net Profit**: Total revenue minus total cost
- **Total Sales**: Count of all transactions

### Date Range Filtering
- Filter financial data by date range
- View specific time periods (daily, weekly, monthly, etc.)
- Clear filters to see all-time data

### Calculations
All financial calculations are performed server-side on the Google Sheets data:
- Ensures accuracy and consistency
- Handles large datasets efficiently
- Real-time recalculation on filter changes

## Sales Transaction History

Access the full sales history from the Transactions page:

### Tabs
- **Inventory Transactions**: All stock movements (restocks, adjustments, etc.)
- **Sales Records**: Detailed POS transaction history

### Sales Table Columns
- Date & Time
- Item name and SKU
- Quantity sold
- Unit price
- Total revenue
- Total cost
- Profit (color-coded: green for positive, red for negative)
- Department

### Search & Filter
- Search by item name, SKU, or department
- Real-time filtering as you type
- Refresh button to reload latest data

## Error Handling

### Insufficient Stock
If a sale is attempted with more quantity than available:
- Transaction is blocked
- Error message shows: "Insufficient stock. Available: X units, Requested: Y units"
- No changes made to inventory or records

### Missing Required Fields
If department or other required fields are missing:
- Transaction is blocked
- Clear error message displayed
- Form highlights missing fields

### Network Errors
If Google Sheets API is unavailable:
- Error message displayed with retry option
- No partial updates (all-or-nothing transactions)
- Logs error for debugging

## Best Practices

1. **Always verify stock levels** before promising items to customers
2. **Set cost prices accurately** for meaningful profit calculations
3. **Assign correct department** for accurate analytics
4. **Regularly check Cash Flow dashboard** to monitor business performance
5. **Review Sales History** to identify best-selling items and trends

## Logging

Every POS sale creates a log entry with format:
```
Operation: POS_SALE
Message: Sold X units of [Item Name] for $Y.YY
Details: { saleId, profit: $Z.ZZ, department, remainingStock }
```

This provides a complete audit trail for troubleshooting and analysis.

## Technical Notes

### Preventing Floating Point Errors
All monetary calculations use the formula:
```javascript
value = Math.round(calculation * 100) / 100
```

This ensures consistent 2-decimal precision for all financial values.

### Atomic Transactions
The sale processing follows this order:
1. Validate stock availability
2. Calculate financials
3. Update inventory
4. Record sale
5. Log transaction

If any step fails, the entire transaction is rolled back.
