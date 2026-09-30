import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchForm from '../../src/components/SearchForm';

describe('SearchForm', () => {
  it('submits the current query', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <SearchForm
        value="Belo Horizonte"
        onChange={vi.fn()}
        onSubmit={onSubmit}
        isLoading={false}
      />,
    );

    await user.click(screen.getByRole('button', { name: /buscar/i }));

    expect(onSubmit).toHaveBeenCalledWith('Belo Horizonte');
  });

  it('shows loading state while searching', () => {
    render(<SearchForm value="Curitiba" onChange={vi.fn()} onSubmit={vi.fn()} isLoading />);

    expect(screen.getByRole('status')).toHaveTextContent('Buscando cidade');
  });
});
