import { Button } from "@/components/ui/button";

export default function PatientRefillPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2>Request Refill</h2>
        <p>Submit refill requests to your pharmacy.</p>
      </div>
      <div className="card space-y-4">
        <p className="text-sm text-slate-500">Select a medication and request refill.</p>
        <Button>Request Refill</Button>
      </div>
    </div>
  );
}