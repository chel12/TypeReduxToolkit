import React from 'react';

interface InputFieldProps {
	value: string;
	handleInput: (str: string) => void;
	handleSubmit: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
	value,
	handleInput,
	handleSubmit,
}) => {
	return (
		<label>
			<input
				placeholder="new todo"
				value={value}
				onChange={(e) => handleInput(e.target.value)}
			/>
			<button onClick={handleSubmit}>Add Todo</button>
		</label>
	);
};

export default InputField;
