import './App.css';
import {useEffect, useState} from 'react'

const URL = 'http://localhost/tehtavakansio/demo/';

function App() {
  const [tasks, setTasks] = useState([])
  const [task, setTask] = useState('')
  const [task2, setTask2] = useState('')

  useEffect(() => {
    let status = 0;
    fetch(URL + 'retrieve.php')
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
          setTasks(res);
        } else {
          alert(res.error)
        }
      }, (error) => {
        alert('Häiriö järjestelmässä, yritä kohta uudelleen!')
      }
    )
  }, [])

  function save(e) {
    e.preventDefault();
    let status = 0;
    fetch(URL + 'create.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        description: task,
        amount: task2
      })
    }) 
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
          setTasks(tasks => [...tasks,res]);
          setTask('');
          setTask2('');
        } else {
          alert(res.error)
        }
      }, (error) => {
        alert('Häiriö järjestelmässä, yritäppä kohta uudelleen!')
      }
    )
  }

  function remove(id) {
    let status = 0;
    fetch(URL + 'delete.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
        body: JSON.stringify({
        id: id
      })
    }) 
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
          const newListWithoutRemoved = tasks.filter((item) => item.id !== id);
          setTasks(newListWithoutRemoved);
        } else {
          alert(res.error)
        }
      }, (error) => {
        alert(error);
      }
    )
  }

  return (
    <div className="container">
      <h3>Shopping list</h3>
      <form onSubmit={save}>
        <label>New item</label> <br></br>
        <input className="col-form-label me-3" placeholder="type description" value={task} onChange={e => setTask(e.target.value)}/>&nbsp;
        {/* <label></label> */}
        <input className="col-form-label" placeholder="type amount" value={task2} onChange={e => setTask2(e.target.value)}/>
        <button className="btn btn-success ms-2 mb-1">Save</button>
      </form>
      <ol>
        {tasks.map(task =>(
          <li key={task.id}>
            {task.description} <span>{task.amount}</span>
            <a className="delete" onClick={() => remove(task.id)} href="#">
              delete
              </a>&nbsp;
              </li>
          ))}
      </ol>
    </div>
  );
}
export default App;