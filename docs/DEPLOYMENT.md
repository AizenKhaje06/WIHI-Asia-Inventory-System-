# Deployment Guide

## Google Sheets Setup

### 1. Create Google Sheet

Create a new Google Sheet with exactly these 4 tabs:

**Inventory Tab**
- Headers: id, name, sku, quantity, reorderPoint, category, unit, deleted, lastModified

**Restock Tab**
- Headers: id, inventoryId, quantity, status, orderedDate, receivedDate, notes, deleted, lastModified

**Transactions Tab**
- Headers: id, inventoryId, type, quantity, reference, timestamp, user

**Logs Tab**
- Headers: timestamp, level, operation, message, details

### 2. Deploy Google Apps Script

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Delete any existing code
4. Copy the entire contents of `docs/google-apps-script.js`
5. Paste into the Apps Script editor
6. **Save** the project (name it "Inventory Management API")
7. Click **Deploy > New Deployment**
8. Choose type: **Web app**
9. Configure:
   - Execute as: **Me**
   - Who has access: **Anyone** (or "Anyone with Google account" for better security)
10. Click **Deploy**
11. **Copy the Web App URL** - you'll need this for the Next.js app

### 3. Test Google Apps Script

Test the deployment by visiting:
```
YOUR_WEB_APP_URL?path=inventory
```

You should see a JSON response with an empty array:
```json
{
  "statusCode": 200,
  "data": [],
  "count": 0
}
```

## Next.js Deployment

### 1. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Google Apps Script URL:
   ```env
   NEXT_PUBLIC_GOOGLE_SHEETS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

### 2. Local Development

```bash
# Install dependencies (if needed)
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 3. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variable:
   - Key: `NEXT_PUBLIC_GOOGLE_SHEETS_API_URL`
   - Value: Your Google Apps Script deployment URL
5. Click **Deploy**

## Security Considerations

### Google Apps Script

- The script runs with **your Google account permissions**
- Consider using "Anyone with Google account" access for better security
- For production, implement API key authentication in the script
- Add CORS headers to restrict which domains can access your API

### Environment Variables

- Never commit `.env.local` to version control
- In production (Vercel), add environment variables through the dashboard
- The `NEXT_PUBLIC_` prefix makes the variable available in the browser
- For sensitive operations, create server-side API routes in Next.js

## Troubleshooting

### "Sheet not found" error
- Verify all 4 tabs exist in your Google Sheet
- Check tab names are **exactly** as specified (case-sensitive)

### "Failed to fetch" error
- Verify your Google Apps Script is deployed as a web app
- Check the deployment URL in `.env.local` is correct
- Ensure "Who has access" is set to "Anyone" in Apps Script

### CORS errors
- Google Apps Script should handle CORS automatically
- If issues persist, add explicit CORS headers in the script

### Data not updating
- Check the Logs tab in your Google Sheet for error messages
- Use the browser's Network tab to inspect API requests
- Verify the Google Apps Script has proper permissions

## Production Best Practices

1. **Backup Strategy**: Regularly backup your Google Sheet
2. **Access Control**: Use "Anyone with Google account" and share the sheet only with authorized users
3. **Monitoring**: Regularly check the Logs tab for errors
4. **Rate Limiting**: Implement rate limiting in Google Apps Script for high-traffic scenarios
5. **Migration Path**: Plan to migrate to a proper database (PostgreSQL, MySQL) when you exceed 10,000 rows
