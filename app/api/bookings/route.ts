import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";
import { createClient } from "@/lib/supabase";

function normalizeIndianPhone(phone: string) {
  const cleaned = String(phone || "").replace(/[^\d+]/g, "").trim();

  if (!cleaned) return "";
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("91") && cleaned.length === 12) return `+${cleaned}`;
  if (cleaned.length === 10) return `+91${cleaned}`;

  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      club_id,
      club_name,
      service,
      service_type,
      check_in,
      check_out,
      pets_count,
      pets,
      pet_name,
      pet_breed,
      pet_size,
      owner_name,
      phone,
      instructions,
    } = body;

    const normalizedClubId = String(club_id || "").trim();
    const normalizedPhone = normalizeIndianPhone(phone);

    if (
      !normalizedClubId ||
      !owner_name ||
      !normalizedPhone ||
      !check_in ||
      !service_type
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missing: {
            club_id: !normalizedClubId,
            owner_name: !owner_name,
            phone: !normalizedPhone,
            check_in: !check_in,
            service_type: !service_type,
          },
        },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const petDetails =
      Array.isArray(pets) && pets.length
        ? pets.map((pet: { name?: string; breed?: string; size?: string }) => ({
            name: pet?.name || "",
            breed: pet?.breed || "",
            size: pet?.size || "small",
          }))
        : [
            {
              name: pet_name || "",
              breed: pet_breed || "",
              size: pet_size || "small",
            },
          ];

    const insertPayload = {
      club_id: normalizedClubId,
      club_name,
      owner_name,
      owner_phone: normalizedPhone,
      owner_email: null,
      booking_date: check_in,
      booking_time: check_out || null,
      service_type,
      pets_count: Number(pets_count) || 1,
      pet_details: petDetails,
      notes: instructions || "",
      status: "confirmed",
      service: service || null,
      check_in,
      check_out: check_out || null,
      phone: normalizedPhone,
      pet_name: pet_name || petDetails[0]?.name || "",
      pet_breed: pet_breed || petDetails[0]?.breed || "",
      pet_size: pet_size || petDetails[0]?.size || "small",
      instructions: instructions || "",
    };

    const { data, error } = await supabase
      .from("bookings")
      .insert([insertPayload])
      .select("id, club_id")
      .single();

    if (error) {
      console.error("Insert booking error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to save booking" },
        { status: 500 }
      );
    }

    let whatsappSent = false;

    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

      if (!accountSid || !authToken || !twilioWhatsappNumber) {
        console.warn("Twilio env vars missing. Skipping WhatsApp notification.");
      } else {
        const client = Twilio(accountSid, authToken);

        const messageBody = `PetGo booking confirmed 🐾

Hi ${owner_name},

Your booking has been received successfully.

Club: ${club_name}
Service: ${service_type}
Check-in: ${check_in}${check_out ? `\nCheck-out / Time: ${check_out}` : ""}
Pet: ${pet_name || petDetails[0]?.name || "Your pet"}

Booking ID: ${data.id}

We will contact you shortly.`;

        const twilioMessage = await client.messages.create({
          body: messageBody,
          from: twilioWhatsappNumber,
          to: `whatsapp:${normalizedPhone}`,
        });

        console.log("WhatsApp sent:", twilioMessage.sid);
        whatsappSent = true;
      }
    } catch (whatsAppError) {
      console.error("WhatsApp send failed, but booking saved:", whatsAppError);
    }

    return NextResponse.json({
      success: true,
      bookingId: data.id,
      clubId: data.club_id,
      whatsappSent,
    });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}