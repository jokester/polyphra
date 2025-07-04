import { createContext, useContext } from "react";
import type { PolyphraApiClient } from "../api";

const ApiHolder = createContext<PolyphraApiClient>(null!);

export const ApiProvider = ApiHolder.Provider;

export const useApiClient = () => useContext(ApiHolder);
