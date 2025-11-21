# Firebase Setup Guide for Delivery App Admin Panel

This guide will walk you through setting up Firebase Realtime Database and configuring your admin panel.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click on **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "DeliveryApp")
4. Click **"Continue"**
5. Choose whether to enable Google Analytics (optional)
6. Click **"Create project"**
7. Wait for the project to be created, then click **"Continue"**

## Step 2: Enable Realtime Database

1. In your Firebase project, click on **"Build"** in the left sidebar
2. Click on **"Realtime Database"**
3. Click **"Create Database"**
4. Select a location closest to your users (e.g., United States, Europe, Asia)
5. For security rules, start in **"Test mode"** (we'll update this later)
   - This allows read/write access for 30 days
6. Click **"Enable"**

## Step 3: Get Your Firebase Configuration

1. In the Firebase Console, click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>` to register a web app5. Enter an app nickname (e.g., "Admin Panel")
6. Click **"Register app"**
7. You'll see a `firebaseConfig` object with your credentials. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

## Step 4: Update Admin Panel Configuration

### For the Admin Panel (Web)

1. Open `admin-panel/admin-script.js`
2. Find the `firebaseConfig` object (around line 8-16)
3. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### For the React Native App

1. Open `src/config/firebaseConfig.js`
2. Replace the placeholder values with your actual Firebase configuration (same as above)

## Step 5: Open the Admin Panel

1. Navigate to the admin panel directory:
   ```bash
   cd admin-panel
   ```

2. Open `admin-panel.html` in your web browser
   - You can double-click the file, or
   - Right-click and select "Open with" → Your browser

3. You should see:
   - **"Connected"** status in green at the top right
   - Empty data grids (since you haven't added any data yet)

## Step 6: Add Your First Data

### Add a Category

1. Click on the **"Categories"** tab (should be active by default)
2. Click the **"+ Add Category"** button
3. Fill in the form:
   - **Name**: `Pizza`
   - **Icon**: `pizza-slice`
   - **Emoji**: `🍕`
4. Click **"Save"**
5. You should see the category appear in the grid!

### Add a Venue

1. Click on the **"Venues"** tab
2. Click the **"+ Add Venue"** button
3. Fill in the form:
   - **Name**: `Pizza Palace`
   - **Rating**: `4.5`
   - **Delivery Time**: `25-35 min`
   - **Price Range**: `$$`
   - **Image URL**: Use a placeholder or actual image URL (e.g., `https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80`)
   - **Categories**: Check the categories this venue belongs to
4. Click **"Save"**

### Add a Product

1. Click on the **"Products"** tab
2. Click the **"+ Add Product"** button
3. Fill in the form:
   - **Venue**: Select the venue you just created
   - **Name**: `Margherita Pizza`
   - **Description**: `Classic tomato, mozzarella, and basil`
   - **Price**: `12.99`
   - **Image URL**: Use a placeholder or actual image URL
4. Click **"Save"**

## Step 7: Test the React Native App

1. Make sure you've updated `src/config/firebaseConfig.js` with your Firebase credentials
2. Start your React Native app:
   ```bash
   npm start
   ```

3. The app should now load data from Firebase!
4. Try adding/editing/deleting data in the admin panel - changes should appear in the app in real-time!

## Step 8: Secure Your Database (Important!)

⚠️ **Test mode security rules expire after 30 days**

For production, update your Firebase Realtime Database rules:

1. Go to Firebase Console → Realtime Database → Rules
2. Replace the rules with:

```json
{
  "rules": {
    "deliveryApp": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

This allows anyone to read the data (for the app), but only authenticated users can write (for the admin panel).

For better security, you can set up Firebase Authentication and restrict write access to admin users only.

## Troubleshooting

### "Disconnected" Status in Admin Panel

- Check that your `firebaseConfig` is correctly set
- Verify the `databaseURL` includes your project ID
- Check browser console for errors

### Data Not Appearing in React Native App

- Ensure `src/config/firebaseConfig.js` has the correct configuration
- Check that Firebase is properly initialized
- Look for errors in the React Native console/terminal

### "Permission denied" Errors

- Check your Firebase Realtime Database security rules
- Ensure you're in test mode or have proper authentication set up

## Next Steps

- Add authentication to your admin panel for security
- Customize the admin panel design to match your brand
- Add more features like bulk upload, data export, etc.
- Set up proper database security rules

## Support

If you encounter issues:
1. Check the Firebase Console for errors
2. Review the browser console (F12) for JavaScript errors
3. Verify your internet connection
4. Make sure you're using a modern web browser

Enjoy managing your Delivery App data! 🚀
