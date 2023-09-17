import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Content } from './Content';
import Listing from './Listing';

export interface ListingItem {
    id_listing: number;
    user: number;
    post_name: string;
    post_desc: string;
    post_date: string;
    state: number;
    price: number;
    contents: {
        [key: string]: ContentItem
    };
    tags : TagItem[];
}

interface ContentItem {
    id_content: number;
    media: string;
}

export interface TagItem{
    id_tag: number;
    id_parent: number;
    tag_name: string;
  }


function ListingContainer(fetchedListings: ListingItem[]) {
    return (
        <>
            <Row md={2} xs={1} lg={4} className="g-3">
                {
                    Object.values(fetchedListings).map(li => (<Col key={li.id_listing}><Listing{...li} /></Col>))
                }
            </Row>
        </>
    )
}

export default ListingContainer
// Object.entries(fetchedListings).forEach(([key, value])=> {<Listing{...value}/>})