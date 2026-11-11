
export interface EmployeeResponseDto {
  // Primary Key
  id: string;

  // Company Information
  companyId: string;

  // Employee Information
  employeeId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  profilePhotoUrl?: string;

  // Contact Information
  workEmail: string;
  phoneNumber: string;
  personalEmail?: string;
  currentAddress?: string;
  permanentAddress?: string;

  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  // Employment Information
  dateOfJoining: string;
  departmentId: string;
  designationId: string;
  branchId?: string;
  reportingManagerId?: string;
  employmentTypeId: string;

  // Employment Status
  employeeStatus: boolean;
  probationEndDate?: string;
  dateOfExit?: string;

  // Audit Information
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface EmployeeResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data?: EmployeeResponseDto;
}

export interface EmployeeListResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: EmployeeResponseDto[];
  total: number;
}
