import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddListing from './components/AddListing';
import { Container } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css"
import ListingContainer from './components/ListingsContainer';
import { FullListing } from './components/FullListing';
import { TopNavBar } from './components/TopNavBar';
import Register from './components/Register';
import Login from './components/Login';
//import { AuthProvider } from './context/AuthProvider';
import PersonalListings from './components/PersonalListings';

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
    <>
      <TopNavBar/>
      <Container className="mb-4">
        <Routes>
          <Route path="/login" element={<Login/>} ></Route>
          <Route path="/register" element={<Register/>} ></Route>
          <Route path="/" element={<ListingContainer {...fetchedListings} />}></Route>
          <Route path="/new" element={<AddListing />}></Route>
          <Route path="/mylistings" element={<PersonalListings/>}></Route>
          <Route path="/:id">
            <Route path="edit" element={<h1>Edit</h1>}></Route>
            <Route index element={<FullListing />}></Route>
          </Route>

          <Route path="*" element={<Navigate to="/" />}></Route>

        </Routes>
      </Container>
    </>
  );
}

export default App;
/*
<div className='listingsContainer'>

<ListingContainer {...fetchedListings} />

</div>*/