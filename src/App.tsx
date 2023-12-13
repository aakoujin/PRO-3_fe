import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddListing from './components/AddListing';
//import { Container } from 'react-bootstrap';
import { Container, CssBaseline } from '@mui/material'
//import "bootstrap/dist/css/bootstrap.min.css"
import ListingContainer from './components/ListingsContainer';
import { FullListing } from './components/FullListing';
import { TopNavBar } from './components/TopNavBar';
import Register from './components/Register';
import Login from './components/Login';
//import { AuthProvider } from './context/AuthProvider';
import PersonalListings from './components/PersonalListings';
import UserInfoComponent from './components/UserInfoComponent';
import EditUserInfoComponent from './components/EditUserInfoComponent';
import SavedListings from './components/SavedListings';
import UserChatsComponent from './components/UserChatsComponent';
import ChatContainer from './components/ChatContainer';
import { EditListing } from './components/EditListing';
import { ListingContainerHandler } from './components/ListingContainerHandler';
import Search from './components/Search';
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles';
import FooterComponent from './components/FooterComponent';
//import CssBaseline from "@mui/material/CssBaseline";


function App() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setLoading(false)
    //fetchListings();
  }, [])

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#007bff', 
      },
      secondary: {
        main: '#ac5353', 
      },
      background: {
        default: '#1a1a1a', 
        paper: '#262626',
      },
      text: {
        primary: '#ffffff', 
        secondary: '#c7c7c7', 
      },
      divider: 'rgba(255,255,255,0.12)', 
    },
  });


  if (loading) return (
    <>
      <div className='loading'>Loading</div>
    </>
  )

  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopNavBar />
      <Container className="mb-4">
        <Routes>
          <Route path="/login" element={<Login />} ></Route>
          <Route path="/register" element={<Register />} ></Route>
          <Route path="/" element={<><ListingContainerHandler startingPage={1} /> <FooterComponent/> </>}></Route>
          <Route path="/home/:page" element={<><ListingContainerHandler startingPage={null} /> <FooterComponent/> </>}></Route>
          <Route path="/new" element={<AddListing />}></Route>
          <Route path="/mylistings" element={<PersonalListings />}></Route>
          <Route path="/:id">
            <Route path="edit" element={<EditListing />}></Route>
            <Route index element={<FullListing />}></Route>
          </Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/userInfo" element={<UserInfoComponent />} ></Route>
          <Route path="/editUserInfo" element={<EditUserInfoComponent />}> </Route>
          <Route path="/savedlistings" element={<SavedListings />}></Route>
          <Route path="/chats" element={<UserChatsComponent />}></Route>
          <Route path="/chats/:id">
            <Route index element={<ChatContainer />}></Route>
          </Route>

          <Route path="*" element={<Navigate to="/" />}></Route>

        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
/*
<div className='listingsContainer'>

<ListingContainer {...fetchedListings} />

</div>*/