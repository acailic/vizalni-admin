import SuperJSON from "superjson";

import { defaultLocale } from "@/locales/locales";
import { api } from "@/server/nextkit";
import { fetchStatisticsSummary } from "@/statistics/summary";

const route = api({
  GET: async ({ req }: { req: any }) => {
    const locale =
      typeof req.query.locale === "string" ? req.query.locale : defaultLocale;

    return SuperJSON.serialize(await fetchStatisticsSummary(locale));
  },
});

export default route;
