import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CityResults from '../../src/components/CityResults';

describe('CityResults', () => {
  it('renders cities and allows selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const cities = [
      { id: 1, name: 'São Paulo', latitude: -23.55, longitude: -46.64, country: 'Brazil' },
      { id: 2, name: 'Rio de Janeiro', latitude: -22.9, longitude: -43.2, country: 'Brazil' },
    ];

    render(<CityResults cities={cities} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: /rio de janeiro/i }));

    expect(onSelect).toHaveBeenCalledWith(cities[1]);
  });
});
