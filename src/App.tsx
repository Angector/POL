import { Routes, Route, Link } from 'react-router-dom';
import Health from './routes/Health';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-command-bg flex flex-col items-center justify-center">
            <h1 className="font-[family-name:var(--font-serif-epic)] text-command-amber text-5xl md:text-7xl font-bold tracking-wider">
              قلعه‌ی ذهن
            </h1>
            <p className="mt-6 text-command-muted text-sm font-[family-name:var(--font-mono-hud)]">
              زیرساخت آماده است — فاز ۰
            </p>
            <Link
              to="/health"
              className="mt-8 px-4 py-2 border border-command-border text-command-text text-sm hover:border-command-amber hover:text-command-amber transition-colors duration-300"
            >
              بررسی سلامت سیستم
            </Link>
          </div>
        }
      />
      <Route path="/health" element={<Health />} />
    </Routes>
  );
}

export default App;
