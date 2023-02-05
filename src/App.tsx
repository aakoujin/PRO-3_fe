import userEvent from '@testing-library/user-event';
import React, { useEffect, useState } from 'react';
import './App.css';
import { Content } from './components/Content';
import ListingContainer from './components/ListingsContainer';
import ListingItem from './components/Listing'

function App() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    fetchListings();
  }, [])

  var fetchedListings = Object.values(listings)


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
    setListings(listings.$values)
    setLoading(false)
  }

  if (loading) return (
    <>
    <div className='loading'>Loading</div>
    </>
  )

  return (
    <div className='listingsContainer'>

    <ListingContainer {...fetchedListings}/>

    </div>
  );
}

export default App;
