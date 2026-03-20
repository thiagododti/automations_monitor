import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  PlayCircle,
  Building2,
  Store,
  Users,
  BriefcaseBusiness,
  FileText,
  Footprints,
  ChevronLeft,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Monitoramento', icon: Activity, href: '/monitoramento' },
  { label: 'Automações', icon: Cpu, href: '/automations' },
  { label: 'Execuções', icon: PlayCircle, href: '/executions' },
  { label: 'Steps', icon: Footprints, href: '/steps' },
  { label: 'Logs', icon: FileText, href: '/logs' },
  { label: 'Departamentos', icon: Building2, href: '/departments' },
  { label: 'Empresas', icon: Store, href: '/businesses' },
  { label: 'Cargos', icon: BriefcaseBusiness, href: '/positions' },
  { label: 'Usuários', icon: Users, href: '/users' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-sidebar transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        {/* <Activity className="h-6 w-6 shrink-0 text-primary" /> */}
        <img src="/logo.png" alt="Logo" className={cn('object-contain', collapsed ? 'h-6 w-6' : 'w-12')} />
        {!collapsed && (
          <span className="text-sm font-semibold text-foreground tracking-tight">
            Automations Monitor
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center border-t border-border p-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft
          className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
        />
      </button>
    </aside>
  );
}
