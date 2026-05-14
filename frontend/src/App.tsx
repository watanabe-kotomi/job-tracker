import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { isAuthenticated } from './lib/auth';
import LoginPage from './pages/LoginPage';
import JobApplicationsPage from './pages/JobApplicationsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/job-applications"
          element={
            <PrivateRoute>
              <JobApplicationsPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/job-applications" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
