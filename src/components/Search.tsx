import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ListingItem } from './Listing';
import ListingContainer from './ListingsContainer';
import { Container, FormControl, Grid, InputLabel, MenuItem, Pagination, Paper, Select, Typography } from '@mui/material';
import axios from '../api/axios';
import { IconButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';



interface SearchParams {
    text_search?: string;
    min?: string;
    max?: string;
    country?: string;
    city?: string;
    state?: string;
    p_code?: string;
    page?: string;
    sortBy?: string;
    sortOrder: string;
}


function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [sortBy, setSortBy] = useState<string>('date');
    const [sortOrder, setSortOrder] = useState<string>('desc');

    const [searchParams, setSearchParams] = useState<SearchParams>({
        text_search: queryParams.get('text_search') || '',
        min: queryParams.get('min') || '',
        max: queryParams.get('max') || '',
        country: queryParams.get('country') || '',
        city: queryParams.get('city') || '',
        state: queryParams.get('state') || '',
        p_code: queryParams.get('p_code') || '',
        page: queryParams.get('page') || String(1).valueOf(),
        sortBy: queryParams.get('sortBy') || "date",
        sortOrder: queryParams.get('sortOrder') || "desc",
    });

    const [listings, setListings] = useState<ListingItem[]>([]);
    const page = queryParams.get('page');
    //useParams();

    const [currentPage, setCurrentPage] = useState(parseInt(page) ? parseInt(page) : 1);
    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0);



    const handleInputChange = (key: keyof SearchParams, value: string) => {
        if (key === 'sortBy')
            setSortBy(value);

        if (key === 'sortOrder')
            setSortOrder(value);


        setSearchParams((prevParams) => ({ ...prevParams, [key]: value }));
    };

    const fetchListings = async (searchQuery: String) => {
        const result =
            await axios.get(`/Listing/search?${searchQuery}`,
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
            sortBy: "date",
            sortOrder: "desc",
            page: String(1).valueOf()
        });
        setSortBy("date");
        setSortOrder("desc")
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
        <Container>
            <Grid container
                sx={{
                    marginBottom: 5,
                    marginTop: 2
                }}>
                <Typography variant="h5" sx={{
                    marginBottom: 2 
                }}>Search</Typography>
                <Grid item xs={12}

                >
                    <Paper sx={{ padding: "15px" }}>
                        <TextField
                            sx={{ padding: "5px" }}
                            label="Text Search"
                            value={searchParams.text_search}
                            onChange={(e) => handleInputChange('text_search', e.target.value)}
                        />
                        <TextField
                            sx={{ padding: "5px" }}
                            type="number"
                            label="Min Price"
                            value={searchParams.min}
                            onChange={(e) => handleInputChange('min', e.target.value)}
                        />
                        <TextField
                            sx={{ padding: "5px" }}
                            type="number"
                            label="Max Price"
                            value={searchParams.max}
                            onChange={(e) => handleInputChange('max', e.target.value)}
                        />
                        <TextField
                            sx={{ padding: "5px" }}
                            label="Country"
                            value={searchParams.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                        />
                        <TextField
                            sx={{ padding: "5px" }}
                            label="City"
                            value={searchParams.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                        <TextField
                            sx={{ padding: "5px" }}
                            label="State"
                            value={searchParams.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                        />
                        <TextField
                            sx={{ padding: "5px" }}
                            label="Code"
                            value={searchParams.p_code}
                            onChange={(e) => handleInputChange('p_code', e.target.value)}
                        />
                        <Grid item xs={12}
                            sx={{
                                padding: "5px",
                            }}
                        >
                            <Button
                                sx={{
                                    marginRight: "10px",
                                    marginTop: "5px"
                                }}
                                variant="contained" color="primary" onClick={handleSearch}>
                                Search
                            </Button>
                            <Button
                                sx={{
                                    marginRight: "5px",
                                    marginTop: "5px"
                                }}
                                variant="contained" color="secondary" onClick={handleClear}>
                                Clear
                            </Button>
                        </Grid>
                        <Grid item xs={12} sx={{mt: 2, mb: 1}}>
                            <FormControl sx={{ minWidth: 120, padding: '5px' }}>
                                <InputLabel id="sort-by-label">Sort By</InputLabel>
                                <Select
                                    labelId="sort-by-label"
                                    id="sort-by"
                                    value={sortBy}
                                    label="Sort By"
                                    onChange={(e) => {
                                        setSortBy(e.target.value as string);
                                        handleInputChange('sortBy', e.target.value as string);
                                    }}
                                >
                                    <MenuItem value="date">Date</MenuItem>
                                    <MenuItem value="name">Name</MenuItem>
                                    <MenuItem value="price">Price</MenuItem>
                                    <MenuItem value="country">Country</MenuItem>
                                    <MenuItem value="city">City</MenuItem>
                                </Select>
                            </FormControl>
                            <IconButton
                                onClick={() => {
                                    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                                    setSortOrder(newSortOrder);
                                    handleInputChange('sortOrder', newSortOrder);
                                }}
                            >
                                {sortOrder === 'desc' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />  }
                            </IconButton>

                        </Grid>

                    </Paper>
                </Grid>

                <Grid item xs={12}
                    sx={{
                        marginTop: 3
                    }}
                >
                    <ListingContainer {...listings} />
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                color="primary"
                                onChange={handlePageChange}
                                variant="outlined" shape="rounded"
                            />
                        </div>
                    )}
                </Grid>
            </Grid>
        </Container>

    );
};

export default Search;