import { Badge } from "@/components/ui/badge";

interface Props {
  isActive?: boolean;
  isStaff?: boolean;
  isSuperuser?: boolean;
}

export function UserStatusBadge({ isActive, isStaff, isSuperuser }: Props) {
  return (
    <div className="flex gap-1.5">
      {isActive !== undefined && (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={
            isActive
              ? "bg-success text-success-foreground hover:bg-success/90"
              : ""
          }
        >
          {isActive ? "Ativo" : "Inativo"}
        </Badge>
      )}
      {isStaff && (
        <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">
          Staff
        </Badge>
      )}
      {isSuperuser && (
        <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">
          Super
        </Badge>
      )}
    </div>
  );
}
