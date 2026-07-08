import { Badge } from "@/shared/components/ui/Badge";

interface MappingConfidenceBadgeProps {
  confidence: number;
}

export function MappingConfidenceBadge({ confidence }: MappingConfidenceBadgeProps) {
  if (confidence >= 0.85) {
    return <Badge variant="success">{Math.round(confidence * 100)}% match</Badge>;
  }
  if (confidence >= 0.5) {
    return <Badge variant="warning">{Math.round(confidence * 100)}% match</Badge>;
  }
  if (confidence === 0) {
    return <Badge variant="outline">Unmapped</Badge>;
  }
  return <Badge variant="destructive">{Math.round(confidence * 100)}% match</Badge>;
}
