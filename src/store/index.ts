import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

const store = configureStore({
	reducer: {
		todos: todoReducer,
	},
});
export default store;

//РетурТайп утилита возвращения типа
export type RootState = ReturnType<typeof store.getState>;

//эти типы нужны для работы с хуками
export type AppDispatch = typeof store.dispatch;
