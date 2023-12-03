import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Grid } from '@mui/material';
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
    locations: Location[]; 
    tags : TagItem[];
}

type Location = {
  id_location: number;
  id_listing: number;
  country: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
};

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
      <Grid container spacing={3}>
        {Object.values(fetchedListings).map(li => (
          <Grid item key={li.id_listing} xs={12} sm={6} md={4} lg={3}>
            <Listing {...li} />
          </Grid>
        ))}
      </Grid>
    );
  }
export default ListingContainer