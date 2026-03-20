import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

function getInitials(firstName: string, lastName: string, username: string): string {
  if (firstName || lastName) {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

export function AppHeader() {
  const { user, logout } = useAuth();

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name}`.trim()
    : user?.username || 'User';

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          System Integrity: Nominal
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photo ?? undefined} />
            <AvatarFallback className="bg-secondary text-xs font-medium text-foreground">
              {user ? getInitials(user.first_name, user.last_name, user.username) : '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-foreground">{displayName}</span>
            {(user?.is_superuser || user?.is_staff) && (
              <span className="text-xs text-muted-foreground">
                {user.is_superuser ? 'Superusuário' : 'Staff'}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
