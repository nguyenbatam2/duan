'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
export type Coupon = {
    id: number;
    code: string;
    description?: string;
    end_at?: string;
};


interface PopupContextProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    selectedCoupon: any;
    setSelectedCoupon: (val: any) => void;
}

const PopupContext = createContext<PopupContextProps | undefined>(undefined);

export const PopupProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

    return (
        <PopupContext.Provider value={{ isOpen, setIsOpen, selectedCoupon, setSelectedCoupon }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) throw new Error("usePopup must be used within PopupProvider");
    return context;
};
