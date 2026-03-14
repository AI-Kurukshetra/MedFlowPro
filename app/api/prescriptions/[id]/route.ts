import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface RouteProps {
  params: { id: string };
}

export async function GET(request: Request, { params }: RouteProps) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prescriptions")
    .select("id, status, created_at, patient_id, pharmacy_id, provider_id")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("audit_logs").insert({
      action: "prescription_accessed",
      entity_type: "prescription",
      entity_id: params.id,
      metadata: { route: "api" }
    });
  }

  return NextResponse.json({ data });
}
