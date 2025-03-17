// app/api/webhook/route.ts
import { NextResponse } from "next/server";
const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN as string;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    return new Response(challenge, { status: 200 }); // Return the challenge as plain text
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json(); // Parse incoming JSON
    console.log("Webhook received:", data); // Log the data

    // TODO: Add your logic to process the webhook data

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
