# AdvenTour - Your AI-Powered Group Travel Planner

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [File Structure](#file-structure)
- [API Integrations](#api-integrations)
- [Testing the App](#testing-the-app)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

---

## Introduction
**AdvenTour** is an AI-powered travel planning application that simplifies group travel decision-making. By leveraging AI and user-friendly interactions, AdvenTour allows users to discover personalized travel recommendations, match itineraries with friends, and plan seamless trips—all with a swipe.

## Features
- **AI-Powered Suggestions** - Get 7 travel recommendations based on budget, preferences, and trip details.
- **Swipe-Based Matching** - Easily accept or reject suggested destinations.
- **Perfect Trip Match** - AI consolidates group preferences to find the best overall travel destination.
- **User Authentication** - Secure sign-in and user data management with Firebase.
- **Trip Management** - Create, edit, and track planned trips.
- **Social Integration** - Invite friends via WhatsApp, Telegram, and other platforms.
- **Dynamic UI** - Mobile-friendly design with intuitive swiping and responsive elements.

## Tech Stack
- **Frontend:** React.js, React Router
- **Backend:** Firebase (Authentication, Firestore Database)
- **APIs:** OpenRouter (LLM for AI trip suggestions), Pexels (image retrieval)
- **Styling:** CSS, Tailwind CSS

## Installation

### Prerequisites
- Node.js (>=14.0)
- npm or yarn
- Firebase project setup with necessary credentials

### Steps
1. **Clone the Repository**:
   ```sh
   git clone https://github.com/your-repo/adventour.git
   cd adventour
   ```
2. **Install Dependencies**:
   ```sh
   npm install  
   ```
3. **Set Up Environment Variables**:
   Create a `.env` file and add the following:

## Environment Variables
To successfully set up the application, ensure you include the following environment variables in your `.env` file:

### Firebase Configuration (Required for authentication and database storage)
```sh
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```
- These keys are required to connect your application to Firebase authentication and Firestore database.
- You can find them in your Firebase project settings under **General > Your apps > SDK setup and configuration**.

### OpenRouter API Key (Required for AI-powered trip recommendations)
```sh
REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key
```
- This API key is used to call OpenRouter's LLM to generate personalized travel recommendations.

### Pexels API Key (Required for fetching destination images)
```sh
REACT_APP_PEXELS_API_KEY=your_pexels_api_key
```
- This API key enables fetching high-quality travel images to enhance user experience.
- You can obtain a free API key by signing up at [Pexels Developer](https://www.pexels.com/api/).

### Cloudinary Configuration (Required for image uploads)
```sh
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```
- Cloudinary is used for storing and managing user-uploaded images.
- You can get these values by setting up an account at [Cloudinary](https://cloudinary.com/).

4. **Start the Application**:
   ```sh
   npm start
   ```

## Usage
- **Sign Up/Login** using Firebase authentication.
- **Create a Trip** with budget, dates, and preferences.
- **Swipe Through Suggestions** to refine group choices.
- **Generate Perfect Match** with AI-based analysis.
- **Share & Collaborate** with friends for seamless planning.

## File Structure
```
.
├── src
│   ├── api
│   │   └── tripApi.js         # Handles API calls for trip suggestions
│   ├── assets                 # Icons, images, and styles
│   ├── components             # Reusable UI components
│   ├── context                # Context providers for state management
│   ├── firebase               # Firebase authentication and database handlers
│   ├── pages                  # Different pages for navigation
│   ├── utils                  # Utility functions
│   ├── App.js                 # Main React app entry
│   ├── index.js               # App initialization
│   └── styles                 # CSS stylesheets
```

## API Integrations
### **1. OpenRouter (AI-Powered Travel Suggestions)**
- Fetches AI-generated trip recommendations based on user preferences and budget.
- Uses GPT-based models to provide travel insights.

### **2. Firebase (Authentication & Database)**
- Manages user authentication and trip data.
- Stores swipes and preferences securely.

### **3. Pexels (Image Retrieval)**
- Provides high-quality images for suggested travel destinations.

## Testing the App
You can test the application without setting it up locally by using the live deployment:

🔗 **[AdvenTour Live App](https://adventour-3bde6.web.app/)**

### **Login Credentials (Existing Users)**
Use any of the following accounts to log in:

- **Email:** jannik@mail.com
- **Email:** smilla@mail.com
- **Email:** franzi@mail.com
- **Email:** phi-linh@mail.com

**Password for all accounts:** `default`

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## Team
Developed by:
- **Smilla Gockner** - Frontend Development
- **Franziska Oberländer** - User Research
- **Jannik Graf** - UI/UX Design
- **Phi Linh Phan** - Backend & LLM Integration

## License
This project is licensed under the MIT License. See `LICENSE` for details.

---
Enjoy your perfect trip with **AdvenTour!** 🚀🌍

