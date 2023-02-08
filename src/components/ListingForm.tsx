import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { storage } from '../firebase';
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {v4} from "uuid";

export function ListingForm() {
    const [imageUpload, setImageUpload] = useState<File>()
    const [imageList, setImageList] = useState<string[]>([]);

    const titleRef = useRef<HTMLInputElement>(null)
    const userRef = useRef<HTMLInputElement>(null)  //to replace for automatic setup of user
    const markdownRef = useRef<HTMLTextAreaElement>(null)


    const navigate = useNavigate();

    const uploadImage = () => {
        const imageRef = ref(storage, `images/${imageUpload!.name + v4()}`)
        uploadBytes(imageRef, imageUpload!).then((snapshot)=> {
            getDownloadURL(snapshot.ref).then((url)=>{
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

        const newListing = {
            post_name: titleRef.current!.value,
            post_desc: markdownRef.current!.value,
            post_date: "2023-02-07T14:10:05.670Z",//(new Date()).toISOString,
            state: userRef.current!.value,
            contents: [{
                media: "sample media placeholder"
            }]
        }

        const result =
            await fetch("http://localhost:42999/api/Listing",
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify(newListing)
                })

        var createdListing = await result.json()
        console.log(createdListing)

        navigate("/" + createdListing.id_listing); //navigate to listing view page
    }

    return (
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
                        <Form.Group controlId="user">
                            <Form.Label>User</Form.Label>
                            <Form.Control ref={userRef} required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="files">
                            <input type="file" onChange={handleFileChange} />
                            <Button onClick={uploadImage}>Upload</Button>
                        </Form.Group>
                    </Col>
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
        </Form>
    )
}