import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/layout/ToastHost';
import { CinematicProvider } from './components/battle/CinematicToast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { NotFound } from './components/ui/NotFound';
import Register from './routes/Register';
import Login from './routes/Login';
import Oath from './routes/Oath';
import Dashboard from './routes/Dashboard';
import ProfilePage from './routes/ProfilePage';
import TerritoryPage from './routes/TerritoryPage';
import TodoPage from './routes/TodoPage';
import GoalsPage from './routes/GoalsPage';
import WorldMapPage from './routes/WorldMapPage';
import LettersPage from './routes/LettersPage';
import AlliancesPage from './routes/AlliancesPage';
import RelicsPage from './routes/RelicsPage';
import SkillsPage from './routes/SkillsPage';
import CouncilPage from './routes/CouncilPage';
import OraclePage from './routes/OraclePage';
import MirrorPage from './routes/MirrorPage';
import GeneralsHall from './routes/GeneralsHall';
import Health from './routes/Health';

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <AppShell>
        <Outlet />
      </AppShell>
    </ProtectedRoute>
  );
}

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

      {/* Oath route - protected but no shell */}
      <Route
        path="/oath"
        element={
          <ProtectedRoute>
            <Oath />
          </ProtectedRoute>
        }
      />

      {/* Protected routes with AppShell */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/territory" element={<TerritoryPage />} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/world" element={<WorldMapPage />} />
        <Route path="/letters" element={<LettersPage />} />
        <Route path="/alliances" element={<AlliancesPage />} />
        <Route path="/patterns" element={<Navigate to="/mirror" replace />} />
        <Route path="/generals" element={<GeneralsHall />} />
        <Route path="/relics" element={<RelicsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/council" element={<CouncilPage />} />
        <Route path="/oracle" element={<OraclePage />} />
        <Route path="/mirror" element={<MirrorPage />} />
      </Route>

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

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CinematicProvider>
          <AppRoutes />
        </CinematicProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
