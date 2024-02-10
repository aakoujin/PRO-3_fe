import React, { useEffect, useState } from 'react';
import ListingContainer, { ListingItem } from './ListingsContainer';
import axios from '../api/axios';
import Pagination from '@mui/material/Pagination';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

interface ListingContainerHandlerProps {
  startingPage: number | null;
}

export function ListingContainerHandler({ startingPage }: ListingContainerHandlerProps) {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const { page } = useParams();
  const [currentPage, setCurrentPage] = useState(parseInt(page) ? parseInt(page) : 1);
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true)
    var targetPage = page ? parseInt(page) : 1
    setCurrentPage(targetPage);
    navigate("/home/" + targetPage);
    fetchListings(targetPage);
  }, [page])
  //fix double call

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    navigate("/home/" + page);
    fetchListings(page);
  };

  const fetchListings = async (page: number) => {
    const result =
      await axios.get("/Listing/withPage/" + page,
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          method: 'GET'
        })

    const listings = await result.data.listings
    setTotalPages(await result.data.pages)
    setListings(listings)
    setLoading(false)
  }

  if (loading) return (
    <>
      <div className='loading'>Loading</div>
    </>
  )
  return (
    <Container sx={{marginTop:3}}>
      <Container maxWidth="sm" sx={{mb:5}}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Your marketplace
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Your in-company marketplace. View, create, share and manage yours and your colleages listings
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" onClick={() => {navigate("/search")}}>Explore available listings</Button>
            </Stack>
          </Container>
      <ListingContainer {...listings} />
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            color="primary"
            onChange={handlePageChange}
            variant="outlined" shape="rounded"
          />
        </div>
      )}
    </Container>
  );
};
