import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import StatusMessage from '../../src/components/StatusMessage';

describe('StatusMessage', () => {
  it('renders loading status', () => {
    render(<StatusMessage status="loading" query="Lisboa" />);
    expect(screen.getByRole('status')).toHaveTextContent('Lisboa');
  });

  it('renders error and retry button', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<StatusMessage status="error" query="Lisboa" errorMessage="Falhou" onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: /tentar novamente/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
