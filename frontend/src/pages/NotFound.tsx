import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-10 w-10 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">404</h1>
          <p className="text-lg font-medium text-foreground">Página não encontrada</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            O endereço{' '}
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
              {location.pathname}
            </span>{' '}
            não existe ou foi removido.
          </p>
        </div>

        <Button onClick={() => navigate('/dashboard')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  );
}
