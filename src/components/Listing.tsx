import React, {Component} from 'react';
import {Card, Button} from 'react-bootstrap';
import { Content } from './Content';

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


function Listing({id_listing, user, post_name, post_desc, post_date, state, content } : ListingItem){
return(
    <>
        <div className='listing'>
        {
            id_listing
        }
        {
            user
        }
        {
            post_desc
        }
        {
            post_date
        }
        </div>
    </>
)    

}

export default Listing