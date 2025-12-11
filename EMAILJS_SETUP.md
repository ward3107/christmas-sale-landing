# EmailJS Setup Guide

This project uses **EmailJS** for sending email notifications when users submit the contact form. EmailJS is **100% FREE** for up to 200 emails per month with no credit card required!

## Why EmailJS?

- ✅ Completely free (200 emails/month)
- ✅ No credit card required
- ✅ Easy setup (5-10 minutes)
- ✅ No backend code needed
- ✅ Works with Gmail, Outlook, and other email providers

## Setup Instructions

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Add Email Service

1. In the EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup wizard:
   - For **Gmail**: You'll need to enable 2-factor authentication and create an App Password
   - For **Outlook**: Just authorize your account
5. Click **Create Service**
6. **Copy your Service ID** (you'll need this later)

### Step 3: Create Email Template

1. In the EmailJS dashboard, go to **Email Templates**
2. Click **Create New Template**
3. Configure your template:
   - **Template Name**: "New Lead Notification" (or any name you prefer)
   - **Subject**: `פנייה חדשה מ-{{from_name}}`
   - **Content**: Use this example template:

```
שלום,

התקבלה פנייה חדשה מהאתר:

שם: {{from_name}}
אימייל: {{from_email}}
טלפון: {{from_phone}}

הודעה:
{{message}}

---
נשלח מאתר החברה
```

4. Make sure to use these exact variable names (they must match exactly):
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{from_phone}}`
   - `{{message}}`

5. Click **Save**
6. **Copy your Template ID** (you'll need this later)

### Step 4: Get Your Public Key

1. In the EmailJS dashboard, go to **Account** (top right)
2. Find the **API Keys** section
3. **Copy your Public Key** (not the Private Key!)

### Step 5: Configure Environment Variables

1. Open `.env.local` in your project (or create it if it doesn't exist)
2. Add your EmailJS credentials:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id-here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-template-id-here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-public-key-here
```

3. Replace `your-service-id-here`, `your-template-id-here`, and `your-public-key-here` with the values you copied

### Step 6: Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Fill out the contact form on your website
3. Submit the form
4. Check your email inbox - you should receive the notification!

## Troubleshooting

### Emails Not Being Sent?

1. **Check the browser console** for any error messages
2. **Verify your environment variables** are set correctly in `.env.local`
3. **Make sure you restarted** your development server after adding the variables
4. **Check your EmailJS dashboard** for any blocked or failed emails
5. **Verify your email service** is properly connected in EmailJS

### Common Issues

**Issue**: "EmailJS not configured" warning in console
- **Solution**: Make sure all three environment variables are set in `.env.local`

**Issue**: Emails go to spam
- **Solution**: This is normal for automated emails. Add your EmailJS email to your contacts or whitelist

**Issue**: Template variables not working
- **Solution**: Make sure you're using the exact variable names: `{{from_name}}`, `{{from_email}}`, `{{from_phone}}`, `{{message}}`

## Email Template Customization

You can customize the email template in the EmailJS dashboard. Here are some tips:

### Hebrew Template Example
```
שלום,

קיבלתם פנייה חדשה מהאתר שלכם!

פרטי הפונה:
- שם: {{from_name}}
- דוא"ל: {{from_email}}
- טלפון: {{from_phone}}

תוכן ההודעה:
{{message}}

---
אימייל זה נשלח אוטומטית מטופס יצירת הקשר באתר שלכם.
```

### Email Reply-To

To allow easy replies, add `{{from_email}}` to the **Reply-To** field in your template settings.

## Need Help?

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)
- Video Tutorial: [https://www.youtube.com/watch?v=dgcYOm8n8ME](https://www.youtube.com/watch?v=dgcYOm8n8ME)

## Next Steps

Once you've set up EmailJS:
1. Test the form thoroughly
2. Monitor your EmailJS dashboard for usage statistics
3. Set up email filters to organize lead notifications
4. Consider upgrading to a paid plan if you need more than 200 emails/month
