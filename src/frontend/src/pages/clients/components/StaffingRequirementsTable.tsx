import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Users } from 'lucide-react';

interface StaffingRequirementsTableProps {
  requirements: string[];
}

export default function StaffingRequirementsTable({ requirements }: StaffingRequirementsTableProps) {
  if (requirements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Staffing Requirements</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground">No staffing requirements specified.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>Staffing Requirements</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {requirements.map((requirement, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <span className="text-primary font-semibold mt-0.5">•</span>
              <span className="flex-1">{requirement}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
