import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  JobOpening,
  Candidate,
  Interview,
  Client,
  UserProfile,
  JobStatus,
  CandidateStatus,
  InterviewStatus,
  InterviewType,
  EntityStatus,
  UserRole,
} from '../backend';
import { queryKeys } from './queryKeys';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: queryKeys.currentUserProfile,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUserProfile });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: queryKeys.currentUserRole,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: queryKeys.isAdmin,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Job Openings Queries
export function useGetAllJobOpenings() {
  const { actor, isFetching } = useActor();

  return useQuery<JobOpening[]>({
    queryKey: queryKeys.jobs.all,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJobOpenings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJobOpening(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<JobOpening | null>({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getJobOpening(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetJobOpeningsForClient(clientId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<JobOpening[]>({
    queryKey: queryKeys.jobs.forClient(clientId),
    queryFn: async () => {
      if (!actor || !clientId) return [];
      return actor.getJobOpeningsForClient(clientId);
    },
    enabled: !!actor && !isFetching && !!clientId,
  });
}

export function useCreateJobOpening() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      clientId: bigint | null;
      location: string;
      salary: string | null;
      description: string;
      requirements: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createJobOpening(
        data.title,
        data.clientId,
        data.location,
        data.salary,
        data.description,
        data.requirements
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      if (variables.clientId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.forClient(variables.clientId) });
      }
    },
  });
}

export function useUpdateJobOpening() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      clientId: bigint | null;
      location: string;
      salary: string | null;
      description: string;
      requirements: string;
      status: JobStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJobOpening(
        data.id,
        data.title,
        data.clientId,
        data.location,
        data.salary,
        data.description,
        data.requirements,
        data.status
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(variables.id) });
      if (variables.clientId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.forClient(variables.clientId) });
      }
    },
  });
}

export function useDeleteJobOpening() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJobOpening(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
    },
  });
}

// Candidates Queries
export function useGetAllCandidates() {
  const { actor, isFetching } = useActor();

  return useQuery<Candidate[]>({
    queryKey: queryKeys.candidates.all,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCandidates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCandidate(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Candidate | null>({
    queryKey: queryKeys.candidates.detail(id),
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getCandidate(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateCandidate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      fullName: string;
      phone: string;
      email: string;
      skills: string;
      notes: string;
      source: string;
      jobOpeningId: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCandidate(
        data.fullName,
        data.phone,
        data.email,
        data.skills,
        data.notes,
        data.source,
        data.jobOpeningId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidates.all });
    },
  });
}

export function useUpdateCandidate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      fullName: string;
      phone: string;
      email: string;
      skills: string;
      notes: string;
      source: string;
      status: CandidateStatus;
      jobOpeningId: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCandidate(
        data.id,
        data.fullName,
        data.phone,
        data.email,
        data.skills,
        data.notes,
        data.source,
        data.status,
        data.jobOpeningId
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidates.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.candidates.detail(variables.id) });
    },
  });
}

export function useDeleteCandidate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCandidate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidates.all });
    },
  });
}

// Interviews Queries
export function useGetAllInterviews() {
  const { actor, isFetching } = useActor();

  return useQuery<Interview[]>({
    queryKey: queryKeys.interviews.all,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInterviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetInterview(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Interview | null>({
    queryKey: queryKeys.interviews.detail(id),
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getInterview(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateInterview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      candidateId: bigint;
      jobOpeningId: bigint | null;
      interviewDate: bigint;
      interviewType: InterviewType;
      interviewerName: string;
      location: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createInterview(
        data.candidateId,
        data.jobOpeningId,
        data.interviewDate,
        data.interviewType,
        data.interviewerName,
        data.location
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews.all });
    },
  });
}

export function useUpdateInterview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      candidateId: bigint;
      jobOpeningId: bigint | null;
      interviewDate: bigint;
      interviewType: InterviewType;
      interviewerName: string;
      location: string;
      status: InterviewStatus;
      outcome: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateInterview(
        data.id,
        data.candidateId,
        data.jobOpeningId,
        data.interviewDate,
        data.interviewType,
        data.interviewerName,
        data.location,
        data.status,
        data.outcome
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews.detail(variables.id) });
    },
  });
}

export function useDeleteInterview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteInterview(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews.all });
    },
  });
}

// Clients Queries
export function useGetAllClients() {
  const { actor, isFetching } = useActor();

  return useQuery<Client[]>({
    queryKey: queryKeys.clients.all,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetClient(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Client | null>({
    queryKey: queryKeys.clients.detail(id),
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getClient(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      companyName: string;
      contactPerson: string;
      phone: string;
      email: string;
      address: string;
      notes: string;
      staffingRequirements: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClient(
        data.companyName,
        data.contactPerson,
        data.phone,
        data.email,
        data.address,
        data.notes,
        data.staffingRequirements
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
    },
  });
}

export function useUpdateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      companyName: string;
      contactPerson: string;
      phone: string;
      email: string;
      address: string;
      notes: string;
      status: EntityStatus;
      staffingRequirements: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClient(
        data.id,
        data.companyName,
        data.contactPerson,
        data.phone,
        data.email,
        data.address,
        data.notes,
        data.status,
        data.staffingRequirements
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(variables.id) });
    },
  });
}

export function useDeleteClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteClient(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
    },
  });
}
