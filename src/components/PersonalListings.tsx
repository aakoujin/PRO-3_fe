import { useContext, useEffect, useState } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthProvider';
import ModifiableListing from './ModifiableListing';
import { Button, Grid, Typography } from '@mui/material'; // Added Typography for empty response message
import { useNavigate } from "react-router-dom";

const P_LISTING_URL = "/Listing/userlistings"

function PersonalListings() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext)

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);
    fetchListings();
  }, [])

  var fetchedListings = Object.values(listings)

  const fetchListings = async () => {
    try {
      const response = await axios.get(P_LISTING_URL,
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
          withCredentials: true
        }
      )
      const listings = response.data
      setListings(listings)
      setLoading(false)
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <Grid container spacing={3} marginBottom={10} marginTop={2}>
      {fetchedListings.length === 0 ? (
        <Grid container>
          <Grid item>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
              You haven't yet created a listing
            </Typography>
            <Button variant="contained" onClick={() => {navigate("/new")}}>Create a listing now</Button>
          </Grid>
        </Grid>

      ) : (
        fetchedListings.map(li => (
          <Grid item key={li.id_listing} xs={12} sm={6} md={4} lg={3}>
            <ModifiableListing {...li} />
          </Grid>
        ))
      )}
    </Grid>
  );
}

export default PersonalListings;
