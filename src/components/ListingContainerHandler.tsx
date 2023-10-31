import React, { useEffect, useState } from 'react';
import ListingContainer, { ListingItem } from './ListingsContainer';
import axios from '../api/axios';
import Pagination from '@mui/material/Pagination';
import { useNavigate, useParams } from 'react-router-dom';

interface ListingContainerHandlerProps{
    startingPage : number | null;
}

export function ListingContainerHandler({startingPage} : ListingContainerHandlerProps) {
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
      await axios.get("http://localhost:42999/api/Listing/withPage/" + page,
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
    <>
    <ListingContainer {...listings}/> 
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            color="primary"
            onChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
};
