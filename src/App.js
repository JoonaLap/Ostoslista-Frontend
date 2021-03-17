import './App.css';
import {useEffect, useState} from 'react'

const URL = 'http://localhost/tehtavakansio/demo/';

function App() {
  const [tasks, setTasks] = useState([])
  const [task, setTask] = useState('')
  const [task2, setTask2] = useState('')
  // const [amounts, setAmounts] = useState([])
  // const [amount, setAmount] = useState('')
  const [editTask, setEditTask] = useState(null);
  const [editAmount, setEditAmount] = useState(null);
  const [editDescription, setEditDescription] = useState('')



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

  // function setEditedTask(task) {
  //   setEditTask(task);
  //   setEditAmount(task);
  //   setEditDescription(task?.description);
  // }


  function update(e) {
    e.preventDefault();
    let status = 0;
    fetch(URL + 'update.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: editTask.id,
        // id: editAmount.id,
        description: editDescription
      })
    }) 
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
          tasks[(tasks.findIndex(task => task.id === editTask.id))].description = editDescription;
          // amounts[(amounts.findIndex(amount => amount.id === editAmount.id))].description = editDescription;
          setTasks([...tasks]);
          setEditTask(null);
          // setEditAmount(null);
          setEditDescription('');
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
        <label>New item</label>&nbsp;
        <input placeholder="type description" value={task} onChange={e => setTask(e.target.value)}/>&nbsp;
        {/* <label></label> */}
        <input placeholder="type amount" value={task2} onChange={e => setTask2(e.target.value)}/>
        <button>Save</button>
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




// return (
//   <div className="container">
//     <h3>todo list</h3>
//     <form onSubmit={save}>
//       <label>New Task</label>
//       <input value={task} onChange={e => setTask(e.target.value)}/>
//       <button>Save</button>
//     </form>
//     <ol>
//       {tasks.map(task =>(
//         <li key={task.id}>{task.description}<a className="delete" onClick={() => remove(task.id)} href="#">delete</a></li>
//       ))}
//     </ol>
//   </div>
// );
