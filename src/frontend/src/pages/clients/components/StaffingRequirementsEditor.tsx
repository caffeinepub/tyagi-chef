import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent } from '../../../components/ui/card';
import { Plus, X } from 'lucide-react';

interface StaffingRequirementsEditorProps {
  requirements: string[];
  onChange: (requirements: string[]) => void;
}

export default function StaffingRequirementsEditor({
  requirements,
  onChange,
}: StaffingRequirementsEditorProps) {
  const addRequirement = () => {
    onChange([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    onChange(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Staffing Requirements</Label>
        <Button type="button" variant="outline" size="sm" onClick={addRequirement}>
          <Plus className="h-4 w-4 mr-2" />
          Add Requirement
        </Button>
      </div>

      {requirements.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p className="text-sm">No staffing requirements added yet.</p>
            <p className="text-xs mt-1">Click "Add Requirement" to specify staff needs.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requirements.map((requirement, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={requirement}
                onChange={(e) => updateRequirement(index, e.target.value)}
                placeholder="e.g., 2 Chefs with 5+ years experience"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRequirement(index)}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
