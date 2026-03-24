"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import type { MenuItem } from "@/types";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    api.menu.list().then((res) => {
      if (res.success && res.data) {
        setItems(res.data);
      } else {
        setErrorMessage(res.error ?? "Failed to load menu");
      }
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Our Menu</h1>
          <p className="text-[var(--muted)]">Explore our selection of dishes</p>
        </div>

        {loading ? (
          <div className="rounded-lg border border-[var(--border)] p-6 text-center text-[var(--muted)]">
            Loading menu…
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-[var(--border)] p-6 text-center text-[var(--muted)]">
            {errorMessage}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-[var(--border)] p-6 text-center text-[var(--muted)]">
            No menu items available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-[var(--border)] overflow-hidden flex flex-col"
              >
                {item.imageUrl ? (
                  <div className="aspect-video overflow-hidden bg-[var(--border)] relative">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-[var(--border)] flex items-center justify-center text-[var(--muted)] text-sm">
                    No image
                  </div>
                )}

                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="text-[var(--muted)] text-sm mt-1">{item.description}</p>
                  </div>

                  <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--muted)]">{item.price1Description}</span>
                      <span className="font-semibold">{item.price1}</span>
                    </div>
                    {item.price2Description && item.price2 && (
                      <div className="flex items-center justify-between text-sm border-t border-[var(--border)] pt-2">
                        <span className="text-[var(--muted)]">{item.price2Description}</span>
                        <span className="font-semibold">{item.price2}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 text-center">
          <Link
            href="/"
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
