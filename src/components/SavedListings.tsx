import { useContext, useEffect, useState } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthProvider';
import ListingContainer from './ListingsContainer';


const P_LISTING_URL = "/SavedListing/savedlistings"

function SavedListings() {

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
        <>
            {<ListingContainer {...fetchedListings} />}
        </>
    )
}

export default SavedListings