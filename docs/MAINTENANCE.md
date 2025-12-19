# Maintenance & Operations Guide

## Daily Operations

### Morning Checklist
1. **Check System Logs** for overnight errors
2. **Review low stock alerts** in Inventory
3. **Verify yesterday's sales** in Transactions
4. **Check pending restock orders** status

### Throughout the Day
- Monitor POS transactions as they occur
- Update restock order statuses when deliveries arrive
- Adjust inventory quantities when needed
- Document any system issues in notes

### End of Day
- Review cash flow for the day
- Reconcile sales with physical cash
- Check for any error logs
- Plan tomorrow's restocking needs

---

## Weekly Maintenance

### Analytics Review
- **Cash Flow**: Review weekly revenue, costs, and profit trends
- **Top Sellers**: Identify best-selling items
- **Slow Movers**: Find items with low turnover
- **Stock Levels**: Ensure reorder points are appropriate

### Data Quality
- Verify SKUs are unique and correct
- Check for duplicate inventory items
- Review transaction history for anomalies
- Clean up cancelled restock orders

### System Health
- Check error count in System Logs
- Review API response times (should be < 3 seconds)
- Verify all sheets have proper headers
- Test POS system with sample transaction

---

## Monthly Maintenance

### Performance Review
- **Sales Performance**: Month-over-month comparison
- **Inventory Turnover**: Calculate turnover ratios
- **Profit Margins**: Review by department and category
- **Restock Efficiency**: Average time from order to receipt

### System Updates
- Update Next.js dependencies if security patches available
- Review and apply Google Apps Script improvements
- Check Vercel for platform updates
- Update documentation for any process changes

### Data Archiving
- Export previous month's transactions to CSV
- Create backup of Google Sheet
- Document any major changes or incidents
- Archive old logs (keep last 3 months active)

---

## Troubleshooting Guide

### Problem: Item Not Deducting from Inventory After Sale

**Symptoms**: POS sale completes but inventory quantity unchanged

**Diagnosis**:
1. Check System Logs for errors during sale
2. Look for transaction record in Transactions tab
3. Verify inventory item ID matches

**Resolution**:
1. Manually adjust inventory quantity
2. Add transaction record with reason "Manual correction - POS sale not recorded"
3. Check Google Apps Script execution logs for quota issues
4. If recurring, redeploy Google Apps Script

### Problem: Slow Performance

**Symptoms**: Pages take >5 seconds to load, API calls timeout

**Diagnosis**:
1. Check Google Apps Script execution time in dashboard
2. Count total rows in each sheet (>10,000 may be slow)
3. Check Vercel deployment logs for build issues

**Resolution**:
1. **Short-term**: Clear browser cache, hard refresh
2. **Medium-term**: Archive old data to separate sheet
3. **Long-term**: Implement pagination, consider database migration

### Problem: Logs Not Showing Recent Activity

**Symptoms**: System Logs page shows old data, missing recent entries

**Diagnosis**:
1. Check if Logs sheet exists in Google Sheet
2. Verify Apps Script has write permissions
3. Look for quota exceeded errors

**Resolution**:
1. Refresh the Logs page
2. Check Google Apps Script execution history
3. Verify Logs sheet headers match expected format
4. If quota exceeded, wait for quota reset (midnight PST)

### Problem: Insufficient Stock Error When Stock Exists

**Symptoms**: POS shows "Insufficient stock" but inventory shows available quantity

**Diagnosis**:
1. Check if multiple browser tabs are open
2. Verify inventory data in Google Sheet matches display
3. Look for pending transactions that haven't completed

**Resolution**:
1. Close all tabs and reopen app
2. Force refresh inventory (click refresh button)
3. Check Transactions tab for duplicate entries
4. Manually verify inventory count vs. sheet

---

## Backup & Recovery

### Backup Strategy

**Daily Automated** (via Google Sheets):
- Version history automatically saved
- Revert to any point in last 30 days

**Weekly Manual**:
1. File > Download > Microsoft Excel (.xlsx)
2. Save to secure location
3. Name format: `IMS_Backup_YYYY-MM-DD.xlsx`

**Monthly Full Backup**:
1. Export Google Sheet to Excel
2. Export code repository (Git)
3. Document system configuration
4. Store in multiple locations

### Recovery Procedures

**If Data Deleted Accidentally**:
1. Go to File > Version history > See version history
2. Find version before deletion
3. Click "Restore this version"
4. Verify data restored correctly

**If Google Apps Script Corrupted**:
1. Open Apps Script editor
2. File > Version history
3. Restore previous working version
4. Redeploy web app

**If Vercel Deployment Fails**:
1. Check deployment logs in Vercel dashboard
2. Review recent Git commits for breaking changes
3. Rollback to previous deployment
4. Fix issues and redeploy

---

## Scaling Recommendations

### When You Have < 100 Items
- Current system is perfect
- No changes needed
- Focus on process optimization

### When You Reach 100-500 Items
- Implement pagination throughout (already built in for inventory)
- Add search/filter to all pages
- Consider archiving old transactions (>6 months)
- Monitor API response times

### When You Reach 500-1,000 Items
- **Critical**: Start planning database migration
- Google Sheets will become noticeably slower
- Consider upgrading to Supabase or PostgreSQL
- Implement proper caching layer (Redis)

### When You Reach 1,000+ Items
- **Required**: Migrate to proper database
- Google Sheets not recommended at this scale
- Add full-text search (Algolia or similar)
- Implement websockets for real-time updates
- Consider microservices architecture

---

## Security Best Practices

### Access Control
- Share Google Sheet with minimum necessary people
- Use "View only" for non-admin staff
- Regularly audit who has access
- Remove access for former employees immediately

### API Security
- **Never** commit `.env.local` to Git
- Rotate API URL if leaked (redeploy Apps Script)
- Use Vercel environment variables for secrets
- Monitor Apps Script execution logs for suspicious activity

### Data Privacy
- Follow local data protection laws
- Don't store customer personal information
- Anonymize logs if needed
- Implement data retention policy

---

## Performance Optimization

### Frontend Optimization
- Images are optimized by Next.js automatically
- Use lazy loading for large lists
- Implement virtual scrolling for 1000+ items
- Cache API responses using SWR (already implemented)

### Backend Optimization
- Limit log retention to 3-6 months
- Archive old transactions quarterly
- Use sheet filtering instead of loading all data
- Implement caching headers in API responses

### Database Optimization (Google Sheets)
- Keep each sheet under 10,000 rows
- Don't use complex formulas in data rows
- Use separate sheet for calculations/dashboards
- Regularly clean up deleted items

---

## Incident Response Plan

### Severity Levels

**P0 - Critical** (System Down)
- POS cannot process sales
- API completely unavailable
- Data loss occurred

**P1 - High** (Major Functionality Broken)
- Inventory not updating
- Sales recording but not deducting stock
- Logs showing repeated errors

**P2 - Medium** (Degraded Performance)
- Slow response times (>5 seconds)
- Some features not working
- Warning logs accumulating

**P3 - Low** (Minor Issues)
- UI glitches
- Non-critical feature broken
- Cosmetic issues

### Response Procedures

**For P0 Critical Issues**:
1. **Immediate**: Switch to manual backup process (paper records)
2. Check Vercel deployment status
3. Check Google Apps Script execution logs
4. Verify environment variables
5. Contact support if needed
6. Document incident timeline
7. Post-incident review within 24 hours

**For P1 High Issues**:
1. Verify issue in System Logs
2. Check recent deployments (rollback if needed)
3. Review Google Apps Script quotas
4. Implement temporary workaround
5. Fix root cause within 4 hours
6. Document and communicate to team

**For P2/P3 Lower Priority**:
1. Create issue in tracking system
2. Schedule fix in next maintenance window
3. Implement workaround if available
4. Update documentation

---

## Training Materials

### For Cashiers (POS Users)
- How to process a sale
- What to do if item not found
- Handling insufficient stock errors
- End of shift procedures

### For Inventory Managers
- Adding new items
- Adjusting quantities
- Creating restock orders
- Receiving orders
- Understanding low stock alerts

### For Administrators
- System architecture overview
- Accessing Google Sheet directly
- Reading system logs
- Troubleshooting common issues
- Backup and recovery procedures

---

## Contact & Support

### Internal Escalation
1. **First**: Check documentation
2. **Second**: Review System Logs
3. **Third**: Check Google Apps Script execution logs
4. **Last**: Contact system administrator

### External Resources
- Next.js Documentation: https://nextjs.org/docs
- Google Apps Script Reference: https://developers.google.com/apps-script
- Vercel Support: https://vercel.com/help

---

This guide should be reviewed and updated quarterly to reflect system changes and lessons learned.
