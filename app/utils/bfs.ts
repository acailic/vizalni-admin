import { HierarchyValue } from "@/domain/data";

const IGNORE = {};

/**
 * Note: This BFS implementation differs from visitHierarchy (which is DFS).
 * Keep both as they serve different traversal needs.
 */
export const bfs = function <T extends unknown>(
  tree: HierarchyValue[],
  visitor: (
    node: HierarchyValue,
    { depth, parents }: { depth: number; parents: HierarchyValue[] }
  ) => T
) {
  const q = [
    ...tree.map((n) => ({
      node: n,
      depth: 0,
      parents: [] as HierarchyValue[],
    })),
  ].reverse();
  const res: T[] = [];
  while (q.length > 0) {
    const popped = q.shift()!;
    const { node, depth, parents } = popped;
    const visitResult = visitor(node, { depth, parents });
    if (visitResult === bfs.IGNORE) {
      continue;
    }
    res.push(visitResult);
    const childrenParents = [...parents, node];
    if (node?.children && node.children.length > 0) {
      for (let child of node.children) {
        q.push({ node: child, depth: depth + 1, parents: childrenParents });
      }
    }
  }
  return res;
};

/**
 * Sentinel value meant to be returned from visitor callbacks
 * if the concerned nodes and its children should be ignored
 * by the DFS.
 */
bfs.IGNORE = IGNORE;
