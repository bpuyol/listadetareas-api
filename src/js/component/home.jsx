import React, { useState, useEffect } from "react";

const TodoItem = ({ todo, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      style={{ textDecoration: todo.isCompleted ? "line-through" : "none" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="list-group-item"
    >
      {todo.text}
      {isHovered && <button className="delete-icon btn btn-danger float-right" onClick={() => onDelete(todo.id)}>&times;</button>}
    </li>
  );
};

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [deletedTodos, setDeletedTodos] = useState([]);


  useEffect(() => {getTodos();}, []);
  function getTodos() {
    fetch ('https://playground.4geeks.com/apis/fake/todos/user/bpuyol')
    .then((response)=>response.json())
    .then((data)=>setTodos(data.results))
    .catch((error)=>console.log(error))
  }

  useEffect(() => {postTodos();}, []);
  function postTodos() {
  fetch('https://playground.4geeks.com/apis/fake/todos/user/bpuyol', {
    method: "POST",
    body: JSON.stringify(todos),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(resp => {
      console.log(resp.ok); // Será true si la respuesta es exitosa
      console.log(resp.status); // El código de estado 200, 300, 400, etc.
      console.log(resp.text()); // Intentará devolver el resultado exacto como string
      return resp.json(); // Intentará parsear el resultado a JSON y retornará una promesa donde puedes usar .then para seguir con la lógica
  })
  .then(data => {
      // Aquí es donde debe comenzar tu código después de que finalice la búsqueda
      console.log(data); // Esto imprimirá en la consola el objeto exacto recibido del servidor
  })
  .catch(error => {
      // Manejo de errores
      console.log(error);
  });
  }




  const addTodo = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputValue.trim(), isCompleted: false }]);
      setInputValue("");
    }
  };

  const deleteTodo = (id) => {
    setDeletedTodos([...deletedTodos, id]);
    setTodos(todos.filter((todo) => !deletedTodos.includes(todo.id)));
  };

  const deleteAllTodos = () => {
    setDeletedTodos([]);
    setTodos([]);
  };

  const pendingTodos = todos.filter((todo) => !todo.isCompleted).length;

  return (
    <div className="todo-app container">
      <h1 className="todo-app-title">Tareas Pendientes</h1>
      <div className="todo-app-input-wrapper">
        <input
          type="text"
          className="form-control todo-app-input"
          placeholder="Añade una tarea"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={addTodo}
        />
      </div>
      <ul className="list-group todo-app-list">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <TodoItem todo={todo} onDelete={deleteTodo} key={todo.id} />
          ))
        ) : (
          <li className="list-group-item no-tasks">No tienes tareas pendientes.</li>
        )}
      </ul>
      <button className="btn btn-danger mt-3" onClick={deleteAllTodos}>Borrar todas las tareas</button>
      {pendingTodos > 0 && <p className="pending-todos mt-3">Tienes {pendingTodos} tareas pendientes.</p>}
    </div>
  );
};

export default TodoApp;