import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tenders" element={<FindTenders />} />
        <Route path="/tenders/:id" element={<TenderDetails />} />
        <Route path="/tenders/:id/eligibility" element={<Eligibility />} />
        <Route path="/tenders/:id/chat" element={<Chat />} />
        <Route path="/chat" element={<ChatList />} />
        <Route path="/copilot" element={<Copilot />} />
        <Route path="/recommended" element={<Recommended />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/saved" element={<SavedTenders />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/company" element={<Company />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
