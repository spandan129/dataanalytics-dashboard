import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface FeatureContextType {
  featureList: string[];
  setFeatureList: (features: string[]) => void;
}

// Create the context
const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

// Context provider component
export const FeatureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [featureList, setFeatureList] = useState<string[]>([]);

  return (
    <FeatureContext.Provider value={{ featureList, setFeatureList}}>
      {children}
    </FeatureContext.Provider>
  );
};

// Custom hook for consuming the context
export const useFeatureContext = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeatureContext must be used within a FeatureProvider');
  }
  return context;
};
