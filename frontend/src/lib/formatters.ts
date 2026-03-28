/**
 * Utilitários de formatação centralizados.
 * Todos os helpers de exibição de dados devem viver aqui
 * para garantir consistência visual em toda a aplicação.
 */

export type GroupBy = 'day' | 'week' | 'month';

// ---------------------------------------------------------------------------
// Numéricos
// ---------------------------------------------------------------------------

/**
 * Converte string (em formato pt-BR ou en-US) ou número para `number`.
 * Retorna 0 em caso de valor inválido ou ausente.
 */
export function toNumber(value: string | number | undefined): number {
    if (typeof value === 'number') return value;
    if (!value) return 0;

    // "1.234,56" → 1234.56
    if (value.includes('.') && value.includes(',')) {
        const normalized = value.replace(/\./g, '').replace(',', '.');
        const n = Number(normalized);
        return Number.isFinite(n) ? n : 0;
    }

    // "1234,56" → 1234.56
    if (value.includes(',')) {
        const n = Number(value.replace(',', '.'));
        return Number.isFinite(n) ? n : 0;
    }

    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

// ---------------------------------------------------------------------------
// Moeda e percentual
// ---------------------------------------------------------------------------

/**
 * Formata um valor monetário em BRL (R$).
 * Aceita string, número ou undefined.
 */
export function formatCurrency(value: string | number | undefined): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 2,
    }).format(toNumber(value));
}

/**
 * Formata um número como percentual com 1 casa decimal.
 * Ex: 98.3 → "98.3%"
 */
export function formatPercent(value: string | number | undefined): string {
    return `${toNumber(value).toFixed(1)}%`;
}

// ---------------------------------------------------------------------------
// Durações
// ---------------------------------------------------------------------------

/**
 * Formato compacto para durações curtas em segundos.
 * Ex: 150 → "2m 30s" | 60 → "1m"
 */
export function formatSeconds(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

/**
 * Formata tempo manual de uma automação em formato compacto.
 * Retorna "—" para valores ausentes ou zero.
 * Ex: 0 → "—" | 45 → "45s" | 150 → "2m 30s"
 */
export function formatManualTime(seconds: number | undefined | null): string {
    if (!seconds) return '—';
    return formatSeconds(seconds);
}

/**
 * Formato compacto para durações longas (minutos, horas, dias).
 * Ex: 3600 → "1h 0min" | 90000 → "1d 1h"
 */
export function formatCompactSeconds(seconds: number | undefined): string {
    const totalSeconds = Math.max(0, Math.floor(seconds || 0));
    const totalMinutes = Math.floor(totalSeconds / 60);

    if (totalMinutes < 60) return `${totalMinutes} min`;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours < 24) return `${hours}h ${minutes}min`;

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
}

// ---------------------------------------------------------------------------
// Datas
// ---------------------------------------------------------------------------

/**
 * Formata uma string ISO como data/hora no padrão pt-BR.
 * Retorna "—" para valores nulos, vazios ou inválidos.
 */
export function formatDateTime(value: string | null | undefined): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

/**
 * Formata um período (string "YYYY-MM-DD") de acordo com o agrupamento do gráfico.
 * Ex: "2024-03-01" com groupBy "month" → "mar. 24"
 */
export function formatPeriod(period: string, groupBy: GroupBy): string {
    const date = new Date(`${period}T00:00:00`);
    if (Number.isNaN(date.getTime())) return period;

    if (groupBy === 'day') {
        return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
    }

    if (groupBy === 'week') {
        return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
    }

    return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' }).format(date);
}
