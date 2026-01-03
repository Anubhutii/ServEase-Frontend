import { useContext } from "react";
import { ApiContext } from "./ApiContext";

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used inside ApiProvider");
  }
  return context;
};
