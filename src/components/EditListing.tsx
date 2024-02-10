import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axios from "../api/axios"
import { AuthContext } from '../context/AuthProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';
import { Avatar, Chip, Paper, Typography } from "@mui/material";
import { CategorySelector } from "./CategorySelector";
import { ListingItem, TagItem } from "./Listing";
import { Form } from "react-bootstrap";
import { Label, AddAPhoto } from "@mui/icons-material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';

export function EditListing() {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const defaultTheme = createTheme();

    const [images, setImages] = useState<File[]>([]);
    const [urls, setUrls] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { id } = useParams();
    const [id_listing, setIdListing] = useState();

    const titleRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const markdownRef = useRef<HTMLTextAreaElement>(null);
    const countryRef = useRef<HTMLInputElement>(null);
    const stateRef = useRef<HTMLInputElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);
    const ctreetRef = useRef<HTMLInputElement>(null);
    const postalCodeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {

        axios.get(`/Listing/${id}`)
            .then((response) => {
                const listingData = response.data;


                setUrls(listingData.contents.map((content: any) => content.media));
                setSelectedTags(listingData.tags.map((tag: any) => tag.tag_name));
                setIdListing(listingData.id_listing);


                if (titleRef.current) titleRef.current.value = listingData.post_name;
                if (priceRef.current) priceRef.current.value = listingData.price;
                if (markdownRef.current) markdownRef.current.value = listingData.post_desc;
                if (listingData.locations.length > 0) {
                    if (countryRef.current) countryRef.current.value = listingData.locations[0].country;
                    if (stateRef.current) stateRef.current.value = listingData.locations[0].state;
                    if (cityRef.current) cityRef.current.value = listingData.locations[0].city;
                    if (ctreetRef.current) ctreetRef.current.value = listingData.locations[0].street;
                    if (postalCodeRef.current) postalCodeRef.current.value = listingData.locations[0].postalCode;
                }

            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [id]);

    const handleCategoriesSelected = (selectedCategories: string[]) => {
        setSelectedTags(selectedCategories);
    };

    const handleChange = (e: any) => {
        if (e.target.files) {
            for (let i = 0; i < e.target.files.length; i++) {
                const newImage = e.target.files[i];
                setImages((prevState: File[] | undefined) => [...(prevState || []), newImage]);
            }
        }
    };

    const handleUpload = () => {
        images?.forEach((image) => {
            const imageRef = ref(storage, `images/${image.name}`);
            uploadBytes(imageRef, image).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    console.log(url);
                    setUrls((prev) => [...prev, url]);
                });
            });
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const contents = urls.map((url) => {
            return { media: url };
        });

        const tags = selectedTags.map((t) => {
            return { tag_name: t };
        });

        const locations = [
            {
                country: countryRef.current!.value,
                state: stateRef.current!.value,
                city: cityRef.current!.value,
                ctreet: ctreetRef.current!.value,
                postalCode: postalCodeRef.current!.value,
            }
        ];

        const updatedListing = {
            id_listing: id_listing,
            post_name: titleRef.current!.value,
            post_desc: markdownRef.current!.value,
            price: priceRef.current!.value,
            locations,
            contents,
            tags
        };

        axios.put(`/Listing`, updatedListing, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authContext.authData?.token}`
            }
        })
            .then((response) => {
                navigate("/" + id);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleClear = () => {
        setImages([]);
        setUrls([]);
    };
    const handleDeleteChip = (tagToDelete: string) => () => {
        const updatedTags = selectedTags.filter(tag => tag !== tagToDelete);
        handleCategoriesSelected(updatedTags)
        console.log('updated categories:', updatedTags);
    };

    return (
        <>
            <Container>
                <Paper elevation={3} style={{ padding: "20px" }}>
                    <Container component="main" maxWidth="lg">
                        <Typography variant="h5">New Listing</Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}
                                    sx={{
                                        marginLeft: 0,
                                        marginBottom: 2,
                                    }}
                                >
                                    <CategorySelector onCategoriesSelected={handleCategoriesSelected} />

                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    {Object.values(selectedTags).map(t => (
                                        <Chip key={t} style={{ margin: "5px" }} label={t} onDelete={handleDeleteChip(t)} />))}
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-title"
                                        name="title"
                                        required
                                        fullWidth
                                        id="title"
                                        label="Title"
                                        autoFocus
                                        inputRef={titleRef}
                                        InputLabelProps={{ shrink: true }}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="price"
                                        label="Price"
                                        name="price"
                                        autoComplete="given-price"
                                        inputRef={priceRef}
                                        InputLabelProps={{ shrink: true }}  
                                    />
                                </Grid>
                                <Grid item xs={12} md={24}>

                                    <TextField
                                        id="markdown"
                                        label="Description"
                                        inputRef={markdownRef}
                                        required
                                        multiline
                                        minRows={5}
                                        variant="outlined"
                                        sx={{ width: '100%' }}
                                        InputLabelProps={{ shrink: true }}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-country"
                                        name="country"
                                        required
                                        fullWidth
                                        id="country"
                                        label="Country"
                                        inputRef={countryRef}
                                        InputLabelProps={{ shrink: true }}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-state"
                                        name="state"
                                        fullWidth
                                        id="state"
                                        label="State"
                                        inputRef={stateRef}
                                        InputLabelProps={{ shrink: true }}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-city"
                                        name="city"
                                        required
                                        fullWidth
                                        id="city"
                                        label="City"
                                        inputRef={cityRef}
                                        InputLabelProps={{ shrink: true }}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-street"
                                        name="street"
                                        fullWidth
                                        id="street"
                                        label="Street"
                                        inputRef={ctreetRef}
                                        InputLabelProps={{ shrink: true }}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-postal-code"
                                        name="postalCode"
                                        fullWidth
                                        id="postalCode"
                                        label="Postal Code"
                                        inputRef={postalCodeRef}
                                        InputLabelProps={{ shrink: true }}  
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}
                                sx={{ marginTop: 3 }}>
                                <Grid item xs={7}>
                                    <Typography variant="h6">Add content to your listing</Typography>
                                </Grid>
                                <Grid item xs={7}>
                                    {images.length === 0 && urls.length > 0 ? (
                                        <ImageList
                                            sx={{
                                                width: 550,
                                                height: 350,
                                                border: '1px solid #d3d3d3',
                                                borderRadius: '3px',
                                                padding: '10px',
                                            }} cols={3} rowHeight={164}>
                                            {urls && urls.map((file, index) => (
                                                <ImageListItem key={index}>
                                                    <Avatar
                                                        variant="rounded"
                                                        src={file}
                                                        sx={{ width: 160, height: 90 }}
                                                    />
                                                </ImageListItem >
                                            ))}
                                        </ImageList>
                                    ) : (
                                        <ImageList
                                            sx={{
                                                width: 550,
                                                height: 350,
                                                border: '1px solid #d3d3d3',
                                                borderRadius: '3px',
                                                padding: '10px',
                                            }} cols={3} rowHeight={164}>
                                            {images && images.map((file, index) => (
                                                <ImageListItem key={index}>
                                                    <Avatar
                                                        variant="rounded"
                                                        src={URL.createObjectURL(file)}
                                                        sx={{ width: 160, height: 90 }}
                                                    />
                                                </ImageListItem >
                                            ))}
                                        </ImageList>)}
                                    <Box>
                                        <input type="file"
                                            multiple
                                            onChange={handleChange}
                                            style={{ display: 'none' }}
                                            id="file-upload"
                                            accept="image/*"
                                        />
                                        <label htmlFor="file-upload">
                                            <Button
                                                variant="contained"
                                                component="span"
                                                sx={{ mt: 0.5, mb: 2 }}
                                                onClick={handleUpload}
                                                startIcon={<AddAPhoto />}
                                            >
                                                Select Files
                                            </Button>
                                        </label>
                                        <Button
                                            variant="contained"
                                            onClick={handleUpload}
                                            sx={{ mt: 0.5, mb: 2, ml: 1 }}
                                            disabled={!images || images.length === 0}
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            Upload
                                        </Button>
                                        {images.length > 0 && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={handleClear}
                                                sx={{ mt: 0.5, mb: 2, ml: 1 }}
                                                startIcon={<CancelIcon />}
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>


                            </Grid>

                            <Button
                                type="submit"
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{ mt: 3, mb: 2 }}
                                startIcon={<CheckIcon/>}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {navigate("/mylistings")}}
                                sx={{ mt: 3, mb: 2, ml: 1 }}
                                startIcon={<CancelIcon/>}
                            >
                                Cancel
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                </Grid>
                            </Grid>
                        </Box>

                    </Container>
                </Paper>
            </Container>
        </>
    );
}
