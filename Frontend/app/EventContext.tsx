"use client"

import { createContext, useContext, ReactNode, useState } from 'react';

type EventContextType = {
    event: string;
    setEvent: (event: string) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [event, setEvent] = useState<string>('');

    return (
        <EventContext.Provider value={{ event, setEvent }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEventContext = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEventContext must be used within an EventProvider');
    }
    return context;
};
