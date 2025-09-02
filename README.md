# AyurSutra - Panchakarma Patient Management & Therapy Scheduling Software

A modern React frontend for Ayurvedic practice management with automated scheduling, patient tracking, and therapy management.

## Features

- **Landing Page**: Hero section with project pitch and feature highlights
- **Patient Dashboard**: Session booking, progress tracking, notifications
- **Practitioner Dashboard**: Calendar management, patient list, practice insights
- **Booking System**: Intelligent slot allocation with therapy selection
- **Feedback System**: Star ratings and symptom tracking

## Tech Stack

- React 18 with functional components and hooks
- Tailwind CSS for styling with Ayurveda-inspired design
- React Router for navigation
- Chart.js ready for data visualization
- Responsive design with mobile-first approach

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view in browser

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── patient/         # Patient-specific components
│   └── practitioner/    # Practitioner-specific components
├── pages/               # Main page components
├── constants.js         # App constants and dummy data
├── index.css           # Tailwind CSS imports
└── App.js              # Main app component
```

## Design System

- **Colors**: Green and earthy tones inspired by Ayurveda
- **Typography**: Inter font family
- **Components**: Rounded corners, soft shadows, clean layouts
- **Responsive**: Mobile-first design with Tailwind utilities

## Available Routes

- `/` - Landing page
- `/patient` - Patient dashboard
- `/practitioner` - Practitioner dashboard
- `/booking` - Therapy booking form
- `/feedback` - Session feedback form