import React, { createContext, useContext, useState } from 'react';

type Interest = {
    id: string;
    name: string;
};

type InterestsContextType = {
    interests: Interest[];
    setInterests: (interests: Interest[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

const InterestsContext = createContext<InterestsContextType>({
    interests: [],
    setInterests: () => { },
    loading: false,
    setLoading: () => { },
});

export const InterestsProvider = ({ children }: { children: React.ReactNode }) => {
    const [interests, setInterests] = useState<Interest[]>([]);
    const [loading, setLoading] = useState(false);

    return (
        <InterestsContext.Provider value={{ interests, setInterests, loading, setLoading }}>
            {children}
        </InterestsContext.Provider>
    );
};

// Custom hook
export const useInterests = () => useContext(InterestsContext);
