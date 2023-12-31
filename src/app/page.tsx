import { Donut } from "@/components/client/Donut";
import { LineChart } from "@/components/client/Line";
import { EVENT_ID, MARKET_ID } from "@/consts/trackedEvents";
import { selectMostRecentOdds } from "@/lib/selectMostRecentOdds";
import { selectTimeSeriesOdds } from "@/lib/selectTimeSeriesOdds";
import { unstable_cache } from "next/cache";
export const dynamic = "force-dynamic";

const getCachedRecentOdds = unstable_cache(
  async () => selectMostRecentOdds(EVENT_ID, MARKET_ID, "SKY_BET"),
  [`getCachedRecentOdds`],
  {
    revalidate: 60 * 60,
    tags: [`EVENT:${EVENT_ID}`],
  }
);

const getCachedTimeSeriesOdds = unstable_cache(
  async () => selectTimeSeriesOdds(EVENT_ID, MARKET_ID, "SKY_BET"),
  [`getCachedTimeSeriesOdds`],
  {
    revalidate: 60 * 60,
    tags: [`EVENT:${EVENT_ID}`],
  }
);

export default async function Home() {
  const data = await getCachedRecentOdds();
  const timeData = await getCachedTimeSeriesOdds();
  return (
    <main>
      <h1 className="p-4">Next Conservative party leader betting odds</h1>
      <div className="card m-4 bg-white">
        <div className="card-body">
          <LineChart data={timeData} />
        </div>
      </div>

      <div className="card m-4 bg-white">
        <div className="card-body">
          <h3>Current betting odds sourced from Skybet</h3>
          <div className="overflow-x-auto">
            <table className="table table-xs table-pin-rows table-pin-cols">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Odds Fractional (UK)</th>
                  <th>Odds Decimal (EU)</th>
                  <th>Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {data.map((x) => {
                  return (
                    <tr key={x.outcome}>
                      <th>{x.outcome}</th>
                      <td>{x.oddsFractional}</td>
                      <td>{x.oddsDecimal?.toFixed(2)}</td>
                      <td suppressHydrationWarning>
                        {new Date(x.timestamp).toISOString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="card m-4 bg-white">
        <div className="card-body">
          <Donut
            label={"Next Conservative party leader, implied propability %"}
            data={data.map((x) => ({
              label: x.outcome,
              value: x.impliedPercent ?? 0,
            }))}
          />
        </div>
      </div>
    </main>
  );
}
