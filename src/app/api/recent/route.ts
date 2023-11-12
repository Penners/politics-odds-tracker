import { EVENT_ID, MARKET_ID } from "@/consts/trackedEvents";
import { selectMostRecentOdds } from "@/lib/selectMostRecentOdds";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  const data = await selectMostRecentOdds(EVENT_ID, MARKET_ID, "SKY_BET");
  return NextResponse.json(data);
}
