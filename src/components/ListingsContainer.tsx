import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Content } from './Content';
import Listing from './Listing';

interface ListingItem {
    id_listing: number;
    user: number;
    post_name: string;
    post_desc: string;
    post_date: string;
    state: number;
    content: {
        id_content: number;
        media: string;
    }
}



function ListingContainer(fetchedListings: ListingItem[]) {
    return (
        <>
            {
               Object.values(fetchedListings).map(li => (<div key={li.id_listing}><Listing{...li}/></div>))
            }
        </>
    )
}

export default ListingContainer
// Object.entries(fetchedListings).forEach(([key, value])=> {<Listing{...value}/>})