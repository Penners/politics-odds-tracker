import { Donut } from "@/components/client/Donut";
import { EVENT_ID, MARKET_ID } from "@/consts/trackedEvents";
import { selectMostRecentOdds } from "@/lib/selectMostRecentOdds";
export const dynamic = "force-dynamic";
export default async function Home() {
  const data = await selectMostRecentOdds(EVENT_ID, MARKET_ID, "SKY_BET");
  return (
    <main className="p-24">
      <Donut
        label={"Next Conservative party leader, implied propability %"}
        data={data.map((x) => ({
          label: x.outcome,
          value: x.impliedPercent ?? 0,
        }))}
      />
    </main>
  );
}
