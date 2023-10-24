import { useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";


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
                <InputGroup>
                    <FormControl placeholder="message..."
                        onChange={e => setMessage(e.target.value)} value={message}
                    />

                    <Button variant="primary" type="submit" disabled={!message}>
                        Send
                    </Button>

                </InputGroup>
            </Form>
        </>
    )
}

export default SendMessageForm;