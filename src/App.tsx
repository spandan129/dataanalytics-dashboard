import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { DeviceStats } from './pages/UserBehavior';
import Login from './pages/Login';
import ProtectedLayout from './components/ProtectedLayout';
import Register from './pages/Register';
import ContentDashboard from './pages/contentMetrics';
import SessionTrackerDocumentation from './pages/sessionTrackerDocumentation';
import UserSessionsDashboard from './pages/UserJourney';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-behavior" element={<DeviceStats />} />
          <Route path="/content-metrics" element={<ContentDashboard />} />
          <Route path="/documentation" element={<SessionTrackerDocumentation />} />
          <Route path="/user-journey" element={<UserSessionsDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
