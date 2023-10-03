import { Button, Container } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import axios from "../api/axios"
import { AuthContext } from "../context/AuthProvider"
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface ContactSellerProps {
    username: string;
    listing: number;
    authorId: number;
}

type MessageData = {
    currentUser: number;
    message: string;
};

const ContactSeller = ({ username, listing, authorId }: ContactSellerProps) => {
    const [chatConnectionString, setChatConnectionString] = useState();
    const [currentUser, setCurrectUser] = useState<number | null>();
    const [connection, setConnection] = useState<HubConnection | null>();
    const [messages, setMessages] = useState<MessageData[] | null>([]);

    const authContext = useContext(AuthContext);

    const fetchConnection = async () => {
        const data = {
            username: username,
            listing: listing
        }
        const result =
            await axios.post("/Chat/getConnection",
                JSON.stringify(data),
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
                    withCredentials: true
                }
            )

        setChatConnectionString(await result.data.chatConnectionString)
        setCurrectUser(await result.data.chatConnectionString.split('_')[0])

        joinRoom(await result.data.chatConnectionString);
    }

    const joinRoom = async (chatConnectionString) => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl("http://localhost:42999/chat")
                .configureLogging(LogLevel.Information)
                .build();

            connection.on("ReceiveMessage", (currentUser, message) => {
                setMessages(messages => [...messages, { currentUser, message }])
            });

            await connection.start();
            await connection.invoke("JoinRoom", { chatConnectionString });

            setConnection(connection);

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            {authorId != currentUser ? (
                <Container>
                    <Button onClick={fetchConnection}>
                        Contact seller
                    </Button>
                </Container>
            ) : (
                <>
                </>
            )}

        </>
    )
}

export default ContactSeller;
//conditional rendering if user != author