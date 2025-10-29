import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/rns/HomePage";
import RegisterPage from "@/pages/rns/RegisterPage";
import MyNamesPage from "@/pages/rns/MyNamesPage";
import ProfilePage from "@/pages/rns/ProfilePage";
import AddressPage from "@/pages/rns/AddressPage";
import SuccessPage from "@/pages/rns/SuccessPage";

export function RNSPanel() {
  return (
    <div className="h-full w-full overflow-y-auto">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register/:name" element={<RegisterPage />} />
        <Route path="/my-domains" element={<MyNamesPage />} />
        <Route path="/:domain" element={<ProfilePage />} />
        <Route path="/address/:address" element={<AddressPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}