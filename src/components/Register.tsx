import { useRef, useState, useEffect, FormEvent } from "react";
import axios from "../api/axios"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
//import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";

const REGISTER_URL = "/Auth/register"

function Register() {
    const navigate = useNavigate();

    const name = useRef<HTMLInputElement>(null)
    const surname = useRef<HTMLInputElement>(null)
    const email = useRef<HTMLInputElement>(null)
    const phone = useRef<HTMLInputElement>(null)
    const userLogin = useRef<HTMLInputElement>(null)
    const userPassword = useRef<HTMLInputElement>(null)
    const defaultTheme = createTheme();

    const LOGIN_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
    const PASSWORD_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        const newUser = {
            name: name.current!.value,
            surname: surname.current!.value,
            email: email.current!.value,
            phonenumber: surname.current!.value,
            userLogin: userLogin.current!.value,
            userPassword: userPassword.current!.value
        }

        // const result =
        //     await fetch("http://localhost:42999/api/Auth/register",
        //         {
        //             headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        //             method: 'POST',
        //             body: JSON.stringify(newUser)
        //         })

        const result = await axios.post(REGISTER_URL,
            JSON.stringify(newUser),
            {
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                withCredentials: true
            }
        )


        //var createdUser = await result.data;
        //console.log(createdUser)
        navigate("/login");


    }

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="name"
                                        required
                                        fullWidth
                                        id="name"
                                        label="First Name"
                                        autoFocus
                                        inputRef={name}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="surname"
                                        label="Last Name"
                                        name="surname"
                                        autoComplete="family-name"
                                        inputRef={surname}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        name="email"
                                        autoComplete="email"
                                        inputRef={email}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="phone"
                                        label="Phone number (exclude code +380)"
                                        name="phone"
                                        autoComplete="Phone number"
                                        inputRef={phone}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="userLogin"
                                        label="Login"
                                        name="userLogin"
                                        autoComplete="userLogin"
                                        inputRef={userLogin}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="userPassword"
                                        label="Password"
                                        type="password"
                                        id="userPassword"
                                        autoComplete="new-password"
                                        inputRef={userPassword}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    )
}

export default Register

/*
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
            </Form>*/