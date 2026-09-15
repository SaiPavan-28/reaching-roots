export type UserRole = 'staff' | 'farmer' | 'vle';

export interface Village {
  id: string;
  name: string;
  farmersCount: number;
  waterResources: string;
  acresUnderCultivation: number;
  district?: string;
  panchayat?: string;
}

export interface Farmer {
  id: string;
  name: string;
  mobile: string;
  village: string;
  landAcres?: number;
  primaryCrop?: string;
  registeredDate?: string;
}

export interface MachineryItem {
  id: string;
  name: string;
  category: string;
  availableUnits: number;
  totalUnits: number;
  rateDescription?: string;
}

export interface VLE {
  id: string;
  name: string;
  mobile: string;
  village: string;
  centerName: string;
  machineryStock: MachineryItem[];
  totalFarmersServed: number;
}

export type RequestStatus = 'Pending' | 'Accepted' | 'Rejected';

export interface MachineryRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerVillage: string;
  farmerMobile: string;
  vleId: string;
  vleName: string;
  machineryId: string;
  machineryName: string;
  requestedDate: string;
  quantityOrArea: string;
  requestDate: string;
  notes?: string;
  status: RequestStatus;
  rejectionReason?: string;
}

export type TransactionStatus = 'Completed' | 'Delivered' | 'In Progress';

export interface TransactionHistoryItem {
  id: string;
  farmerId: string;
  farmerName: string;
  vleId: string;
  vleName: string;
  productOrService: string;
  date: string;
  quantity: string;
  amount: number;
  status: TransactionStatus;
}
