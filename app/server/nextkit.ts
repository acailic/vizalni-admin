import createAPI, { NextkitError, NextkitHandler } from "nextkit";

import { enforceCsrfProtection, enforceRateLimit } from "@/server/security";

/** Provides type hints */
export const controller = <
  THandlers extends Record<string, NextkitHandler<null, unknown>>,
>(
  methods: THandlers
) => {
  return methods;
};

const baseApi = createAPI({
  async onError(_req, _res, error) {
    if (error instanceof NextkitError) {
      return {
        status: error.code,
        message: error.message,
      };
    }

    return {
      status: 500,
      message: `Something went wrong: ${
        error instanceof Error ? error.message : error
      }`,
    };
  },
});

const applyApiGuards = <
  THandlers extends Record<string, NextkitHandler<null, unknown>>,
>(
  handlers: THandlers
) =>
  Object.fromEntries(
    Object.entries(handlers).map(([method, handler]) => [
      method,
      async ({ req, res, ctx }) => {
        enforceRateLimit(req, res, "api");
        enforceCsrfProtection(req);
        return handler({ req, res, ctx } as Parameters<typeof handler>[0]);
      },
    ])
  ) as THandlers;

export const api = (handlers: any) => baseApi(applyApiGuards(handlers)) as any;
(api as any).raw = baseApi.raw;
