import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Register from './routes/Register';
import Login from './routes/Login';
import Oath from './routes/Oath';
import Dashboard from './routes/Dashboard';
import Health from './routes/Health';

function AppRoutes() {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-command-bg flex items-center justify-center">
        <div className="text-command-amber text-lg font-[family-name:var(--font-mono-hud)]">
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/health" element={<Health />} />

      {/* Protected routes */}
      <Route
        path="/oath"
        element={
          <ProtectedRoute>
            <Oath />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          !session ? (
            <Navigate to="/login" replace />
          ) : profile?.oath_signed_at ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/oath" replace />
          )
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
