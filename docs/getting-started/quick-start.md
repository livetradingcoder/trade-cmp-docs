# Quick Start

Get LiveTradingLeague up and running in minutes with this quick start guide.

## Prerequisites

Make sure you've completed the [Installation](/getting-started/installation) guide first.

## Starting the Application

### Development Mode

Start both the backend and frontend in development mode:

```bash
npm run dev
```

This command uses Turborepo to run both packages concurrently:
- Backend API: http://localhost:3001
- Frontend: http://localhost:5173

### Individual Packages

You can also run packages individually:

```bash
# Backend only
cd packages/server
npm run dev

# Frontend only
cd packages/web
npm run dev
```

## First Login

1. Navigate to http://localhost:5173
2. Click **"Admin Login"** in the navigation
3. Use the default credentials:
   - Username: `admin`
   - Password: `admin123`

**Security Note**: Change these credentials immediately after first login!

## Creating Your First Tournament

### Step 1: Access Admin Dashboard

After logging in, you'll see the admin dashboard with:
- Tournament list
- Participant management
- Settings

### Step 2: Create a Tournament

1. Click the **"Create Tournament"** button
2. Fill in the tournament details:
   - **Title**: e.g., "Weekly Trading Challenge"
   - **Tier**: Weekly, Monthly, or Quarterly
   - **Prize**: e.g., "$1,000 Cash Prize"
   - **Entry Fee**: e.g., "Free" or "$50"
   - **Participants**: Maximum number of participants
   - **Registration Link**: URL for registration
   - **Start/End Dates**: Competition timeline

3. Upload tournament images (optional):
   - **Cover Image**: Banner for the tournament card
   - **Detail Image**: Image for the tournament detail page

4. Click **"Create Tournament"**

### Step 3: Publish the Tournament

1. Find your tournament in the list
2. Click **"Edit"**
3. Change **Status** from "Draft" to "Active"
4. Click **"Save Changes"**

Your tournament is now live and visible to users!

## Managing Participants

### Viewing Applications

1. Go to **"Participants"** in the sidebar
2. Select a tournament from the dropdown
3. View all applications with their status:
   - **Pending**: Awaiting review
   - **Approved**: Accepted into competition
   - **Declined**: Application rejected
   - **Disqualified**: Removed from competition

### Reviewing Applications

For each pending application:

1. Click **"View Details"** to see:
   - User email
   - FP Markets account number
   - Referral code status
   - Application date

2. Take action:
   - **Approve**: Accept the participant
   - **Decline**: Reject with a reason
   - **Add Notes**: Internal notes for reference

### Approving Participants

1. Click **"Approve"** on a pending application
2. Confirm the action
3. The participant receives an approval email automatically
4. Their status changes to "Approved"

### Declining Participants

1. Click **"Decline"** on a pending application
2. Enter a reason (e.g., "Account not verified")
3. Confirm the action
4. The participant receives a decline email with the reason

## Configuring Email Settings

### SMTP Configuration

1. Go to **"Settings"** in the sidebar
2. Scroll to **"Email (SMTP) Configuration"**
3. Enter your SMTP details:
   - **Host**: e.g., `smtp.gmail.com`
   - **Port**: e.g., `587`
   - **Username**: Your email address
   - **Password**: Your email password or app password
   - **From Address**: Sender email address
   - **Use TLS/SSL**: Check if using secure connection

4. Click **"Send Test Email"** to verify configuration
5. Click **"Save SMTP Settings"**

### Gmail Setup

For Gmail:
1. Enable 2-factor authentication
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the app password in SMTP settings

## Testing the User Flow

### As a User

1. Open a new incognito/private browser window
2. Navigate to http://localhost:5173
3. Browse available tournaments
4. Click **"Apply Now"** on a tournament
5. Fill in the application form:
   - Email address
   - FP Markets account number
   - Referral code (if applicable)
6. Submit the application

### As an Admin

1. Return to the admin dashboard
2. Go to **"Participants"**
3. You should see the new application as "Pending"
4. Review and approve/decline the application

## Viewing the Leaderboard

1. In the admin dashboard, click **"Manage"** on a tournament
2. View the **"Leaderboard"** tab
3. See participant rankings with:
   - Rank
   - Trader name
   - ROI (Return on Investment)
   - P&L (Profit & Loss)
   - Number of trades
   - Win rate

**Note**: The current version uses mock data. Real broker integration will populate actual trading data.

## Changing Your Password

1. Click your username in the top right
2. Select **"Change Password"**
3. Enter:
   - Current password
   - New password
   - Confirm new password
4. Click **"Change Password"**

## Common Tasks

### Editing a Tournament

1. Find the tournament in the list
2. Click **"Edit"**
3. Modify any fields
4. Click **"Save Changes"**

### Deleting a Tournament

1. Find the tournament in the list
2. Click **"Delete"**
3. Confirm the deletion

**Warning**: This action cannot be undone!

### Disqualifying a Participant

1. Go to **"Participants"**
2. Find an approved participant
3. Click **"Disqualify"**
4. Enter a reason
5. Confirm the action

The participant receives a disqualification email.

### Updating Affiliate Code

1. Go to **"Settings"**
2. Update the **"Affiliate Code"** field
3. Click **"Save Settings"**

This code is displayed to new users during registration.

## Next Steps

Now that you're familiar with the basics:

- [Development Guide](/getting-started/development) - Learn about the development workflow
- [Architecture Overview](/guide/architecture) - Understand the system design
- [API Reference](/api/overview) - Explore the backend API
- [Deployment Guide](/deployment/production) - Deploy to production

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](/getting-started/installation#troubleshooting) section
2. Review the [Testing Guide](/getting-started/testing)
3. [Open an issue](https://github.com/livetradingcoder/trade-cmp/issues) on GitHub
4. Email support: livetradingcoderlive-trading-league@proton.me
