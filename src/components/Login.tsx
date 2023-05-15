import axios from "axios"
import { FormEvent, useRef } from "react"
import { Button, Form, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"

function Login() {

    const userLogin = useRef<HTMLInputElement>(null)
    const userPassword = useRef<HTMLInputElement>(null)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        const newUser = {
            userLogin: userLogin.current!.value,
            userPassword: userPassword.current!.value
        }

        const result =
            await axios.post("http://localhost:42999/api/Auth/login",
                JSON.stringify(newUser),
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                }
            )

        console.log(JSON.stringify(result))


    }

    return (
        <>
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
        </>
    )
}

export default Login