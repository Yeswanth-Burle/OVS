import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import MainAdminPanel from './pages/MainAdminPanel';
import ElectionDetails from './pages/ElectionDetails';
import Results from './pages/Results';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            {/* Voter Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['voter', 'admin', 'main_admin']}>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Voting Routes */}
            <Route path="/election/:id" element={
              <ProtectedRoute allowedRoles={['voter']}>
                <ElectionDetails />
              </ProtectedRoute>
            } />

            {/* Results Routes - Public/Private depending on election status (handled in component) */}
            <Route path="/results/:id" element={
              <ProtectedRoute allowedRoles={['voter', 'admin', 'main_admin']}>
                <Results />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin', 'main_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Main Admin Routes */}
            <Route path="/main-admin" element={
              <ProtectedRoute allowedRoles={['main_admin']}>
                <MainAdminPanel />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
