import { useContext, useEffect, useState } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthProvider';
import ListingContainer from './ListingsContainer';
import { Button, Grid, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";

const P_LISTING_URL = "/SavedListing/savedlistings"

function SavedListings() {
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
                            You haven't yet saved a post
                        </Typography>
                        <Button variant="contained" onClick={() => { navigate("/search") }}>Explore avaialbe listings</Button>
                    </Grid>
                </Grid>
            ) : (
                <ListingContainer {...fetchedListings} />
            )}
        </Grid>
    )
}

export default SavedListings;
