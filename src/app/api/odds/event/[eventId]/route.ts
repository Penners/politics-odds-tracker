import { getEventsForCategory, getOddsForEvent } from "@/clients/skybet";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const eventId = params.eventId;
  const data = await getOddsForEvent(eventId);
  return NextResponse.json(data.data);
}
