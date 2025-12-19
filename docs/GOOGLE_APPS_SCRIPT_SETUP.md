# Google Apps Script Backend Setup

## Overview

This file contains the complete backend code for your Inventory Management System. The backend uses Google Sheets as a database and exposes REST API endpoints for the Next.js frontend.

## Deployment Instructions

1. **Create a Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new blank spreadsheet
   - Rename it to "Inventory Management System"

2. **Open Apps Script Editor**
   - In your Google Sheet, click **Extensions** > **Apps Script**
   - Delete any existing code in the editor

3. **Copy the Backend Code**
   - Open `docs/google-apps-script.txt`
   - Copy ALL the code
   - Paste it into the Apps Script editor

4. **Deploy as Web App**
   - Click **Deploy** > **New deployment**
   - Click the gear icon next to "Select type"
   - Choose **Web app**
   - Configure:
     - **Execute as**: Me
     - **Who has access**: Anyone
   - Click **Deploy**
   - Copy the **Web App URL**

5. **Add URL to Next.js Environment**
   - In the v0 UI, go to the **Vars** section in the sidebar
   - Add: `NEXT_PUBLIC_GOOGLE_SHEETS_API_URL`
   - Paste your Web App URL as the value

6. **Create Sheet Tabs**
   - In your Google Sheet, create 4 tabs with these EXACT names:
     - `Inventory`
     - `Restock`
     - `Transactions`
     - `Logs`
   - The headers will be automatically created when you first use the app

## Sheet Structure

### Inventory Tab
- ID | Name | Category | Quantity | Total COGS | Cost Price | Selling Price | Reorder Level | Warehouse | Last Updated

### Restock Tab
- ID | Item ID | Item Name | Quantity Added | Cost Price | Total Cost | Timestamp | Reason

### Transactions Tab
- ID | Item ID | Item Name | Quantity | Cost Price | Selling Price | Total Cost | Profit | Timestamp | Department

### Logs Tab
- ID | Operation | Item ID | Item Name | Details | Timestamp

## Testing

After deployment, you can test if it's working:

1. Run the `testInitialize()` function in Apps Script to create headers
2. Open your Next.js app and try adding an inventory item
3. Check your Google Sheet to see if data appears

## Troubleshooting

**Error: "Sheet not found"**
- Make sure you created all 4 tabs with exact names (case-sensitive)

**Error: "Authorization required"**
- Re-deploy and make sure "Who has access" is set to "Anyone"

**No data appearing**
- Check the Apps Script execution logs (View > Logs)
- Verify the Web App URL is correct in your environment variables

## Notes

- The backend code uses Google Apps Script built-in globals (`SpreadsheetApp`, `ContentService`, `Logger`)
- These are automatically available in the Google Apps Script runtime
- The `.txt` extension prevents linting errors in the Next.js project
