import { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TodoList from "./TodoList";
import { notification } from "antd";
import "/fonts.css";
import { Context } from "../context/ContextProvider";

const TodoApp = () => {
  const {
    value,
    setValue,
    todos,
    setTodos,
    editingText,
    setEditingText,
    editingIndex,
    setEditingIndex,
  } = useContext(Context);

  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const openNotificationWithIcon = (type, message) => {
    notification[type]({
      message,
      description: "",
      style: {
        width: "300px",
        marginLeft: "-150px",
        border: "1px solid #D2B48C",
        backgroundColor: "#FFF8DC",
        boxShadow: "0 2px 8px rgba(139, 69, 19, 0.15)",
        borderRadius: "8px",
      },
      className: "custom-notification",
      duration: 3,
    });
  };

  const handleInputChange = (e) => setValue(e.target.value);
  const handleInputEdit = (e) => setEditingText(e.target.value);

  const handleEditChange = (index) => {
    setEditingIndex(index);
    setEditingText(todos[index].text);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && value.trim() !== "") {
      addToDo();
    }
  };

  const handleUpdateTodo = () => {
    if (editingText.trim() !== "") {
      const updateTodos = todos.map((todo, index) =>
        index === editingIndex ? { ...todo, text: editingText } : todo
      );
      setTodos(updateTodos);
      setEditingIndex(null);
      setEditingText("");
      openNotificationWithIcon("success", "Todo updated successfully");
    }
  };

  const addToDo = () => {
    if (value.trim() !== "") {
      const now = new Date();
      const dateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      const newTodos = [
        { text: value, completed: false, addedAt: dateTime },
        ...todos,
      ];
      setTodos(newTodos);
      setValue("");
      openNotificationWithIcon("success", "Todo added successfully");
    }
  };

  const handleKeyDownEdit = (event) => {
    if (event.key === "Enter") {
      handleUpdateTodo();
    }
  };

  const toggleComplete = (index) => {
    const updateTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updateTodos);
    openNotificationWithIcon(
      "success",
      updateTodos[index].completed
        ? "Marked as complete"
        : "Marked as incomplete"
    );
  };

  const handleDelete = (index) => {
    const updateTodo = todos.filter((_, i) => i !== index);
    setTodos(updateTodo);
    openNotificationWithIcon("success", "Todo deleted successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 sm:p-8 rounded-lg shadow-2xl max-w-md sm:max-w-lg md:max-w-3xl mx-auto"
      >
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-3xl sm:text-5xl text-[#8B4513] font-bold mb-6 sm:mb-8 text-center tracking-wide uppercase"
        >
          <span className="bg-gradient-to-r from-[#5D3A1A] to-[#A0522D] text-transparent bg-clip-text">
            To-do List
          </span>
        </motion.h1>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <motion.input
            ref={inputRef}
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            placeholder="Add todo..."
            type="text"
            value={value}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addToDo}
            className="bg-[#7c4614] bg-opacity-70 backdrop-filter backdrop-blur-md text-[#ffecde] px-4 py-3 rounded-lg hover:bg-[#8B4513] hover:bg-opacity-70 transition duration-300"
          >
            Add Task
          </motion.button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto">
          <AnimatePresence>
            {todos.length > 0 ? (
              todos.map((todo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {todo && (
                    <TodoList
                      todo={todo}
                      index={index}
                      handleInputEdit={handleInputEdit}
                      isEditing={editingIndex === index}
                      handleEditChange={handleEditChange}
                      handleUpdateTodo={handleUpdateTodo}
                      editingText={editingText}
                      handleKeyDownEdit={handleKeyDownEdit}
                      handleDelete={handleDelete}
                      toggleComplete={toggleComplete}
                    />
                  )}
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-lg text-[#8B4513] "
              >
                No todos added yet.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <h1 className="text-center text-sm text-gray-500 mt-4">
        By melvin sundae
      </h1>
    </motion.div>
  );
};

export default TodoApp;
