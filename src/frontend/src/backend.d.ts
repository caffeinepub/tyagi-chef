import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Interview {
    id: bigint;
    status: InterviewStatus;
    createdAt: bigint;
    updatedAt: bigint;
    interviewDate: bigint;
    interviewType: InterviewType;
    outcome: string;
    candidateId: bigint;
    location: string;
    jobOpeningId?: bigint;
    interviewerName: string;
}
export interface Candidate {
    id: bigint;
    status: CandidateStatus;
    source: string;
    createdAt: bigint;
    fullName: string;
    email: string;
    updatedAt: bigint;
    notes: string;
    phone: string;
    skills: string;
    jobOpeningId?: bigint;
}
export interface JobOpening {
    id: bigint;
    status: JobStatus;
    title: string;
    clientId?: bigint;
    salary?: string;
    createdAt: bigint;
    description: string;
    updatedAt: bigint;
    requirements: string;
    location: string;
}
export interface Client {
    id: bigint;
    status: EntityStatus;
    createdAt: bigint;
    contactPerson: string;
    email: string;
    updatedAt: bigint;
    address: string;
    notes: string;
    companyName: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    role: string;
    email: string;
}
export enum CandidateStatus {
    new_ = "new",
    placed = "placed",
    screening = "screening",
    rejected = "rejected",
    interviewing = "interviewing",
    offered = "offered"
}
export enum EntityStatus {
    active = "active",
    inactive = "inactive"
}
export enum InterviewStatus {
    scheduled = "scheduled",
    noShow = "noShow",
    cancelled = "cancelled",
    completed = "completed"
}
export enum InterviewType {
    video = "video",
    phone = "phone",
    inPerson = "inPerson"
}
export enum JobStatus {
    closed = "closed",
    open = "open",
    paused = "paused"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCandidate(fullName: string, phone: string, email: string, skills: string, notes: string, source: string, jobOpeningId: bigint | null): Promise<bigint>;
    createClient(companyName: string, contactPerson: string, phone: string, email: string, address: string, notes: string): Promise<bigint>;
    createInterview(candidateId: bigint, jobOpeningId: bigint | null, interviewDate: bigint, interviewType: InterviewType, interviewerName: string, location: string): Promise<bigint>;
    createJobOpening(title: string, clientId: bigint | null, location: string, salary: string | null, description: string, requirements: string): Promise<bigint>;
    deleteCandidate(id: bigint): Promise<void>;
    deleteClient(id: bigint): Promise<void>;
    deleteInterview(id: bigint): Promise<void>;
    deleteJobOpening(id: bigint): Promise<void>;
    getAllCandidates(): Promise<Array<Candidate>>;
    getAllClients(): Promise<Array<Client>>;
    getAllInterviews(): Promise<Array<Interview>>;
    getAllJobOpenings(): Promise<Array<JobOpening>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCandidate(id: bigint): Promise<Candidate>;
    getClient(id: bigint): Promise<Client>;
    getInterview(id: bigint): Promise<Interview>;
    getJobOpening(id: bigint): Promise<JobOpening>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCandidate(id: bigint, fullName: string, phone: string, email: string, skills: string, notes: string, source: string, status: CandidateStatus, jobOpeningId: bigint | null): Promise<void>;
    updateClient(id: bigint, companyName: string, contactPerson: string, phone: string, email: string, address: string, notes: string, status: EntityStatus): Promise<void>;
    updateInterview(id: bigint, candidateId: bigint, jobOpeningId: bigint | null, interviewDate: bigint, interviewType: InterviewType, interviewerName: string, location: string, status: InterviewStatus, outcome: string): Promise<void>;
    updateJobOpening(id: bigint, title: string, clientId: bigint | null, location: string, salary: string | null, description: string, requirements: string, status: JobStatus): Promise<void>;
}
