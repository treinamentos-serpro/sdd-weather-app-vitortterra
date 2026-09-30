interface StatusMessageProps {
  status: 'idle' | 'loading' | 'success' | 'error' | 'empty';
  query?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export default function StatusMessage({
  status,
  query,
  errorMessage,
  onRetry,
}: StatusMessageProps) {
  if (status === 'loading') {
    return (
      <div
        role="status"
        className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 text-sky-100"
      >
        Buscando o clima para {query || 'a cidade selecionada'}…
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-100"
      >
        <p className="font-medium">Não foi possível buscar o clima.</p>
        {errorMessage ? <p className="mt-1 text-sm">{errorMessage}</p> : null}
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-md bg-red-500 px-3 py-1 text-sm text-white"
          >
            Tentar novamente
          </button>
        ) : null}
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-slate-300">
        {query
          ? `Nenhuma cidade encontrada para “${query}”.`
          : 'Busque por uma cidade para ver o clima.'}
      </div>
    );
  }

  if (status === 'idle') {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-slate-300">
        Digite uma cidade para consultar a previsão.
      </div>
    );
  }

  return null;
}
