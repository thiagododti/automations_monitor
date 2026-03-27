import type { NavigateFunction } from 'react-router-dom';

let _navigate: NavigateFunction | null = null;

export function setNavigate(fn: NavigateFunction): void {
    _navigate = fn;
}

/**
 * Navega programaticamente sem causar reload da página.
 * Requer que setNavigate() tenha sido chamado previamente pelo NavigationSetter no App.tsx.
 * Usa window.location.href como fallback seguro caso seja chamado antes da montagem do Router.
 */
export function navigateTo(path: string): void {
    if (_navigate) {
        _navigate(path);
    } else {
        window.location.href = path;
    }
}
