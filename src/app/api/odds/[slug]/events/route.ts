import { getEventsForCategory } from "@/clients/skybet";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const data = await getEventsForCategory(slug);
  return NextResponse.json(data);
}
