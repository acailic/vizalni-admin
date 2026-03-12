/**
 * We need to access the map from the map controls. Until we have a good solution
 * for sibling components, we use a global non-observable ref.
 */
let map: any | null = null;

const getMap = () => {
  return map;
};

const setMap = (d: any | null) => {
  map = d;
};

export { getMap, setMap };
