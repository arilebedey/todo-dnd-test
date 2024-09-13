import type { AppDispatch, RootState } from "./store";
import { useDispatch, useSelector } from "react-redux";

// From redux docs. For use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
