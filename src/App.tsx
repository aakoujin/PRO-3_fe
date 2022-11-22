import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const result =
        await fetch("http://localhost:42999/api/User",
          {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            method: 'GET'
          })
      const users = await result.json()
      console.log(users.$values)

      setUsers(users.$values)
    }

    fetchUsers();
  }, [])

  return (
    <div className='userContainer'>
      {users.map(user =>
        <div>{JSON.stringify(user)}</div>
      )}
    </div>
  );
}

export default App;
