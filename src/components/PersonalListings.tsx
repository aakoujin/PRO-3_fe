import { useContext, useEffect, useState } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthProvider';
import ListingContainer from './ListingsContainer';
import { Col, Row } from 'react-bootstrap';
import Listing from './Listing';
import ModifiableListing from './ModifiableListing';
import { Grid } from '@mui/material';


const P_LISTING_URL = "/Listing/userlistings"

function PersonalListings() {

    const authContext = useContext(AuthContext)

    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)

        fetchListings();
    }, [])

    var fetchedListings = Object.values(listings)

    const fetchListings = async () => {

        const response = await axios.get(P_LISTING_URL,
            {
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
                withCredentials: true
            }
        )
        const listings = response.data
        setListings(listings)
        setLoading(false)
    }

    return (
        <Grid container spacing={3}>
          {Object.values(fetchedListings).map(li => (
            <Grid item key={li.id_listing} xs={12} sm={6} md={4} lg={3}>
              <Listing {...li} />
            </Grid>
          ))}
        </Grid>
      );
}

export default PersonalListings