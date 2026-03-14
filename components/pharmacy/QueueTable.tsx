"use client";

import { useState, useTransition } from "react";
import { fillPrescriptionAction, rejectPrescriptionAction } from "@/app/actions/pharmacy";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface QueueItem {
  id: string;
  patient: string;
  medication: string;
  status: string;
}

interface QueueTableProps {
  initialQueue: QueueItem[];
}

export function QueueTable({ initialQueue }: QueueTableProps) {
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue);
  const [isPending, startTransition] = useTransition();

  const handleFill = (id: string) => {
    startTransition(async () => {
      const result = await fillPrescriptionAction(id);
      if (result.success) {
        setQueue((prev) => prev.filter((item) => item.id !== id));
      }
    });
  };

  const handleReject = (id: string) => {
    startTransition(async () => {
      const result = await rejectPrescriptionAction(id);
      if (result.success) {
        setQueue((prev) => prev.filter((item) => item.id !== id));
      }
    });
  };

  return (
    <div className="card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rx ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Medication</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queue.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id.slice(0, 6)}...</TableCell>
              <TableCell>{item.patient}</TableCell>
              <TableCell>{item.medication}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" onClick={() => handleFill(item.id)} disabled={isPending}>Fill</Button>
                <Button size="sm" variant="ghost" onClick={() => handleReject(item.id)} disabled={isPending}>Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}