import { Certification } from "../types";

export const certifications: Certification[] = [
  {
    id: "cert-1",
    name: "ISO 9001",
    issueDate: "2022-01-15",
    expiryDate: "2025-01-14",
    status: "added",
  },
  {
    id: "cert-2",
    name: "ISO 14001",
    issueDate: "2023-03-10",
    expiryDate: "2026-03-09",
    status: "added",
  },
  {
    id: "cert-3",
    name: "MSME",
    issueDate: "2021-06-01",
    expiryDate: "2026-05-31",
    status: "added",
  },
  {
    id: "cert-4",
    name: "Government Contractor Registration",
    issueDate: "",
    expiryDate: "",
    status: "missing",
  },
  {
    id: "cert-5",
    name: "Electrical License",
    issueDate: "",
    expiryDate: "",
    status: "missing",
  },
];
