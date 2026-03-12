import Router, { SingletonRouter } from "next/router";
import { create, StateCreator, StoreApi } from "zustand";

import { DataSource } from "@/configurator";
import {
  DEFAULT_DATA_SOURCE,
  parseSourceByLabel,
  sourceToLabel,
} from "@/domain/data-source";
import { maybeWindow } from "@/utils/maybe-window";
import { getURLParam, setURLParam } from "@/utils/router/helpers";

type DataSourceStore = {
  dataSource: DataSource;
  setDataSource: (value: DataSource) => void;
};

const PARAM_KEY = "dataSource";

/**
 * Saves data source to localStorage for persistence.
 *
 * @param value - The data source to save
 */
const saveToLocalStorage = (value: DataSource) => {
  try {
    localStorage.setItem(PARAM_KEY, sourceToLabel(value));
  } catch (error) {
    console.error("Error saving data source to localStorage", error);
  }
};

/**
 * Retrieves data source from localStorage.
 *
 * @returns The saved data source, or undefined if not found
 */
export const getDataSourceFromLocalStorage = () => {
  try {
    const dataSourceLabel = localStorage.getItem(PARAM_KEY);

    if (dataSourceLabel) {
      return parseSourceByLabel(dataSourceLabel);
    }
  } catch (error) {
    console.error("Error getting data source from localStorage", error);
  }
};

/**
 * Checks if the data source should be persisted in URL for a given path.
 *
 * @param pathname - The current route pathname
 * @returns true if source should be in URL, false otherwise
 */
const shouldKeepSourceInURL = (pathname: string) => {
  return !pathname.includes("__test");
};

const saveToURL = (dataSource: DataSource) => {
  const urlDataSourceLabel = getURLParam(PARAM_KEY);
  const dataSourceLabel = sourceToLabel(dataSource);

  if (urlDataSourceLabel !== dataSourceLabel) {
    setURLParam(PARAM_KEY, dataSourceLabel);
  }
};

/**
 * Custom middleware that saves data source to localStorage and URL.
 *
 * On initialization it tries to first retrieve data source from the
 * URL (stored as label: Prod, Int, Test); if it's not there, tries with
 * localStorage (also stored as label), otherwise uses a default data source.
 *
 * @param config - Zustand state creator
 * @param router - Next.js router instance
 * @returns Zustand middleware function with data source persistence
 */
const dataSourceStoreMiddleware =
  (config: StateCreator<DataSourceStore>, router: SingletonRouter) =>
  (
    set: StoreApi<DataSourceStore>["setState"],
    get: StoreApi<DataSourceStore>["getState"],
    api: StoreApi<DataSourceStore>
  ) => {
    const window = maybeWindow();
    const state = config(
      (payload: DataSourceStore) => {
        set(payload);

        if (window) {
          saveToLocalStorage(payload.dataSource);
          saveToURL(payload.dataSource);
        }
      },
      get,
      api
    );

    let dataSource = DEFAULT_DATA_SOURCE;

    if (window) {
      const urlDataSourceLabel = getURLParam(PARAM_KEY);
      const urlDataSource = urlDataSourceLabel
        ? parseSourceByLabel(urlDataSourceLabel)
        : undefined;

      if (urlDataSourceLabel && urlDataSource) {
        dataSource = urlDataSource;
        saveToLocalStorage(urlDataSource);
      } else {
        const storageDataSource = getDataSourceFromLocalStorage();

        if (storageDataSource) {
          dataSource = storageDataSource;
        } else {
          saveToLocalStorage(dataSource);
        }
      }
    }

    const callback = () => {
      const newSource = get()?.dataSource;

      if (newSource && shouldKeepSourceInURL(router.pathname)) {
        saveToURL(newSource);
      }
    };

    // No need to unsubscribe, as store is created once and needs to update
    // URL continuously.
    router.events.on("routeChangeComplete", callback);

    // Initialize with correct url.
    router.ready(callback);

    return { ...state, dataSource };
  };

/**
 * Creates a Zustand store for managing data source state.
 *
 * @param router - Next.js router instance
 * @returns Zustand store with dataSource state and setDataSource action
 */
export const createUseDataSourceStore = (router: SingletonRouter) =>
  create<DataSourceStore>(
    dataSourceStoreMiddleware(
      (set) => ({
        dataSource: DEFAULT_DATA_SOURCE,
        setDataSource: (value) => set({ dataSource: value }),
      }),
      router
    )
  );

export const useDataSourceStore = createUseDataSourceStore(Router);
