"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export interface PharmacyOption {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
}

interface PharmacySelectorProps {
  options: PharmacyOption[];
  onSelect: (pharmacy: PharmacyOption) => void;
}

export function PharmacySelector({ options, onSelect }: PharmacySelectorProps) {
  const [query, setQuery] = useState("");

  const filtered = options.filter((pharmacy) =>
    pharmacy.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search pharmacy by name"
      />
      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((pharmacy) => (
          <Card key={pharmacy.id} className="surface-card">
            <CardContent>
              <button
                className="w-full text-left"
                onClick={() => onSelect(pharmacy)}
              >
                <p className="text-sm font-semibold text-slate-900">{pharmacy.name}</p>
                <p className="text-xs text-slate-500">{pharmacy.address}</p>
                <p className="text-xs text-slate-500">{pharmacy.city}, {pharmacy.state}</p>
                <p className="text-xs text-slate-500">{pharmacy.phone}</p>
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
