import { Component, useState, useEffect } from 'react';
import Listing from './Listing';
import axios from "../api/axios"
import { ListingItem, ContentItem } from "./Listing"

interface SimilarListingsContainerProps {
    id: number;
}

export default function SimilarListingsContainer({ id }: SimilarListingsContainerProps) {

    const [similarListings, setSimilarListings] = useState<ListingItem[] | null>([]);






    useEffect(() => {
        fetchData();
    },);

    const fetchData = async () => {
        const result =
            await axios.get("/Listing/similar/" + id,
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                }
            )

        setSimilarListings(await result.data);
    }

/*
    if (similarListings !== null && similarListings.length !== 0) {
        return (
            <>
                <div>
                    <h2>Similar Listings</h2>

                    {similarListings?.map((listing) => (

                        <Listing key={listing.id_listing} {...listing} />

                    ))}

                </div>
            </>
        )
    }
    else*/ return (
        <>
            <h2>Similar Listings {id}</h2>
            <>
            </>
        </>
    )
}
