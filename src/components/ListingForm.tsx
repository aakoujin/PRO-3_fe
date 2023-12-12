import { ChangeEvent, FormEvent, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from '../firebase';
import Button from '@mui/material/Button';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import axios from "../api/axios"
import { AuthContext } from '../context/AuthProvider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Avatar, Chip, Paper, Typography, Box } from "@mui/material";
import { CategorySelector } from "./CategorySelector"
import { AddAPhoto } from "@mui/icons-material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';


export function ListingForm() {

    const authContext = useContext(AuthContext)

    const [images, setImages] = useState<File[]>([]);
    const [urls, setUrls] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const titleRef = useRef<HTMLInputElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)

    const countryRef = useRef<HTMLInputElement>(null);
    const stateRef = useRef<HTMLInputElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);
    const ctreetRef = useRef<HTMLInputElement>(null);
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

    const handleAsyncUpload = async () => {
        images?.map((image) => {
            const imageRef = ref(storage, `images/${image!.name + v4()}`)
            uploadBytes(imageRef, image!).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    console.log(url);
                    setUrls((prev) => [...prev, url]);
                })
            })

        })
    };


    const handleDeleteChip = (tagToDelete: string) => () => {
        const updatedTags = selectedTags.filter(tag => tag !== tagToDelete);
        handleCategoriesSelected(updatedTags)
        console.log('updated categories:', updatedTags);
    };

    const handleClear = () => {
        setImages([]);
        setUrls([]);
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        var contents;

        if (urls.length > 0) {
            contents = urls.map((url) => {
                return { media: url }
            })
        } else if (urls.length === 0 && images.length > 0) {
            await handleAsyncUpload()
            contents = urls.map((url) => {
                return { media: url }
            })
        }


        const tags = selectedTags.map((t) => {
            return { tag_name: t }
        })

        const locations = [{
            country: countryRef.current!.value,
            state: stateRef.current!.value,
            city: cityRef.current!.value,
            ctreet: ctreetRef.current!.value,
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

        navigate("/" + createdListing.id_listing);
    }

    return (
        <>
            <Container>
                <Typography variant="h5" sx={{
                    marginLeft: 2,
                    marginBottom: 2,
                    marginTop: 2
                }}>
                    New Listing</Typography>

                <Container component="main" maxWidth="lg">
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Paper elevation={6} style={{ padding: "20px", width: "100%" }}>
                                <Grid container maxWidth="lg">
                                    <Grid item xs={12} sx={{ marginLeft: 0, marginBottom: 2, }}>
                                        <Typography variant="h6" sx={{
                                            marginLeft: 0,
                                            marginBottom: 2,
                                        }} >Select a category of your listing</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ marginLeft: 0, marginBottom: 2, }}>
                                        <CategorySelector onCategoriesSelected={handleCategoriesSelected} />
                                    </Grid>
                                    <Grid item xs={6} >
                                        {Object.values(selectedTags).map(t => (
                                            <Chip key={t} style={{ margin: "5px" }} label={t} onDelete={handleDeleteChip(t)} />))}
                                    </Grid>

                                </Grid>
                            </Paper>
                            <Paper elevation={6} sx={{ padding: "20px", width: "100%", mt: 3 }}>
                                <Grid container spacing={1} sx={{ mt: 1 }} >
                                    <Grid item xs={12} sx={{ mb: 1, }}>
                                        <Typography variant="h6" >Add information about your item</Typography>
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

                                        <TextField
                                            id="markdown"
                                            label="Description"
                                            inputRef={markdownRef}
                                            required
                                            multiline
                                            minRows={5}
                                            variant="outlined"
                                            sx={{ width: '100%' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 2, mb: 1, }}>
                                        <Typography variant="h6">Add information about your location</Typography>
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
                                            inputRef={ctreetRef}
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
                                </Grid>
                            </Paper>

                            <Paper elevation={6} sx={{ padding: "20px", width: "100%", ml: 0, mt: 3 }}>
                                <Grid container
                                    sx={{ marginLeft: 0 }}>
                                    <Grid item xs={12} sx={{ mb: 2 }}>
                                        <Typography variant="h6">Add content to your listing</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {images.length === 0 ? (
                                            <></>
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
                            </Paper>
                            <Grid container sx={{ mb: 10 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    onClick={handleSubmit}
                                    sx={{ mt: 3, mb: 2 }}
                                    startIcon={<CheckIcon />}
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { navigate("/mylistings") }}
                                    sx={{ mt: 3, mb: 2, ml: 1 }}
                                    startIcon={<CancelIcon />}
                                >
                                    Cancel
                                </Button>
                            </Grid>

                        </Grid>
                    </Box>

                </Container>

            </Container>
        </>
    )
}

/*
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
                                        </ImageList>*/