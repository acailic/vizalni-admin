import { GraphQLResolveInfo } from "graphql";

import { timed, Timing } from "@/utils/timed";

export type Resolver = any;
export type Resolvers = any;

export type Timings = Record<
  string,
  { start: number; end: number; children?: Timings }
>;

const getPathFromInfo = (info: GraphQLResolveInfo) => {
  const path: any[] = [];
  let cur = info.path as GraphQLResolveInfo["path"] | undefined;
  while (cur) {
    path.push(cur);
    cur = cur.prev;
  }
  path.reverse();
  return path;
};

const setTimingInContext = (
  ctx: any,
  path: GraphQLResolveInfo["path"][],
  timing: Timing
) => {
  ctx.timings = ctx.timings || { children: {} };
  let cur = ctx.timings;

  for (let i = 0; i < path.length; i++) {
    const item = path[i];
    cur.children[item.key] = cur.children[item.key] || { children: {} };
    cur = cur.children[item.key];
  }

  Object.assign(cur, timing);
};

/**
 * Modifies in place the resolvers so that they console log their
 * duration if it exceeds threshold.
 */
export const setupFlamegraph = (resolvers: Resolvers) => {
  for (const [, typeResolvers] of Object.entries(resolvers)) {
    if (typeof typeResolvers === "object" && typeResolvers) {
      const typeResolversRecord = typeResolvers as Record<
        string,
        Resolver | undefined
      >;
      for (const [field, fieldResolver] of Object.entries(
        typeResolversRecord
      )) {
        if (
          typeof fieldResolver === "function" &&
          fieldResolver.constructor.name === "AsyncFunction"
        ) {
          typeResolversRecord[field] = timed(
            fieldResolver,
            (timing, ...resolverArgs: Parameters<Resolver>) => {
              const [, , context, info] = resolverArgs;
              const path = info
                ? getPathFromInfo(info as unknown as GraphQLResolveInfo)
                : [];
              setTimingInContext(context, path, timing);
            }
          );
        }
      }
    }
  }
};
