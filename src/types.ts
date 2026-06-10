/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  ADMIN = 'admin',
  MECHANIC = 'mechanic',
  CLIENT = 'client',
}

export enum ServiceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  AWAITING_PARTS = 'awaiting_parts',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  photoURL?: string;
  createdAt: number;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  vin?: string;
  lastMaintenance?: number;
}

export interface MaintenanceService {
  id: string;
  vehicleId: string;
  clientId: string;
  mechanicId?: string; // Legacy field
  mechanicIds?: string[]; // Multiple mechanics support
  title: string;
  description: string;
  status: ServiceStatus;
  scheduledDate: number;
  startDate?: number;
  expectedDelivery?: string;
  endDate?: string;
  budget?: number;
  items?: string[];
  history: ServiceLog[];
  report?: {
    serviceName: string;
    procedures: string[];
    diagnostics?: string;
    observations?: string;
    finalValue: string;
    parts: { name: string; brand: string; quantity: number }[];
  };
  vehicleName?: string;
  evaluation?: {
    rating: number;
    comment: string;
    date: number;
  };
}

export interface TechnicalReport {
  serviceName: string;
  procedures: string[];
  parts?: SparePart[];
  diagnostics?: string;
  recommendations?: string;
  observations?: string;
  finalValue: number;
  createdAt: number;
}

export interface SparePart {
  id: string;
  name: string;
  code: string;
  brand: string;
  quantity: number;
  unitPrice: number;
}

export interface ServiceLog {
  timestamp: number;
  status: ServiceStatus;
  message: string;
  authorId: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  vehicleId: string;
  date: number;
  serviceType: string;
  status: 'requested' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'success';
  date: number;
  read: boolean;
}

export type ViewState = 'landing' | 'admin' | 'client' | 'schedule' | 'register-vehicle';
