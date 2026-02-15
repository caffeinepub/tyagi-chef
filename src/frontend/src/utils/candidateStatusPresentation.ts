import { CandidateStatus } from '../backend';

export interface StatusPresentation {
  variant: 'default' | 'secondary' | 'destructive';
  label: string;
}

/**
 * Safely converts a candidate status (which may be undefined/unknown) into
 * a presentation object with a badge variant and label.
 * Returns a safe fallback when status is missing or unrecognized.
 */
export function getCandidateStatusPresentation(status: CandidateStatus | undefined): StatusPresentation {
  if (!status) {
    return { variant: 'secondary', label: 'UNKNOWN' };
  }

  const config: Record<string, StatusPresentation> = {
    new_: { variant: 'default', label: 'NEW' },
    screening: { variant: 'secondary', label: 'SCREENING' },
    interviewing: { variant: 'default', label: 'INTERVIEWING' },
    offered: { variant: 'default', label: 'OFFERED' },
    placed: { variant: 'default', label: 'PLACED' },
    rejected: { variant: 'destructive', label: 'REJECTED' },
  };

  return config[status] || { variant: 'secondary', label: 'UNKNOWN' };
}
