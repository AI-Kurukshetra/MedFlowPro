import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PatientProfilePage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: patient } = await supabase
    .from("patients")
    .select("full_name, age, gender")
    .eq("user_id", user?.id ?? "")
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h2>My Profile</h2>
        <p>Review your demographics and contact info.</p>
      </div>
      <div className="card space-y-3">
        <p className="text-sm text-slate-500">Name: {patient?.full_name ?? "-"}</p>
        <p className="text-sm text-slate-500">Age: {patient?.age ?? "-"}</p>
        <p className="text-sm text-slate-500">Gender: {patient?.gender ?? "-"}</p>
      </div>
    </div>
  );
}