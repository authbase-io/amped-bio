import HomePage from "@/pages/rns/HomePage";
import RegisterPage from "@/pages/rns/RegisterPage";
import MyNamesPage from "@/pages/rns/MyNamesPage";
import ProfilePage from "@/pages/rns/ProfilePage";
import AddressPage from "@/pages/rns/AddressPage";
import SuccessPage from "@/pages/rns/SuccessPage";
import { useRNSNavigation } from "@/contexts/RNSNavigationContext";

export function RNSPanel() {
  const { currentView } = useRNSNavigation();

  const renderView = () => {
    switch (currentView.type) {
      case 'home':
        return <HomePage />;
      case 'register':
        return <RegisterPage name={currentView.name} />;
      case 'my-names':
        return <MyNamesPage />;
      case 'profile':
        return <ProfilePage name={currentView.name} activeTab="details" />;
      case 'profile-ownership':
        return <ProfilePage name={currentView.name} activeTab="ownership" />;
      case 'profile-more':
        return <ProfilePage name={currentView.name} activeTab="more" />;
      case 'address':
        return <AddressPage address={currentView.address} />;
      case 'success':
        return <SuccessPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-50">
      {renderView()}
    </div>
  );
}