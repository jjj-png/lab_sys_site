
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
  status: string,
  equipmentStatus: string,
  labAdminId: number,
  createdAt: string,
  updatedAt: string,
}