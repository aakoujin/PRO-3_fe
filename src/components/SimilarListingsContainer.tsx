import { Component, useState, useEffect } from 'react';
import axios from "../api/axios"
import { ListingItem, ContentItem } from "./Listing"
import Listing from './Listing';
import { Col, Row } from 'react-bootstrap';
import { Button, Container, Grid, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export interface TagItem {
    id_tag: number;
    id_parent: number;
    tag_name: string;
}

interface SimilarListingsContainerProps {
    similarListings: ListingItem[];
}

export function SimilarListingsContainer({ similarListings }: SimilarListingsContainerProps) {
    const [startIndex, setStartIndex] = useState(0);

    const nextItem = () => {
        setStartIndex((prevIndex) =>
            prevIndex === similarListings.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevItem = () => {
        setStartIndex((prevIndex) =>
            prevIndex === 0 ? similarListings.length - 1 : prevIndex - 1
        );
    };



    const visibleItems = similarListings.slice(startIndex, startIndex + 4);
    const isLastPage = startIndex >= similarListings.length - 4;
    const isFirstPage = startIndex === 0;

    return (
        <>
            <Container>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <IconButton onClick={prevItem} disabled={isFirstPage}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">Listings you may find interesting</Typography>
                    </Grid>
                    <IconButton onClick={nextItem} disabled={isLastPage}>
                        <ArrowForwardIcon />
                    </IconButton>
                </Grid>
                <Grid container spacing={2}>
                    {visibleItems.map((item) => (
                        <Grid item key={item.id_listing} xs={3}>
                            <Listing{...item} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}

export default SimilarListingsContainer;