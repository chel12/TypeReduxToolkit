import {
	createSlice,
	PayloadAction,
	createAsyncThunk,
	AnyAction,
} from '@reduxjs/toolkit';

//PayloadAction для типизации экшенов
type Todo = {
	id: string;
	title: string;
	completed: boolean;
};

type TodosState = {
	list: Todo[];
	loading: boolean;
	error: null | string;
};
const initialState: TodosState = {
	list: [],
	loading: false,
	error: null,
};

//!Санка на получение
//передача типа дженериком, 1 который ожидаем принять, 2 тип параметров передаваемых,
// 3 тип (можно подсмотреть тыкнув на санку и найти там AsyncThunkConfig)
export const fetchTodos = createAsyncThunk<
	Todo[],
	undefined,
	{ rejectValue: string }
>(
	'todos/fetchTodos', //имя в санка надо писать вручную
	async function (_, { rejectWithValue }) {
		const response = await fetch(
			'https://jsonplaceholder.typicode.com/todos?_limit=10'
		);

		if (!response.ok) {
			return rejectWithValue('Server Error!');
		}
		const data = await response.json();
		return data;
	}
);

//!Санка на добавление Туду
//диспатч убрал, идём через extraReducer
export const addNewTodo = createAsyncThunk<
	Todo,
	string,
	{ rejectValue: string }
>('todos/addNewTodo', async function (text, { rejectWithValue }) {
	//принимаем текст

	const todo = {
		title: text,
		userId: 1,
		completed: false,
	};
	const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(todo),
	});

	if (!response.ok) {
		return rejectWithValue('Can `t add task. Server error.');
	}

	//вернуть ответ в json и принимать как type Todo
	return (await response.json()) as Todo;
});

//!Санка на тогл
//потребуется ещё доп операция, описать структуру с которой работаем state: { todos: TodosState }

export const toggleStatus = createAsyncThunk<
	Todo,
	string,
	{ rejectValue: string; state: { todos: TodosState } }
>(
	'todos/toggleStatus',
	async function (id, { rejectWithValue, dispatch, getState }) {
		//найти тудушку
		const todo = getState().todos.list.find((todo) => todo.id === id);
		if (todo) {
			const response = await fetch(
				`https://jsonplaceholder.typicode.com/todos/${id}`,
				{
					method: 'PATCH', //метод обновления
					headers: {
						'Content-Type': 'application/json',
					},
					//изменять статус но для этого надо его получить через гет стейт
					body: JSON.stringify({
						completed: !todo.completed,
					}),
				}
			);
			if (!response.ok) {
				return rejectWithValue('Can `t toggle status. Server error.');
			}

			return (await response.json()) as Todo;
		}
		return rejectWithValue('No such todo in list!');
	}
);
//!Санка удаления
export const deleteTodo = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('todo/deleteTodo', async function (id, { rejectWithValue }) {
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/todos/${id}`,
		{ method: 'DELETE' }
	);

	if (!response.ok) {
		return rejectWithValue('Can `t delete task. Server error.');
	}
	return id;
});

const todoSlice = createSlice({
	name: 'todos',
	initialState,

	reducers: {
		// 	addTodo(state, action: PayloadAction<string>) {
		// 		state.list.push({
		// 			id: new Date().toISOString(),
		// 			title: action.payload,
		// 			completed: false,
		// 		});
		// 	},
		// 	toggleTodoCompleted(state, action: PayloadAction<string>) {
		// 		const toggledTodo = state.list.find(
		// 			(todo) => todo.id === action.payload
		// 		);
		// 		//нужна провоерка есть ли обьект, после экшена
		// 		if (toggledTodo) {
		// 			toggledTodo.completed = !toggledTodo.completed;
		// 		}
		// 	},
		// 	removeTodo(state, action: PayloadAction<string>) {
		// 		state.list = state.list.filter(
		// 			(todo) => todo.id !== action.payload
		// 		);
		// 	},
	},
	//важный нюанс использовать builder при работе с TS
	//экстра редьюсер это - каждый асинк экшен возвращает ещё доп 3 экшена (pending,fullfield,rejected) и их можно обрабатывать в экстра редьюсере
	//в экстра редьюсере не нужно типизировать экшен
	extraReducers: (builder) => {
		builder
			.addCase(fetchTodos.pending, (state, action) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTodos.fulfilled, (state, action) => {
				//в случае успеха запроса стейт лист = тому что пришло
				state.list = action.payload;
				state.loading = false;
				state.error = null;
			})
			.addCase(addNewTodo.pending, (state) => {
				state.error = null;
			})
			.addCase(addNewTodo.fulfilled, (state, action) => {
				state.list.push(action.payload);
			})
			.addCase(toggleStatus.fulfilled, (state, action) => {
				const toggledTodo = state.list.find(
					(todo) => todo.id === action.payload.id
				);
				if (toggledTodo) {
					toggledTodo.completed = !toggledTodo.completed;
				}
			})
			.addCase(deleteTodo.fulfilled, (state, action) => {
				state.list = state.list.filter(
					(todo) => todo.id !== action.payload
				);
			})
			//чтобы для всех не писать reject, есть addMatcher для него нужно написать функцию предикат. Ниже isError ()
			//тут типизируем, что в случае ошибки, получим строку
			.addMatcher(isError, (state, action: PayloadAction<string>) => {
				//ошибка будет равна экшен-ответу, который прийдёт как строка
				state.error = action.payload;
				//загрузка больше производится
				state.loading = false;
			});
	},
});

// export const { addTodo, removeTodo, toggleTodoCompleted } = todoSlice.actions;
export default todoSlice.reducer;
//функцию предикат что-то принимает  и возвращает true или false
//проверка action на ошибку, но его нужно описать спец типом AnyAction
function isError(action: AnyAction) {
	return action.type.endsWith('rejected');
}
