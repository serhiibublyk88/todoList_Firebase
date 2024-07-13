import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { ref, onValue, push, set, remove } from "firebase/database";
import { db } from "./firebase"; 
import styles from "./App.module.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [nextTodoId, setNextTodoId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    const todosDbRef = ref(db, "todos");

    onValue(todosDbRef, (snapshot) => {
      const loadedTodos = snapshot.val() || {};
      const todosArray = Object.keys(loadedTodos).map((id) => ({
        id,
        ...loadedTodos[id],
      }));

      setTodos(todosArray);
      setNextTodoId(
        todosArray.length
          ? Math.max(...todosArray.map((todo) => parseInt(todo.id))) + 1
          : 1
      );
    });
  }, []);

  const requestAddToDO = () => {
    setLoadingMessage("Adding...");
    setIsProcessing(true);

    const newTodo = {
      title: `New todo ${nextTodoId}`,
      completed: false,
    };

    const todosDbRef = ref(db, `todos/${String(nextTodoId).padStart(3, "0")}`);

    push(todosDbRef).then(() => {
      setTodos((prevTodos) => [
        ...prevTodos,
        { id: String(nextTodoId).padStart(3, "0"), ...newTodo },
      ]);
      setNextTodoId(nextTodoId + 1);
      setTimeout(() => {
        setIsProcessing(false);
        setLoadingMessage("");
      }, 2000);
    });
  };

  const requestUpdateToDO = (id, completed, title) => {
    setLoadingMessage("Updating...");
    setIsProcessing(true);

    const todosDbRef = ref(db, `todos/${id}`);

    set(todosDbRef, { title, completed: !completed }).then(() => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
      setTimeout(() => {
        setIsProcessing(false);
        setLoadingMessage("");
      }, 2000);
    });
  };

  const requestDeleteToDO = (id) => {
    setLoadingMessage("Deleting...");
    setIsProcessing(true);

    const todosDbRef = ref(db, `todos/${id}`);

    remove(todosDbRef).then(() => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setTimeout(() => {
        setIsProcessing(false);
        setLoadingMessage("");
      }, 2000);
    });
  };

  const handleSearch = debounce((term) => {
    setSearchTerm(term);
  }, 500);

  const toggleSort = () => {
    setIsSorted(!isSorted);
  };

  const getFilteredTodos = () => {
    return todos
      .filter((todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (isSorted ? a.title.localeCompare(b.title) : 0));
  };

  return (
    <div className={styles.app}>
      {isProcessing && (
        <div className={styles.overlay}>
          <h2 className={styles.loadingText}>{loadingMessage}</h2>
        </div>
      )}
      <h1>Todo List</h1>
      <div className={styles.controls}>
        <button onClick={requestAddToDO} disabled={isProcessing}>
          Add todo
        </button>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button onClick={toggleSort} disabled={isProcessing}>
          {isSorted ? "Unsort" : "Sort A-Z"}
        </button>
      </div>
      <ul className={styles.todoList}>
        {getFilteredTodos().map(({ id, title, completed }) => (
          <li key={id} className={styles.todoItem}>
            <span className={styles.todoTitle}>{title}</span>
            <span
              className={completed ? styles.completed : styles.notCompleted}
            >
              {completed ? "Completed" : "Not Completed"}
            </span>
            <button
              onClick={() => requestUpdateToDO(id, completed, title)}
              disabled={isProcessing}
            >
              Update
            </button>
            <button
              onClick={() => requestDeleteToDO(id)}
              disabled={isProcessing}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
