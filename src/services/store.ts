import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  TypedUseSelectorHook,
  useDispatch as useDispatchHook,
  useSelector as useSelectorHook
} from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import burgerConstructor from './slices/burger-constructor/slice';
import feed from './slices/feed/slice';
import ingredients from './slices/ingredients/slice';
import order from './slices/order/slice';
import user from './slices/user/slice';

const rootReducer = combineReducers({
  burgerConstructor,
  feed,
  ingredients,
  order,
  user
});

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;

type ApplicationActions = any;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  ApplicationActions
>;

export type AppDispatch = ThunkDispatch<RootState, unknown, ApplicationActions>;

export const useDispatch = () => useDispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorHook;

export default store;
