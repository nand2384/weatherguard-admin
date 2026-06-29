export enum AuthProvider {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
}

export enum ApprovalStatus {
  INCOMPLETE = "INCOMPLETE",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum AlertFrequency {
  EVERY_HOUR = "EVERY_HOUR",
  EVERY_3_HOURS = "EVERY_3_HOURS",
  EVERY_6_HOURS = "EVERY_6_HOURS",
  SEVERE_ONLY = "SEVERE_ONLY",
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}