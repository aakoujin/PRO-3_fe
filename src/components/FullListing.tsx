import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ListingItem } from "./Listing";



export function FullListing(){

    const params = useParams()

    const [listing, setListing] = useState({})
    const [loading, setLoading] = useState(true)
    

    useEffect(() => {
        fetchListing();
      }, [])


    const fetchListing = async () => {
        const result =
          await fetch("http://localhost:42999/api/Listing/" + params.id ,
            {
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              method: 'GET'
            })
        const returnedListing = await result.json()
        setListing(returnedListing)
        setLoading(false)
      }

      if (loading) return (
        <>
          <div className='loading'>Loading</div>
        </>
      )

    const displayableListing = listing as ListingItem
      
    return(
        <>
        {
            displayableListing.post_name
        }
        {
            displayableListing.post_desc
        }
        </>
    )

}