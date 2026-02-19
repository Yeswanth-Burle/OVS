# Online Voting System (OVS)

A secure, role-based election platform built with the MERN stack.

## Features
- **User Roles**: Main Admin, Admin, Voter.
- **Security**: JWT Authentication, Role-based Access Control, Double Voting Prevention.
- **Voting**: Secure vote casting, real-time status updates.
- **Results**: Visual breakdown of election results.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Atlas or Local)

### 1. Backend Setup
1. Navigate to `Backend` folder:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file (if not exists) and configure:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Seed the database (creates default Admin):
   ```bash
   node seed.js
   ```
   *Default Admin Credentials:*
   - Email: `admin@ovs.com`
   - Password: `admin123`

5. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to `Frontend` folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open browser at `http://localhost:5173`.

## Usage
- **Register** as a Voter.
- **Login** as Main Admin (`admin@ovs.com`) to approve users or creating other admins.
- **Admin Dashboard**: Create elections, add candidates.
- **Voter Dashboard**: Vote in active elections.
