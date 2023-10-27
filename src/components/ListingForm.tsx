import { ChangeEvent, FormEvent, useRef, useState, useContext } from "react";
import { Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { storage } from '../firebase';
import Button from '@mui/material/Button';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import axios from "../api/axios"
import { AuthContext } from '../context/AuthProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Paper } from "@mui/material";
import { CategorySelector } from "./CategorySelector"
import { TagItem } from "./Listing";


export function ListingForm() {

    const authContext = useContext(AuthContext)
    const defaultTheme = createTheme();

    const [images, setImages] = useState<File[] | undefined>();
    const [urls, setUrls] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const titleRef = useRef<HTMLInputElement>(null)
    const userRef = useRef<HTMLInputElement>(null)  //to replace for automatic setup of user
    const priceRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)

    const countryRef = useRef<HTMLInputElement>(null);
    const stateRef = useRef<HTMLInputElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);
    const streetRef = useRef<HTMLInputElement>(null);
    const postalCodeRef = useRef<HTMLInputElement>(null);


    const navigate = useNavigate();

    const handleCategoriesSelected = (selectedCategories: string[]) => {
        setSelectedTags(selectedCategories);
        console.log('Selected categories:', selectedCategories);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            for (let i = 0; i < e.target.files.length; i++) {
                const newImage = e.target.files[i];
                setImages((prevState: File[] | undefined) => [...(prevState || []), newImage]);
            }
        }
    };

    const handleUpload = () => {
        images?.map((image) => {
            const imageRef = ref(storage, `images/${image!.name + v4()}`)
            uploadBytes(imageRef, image!).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    console.log(url);
                    setUrls((prev) => [...prev, url]);
                })
            })

        })
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        const contents = urls.map((url) => {
            return { media: url }
        })

        const tags = selectedTags.map((t) => {
            return { tag_name: t }
        })

        const locations = [{
            country: countryRef.current!.value,
            state: stateRef.current!.value,
            city: cityRef.current!.value,
            ctreet: streetRef.current!.value,
            postalCode: postalCodeRef.current!.value,
        }]

        const newListing = {
            post_name: titleRef.current!.value,
            post_desc: markdownRef.current!.value,
            post_date: "2023-02-07T14:10:05.670Z",//(new Date()).toISOString,
            price: priceRef.current!.value,
            locations,
            contents,
            tags
        }

        const result =
            await axios.post("http://localhost:42999/api/Listing",
                JSON.stringify(newListing),
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
                    withCredentials: true
                }
            )

        var createdListing = await result.data

        navigate("/" + createdListing.id_listing); //navigate to listing view page
    }

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
                                    {Object.values(selectedTags).map(t => (
                                        <div key={t}>
                                            {t}
                                        </div>))}
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
                                    />
                                </Grid>
                                <Grid item xs={12} md={24}>
                                    <Form.Group controlId="markdown">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control ref={markdownRef} required as="textarea" rows={5} />
                                    </Form.Group>
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
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-street"
                                        name="street"
                                        fullWidth
                                        id="street"
                                        label="Street"
                                        inputRef={streetRef}
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
                                            {urls.map((item) => (
                                                <ImageListItem key={item}>
                                                    <img
                                                        src={`${item}?w=124&h=124&fit=crop&auto=format`}
                                                        srcSet={`${item}?w=124&h=124&fit=crop&auto=format&dpr=2 2x`}
                                                        alt={item}
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
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                </Grid>
                            </Grid>
                        </Box>

                    </Container>
                </Paper>
            </ThemeProvider>
        </>
    )
}
