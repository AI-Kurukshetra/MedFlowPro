import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const supabase = createSupabaseServerClient();

  if (!payload?.prescription_id) {
    return NextResponse.json({ error: "Missing prescription_id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("prescriptions")
    .update({ status: "routed" })
    .eq("id", payload.prescription_id)
    .select("id, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("audit_logs").insert({
      action: "prescription_routed",
      entity_type: "prescription",
      entity_id: payload.prescription_id,
      metadata: { status: data?.status }
    });
  }

  return NextResponse.json({ success: true, prescription: data });
}

