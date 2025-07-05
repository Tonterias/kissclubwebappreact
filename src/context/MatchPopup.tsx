import React, { createContext, useContext, useState } from 'react';

const MatchPopupContext = createContext<{
    showPopup: boolean;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const MatchPopupProvider = ({ children }: { children: React.ReactNode }) => {
    const [showPopup, setShowPopup] = useState(true);

    return (
        <MatchPopupContext.Provider value={{ showPopup, setShowPopup }}>
            {children}
        </MatchPopupContext.Provider>
    );
};

export const useMatchPopup = () => {
    const context = useContext(MatchPopupContext);
    if (!context) {
        throw new Error('useMatchPopup must be used within a MatchPopupProvider');
    }
    return context;
};
