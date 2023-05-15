import { useRef, useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

function Register() {

    const name = useRef<HTMLInputElement>(null)
    const surname = useRef<HTMLInputElement>(null)
    const userLogin = useRef<HTMLInputElement>(null)
    const userPassword = useRef<HTMLInputElement>(null)

    const LOGIN_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
    const PASSWORD_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        const newUser = {
            name: name.current!.value,
            surname: surname.current!.value,
            userLogin: userLogin.current!.value,
            userPassword: userPassword.current!.value
        }

        const result =
            await fetch("http://localhost:42999/api/Auth/register",
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify(newUser)
                })


        var createdUser = await result.json()
        console.log(createdUser)


    }

    return (
        <>
            <Form>
                <Stack gap={4}>
                    <Row>
                        <Form.Group controlId="name">
                            <Form.Label>Input your name</Form.Label>
                            <Form.Control ref={name} required />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group controlId="surname">
                            <Form.Label>Input your surname</Form.Label>
                            <Form.Control ref={surname} required />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group controlId="userLogin">
                            <Form.Label>Enter a username</Form.Label>
                            <Form.Control ref={userLogin} required />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group controlId="userPassword">
                            <Form.Label>Enter a password</Form.Label>
                            <Form.Control ref={userPassword} required />
                        </Form.Group>
                    </Row>
                    <Stack direction="horizontal" gap={2} className="justify-content-end">
                        <Button type="submit" variant="primary" onClick={handleSubmit}>Register</Button>
                        <Link to="..">
                            <Button type="button" variant="outline-secondary">Cancel</Button>
                        </Link>
                    </Stack>
                </Stack>
            </Form>
        </>
    )
}

export default Register