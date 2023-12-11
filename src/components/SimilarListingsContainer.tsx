import { useState } from 'react';
import Listing, { ListingItem } from "./Listing"
import { Container, Grid, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();

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

    function handleClick(id: number) {
        navigate("/" + id);
        window.location.reload();
    }


    const visibleItems = similarListings.slice(startIndex, startIndex + 4);
    const isLastPage = startIndex >= similarListings.length - 4;
    const isFirstPage = startIndex === 0;

    return (

        <Container>
            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
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
            <Grid container spacing={2} marginTop={2} marginBottom={3} >
                {visibleItems.map((item) => (
                    <Grid item key={item.id_listing} xs={3} onClick={() => handleClick(item.id_listing)}>
                        <Listing{...item} />
                    </Grid>
                ))}
            </Grid>
        </Container>

    )
}

export default SimilarListingsContainer;