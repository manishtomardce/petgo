// app/api/send-whatsapp/route.ts

import { NextResponse } from "next/server";
import Twilio from "twilio";

export async function POST(req: Request) {
    try {
      const { phone, clubName, service, date } = await req.json();
  
      const client = Twilio(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_AUTH_TOKEN!
      );
  
      const response = await client.messages.create({
        body: `PetGo Booking Confirmed 🐾
  
  Club: ${clubName}
  Service: ${service}
  Date: ${date}`,
        from: process.env.TWILIO_WHATSAPP_NUMBER!,
        to: `whatsapp:${phone}`,
      });
  
      console.log("WhatsApp sent:", response.sid);
  
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error("WhatsApp ERROR:", error);
  
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }