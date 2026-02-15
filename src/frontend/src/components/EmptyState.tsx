import { ReactNode } from 'react';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  showIllustration?: boolean;
}

export default function EmptyState({ icon, title, description, action, showIllustration }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {showIllustration && (
        <img
          src="/assets/generated/hospitality-staffing-illustration.dim_1600x900.png"
          alt="Empty state"
          className="w-full max-w-md mb-6 opacity-60"
        />
      )}
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="lg">
          {action.label}
        </Button>
      )}
    </div>
  );
}
