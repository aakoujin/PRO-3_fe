import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Content } from './Content';
import Listing from './Listing';

interface ListingItem {
    id_listing: number;
    user: number;
    post_name: string;
    post_desc: string;
    post_date: string;
    state: number;
    contents: {
        [key: string]: ContentItem
    }
}

interface ContentItem {
    id_content: number;
    media: string;
}



function ListingContainer(fetchedListings: ListingItem[]) {
    return (
        <>
            <Row md={2} xs={1} lg={3} className="g-3">
                {
                    Object.values(fetchedListings).map(li => (<Col key={li.id_listing}><Listing{...li} /></Col>))
                }
            </Row>
        </>
    )
}

export default ListingContainer
// Object.entries(fetchedListings).forEach(([key, value])=> {<Listing{...value}/>})