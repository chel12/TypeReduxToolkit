import { useAppDispatch } from '../hook';
import { toggleStatus, deleteTodo } from '../store/todoSlice';

interface TodoItemProps {
	id: string;
	completed: boolean;
	title: string;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, completed, title }) => {
	const dispatch = useAppDispatch();

	return (
		<li key={id}>
			<input
				type="checkbox"
				checked={completed}
				onChange={() => dispatch(toggleStatus(id))}
			/>
			<span>{title}</span>
			<span className="delete" onClick={() => dispatch(deleteTodo(id))}>
				&#8722;
			</span>
		</li>
	);
};

export default TodoItem;
