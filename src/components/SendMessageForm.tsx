import { Grid, Input, Button } from "@mui/material";
import { useState } from "react";
import { Form } from "react-bootstrap";


const SendMessageForm = ({ sendMessage, chatConnectionString }) => {
    const [message, setMessage] = useState('');

    return (
        <>
            <Form
                onSubmit={e => {
                    e.preventDefault();
                    sendMessage(message, chatConnectionString);
                    setMessage('');
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={9}>
                        <Input
                            placeholder="Message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!message}
                        >
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </Form>
        </>
    )
}

export default SendMessageForm;