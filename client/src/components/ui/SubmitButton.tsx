interface SubmitButtonProps {
  loading: boolean;
  label: string;
  loadingLabel?: string;
}

export function SubmitButton({ loading, label, loadingLabel = "Sending…" }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
