import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the possible RNS views
export type RNSView =
  | { type: 'home' }
  | { type: 'profile'; name: string }
  | { type: 'profile-ownership'; name: string }
  | { type: 'profile-more'; name: string }
  | { type: 'register'; name: string }
  | { type: 'address'; address: string }
  | { type: 'success' }
  | { type: 'my-names' };

interface RNSNavigationContextType {
  currentView: RNSView;
  navigateToHome: () => void;
  navigateToProfile: (name: string) => void;
  navigateToProfileOwnership: (name: string) => void;
  navigateToProfileMore: (name: string) => void;
  navigateToRegister: (name: string) => void;
  navigateToAddress: (address: string) => void;
  navigateToSuccess: () => void;
  navigateToMyNames: () => void;
  goBack: () => void;
  history: RNSView[];
}

const RNSNavigationContext = createContext<RNSNavigationContextType | undefined>(undefined);

export const RNSNavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<RNSView>({ type: 'home' });
  const [history, setHistory] = useState<RNSView[]>([{ type: 'home' }]);

  const navigate = (view: RNSView) => {
    setCurrentView(view);
    setHistory(prev => [...prev, view]);
  };

  const navigateToHome = () => navigate({ type: 'home' });
  const navigateToProfile = (name: string) => navigate({ type: 'profile', name });
  const navigateToProfileOwnership = (name: string) => navigate({ type: 'profile-ownership', name });
  const navigateToProfileMore = (name: string) => navigate({ type: 'profile-more', name });
  const navigateToRegister = (name: string) => navigate({ type: 'register', name });
  const navigateToAddress = (address: string) => navigate({ type: 'address', address });
  const navigateToSuccess = () => navigate({ type: 'success' });
  const navigateToMyNames = () => navigate({ type: 'my-names' });

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const previousView = newHistory[newHistory.length - 1];
      setCurrentView(previousView);
      setHistory(newHistory);
    }
  };

  return (
    <RNSNavigationContext.Provider
      value={{
        currentView,
        navigateToHome,
        navigateToProfile,
        navigateToProfileOwnership,
        navigateToProfileMore,
        navigateToRegister,
        navigateToAddress,
        navigateToSuccess,
        navigateToMyNames,
        goBack,
        history
      }}
    >
      {children}
    </RNSNavigationContext.Provider>
  );
};

export const useRNSNavigation = () => {
  const context = useContext(RNSNavigationContext);
  if (context === undefined) {
    // Return no-op functions when context is not available
    return {
      currentView: { type: 'home' as const },
      navigateToHome: () => {},
      navigateToProfile: (name: string) => {},
      navigateToProfileOwnership: (name: string) => {},
      navigateToProfileMore: (name: string) => {},
      navigateToRegister: (name: string) => {},
      navigateToAddress: (address: string) => {},
      navigateToSuccess: () => {},
      navigateToMyNames: () => {},
      goBack: () => {},
      history: []
    };
  }
  return context;
};