# AyurSutra - Smart Online Appointment Booking System

A comprehensive Ayurvedic healthcare management system built with React.js and Node.js.

## Features

- **Patient Management**: Registration, profile management, appointment booking
- **Practitioner Dashboard**: Schedule management, patient records, treatment plans
- **Admin Panel**: User management, system analytics, revenue tracking
- **Authentication**: JWT-based auth with Google OAuth integration
- **Real-time Notifications**: Appointment reminders and updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT, Passport.js, Google OAuth
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Vercel-ready configuration

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/nishirajsingh/AyurSutra.git
   cd AyurSutra
   ```

2. **Install dependencies**
   ```bash
   npm run setup
   ```

3. **Start development servers**
   ```bash
   # Backend (Terminal 1)
   cd backend && npm start
   
   # Frontend (Terminal 2)
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Health Check: http://localhost:8000/health

## Environment Setup

Create `.env` files in root and backend directories with required variables (see `.env.example` files).

## Deployment

Ready for deployment on Vercel with included `vercel.json` configuration.

## License

MIT License - see LICENSE file for details.