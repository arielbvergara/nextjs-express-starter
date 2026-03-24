import { ReactNode } from "react";
import Link from "next/link";

interface FormSuccessBannerProps {
  emoji: string;
  title: string;
  message: ReactNode;
  onReset: () => void;
  resetLabel: string;
  backHref: string;
  backLabel: string;
  children?: ReactNode;
}

export function FormSuccessBanner({
  emoji,
  title,
  message,
  onReset,
  resetLabel,
  backHref,
  backLabel,
  children,
}: FormSuccessBannerProps) {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
          <div className="text-4xl mb-3">{emoji}</div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">{title}</h1>
          <div className="text-green-700 mb-6">{message}</div>
          {children}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onReset}
              className="rounded-lg border border-green-300 px-4 py-2 text-sm text-green-700 hover:bg-green-100 transition-colors"
            >
              {resetLabel}
            </button>
            <Link
              href={backHref}
              className="rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800 transition-colors"
            >
              {backLabel}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
