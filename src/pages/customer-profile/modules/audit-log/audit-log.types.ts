import { ENUM_AUDIT_LOG_ACTION } from "@types";

export interface IAuditLogResponse {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  items: IAuditLog[];
}

export interface IAuditLog {
  action: ENUM_AUDIT_LOG_ACTION;
  comments: IAuditLogComment[];
  createdAt: string;
  createdBy: string;
  id: number;
  jiraLink: IAuditLogJiraLink;
  reason: IAuditLogReason;
}

export interface IAuditLogJiraLink {
  jiraLink: string;
  modifiedAt: string;
  modifiedBy: string;
}

export interface IAuditLogReason {
  reason: number;
  modifiedAt: string;
  modifiedBy: string;
}

export interface IAuditLogComment {
  comment: string;
  createdAt: string;
  createdBy: string;
  id: number;
  modifiedAt: string;
  modifiedBy: string;
}
