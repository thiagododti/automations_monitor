import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  PlayCircle,
  Store,
  Users,
  BriefcaseBusiness,
  FileText,
  Footprints,
  ChevronLeft,
  ChevronDown,
  Activity,
  Github,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const topItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Monitoramento', icon: Activity, href: '/monitoramento' },
];

const executionItems = [
  { label: 'Execuções', icon: PlayCircle, href: '/executions' },
  { label: 'Steps', icon: Footprints, href: '/steps' },
  { label: 'Logs', icon: FileText, href: '/logs' },
];

const cadastrosItems = [
  { label: 'Empresas', icon: Store, href: '/businesses' },
  { label: 'Cargos', icon: BriefcaseBusiness, href: '/positions' },
  { label: 'Usuários', icon: Users, href: '/users' },
  { label: 'Automações', icon: Cpu, href: '/automations' }
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [cadastrosOpen, setCadastrosOpen] = useState(false);
  const location = useLocation();

  const isCadastrosActive = cadastrosItems.some((item) =>
    location.pathname.startsWith(item.href)
  );

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
        {topItems.map((item) => (
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

        <div className="my-1 border-t border-border" />

        {executionItems.map((item) => (
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

        <div className="my-1 border-t border-border" />

        <button
          onClick={() => {
            if (!collapsed) setCadastrosOpen(!cadastrosOpen);
          }}
          className={cn(
            'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
            isCadastrosActive
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            collapsed && 'justify-center'
          )}
        >
          <FolderOpen className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Cadastros</span>
              <ChevronDown
                className={cn('h-4 w-4 transition-transform', cadastrosOpen && 'rotate-180')}
              />
            </>
          )}
        </button>

        {!collapsed && cadastrosOpen && (
          <div className="ml-3 space-y-1 border-l border-border pl-3">
            {cadastrosItems.map((item) => (
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
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <a
        href="https://github.com/AlldaxBots/botlogger"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'flex items-center gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors',
          collapsed && 'justify-center px-0'
        )}
      >
        <Github className="h-4 w-4 shrink-0" />
        {!collapsed && <span>BotLogger</span>}
      </a>

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
