import { describe, expect, it, vi } from 'vitest';
import { formatCivilDate, formatDateLabel, formatReferenceDate } from '../../src/lib/date';

describe('date formatting in city timezone', () => {
  it('keeps the civil date stable regardless of runtime timezone', () => {
    vi.setSystemTime(new Date('2026-09-30T12:00:00Z'));

    expect(formatCivilDate('2026-09-30', 'America/Sao_Paulo')).toBe('2026-09-30');
    expect(formatCivilDate('2026-09-30', 'America/New_York')).toBe('2026-09-30');
  });

  it('labels the local today date as Hoje', () => {
    vi.setSystemTime(new Date('2026-09-30T12:00:00Z'));

    expect(formatDateLabel('2026-09-30', 'America/Sao_Paulo')).toBe('Hoje');
    expect(formatDateLabel('2026-10-01', 'America/Sao_Paulo')).toBe('1/10');
  });

  it('returns no invented values when time or timezone is missing', () => {
    expect(formatReferenceDate('', 'America/Sao_Paulo')).toBeNull();
    expect(formatReferenceDate('2026-09-30T12:00:00', '')).toBeNull();
    expect(formatReferenceDate('2026-09-30T12:00:00', 'America/Sao_Paulo')).toBe(
      '30/09/2026, 12:00 GMT-3',
    );
  });
});
