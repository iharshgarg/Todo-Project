import { useState, useEffect, useDebugValue } from "react"
import Navbar from "./components/Navbar"
import { v4 as uuidv4 } from 'uuid';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function App() {

  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setShowFinished] = useState(true)

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem("todos"))
      setTodos(todos)
    }
  }, [])
  
  
  useEffect(() => {
    setTimeout(() => {
      localStorage.setItem("todos", JSON.stringify(todos))
    }, 0);
  }, [todos])


  const toggleFinished = (e) => {
    setShowFinished(!showFinished)
  }


  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter" && todo.trim().length > 0){
      handleSave();
    }
  };
  

  const handleSave = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
    setTodo("")
  }

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id;
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos)
  }


  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id)
    setTodo(t[0].todo)
    let newTodos = todos.filter(item => {
      return item.id !== id
    });
    setTodos(newTodos)
  }

  const handleDelete = (e, id) => {

    if(confirm('Delete "'+todos.find(item => item.id === id).todo+'", sure?')){
      let newTodos = todos.filter(item => {
        return item.id !== id
      });
      setTodos(newTodos)
    }
    else{
      alert("Jab delete nai krna to button kyo dabaya bhadve!")
    }

  }

  return (
    <>
      <Navbar />
      <div className="container bg-cyan-300 max-md:h-screen min-h-[70vh] md:w-5/12 md:rounded-xl mx-auto md:my-14 py-6 px-10">
        <h1 className="font-bold text-2xl md:text-3xl flex justify-center items-center p-1.5 m-1.5 text-cyan-700">Add a Todo:</h1>
        <div className="addTodo flex justify-center items-center m-1.5 p-1.5">
          <input onChange={handleChange} onKeyDown={handleKeyDown} value={todo} type="text" className="w-8/12 rounded-md"/>
          <button onClick={handleSave} disabled={todo.length === 0} className="disabled:bg-cyan-400 bg-cyan-700 hover:bg-cyan-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-2">Save</button>
        </div>
        <div className="finished flex justify-center items-center gap-1 m-1 p-1">
          <input onChange={toggleFinished} type="checkbox" id='show' checked={showFinished} />
          <label htmlFor="show" className="text-cyan-700">Show Finished</label>
        </div>
        <h1 className="font-bold text-2xl md:text-3xl flex justify-center items-center p-1.5 m-1.5 text-cyan-700">Your Todos:</h1>
        <div className="todos flex flex-col items-center">
          {todos.length === 0 && <div className="text-cyan-700 flex justify-center items-center w-full my-16">No todos to display!</div>}
          {todos.map(item => {
            return (showFinished || !item.isCompleted) && <div key={item.id} className="todo flex justify-between items-center m-1 p-1 max-md:w-11/12 w-7/12">
              <div className="todo-content flex gap-1 items-center">
                <input onChange={handleCheckbox} type="checkbox" name={item.id} checked={item.isCompleted} id="" />
                <div className={`${item.isCompleted ? "line-through" : ""} text-cyan-700`}>{item.todo}</div>
              </div>
              <div className="buttons flex justify-center items-center h-full">
                <button onClick={(e) => { handleEdit(e, item.id) }} className="bg-cyan-700 hover:bg-cyan-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"><FaEdit /></button>
                <button onClick={(e) => { handleDelete(e, item.id) }} className="bg-cyan-700 hover:bg-cyan-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"><MdDelete /></button>
              </div>
            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default App