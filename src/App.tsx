import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [listings, setListings] = useState([])

  useEffect(() => {


    fetchListings();
  }, [])

  const fetchUsers = async () => {
    const result =
      await fetch("http://localhost:42999/api/User",
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          method: 'GET'
        })
    const users = await result.json()
    console.log(users.$values)

    //setUsers(users.$values)
  }

  const fetchListings = async () => {
    const result =
      await fetch("http://localhost:42999/api/Listing",
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          method: 'GET'
        })
    const listings = await result.json()
    console.log(listings.$values)
    
    setListings(listings.$values)
  }

  return (
    <div className='userContainer'>
      {listings.map(listing =>
        <div>{JSON.stringify(listing)}</div>
      )}
    </div>
  );
}

export default App;
