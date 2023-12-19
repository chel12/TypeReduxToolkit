import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
type Todo = {
	id:string,
	title:string,
	completed:boolean
}

const todoSlice = createSlice({
	name: 'todos',
	initialState: {
		todos: [],
	},

	reducers: {
		addTodo(state, action) {
			state.todos.push(
				id: new Date().toISOString(),
				title: action.payload.text,
				completed: false,
				
			);
		},
		toggleTodoCompleted(state, action) {
			const toggledTodo = state.todos.find(
				(todo) => todo.id === action.payload.id
			);
			toggledTodo.completed = !toggledTodo.completed;
		},
		removeTodo(state, action) {
			state.todos = state.todos.filter(
				(todo) => todo.id !== action.payload.id
			);
		},
		
	},
};

export const { addTodo, removeTodo, toggleTodoCompleted } = todoSlice.actions;
export default todoSlice.reducer;