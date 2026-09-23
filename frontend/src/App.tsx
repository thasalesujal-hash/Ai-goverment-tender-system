import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FindTenders from "./pages/FindTenders";
import TenderDetails from "./pages/TenderDetails";
import Eligibility from "./pages/Eligibility";
import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";
import Recommended from "./pages/Recommended";
import Recommendations from "./pages/Recommendations";
import SavedTenders from "./pages/SavedTenders";
import Compare from "./pages/Compare";
import Copilot from "./pages/Copilot";
import Company from "./pages/Company";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes - Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tenders" 
            element={
              <ProtectedRoute>
                <FindTenders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tenders/:id" 
            element={
              <ProtectedRoute>
                <TenderDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tenders/:id/eligibility" 
            element={
              <ProtectedRoute>
                <Eligibility />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tenders/:id/chat" 
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/copilot" 
            element={
              <ProtectedRoute>
                <Copilot />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recommended" 
            element={
              <ProtectedRoute>
                <Recommended />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recommendations" 
            element={
              <ProtectedRoute>
                <Recommendations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/saved" 
            element={
              <ProtectedRoute>
                <SavedTenders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/compare" 
            element={
              <ProtectedRoute>
                <Compare />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company" 
            element={
              <ProtectedRoute>
                <Company />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect root to login if not authenticated (handled by ProtectedRoute on dashboard) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
