import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//PayloadAction для типизации экшенов
type Todo = {
	id: string;
	title: string;
	completed: boolean;
};

type TodosState = {
	list: Todo[];
};
const initialState: TodosState = {
	list: [],
};

const todoSlice = createSlice({
	name: 'todos',
	initialState,

	reducers: {
		addTodo(state, action: PayloadAction<string>) {
			state.list.push({
				id: new Date().toISOString(),
				title: action.payload,
				completed: false,
			});
		},
		toggleTodoCompleted(state, action: PayloadAction<string>) {
			const toggledTodo = state.list.find(
				(todo) => todo.id === action.payload
			);
			//нужна провоерка есть ли обьект, после экшена
			if (toggledTodo) {
				toggledTodo.completed = !toggledTodo.completed;
			}
		},
		removeTodo(state, action: PayloadAction<string>) {
			state.list = state.list.filter(
				(todo) => todo.id !== action.payload
			);
		},
	},
});

export const { addTodo, removeTodo, toggleTodoCompleted } = todoSlice.actions;
export default todoSlice.reducer;
