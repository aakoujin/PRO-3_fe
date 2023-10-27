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
import { Paper } from "@mui/material";
import { CategorySelector } from "./CategorySelector";
import { ListingItem, TagItem } from "./Listing";
import { Form } from "react-bootstrap";

export function EditListing() {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const defaultTheme = createTheme();

    const [images, setImages] = useState<File[] | undefined>([]);
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
        // Fetch listing info from the API using the provided id
        axios.get(`/Listing/${id}`)
            .then((response) => {
                const listingData = response.data;

                // Set fetched data to the component state
                setUrls(listingData.contents.map((content: any) => content.media));
                setSelectedTags(listingData.tags.map((tag: any) => tag.tag_name));
                setIdListing(listingData.id_listing);

                // Update form fields with fetched data
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
                navigate("/" + id); // Navigate to the listing view page
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
//fix category reset
    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Paper elevation={3} style={{ padding: "20px" }}>
                    <Container component="main" maxWidth="lg">
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <CategorySelector onCategoriesSelected={handleCategoriesSelected} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    {selectedTags.map((t) => (
                                        <div key={t}>{t}</div>
                                    ))}
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
                                        fullWidth
                                        id="description"
                                        label="Description"
                                        name="description"
                                        inputRef={markdownRef}
                                        multiline
                                        rows={5}
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
                                <Grid item xs={1}>
                                    <Form.Group controlId="files">
                                        <input type="file" multiple onChange={handleChange} />
                                        <Button
                                            variant="contained"
                                            onClick={handleUpload}
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            Upload
                                        </Button>
                                    </Form.Group>
                                    <Grid item xs={12} sm={6}>
                                        <ImageList sx={{ width: 830, height: 150 }} cols={6} rowHeight={124}>
                                            {urls.map((item, index) => (
                                                <ImageListItem key={index}>
                                                    <img
                                                        src={`${item}?w=124&h=124&fit=crop&auto=format`}
                                                        srcSet={`${item}?w=124&h=124&fit=crop&auto=format&dpr=2 2x`}
                                                        alt={`Image ${index}`}
                                                        loading="lazy"
                                                    />
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Container>
                </Paper>
            </ThemeProvider>
        </>
    );
}
