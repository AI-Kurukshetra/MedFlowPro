export default function PatientRemindersPage() {
  const reminders = [
    "Take Metformin with breakfast",
    "Evening dose of Lisinopril at 8:00 PM",
    "Refill request due in 3 days"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2>Reminders</h2>
        <p>Stay on track with medication schedules.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {reminders.map((reminder) => (
          <div key={reminder} className="card text-sm text-slate-600">
            {reminder}
          </div>
        ))}
      </div>
    </div>
  );
}