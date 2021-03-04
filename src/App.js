import './App.css';
import {useEffect, useState} from 'react'

const URL = 'http://localhost/tehtavakansio/demo/';

function App() {
  const [tasks, setTasks] = useState([])
  const [task, setTask] = useState('')
  const [editTask, setEditTask] = useState(null);
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
        description: task
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

  function setEditedTask(task) {
    setEditTask(task);
    setEditDescription(task?.description);
  }


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
          setTasks([...tasks]);
          setEditTask(null);
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
      <h3>todo list</h3>
      <form onSubmit={save}>
        <label>New Task</label>
        <input value={task} onChange={e => setTask(e.target.value)}/>
        <button>Save</button>
      </form>
      <ol>
        {tasks.map(task =>(
          <li key={task.id}>
            {editTask?.id !== task.id && 
            task.description
            }
            {editTask?.id === task.id &&
              <form onSubmit={update}>
                <input value={editDescription} onChange={e => setEditDescription(e.target.value)}></input>
                <button>Save</button>
                <button type="button" onClick={() => setEditedTask(null)}>Cancel</button>
              </form>
            }
            <a className="delete" onClick={() => remove(task.id)} href="#">
              delete
              </a>&nbsp;
              {editTask === null &&
                <a className="edit" onClick={() => setEditedTask(task)} href="#">
                  Edit
                </a>
              }
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
