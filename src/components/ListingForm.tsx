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


export function ListingForm() {

    const authContext = useContext(AuthContext)
    const defaultTheme = createTheme();

    const [imageUpload, setImageUpload] = useState<File>()
    const [imageList, setImageList] = useState<string[]>([]);

    const titleRef = useRef<HTMLInputElement>(null)
    const userRef = useRef<HTMLInputElement>(null)  //to replace for automatic setup of user
    const priceRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)


    const navigate = useNavigate();

    const uploadImage = () => {
        const imageRef = ref(storage, `images/${imageUpload!.name + v4()}`)
        uploadBytes(imageRef, imageUpload!).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                console.log(url);
                setImageList((prev) => [...prev, url]);
            })
        })
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        setImageUpload(e.target.files[0])
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        function attachImages() {
            //todo multi-img 
        }

        const newListing = {
            post_name: titleRef.current!.value,
            post_desc: markdownRef.current!.value,
            post_date: "2023-02-07T14:10:05.670Z",//(new Date()).toISOString,
            price: priceRef.current!.value,
            contents: [{
                media: imageList[0]
            }]
        }
        /*
                const res =
                    await fetch("http://localhost:42999/api/Listing",
                        {
                            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                            method: 'POST',
                            body: JSON.stringify(newListing)
                        })
        
                var createdListing = await res.json()
                console.log(createdListing)*/

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
                <Container component="main" maxWidth="md">
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
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
                            <Grid item xs={1}>
                                <Form.Group controlId="files">
                                    <input type="file" onChange={handleFileChange} />
                                    <Button
                                        
                                        variant="contained"
                                        onClick={uploadImage}
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Upload
                                    </Button>
                                </Form.Group>
                                <Grid item xs={12} sm={6}>
                                    <ImageList sx={{ width: 830, height: 150 }} cols={6} rowHeight={124}>
                                        {imageList.map((item) => (
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
            </ThemeProvider>

        </>
    )
}

/*
<Form onSubmit={handleSubmit}>
                <Stack gap={4}>
                    <Row>
                        <Col>
                            <Form.Group controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control ref={titleRef} required />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="price">
                                <Form.Label>Price</Form.Label>
                                <Form.Control ref={priceRef} required />
                            </Form.Group>
                        </Col>
                        <Row>
                            <Col>
                                <Form.Group controlId="files">
                                    <input type="file" onChange={handleFileChange} />
                                    <Button onClick={uploadImage}>Upload</Button>
                                </Form.Group>
                            </Col>
                            {imageList.map((url) => {
                                return <img key={url} src={url} />
                            })}
                        </Row>
                    </Row>
                    <Row>
                        <Form.Group controlId="markdown">
                            <Form.Label>Description</Form.Label>
                            <Form.Control ref={markdownRef} required as="textarea" rows={15} />
                        </Form.Group>
                    </Row>
                    <Stack direction="horizontal" gap={2} className="justify-content-end">
                        <Button type="submit" variant="primary">Save</Button>
                        <Link to="..">
                            <Button type="button" variant="outline-secondary">Cancel</Button>
                        </Link>
                    </Stack>
                </Stack>
            </Form>*/