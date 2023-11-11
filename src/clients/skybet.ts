import axios from "axios";
import * as AxiosLogger from "axios-logger";

const randUserAgent =
  "Mozilla/5.0 (PPC) AppleWebKit/508.0 (KHTML, live Gecko) Chrome/22.01167.212 Safari/508";

const instance = axios.create({
  baseURL: "https://services.skybet.com/sportsapi/v2",
  params: {
    api_user: "",
  },
});
//@ts-ignore
instance.interceptors.request.use(AxiosLogger.requestLogger);
instance.interceptors.response.use(
  AxiosLogger.responseLogger,
  AxiosLogger.errorLogger
);

export interface getEventCategories {
  event_classes: EventClass[];
}

export interface EventClass {
  name: string;
  url: string;
  id: number;
}

export const getEventCategories = async () => {
  try {
    const data = await instance.get<getEventCategories>("/a-z", {
      headers: {
        "User-Agent": randUserAgent,
      },
    });
    return {
      data: data.data.event_classes.map((category) => ({
        name: category.name,
        slug: category.url.replace("/sportsapi/v2/", ""),
        link: `/api/odds/${category.url.replace("/sportsapi/v2/", "")}/events`,
      })),
      error: false,
    };
  } catch (e) {
    return { data: null, error: true };
  }
};

export type GetEventsForCategory = {
  events: { [key: string]: GetEventsForCategoryEvent };
  events_sort: string[];
  liveBetting: any[];
  name: string;
  ev_class_id: number;
};

export type GetEventsForCategoryEvent = {
  name: string;
  events: { [key: string]: EventEvent };
  eventSort: string[];
};

export type EventEvent = {
  desc: string;
  start_time: number;
  settled: boolean;
  outright: boolean;
  url: string;
};

export const getEventsForCategory = async (categorySlug: string) => {
  try {
    const response = await instance.get<GetEventsForCategory>(
      `${categorySlug}`,
      {
        headers: {
          "User-Agent": randUserAgent,
        },
      }
    );
    return {
      data: Object.entries(response.data.events).map(
        ([eventCatId, eventCat]) => ({
          eventCategoryId: eventCatId,
          ...eventCat,
          event_sort: undefined,
          events: Object.entries(eventCat.events).map(([eventId, ev]) => ({
            eventId,
            ...ev,
            url: undefined,
            link: `/api/odds/event/${eventId}`,
          })),
        })
      ),
      error: null,
    };
  } catch (e) {
    return { error: true, data: null };
  }
};

export interface GetOddsForEvent {
  desc: string;
  notes: DataNotes;
  linked_event: null;
  ev_id: number;
  ev_type_id: number;
  ev_class_id: number;
  settled: boolean;
  suspended: boolean;
  started: boolean;
  ev_class_name: string;
  ev_type_name: string;
  start_time: number;
  outright: boolean;
  num_mkts: number;
  market_sort: string[];
  markets: { [key: string]: Market };
}

export interface Market {
  ev_mkt_id: number | string;
  gp_avail: boolean;
  bet_in_run: boolean;
  name: string;
  suspended: boolean;
  notes: MarketNotes;
  view_type: string;
  outcome_sort: string[];
  outcomes: { [key: string]: Outcome };
}

export interface MarketNotes {
  essential: string;
  promo: string;
  terms: string;
}

export interface Outcome {
  ev_oc_id: number;
  desc: string;
  result: string;
  lp_num: string;
  lp_den: string;
  fb_result: string;
  suspended: boolean;
  price_direction: number;
  lp_decimal: number;
  has_lp: boolean;
  has_sp: boolean;
  is_void: boolean;
  runner_num?: number;
  lp_disp_fraction: string;
  lp_disp_decimal: string;
}

export interface DataNotes {
  essential: string;
  promo: string;
}

export const getOddsForEvent = async (eventId: string | number) => {
  try {
    const response = await instance.get<GetOddsForEvent>(`/event/${eventId}`, {
      headers: {
        "User-Agent": randUserAgent,
      },
    });
    return {
      data: {
        ...response.data,
        markets: Object.values(response.data.markets).map((market) => ({
          marketId: market.ev_mkt_id,
          ...market,
          outcomes: Object.values(market.outcomes).map((outcome) => ({
            outcomeId: outcome.ev_oc_id,
            ...outcome,
          })),
        })),
      },
      error: false,
    };
  } catch (e) {
    return { error: true, data: null };
  }
};
