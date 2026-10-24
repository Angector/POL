import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/layout/ToastHost';
import { CinematicProvider } from './components/battle/CinematicToast';
import { SoundProvider } from './context/SoundContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/errors/ErrorBoundary';
import { NotFound } from './components/ui/NotFound';

// Lazy load heavy pages
const Register = lazy(() => import('./routes/Register'));
const Login = lazy(() => import('./routes/Login'));
const Oath = lazy(() => import('./routes/Oath'));
const Dashboard = lazy(() => import('./routes/Dashboard'));
const ProfilePage = lazy(() => import('./routes/ProfilePage'));
const TerritoryPage = lazy(() => import('./routes/TerritoryPage'));
const TodoPage = lazy(() => import('./routes/TodoPage'));
const GoalsPage = lazy(() => import('./routes/GoalsPage'));
const WorldMapPage = lazy(() => import('./routes/WorldMapPage'));
const LettersPage = lazy(() => import('./routes/LettersPage'));
const AlliancesPage = lazy(() => import('./routes/AlliancesPage'));
const GeneralsHall = lazy(() => import('./routes/GeneralsHall'));
const RelicsPage = lazy(() => import('./routes/RelicsPage'));
const SkillsPage = lazy(() => import('./routes/SkillsPage'));
const CouncilPage = lazy(() => import('./routes/CouncilPage'));
const OraclePage = lazy(() => import('./routes/OraclePage'));
const MirrorPage = lazy(() => import('./routes/MirrorPage'));
const Health = lazy(() => import('./routes/Health'));

// Loading fallback
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-command-bg flex items-center justify-center">
      <div className="text-command-amber text-lg font-[family-name:var(--font-mono-hud)]">
        در حال بارگذاری...
      </div>
    </div>
  );
}

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
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/register" element={<Suspense fallback={<LoadingScreen />}><Register /></Suspense>} />
      <Route path="/login" element={<Suspense fallback={<LoadingScreen />}><Login /></Suspense>} />
      <Route path="/health" element={<Suspense fallback={<LoadingScreen />}><Health /></Suspense>} />

      {/* Oath route - protected but no shell */}
      <Route
        path="/oath"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingScreen />}>
              <Oath />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Protected routes with AppShell */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Suspense fallback={<LoadingScreen />}><Dashboard /></Suspense>} />
        <Route path="/profile" element={<Suspense fallback={<LoadingScreen />}><ProfilePage /></Suspense>} />
        <Route path="/territory" element={<Suspense fallback={<LoadingScreen />}><TerritoryPage /></Suspense>} />
        <Route path="/todo" element={<Suspense fallback={<LoadingScreen />}><TodoPage /></Suspense>} />
        <Route path="/goals" element={<Suspense fallback={<LoadingScreen />}><GoalsPage /></Suspense>} />
        <Route path="/world" element={<Suspense fallback={<LoadingScreen />}><WorldMapPage /></Suspense>} />
        <Route path="/letters" element={<Suspense fallback={<LoadingScreen />}><LettersPage /></Suspense>} />
        <Route path="/alliances" element={<Suspense fallback={<LoadingScreen />}><AlliancesPage /></Suspense>} />
        <Route path="/patterns" element={<Navigate to="/mirror" replace />} />
        <Route path="/generals" element={<Suspense fallback={<LoadingScreen />}><GeneralsHall /></Suspense>} />
        <Route path="/relics" element={<Suspense fallback={<LoadingScreen />}><RelicsPage /></Suspense>} />
        <Route path="/skills" element={<Suspense fallback={<LoadingScreen />}><SkillsPage /></Suspense>} />
        <Route path="/council" element={<Suspense fallback={<LoadingScreen />}><CouncilPage /></Suspense>} />
        <Route path="/oracle" element={<Suspense fallback={<LoadingScreen />}><OraclePage /></Suspense>} />
        <Route path="/mirror" element={<Suspense fallback={<LoadingScreen />}><MirrorPage /></Suspense>} />
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
    <ErrorBoundary>
      <SoundProvider>
        <ToastProvider>
          <AuthProvider>
            <CinematicProvider>
              <AppRoutes />
            </CinematicProvider>
          </AuthProvider>
        </ToastProvider>
      </SoundProvider>
    </ErrorBoundary>
  );
}

export default App;
