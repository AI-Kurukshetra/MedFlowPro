import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { prescription_id, patient_id, doctor_id, patient_notes } = await request.json();

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check no pending refill already exists
  const { data: existing } = await supabase
    .from("refill_requests")
    .select("id")
    .eq("prescription_id", prescription_id)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "A refill request is already pending for this prescription." }, { status: 409 });
  }

  const { error } = await supabase
    .from("refill_requests")
    .insert({ prescription_id, patient_id, doctor_id, patient_notes: patient_notes || null });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const { id, status, doctor_notes } = await request.json();

  if (!["approved", "denied"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("refill_requests")
    .update({ status, doctor_notes: doctor_notes || null, responded_at: new Date().toISOString() })
    .eq("id", id)
    .eq("doctor_id", session.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
