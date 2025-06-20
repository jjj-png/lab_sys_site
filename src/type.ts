
export interface loginResponse {
  userId: number,
  name: string,
  email: string,
  role: string,
  avatar: string,
}

export interface LabInfo {
  labId: number,
  labAdminId: number,
  labTypeId: number,
  labName: string,
  description: string,
  roomNumber: string,
  startTime: string,
  endTime: string,
  status: number,
  createdAt: string,
  updatedAt: string,
}

export interface ReservationInfo {
  reservationId: number,
  userId: number,
  labId: number,
  operationTime: string,
  status: number,
  equipmentStatus: string,
  labAdminId: number,
  createdAt: string,
  updatedAt: string,
}

export interface RepairInfo {
  repairId: number,
  userId: number,
  labId: number,
  repairTime: string,
  status: number,
  adminId: number,
  description: string,
  createdAt: string,
  updatedAt: string,
}