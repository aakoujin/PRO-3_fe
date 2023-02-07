import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddListing from './components/AddListing';
import { Container } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css"

function App() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    fetchListings();
  }, [])

  var fetchedListings = Object.values(listings)

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
    <Container className="my-4">
      <Routes>
        <Route path="/login" element={<h1>Login</h1>} ></Route> 
        <Route path="/" element={<h1>Home</h1>}></Route>
        <Route path="/new" element={<AddListing />}></Route>

        <Route path="/:id">
          <Route path="edit" element={<h1>Edit</h1>}></Route>
          <Route index element={<h1>view</h1>}></Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />}></Route>

      </Routes>
    </Container>

  );
}

export default App;
/*
<div className='listingsContainer'>

<ListingContainer {...fetchedListings} />

</div>*/