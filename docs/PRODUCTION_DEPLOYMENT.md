# Production Deployment Guide

## Overview

This guide walks you through deploying the Inventory Management System to production using Vercel and Google Apps Script.

## Prerequisites

- Google Account with access to Google Sheets
- Vercel account (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)

---

## Part 1: Google Sheets Setup

### 1.1 Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Inventory Management System"
3. Create the following tabs (sheets) in this exact order:
   - **Inventory**
   - **Restock**
   - **Transactions**
   - **Logs**
   - **Sales**

### 1.2 Deploy Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `docs/google-apps-script.js` from this repository
4. Paste it into the Apps Script editor
5. Save the project (name it "IMS Backend")
6. Click **Deploy > New deployment**
7. Choose **Web app** as deployment type
8. Configure:
   - **Description**: "IMS API v1"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
9. Click **Deploy**
10. **Authorize** the script (you'll see security warnings - click "Advanced" then "Go to IMS Backend")
11. **Copy the Web App URL** - it looks like:
    ```
    https://script.google.com/macros/s/ABC...XYZ/exec
    ```
12. **Important**: Keep this URL secure. Anyone with this URL can access your API.

### 1.3 Test the API

Open your browser and visit:
```
YOUR_WEB_APP_URL?action=health
```

You should see:
```json
{
  "success": true,
  "message": "Inventory Management System API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Part 2: Vercel Deployment

### 2.1 Prepare Repository

1. Push your code to GitHub/GitLab/Bitbucket
2. Ensure these files are committed:
   - All source code files
   - `.env.example` (but NOT `.env.local`)
   - `package.json`
   - `next.config.mjs`

### 2.2 Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New > Project**
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)

### 2.3 Configure Environment Variables

1. In Vercel project settings, go to **Settings > Environment Variables**
2. Add the following variable:

   **Variable**: `NEXT_PUBLIC_GOOGLE_SHEETS_API_URL`  
   **Value**: Your Google Apps Script Web App URL (from step 1.2)  
   **Environment**: Production, Preview, Development (check all)

3. Click **Save**

### 2.4 Deploy

1. Click **Deploy**
2. Wait for build to complete (1-3 minutes)
3. Once deployed, click **Visit** to see your live app

---

## Part 3: Post-Deployment Configuration

### 3.1 Initial System Setup

1. Visit your deployed app
2. Navigate to **Inventory** page
3. Add your first item - this will initialize all sheets with proper headers
4. Verify logs are being created in the **System Logs** page

### 3.2 Security Recommendations

**Google Apps Script:**
- Consider implementing API key authentication
- Monitor Apps Script quotas (6 min/execution limit)
- Set up Google Cloud Console project for better monitoring

**Vercel:**
- Enable **Vercel Authentication** if you want to restrict access
- Set up **Team** access controls for collaboration
- Consider adding **Vercel Firewall** rules

### 3.3 Backup Strategy

**Google Sheets:**
- Enable **Version History** (File > Version history)
- Set up periodic exports to Google Drive
- Consider Google Workspace backup solutions

**Code:**
- Keep Git repository up to date
- Tag releases (v1.0, v1.1, etc.)
- Document major changes

---

## Part 4: Monitoring & Maintenance

### 4.1 System Health Checks

**Daily:**
- Check System Logs for errors
- Verify POS sales are recording properly
- Review low stock alerts

**Weekly:**
- Review cash flow analytics
- Check transaction records completeness
- Audit restock order status

**Monthly:**
- Analyze system performance
- Review Google Apps Script quotas
- Update dependencies if needed

### 4.2 Google Apps Script Quotas

**Free tier limits:**
- 6 minutes/execution
- 30 million calls/day
- 20,000 emails/day

**Monitor usage:**
1. Go to Apps Script project
2. Click **Executions** to see history
3. Watch for quota warnings

### 4.3 Scaling Considerations

**When to upgrade:**
- More than 1,000 inventory items
- More than 100 transactions/day
- Multiple concurrent users
- Need for real-time updates

**Upgrade path:**
- Consider migrating to PostgreSQL/Supabase
- Implement Redis for caching
- Add WebSocket support for real-time updates
- Set up proper database indices

---

## Part 5: Troubleshooting

### Common Issues

**Issue**: "Failed to fetch from API"
- **Solution**: Verify `NEXT_PUBLIC_GOOGLE_SHEETS_API_URL` is set correctly in Vercel
- Check Google Apps Script is deployed and accessible

**Issue**: "Insufficient stock" error when stock exists
- **Solution**: Clear browser cache and refresh
- Check Transactions tab for duplicate entries

**Issue**: Logs not appearing
- **Solution**: Ensure "Logs" sheet exists in Google Sheet
- Redeploy Google Apps Script with latest code

**Issue**: Slow response times
- **Solution**: Check Google Apps Script execution time in Apps Script dashboard
- Consider reducing data returned (pagination)

### Getting Help

- Review **docs/ARCHITECTURE.md** for system design
- Check **docs/API_REFERENCE.md** for API details
- Review Google Apps Script execution logs
- Check Vercel deployment logs

---

## Part 6: Production Checklist

Before going live, ensure:

- [ ] Google Sheet created with all 5 tabs
- [ ] Google Apps Script deployed successfully
- [ ] API health check returns success
- [ ] Environment variable set in Vercel
- [ ] First inventory item created successfully
- [ ] POS sale test completed
- [ ] Logs are being recorded
- [ ] Transactions are being tracked
- [ ] Cash flow analytics showing data
- [ ] Team members trained on system
- [ ] Backup strategy documented
- [ ] Monitoring plan in place

---

## Support

For issues or questions:
1. Check the documentation in `/docs`
2. Review System Logs for error details
3. Check Google Apps Script execution logs
4. Review Vercel deployment logs

## Next Steps

- Customize department names in POS
- Add more inventory items
- Train staff on POS system
- Set up regular backup routine
- Monitor system logs daily
