import { NextResponse } from "next/server";
import { notifyNewInquiryEmail } from "@/lib/inquiry-notification-email";
import { getSupabaseServerClient } from "@/lib/supabase";

type InquiryPayload = {
  name?: string;
  phone?: string;
  contactType?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InquiryPayload;
    const requiredFields = ["name", "phone", "contactType", "email", "message"] as const;
    const missingField = requiredFields.find((field) => !body[field]?.trim());

    if (missingField) {
      return NextResponse.json(
        { error: `Field "${missingField}" is required.` },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    const tableName = process.env.SUPABASE_INQUIRIES_TABLE || "hikuada_leads";
    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const contactType = body.contactType?.trim().toLowerCase();
    const email = body.email?.trim();
    const message = body.message?.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedContactTypes = new Set(["whatsapp", "zalo"]);

    if (!email || !emailPattern.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!contactType || !allowedContactTypes.has(contactType)) {
      return NextResponse.json({ error: "Please choose WhatsApp or Zalo." }, { status: 400 });
    }

    const { error } = await supabase.from(tableName).insert({
      customer_name: name,
      whatsapp_zalo: phone,
      contact_type: contactType,
      email,
      message,
    });

    if (error) {
      return NextResponse.json(
        { error: `Failed to submit inquiry. ${error.message}` },
        { status: 500 },
      );
    }

    await notifyNewInquiryEmail({
      name: name!,
      phone: phone!,
      contactType: contactType!,
      email,
      message: message!,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
