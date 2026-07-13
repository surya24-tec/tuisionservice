export interface Student {
  id?: number;
  studentId?: string;         // Auto-generated (e.g. STU-2024-001)
  name: string;
  studentClass: string;       // Class / Grade
  parentName: string;
  parentMobileNumber: string;
  email: string;
  password?: string;          // For student login
  address: string;
  batch?: { id?: number; name?: string } | null;
  admissionDate: string;
  status: string;             // Active | Inactive | Transferred
  user?: any;
}
