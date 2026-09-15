import React, { createContext, useContext, useState } from 'react';
import {
  UserRole,
  Village,
  Farmer,
  VLE,
  MachineryRequest,
  TransactionHistoryItem,
} from '../types';
import {
  INITIAL_VILLAGES,
  INITIAL_FARMERS,
  INITIAL_VLES,
  INITIAL_REQUESTS,
  INITIAL_TRANSACTION_HISTORY,
} from '../mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  // Data
  villages: Village[];
  farmers: Farmer[];
  vles: VLE[];
  requests: MachineryRequest[];
  history: TransactionHistoryItem[];
  // Active auth sessions
  activeFarmer: Farmer | null;
  isFarmerLoggedIn: boolean;
  activeVle: VLE | null;
  isVleLoggedIn: boolean;
  // Actions
  addVillage: (village: Omit<Village, 'id'>) => void;
  addFarmer: (farmer: Omit<Farmer, 'id'>) => void;
  addVLE: (vle: Omit<VLE, 'id'>) => void;
  submitMachineryRequest: (data: {
    machineryId: string;
    machineryName: string;
    vleId: string;
    requestedDate: string;
    quantityOrArea: string;
    notes?: string;
  }) => { success: boolean; message: string };
  updateRequestStatus: (
    requestId: string,
    status: 'Accepted' | 'Rejected',
    reason?: string
  ) => { success: boolean; message: string };
  // Auth helpers
  loginFarmer: (mobile: string, otp: string) => { success: boolean; message: string };
  logoutFarmer: () => void;
  loginVle: (vleId: string) => { success: boolean; message: string };
  logoutVle: () => void;
  setActiveFarmerById: (farmerId: string) => void;
  setActiveVleById: (vleId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('staff');
  const [villages, setVillages] = useState<Village[]>(INITIAL_VILLAGES);
  const [farmers, setFarmers] = useState<Farmer[]>(INITIAL_FARMERS);
  const [vles, setVles] = useState<VLE[]>(INITIAL_VLES);
  const [requests, setRequests] = useState<MachineryRequest[]>(INITIAL_REQUESTS);
  const [history, setHistory] = useState<TransactionHistoryItem[]>(INITIAL_TRANSACTION_HISTORY);

  // Farmer auth state
  const [activeFarmer, setActiveFarmer] = useState<Farmer | null>(INITIAL_FARMERS[0]);
  const [isFarmerLoggedIn, setIsFarmerLoggedIn] = useState<boolean>(true);

  // VLE auth state
  const [activeVle, setActiveVle] = useState<VLE | null>(INITIAL_VLES[0]);
  const [isVleLoggedIn, setIsVleLoggedIn] = useState<boolean>(true);

  // Add Village
  const addVillage = (newVillage: Omit<Village, 'id'>) => {
    const id = `vil-${Date.now()}`;
    setVillages((prev) => [
      {
        ...newVillage,
        id,
      },
      ...prev,
    ]);
  };

  // Add Farmer
  const addFarmer = (newFarmer: Omit<Farmer, 'id'>) => {
    const id = `farm-${Date.now()}`;
    const farmer: Farmer = {
      ...newFarmer,
      id,
      registeredDate: new Date().toISOString().split('T')[0],
    };
    setFarmers((prev) => [farmer, ...prev]);

    // Update village farmer count
    setVillages((prev) =>
      prev.map((v) =>
        v.name.toLowerCase() === newFarmer.village.toLowerCase()
          ? { ...v, farmersCount: v.farmersCount + 1 }
          : v
      )
    );
  };

  // Add VLE
  const addVLE = (newVLE: Omit<VLE, 'id'>) => {
    const id = `vle-${Date.now()}`;
    setVles((prev) => [
      {
        ...newVLE,
        id,
      },
      ...prev,
    ]);
  };

  // Farmer submits machinery request
  const submitMachineryRequest = (data: {
    machineryId: string;
    machineryName: string;
    vleId: string;
    requestedDate: string;
    quantityOrArea: string;
    notes?: string;
  }) => {
    if (!activeFarmer) {
      return { success: false, message: 'Farmer not authenticated' };
    }

    const targetVle = vles.find((v) => v.id === data.vleId);
    if (!targetVle) {
      return { success: false, message: 'Selected VLE not found' };
    }

    const newRequest: MachineryRequest = {
      id: `req-${Date.now()}`,
      farmerId: activeFarmer.id,
      farmerName: activeFarmer.name,
      farmerVillage: activeFarmer.village,
      farmerMobile: activeFarmer.mobile,
      vleId: targetVle.id,
      vleName: targetVle.name,
      machineryId: data.machineryId,
      machineryName: data.machineryName,
      requestedDate: data.requestedDate,
      quantityOrArea: data.quantityOrArea,
      requestDate: new Date().toISOString().split('T')[0],
      notes: data.notes,
      status: 'Pending',
    };

    setRequests((prev) => [newRequest, ...prev]);
    return { success: true, message: 'Request submitted successfully to VLE.' };
  };

  // VLE updates request status (Accept / Reject)
  const updateRequestStatus = (
    requestId: string,
    status: 'Accepted' | 'Rejected',
    reason?: string
  ) => {
    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq) {
      return { success: false, message: 'Request not found.' };
    }

    // If accepting, check stock availability in the assigned VLE
    if (status === 'Accepted') {
      const assignedVle = vles.find((v) => v.id === targetReq.vleId);
      const machine = assignedVle?.machineryStock.find((m) => m.id === targetReq.machineryId);
      if (machine && machine.availableUnits <= 0) {
        return {
          success: false,
          message: `Cannot accept request: ${machine.name} is currently out of stock (0 available units).`,
        };
      }
    }

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status,
            rejectionReason: status === 'Rejected' ? (reason || 'Unable to fulfill at this time') : undefined,
          };
        }
        return r;
      })
    );

    // If accepted, add an active transaction history record as well
    if (status === 'Accepted') {
      const newHistoryItem: TransactionHistoryItem = {
        id: `tx-${Date.now()}`,
        farmerId: targetReq.farmerId,
        farmerName: targetReq.farmerName,
        vleId: targetReq.vleId,
        vleName: targetReq.vleName,
        productOrService: targetReq.machineryName,
        date: targetReq.requestedDate,
        quantity: targetReq.quantityOrArea,
        amount: 1500, // estimated standard charge
        status: 'In Progress',
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    }

    return {
      success: true,
      message: `Request marked as ${status} successfully.`,
    };
  };

  // Farmer login
  const loginFarmer = (mobile: string, otp: string) => {
    if (otp !== '123456') {
      return { success: false, message: 'Invalid OTP. Please enter 123456.' };
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    const found = farmers.find((f) => f.mobile === cleanMobile);
    if (found) {
      setActiveFarmer(found);
    } else {
      // Create new farmer session on the fly if not in list
      const tempFarmer: Farmer = {
        id: `farm-${Date.now()}`,
        name: `Farmer (${cleanMobile.slice(-4)})`,
        mobile: cleanMobile,
        village: 'Rampur',
        landAcres: 2.5,
        primaryCrop: 'Wheat',
        registeredDate: new Date().toISOString().split('T')[0],
      };
      setFarmers((prev) => [tempFarmer, ...prev]);
      setActiveFarmer(tempFarmer);
    }

    setIsFarmerLoggedIn(true);
    return { success: true, message: 'Logged in successfully.' };
  };

  const logoutFarmer = () => {
    setIsFarmerLoggedIn(false);
  };

  // VLE login
  const loginVle = (vleId: string) => {
    const found = vles.find((v) => v.id === vleId);
    if (found) {
      setActiveVle(found);
      setIsVleLoggedIn(true);
      return { success: true, message: `Welcome, ${found.name}` };
    }
    return { success: false, message: 'VLE profile not found.' };
  };

  const logoutVle = () => {
    setIsVleLoggedIn(false);
  };

  const setActiveFarmerById = (farmerId: string) => {
    const found = farmers.find((f) => f.id === farmerId);
    if (found) {
      setActiveFarmer(found);
      setIsFarmerLoggedIn(true);
    }
  };

  const setActiveVleById = (vleId: string) => {
    const found = vles.find((v) => v.id === vleId);
    if (found) {
      setActiveVle(found);
      setIsVleLoggedIn(true);
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        villages,
        farmers,
        vles,
        requests,
        history,
        activeFarmer,
        isFarmerLoggedIn,
        activeVle,
        isVleLoggedIn,
        addVillage,
        addFarmer,
        addVLE,
        submitMachineryRequest,
        updateRequestStatus,
        loginFarmer,
        logoutFarmer,
        loginVle,
        logoutVle,
        setActiveFarmerById,
        setActiveVleById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
