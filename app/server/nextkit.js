import createAPI, { NextkitError } from "nextkit";

import { enforceCsrfProtection, enforceRateLimit, } from "@/server/security";
/** Provides type hints */
export const controller = (methods) => {
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
            message: `Something went wrong: ${error instanceof Error ? error.message : error}`,
        };
    },
});
const applyApiGuards = (handlers) => Object.fromEntries(Object.entries(handlers).map(([method, handler]) => [
    method,
    async ({ req, res, ctx }) => {
        enforceRateLimit(req, res, "api");
        enforceCsrfProtection(req);
        return handler({ req, res, ctx });
    },
]));
export const api = (handlers) => baseApi(applyApiGuards(handlers));
