export const queryKeys = {
  currentUserProfile: ['currentUserProfile'],
  currentUserRole: ['currentUserRole'],
  isAdmin: ['isAdmin'],
  jobs: {
    all: ['jobs'],
    detail: (id: bigint | undefined) => ['jobs', id?.toString()],
    forClient: (clientId: bigint | undefined) => ['jobs', 'client', clientId?.toString()],
  },
  candidates: {
    all: ['candidates'],
    detail: (id: bigint | undefined) => ['candidates', id?.toString()],
  },
  interviews: {
    all: ['interviews'],
    detail: (id: bigint | undefined) => ['interviews', id?.toString()],
  },
  clients: {
    all: ['clients'],
    detail: (id: bigint | undefined) => ['clients', id?.toString()],
    withJobs: (id: bigint | undefined) => ['clients', id?.toString(), 'withJobs'],
  },
};
