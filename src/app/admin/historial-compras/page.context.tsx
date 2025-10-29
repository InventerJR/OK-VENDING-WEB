import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getAllPurchases } from '../../../../api';
import PurchaseDetailModal from './modals/purchase-detail-modal';

export const TASKS_PER_PAGE = 10;

export type PurchaseDataObject = {
  ticket_id: number;
  supplier: string;
  total_amount: string;
  purchase_date: string;
  ticket_image: string;
  products: {
    product: string;
    buying_price: string;
    quantity: number;
    expiration: string;
  }[];
};

interface ProviderProps {
  children?: React.ReactNode;
}

type ContextInterface = {
  data: PurchaseDataObject[];
  selectedPurchase: PurchaseDataObject | null;
  setSelectedPurchase: (value: PurchaseDataObject | null) => void;
  refreshData: (url?: string) => void;
  currentPage: number;
  totalPages: number;
  nextUrl: string | null;
  prevUrl: string | null;
  isLoading: boolean;
};

const Context = createContext<ContextInterface | undefined>(undefined);

export const useContextPurchase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useContextPurchase must be used within a PurchaseProvider');
  }
  return context;
};

export const PurchaseProvider: React.FC<ProviderProps> = ({ children }) => {
  const [data, setData] = useState<PurchaseDataObject[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseDataObject | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (url?: string) => {
    setIsLoading(true);
    try {
      const response = await getAllPurchases(url);
      setData(response.results);
      setCurrentPage(response.current || 1);
      setTotalPages(Math.ceil(response.count / TASKS_PER_PAGE));
      setNextUrl(response.next);
      setPrevUrl(response.previous);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value: ContextInterface = {
    data,
    selectedPurchase,
    setSelectedPurchase,
    refreshData: fetchData,
    currentPage,
    totalPages,
    nextUrl,
    prevUrl,
    isLoading,
  };

  return (
    <Context.Provider value={value}>
      <div className='relative w-full'>
        {selectedPurchase && (
          <PurchaseDetailModal 
            purchase={selectedPurchase} 
            onClose={() => setSelectedPurchase(null)} 
          />
        )}
        {children}
      </div>
    </Context.Provider>
  );
};

export default useContextPurchase;