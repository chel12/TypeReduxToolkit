import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useAppDispatch } from './hook';
import { addTodo } from './store/todoSlice';
import InputField from './components/InputField';
import TodoList from './components/TodoList';

function App() {
	const [text, setText] = useState('');
	const dispatch = useAppDispatch();

	const handleAction = () => {
		if (text.trim().length) {
			dispatch(addTodo(text));
			setText('');
		}
	};

	return (
		<div className="App">
			<InputField
				value={text}
				handleInput={setText}
				handleSubmit={handleAction}
			/>

			{/* {status === 'loading' && <h2>Loading....</h2>}
			{error && <h2>An error occured: {error}</h2>} */}

			<TodoList />
		</div>
	);
}

export default App;
