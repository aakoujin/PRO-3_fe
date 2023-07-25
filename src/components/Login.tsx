import { FormEvent, useContext, useRef } from "react"
//import { Button, Form, Row, Stack } from "react-bootstrap"
//import { Link } from "react-router-dom"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
//import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import axios from "../api/axios"
import { AuthContext, authData } from "../context/AuthProvider"

const LOGIN_URL = "/Auth/login"

function Login() {


    const authContext = useContext(AuthContext)

    const userLogin = useRef<HTMLInputElement>(null)
    const userPassword = useRef<HTMLInputElement>(null)
    const defaultTheme = createTheme();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        console.log(userLogin.current!.value)

        const newUser = {
            userLogin: userLogin.current!.value,
            userPassword: userPassword.current!.value
        }

        const response = await axios.post(LOGIN_URL,
            JSON.stringify(newUser),
            {
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                withCredentials: true
            }
        )

        const authToken: authData = {
            token: response.data,
        };


        authContext.setState(authToken)
        //console.log(authContext)



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
                            Sign in
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="userLogin"
                                label="Login"
                                name="userLogin"
                                autoComplete="userLogin"
                                autoFocus
                                inputRef={userLogin}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="userPassword"
                                label="Password"
                                type="userPassword"
                                id="userPassword"
                                autoComplete="current-password"
                                inputRef={userPassword}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                onClick={handleSubmit}
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        {"Don't have an account? Sign Up"}
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

export default Login

/*
<Form>
                <Stack gap={4}>
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
                        <Button type="submit" variant="primary" onClick={handleSubmit}>Login</Button>
                        <Link to="..">
                            <Button type="button" variant="outline-secondary">Cancel</Button>
                        </Link>
                    </Stack>
                </Stack>
            </Form >
*/