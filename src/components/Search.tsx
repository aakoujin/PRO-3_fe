import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ListingItem } from './Listing';
import ListingContainer from './ListingsContainer';
import { Pagination } from '@mui/material';
import axios from '../api/axios';

interface SearchParams {
    text_search?: string;
    min?: string;
    max?: string;
    country?: string;
    city?: string;
    state?: string;
    p_code?: string;
    page?: string;
}

const Search: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [searchParams, setSearchParams] = useState<SearchParams>({
        text_search: queryParams.get('text_search') || '',
        min: queryParams.get('min') || '',
        max: queryParams.get('max') || '',
        country: queryParams.get('country') || '',
        city: queryParams.get('city') || '',
        state: queryParams.get('state') || '',
        p_code: queryParams.get('p_code') || '',
        page: queryParams.get('page') || String(1).valueOf()
    });

    const [listings, setListings] = useState<ListingItem[]>([]);
    const page = queryParams.get('page');
    //useParams();

    const [currentPage, setCurrentPage] = useState(parseInt(page) ? parseInt(page) : 1);
    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0);



    const handleInputChange = (key: keyof SearchParams, value: string) => {
        setSearchParams((prevParams) => ({ ...prevParams, [key]: value }));
    };

    const fetchListings = async (searchQuery: String) => {
        const result =
            await axios.get(`http://localhost:42999/api/Listing/search?${searchQuery}`,
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    method: 'GET'
                })

        const listings = await result.data.listings
        setTotalPages(await result.data.pages)
        setListings(listings)
        setLoading(false)
    }

    const handleSearch = async () => {
        const searchQuery = new URLSearchParams(searchParams as any).toString();
        navigate(`/search?${searchQuery}`);
        await fetchListings(searchQuery);

    };

    const handleClear = () => {
        navigate('/search');
        setSearchParams({
            text_search: '',
            min: '',
            max: '',
            country: '',
            city: '',
            state: '',
            p_code: '',
            page: String(1).valueOf()
        });
    };

    useEffect(() => {
        setLoading(true)
        const searchQuery = new URLSearchParams(searchParams as any)
        var targetPage = searchQuery.get('page') ? parseInt(searchQuery.get('page')) : 1
        setCurrentPage(targetPage);
        navigate(`/search?${searchQuery.toString()}`);

    }, [location.search]);


    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {

        handleInputChange('page', page.toString());
        const searchQuery = new URLSearchParams(searchParams as any);
        searchQuery.set('page', page.toString());


        const updateSearchAndFetch = async () => {
            await fetchListings(searchQuery.toString());
            navigate(`/search?${searchQuery.toString()}`);
            setCurrentPage(page);
        };

        updateSearchAndFetch();

    };

    return (
        <div>
            <TextField
                label="Text Search"
                value={searchParams.text_search}
                onChange={(e) => handleInputChange('text_search', e.target.value)}
            />
            <TextField
                type="number"
                label="Min Price"
                value={searchParams.min}
                onChange={(e) => handleInputChange('min', e.target.value)}
            />
            <TextField
                type="number"
                label="Max Price"
                value={searchParams.max}
                onChange={(e) => handleInputChange('max', e.target.value)}
            />
            <TextField
                label="Country"
                value={searchParams.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
            />
            <TextField
                label="City"
                value={searchParams.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
            />
            <TextField
                label="State"
                value={searchParams.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
            />
            <TextField
                label="Code"
                value={searchParams.p_code}
                onChange={(e) => handleInputChange('p_code', e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
                Search
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClear}>
                Clear
            </Button>

            <>
                <ListingContainer {...listings} />
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
        </div>

    );
};

export default Search;