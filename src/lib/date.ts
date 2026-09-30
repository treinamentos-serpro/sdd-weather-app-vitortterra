export function formatCivilDate(date: string, timezone: string | undefined): string | null {
  if (!date || !timezone) {
    return null;
  }

  return date;
}

export function formatDateLabel(date: string, timezone: string | undefined): string | null {
  if (!date || !timezone) {
    return null;
  }

  const today = new Date();
  const timeZoneDate = new Intl.DateTimeFormat('pt-BR', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(today);

  const parts = Object.fromEntries(
    timeZoneDate.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]),
  ) as { day: string; month: string; year: string };

  const cityToday = `${parts.year}-${parts.month}-${parts.day}`;

  if (date === cityToday) {
    return 'Hoje';
  }

  const dateParts = date.split('-');
  if (dateParts.length !== 3) {
    return null;
  }

  return `${Number(dateParts[2])}/${Number(dateParts[1])}`;
}

export function formatReferenceDate(dateTime: string, timezone: string | undefined): string | null {
  if (!dateTime || !timezone) {
    return null;
  }

  const directMatch = dateTime.match(
    /(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?/,
  );

  if (directMatch) {
    const [, year, month, day, hour, minute] = directMatch;
    const offset =
      new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'shortOffset',
      })
        .formatToParts(
          new Date(
            Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)),
          ),
        )
        .find((part) => part.type === 'timeZoneName')?.value ?? 'GMT';

    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}, ${hour}:${minute} ${offset}`.trim();
  }

  const parsed = new Date(dateTime);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: timezone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(parsed);
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  const yearValue = parts.find((part) => part.type === 'year')?.value ?? '';
  const hourValue = parts.find((part) => part.type === 'hour')?.value ?? '';
  const minuteValue = parts.find((part) => part.type === 'minute')?.value ?? '';
  const offset =
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    })
      .formatToParts(parsed)
      .find((part) => part.type === 'timeZoneName')?.value ?? 'GMT';

  return `${day}/${month}/${yearValue}, ${hourValue}:${minuteValue} ${offset}`.trim();
}
