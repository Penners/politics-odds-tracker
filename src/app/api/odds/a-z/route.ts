import { getEventCategories } from "@/clients/skybet";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const data = await getEventCategories();
  return NextResponse.json(data.data);
}
