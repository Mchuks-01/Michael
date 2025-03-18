// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN as string;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK_VERIFIED");
    return new NextResponse(challenge, { status: 200, headers: { "Content-Type": "text/plain" } }); // Ensure plain text response
  } else {
    console.warn("❌ WEBHOOK_VERIFICATION_FAILED");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("📩 Webhook received:", JSON.stringify(data, null, 2));

    // TODO: Process webhook data here (e.g., save to database, trigger actions, etc.)

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }
}

