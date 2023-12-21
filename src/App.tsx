import React, { useState, useEffect } from 'react';
import './App.css';
import { useAppDispatch, useAppSelector } from './hook';
import { fetchTodos, addNewTodo } from './store/todoSlice';
import InputField from './components/InputField';
import TodoList from './components/TodoList';
import { useSelector } from 'react-redux';

function App() {
	const [text, setText] = useState('');
	const { loading, error } = useAppSelector((state) => state.todos);
	const dispatch = useAppDispatch();

	const handleAction = () => {
		if (text.trim().length) {
			dispatch(addNewTodo(text));
			setText('');
		}
	};
	useEffect(() => {
		dispatch(fetchTodos());
	}, [dispatch]);
	return (
		<div className="App">
			<InputField
				value={text}
				handleInput={setText}
				handleSubmit={handleAction}
			/>

			{loading && <h2>Loading....</h2>}
			{error && <h2>An error occured: {error}</h2>}

			<TodoList />
		</div>
	);
}

export default App;
