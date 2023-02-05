import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';

interface ListingItem {
    id_listing: number;
    user: number;
    post_name: string;
    post_desc: string;
    post_date: string;
    state: number;
    contents: {
        [key: string] : ContentItem
    }
}

interface ContentItem {
    id_content: number;
    media: string;
}


//function Listing({id_listing, user, post_name, post_desc, post_date, state, contents } : ListingItem){
function Listing(listing : ListingItem) {

    return (
        <>
            <div className='listing'>
                {listing.id_listing}
                {listing.post_desc}
                {listing.post_name}
            </div>
        </>
    )

}

export default Listing
//Object.values(listing.contents.$values)[0].media