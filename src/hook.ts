import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store/index';

//типизация useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
//типизация useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
