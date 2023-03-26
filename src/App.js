import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {solid, regular} from "@fortawesome/fontawesome-svg-core/import.macro";
import {useState, useEffect} from "react";

function App() {

  const [newTask, setNewTask] = useState({
    title: "",
    deadline: "",
  })

  const [newDeadline, setNewDeadline] = useState("")

  const [err, setErr] = useState(false)

  const [tasks, setTasks] = useState([])

  const [filter, setFilter] = useState("none")


  function addTask(e){
    e.preventDefault()
    if(newTask.title.length <= 10){
      setErr(true)
    }else{
      setTasks([...tasks, newTask])
      setNewTask({title: ''})
      localStorage.setItem('tasks', JSON.stringify([...tasks, newTask]))
    }

  }

  function updateTask(key){

    let update = tasks.slice();

    if(update[key].status == "active") {
      update[key].status = "completed"
    }else{
      update[key].status = "active"
    }
    setTasks(update)
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

  function deleteTask(key){
    let update = tasks.slice()
    update.splice(key, 1);
    setTasks(update)
    localStorage.setItem('tasks', JSON.stringify(update))
  }

  useEffect(()=>{
    let LocalData = JSON.parse(localStorage.getItem('tasks'))

    if(tasks.length == 0){
      if(LocalData != null) {
        setTasks(LocalData)
      }
    }


  }, [tasks])

  return (
      <div className="App">
        <header className="App-header">
          <h2>Pflegehilfe app</h2>
          {err ? <div className="error">Error:Task name should be more than 10 characters including spaces.</div> : <></>}
          <div className="todo-container">
            <div className="input-container">
              <FontAwesomeIcon icon={solid("angle-down")} className="icon" />
              <form onSubmit={(e) => addTask(e)} className={"todo-form"}>
                <input
                    className="input-field"
                    placeholder={"What needs to be done?"}
                    value={newTask.title}
                    onChange={(v) => {
                      setNewTask({ ...newTask, title: v.currentTarget.value, status: "active"})
                      setErr(false)
                    }}
                />
                <input type="date" className="input-deadline" onChangeCapture={(v) => {
                  setNewTask({...newTask, deadline: v.currentTarget.value})
                  console.log(newTask)
                }
                } />

              </form>
            </div>
                <div className="todo-list">
                  { tasks.filter(item => {
                    if(filter != "none") {
                      return item.status == filter
                    }else{
                      return item
                    }
                  }).map((task, key) => {
                    let overdue = false;
                    if(new Date(task.deadline).toLocaleDateString() < new Date().toLocaleDateString()){
                      overdue = true
                    }
                    return(
                        <div className={"todo-item " + (overdue ? "overdue" : "")} key={key}>
                          <div className="todo-inner">
                            <FontAwesomeIcon
                                icon={task.status == "active" ? regular("circle") : solid("circle")}
                                onClick={() => updateTask(key)}
                                className={"icon " + task.status}
                            />
                            <div className="todo-item-text">{task.title}</div>
                          </div>
                          <div className="todo-action">
                            <div className="deadline">{task.deadline}</div>
                            <div className="delete"><FontAwesomeIcon icon={solid("trash")} onClick={() => deleteTask(key)} /></div>
                          </div>
                        </div>
                    )
                  })}

                </div>

            <div className="todo-action-bar">
              <div className="number">{tasks.length} items left</div>
              <div className="filters">
                <div className={'filter ' + (filter == "none" ? "active" : "")} onClick={() => setFilter("none")}>All</div>
                <div className={"filter " + (filter == 'active' ? "active" : "")} onClick={() => setFilter("active")}>Active</div>
                <div className={"filter " + (filter == 'completed' ? "active" : "")} onClick={() => setFilter("completed")}>Completed</div>
              </div>
            </div>
          </div>
        </header>
      </div>
  );
}

export default App;
