import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/Dashboard';
import DashboardContent from './components/dashboard/DashboardContent';
import PoliceReport from './components/reports/non-rev/PoliceReport';
import RoomsReport from './components/reports/non-rev/RoomsReport';
import CheckinOutReport from './components/reports/non-rev/CheckInOutReport';
import BlockMaster from './components/dashboard/master/BlockMaster';
import CleanRoom from './components/dashboard/master/CleanRoom';
import CheckinInfo from './components/dashboard/master/CheckinInfo';
import MaintenanceRoom from './components/dashboard/master/MaintenanceRoom';
import FloorMaster from './components/dashboard/master/FloorMaster';
import RoomTypeMaster from './components/dashboard/master/RoomTypeMaster';
import RoomMaster from './components/dashboard/master/RoomMaster';
import CheckInRoom from './components/dashboard/master/CheckInRoom';
import CheckoutRoom from './components/dashboard/master/CheckoutRoom';
import InvoicesPage from './components/dashboard/master/invoice/InvoicesPage';
import BlockRoom from './components/dashboard/master/BlockRoom';
import UnblockRoom from './components/dashboard/master/UnblockRoom';
import CheckinList from './components/dashboard/master/CheckinList';
import Settings from './components/dashboard/SettingsContent';
import Profile from './components/dashboard/UsersContent';
import Property from './components/dashboard/PropertyContent';
import Protected from './components/dashboard/UsersContent';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Nested route component for dashboard
const DashboardRoutes = ({ mode, setMode, primaryColor, setPrimaryColor }) => {
  return (
    <DashboardLayout 
      currentMode={mode}
      onModeChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
      onColorChange={setPrimaryColor}
    >
      <Outlet />
    </DashboardLayout>
  );
};

function App() {
  const [mode, setMode] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#1976d2'); // Default primary color

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: primaryColor,
            light: '#4791db',
            dark: '#115293',
            contrastText: '#fff',
          },
          secondary: {
            main: '#dc004e',
            light: '#ff5c8d',
            dark: '#9a0036',
            contrastText: '#fff',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
            secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          },
        },
        // ... rest of your theme config
      }),
    [mode, primaryColor]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              {/* Dashboard nested routes */}
              <Route 
                path="/dashboard" 
                element={
                  <DashboardRoutes 
                    mode={mode}
                    setMode={setMode}
                    primaryColor={primaryColor}
                    setPrimaryColor={setPrimaryColor}
                  />
                }
              >
                <Route index element={<DashboardContent />} />
                {/* Room Management */}
                <Route path="block-master" element={<BlockMaster />} />
                <Route path="clean-room" element={<CleanRoom />} />
                <Route path="maintenance-room" element={<MaintenanceRoom />} />
                <Route path="checkin-info" element={<CheckinInfo />} />
                <Route path="floor-master" element={<FloorMaster />} />
                <Route path="room-type-master" element={<RoomTypeMaster />} />
                <Route path="room-master" element={<RoomMaster />} />
                <Route path="check-in-room" element={<CheckInRoom />} />
                <Route path="checkout-room/:checkinId/:roomId" element={<CheckoutRoom />} />
                <Route path="block-room" element={<BlockRoom />} />
                <Route path="unblock-room" element={<UnblockRoom />} />
                <Route path="checkin-list" element={<CheckinList />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="police-report" element={<PoliceReport />} />
                <Route path="rooms-report" element={<RoomsReport />} />
                <Route path="checkinoout-report" element={<CheckinOutReport />} />
                <Route path="invoices/:invoice_number" element={<InvoicesPage />} />

                {/* System */}
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="property" element={<Property />} />
              </Route>
              
              <Route path="/protected" element={<Protected />} />
            </Route>
            
            {/* Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;