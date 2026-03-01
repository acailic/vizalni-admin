import { getConfig } from "../../../db/config";
import { api } from "../../../server/nextkit";
import { validateConfigKey } from "../../../server/validation";

const route = api({
  GET: async ({ req }: { req: any }) => {
    // Validate input
    const key = validateConfigKey(req.query.key);

    const result = await getConfig(key);
    if (result) {
      return result;
    }
  },
});

export default route;
