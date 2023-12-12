import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import axios from "../api/axios"
import { AuthContext } from "../context/AuthProvider"
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Chat from "./Chat";
import ChatIcon from '@mui/icons-material/Chat';

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
    const [open, setOpen] = useState(false);

    const authContext = useContext(AuthContext);

    useEffect(() => {
        fetchConnection();
      }, []);

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
        getHistory(await result.data.chatConnectionString)
        //joinRoom(await result.data.chatConnectionString);
    }


    const getHistory = async (connection_string) => {

        const mss = {
            message_content: null,
            connection_string: connection_string
        }

        var result =
            await axios.post("/Chat/chatHistory",
                JSON.stringify(mss),
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
                    withCredentials: true
                })

        const transformedMessages: MessageData[] = result.data.map(item => ({
            currentUser: parseInt(item.sender),
            message: item.message_content
        }));

        setMessages(transformedMessages);
    }

    const joinRoom = async () => {
        try {
            const data = {
                username: username,
                listing: listing
            }

            const result =
            await axios.post("/Chat/registerRoom",
                JSON.stringify(data),
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
                    withCredentials: true
                }
            )

            console.log("Registered chatRoom: " + await result.data)

            const connection = new HubConnectionBuilder()
                .withUrl("http://localhost:42999/chat")
                .configureLogging(LogLevel.Information)
                .build();

            connection.on("ReceiveMessage", (currentUser, message) => {
                setMessages(messages => [...messages, { currentUser, message }])
                console.log(messages);
            });

            await connection.start();
            await connection.invoke("JoinRoom", { chatConnectionString });

            setConnection(connection);

        } catch (e) {
            console.log(e)
        }
    }

    const sendMessage = async (message, chatConnectionString) => {
        try{
            await connection.invoke("SendMessage", message, chatConnectionString);

            const mss = {
                message_content: message,
                connection_string: chatConnectionString 
            }

            const result =
            await axios.post("/Chat/saveMessage",
                JSON.stringify(mss),
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
                    withCredentials: true
                }
            )

        }catch(e){
            console.log(e)
        }
    }

    const handleContactSeller = () => {
        setOpen(true);
        joinRoom();
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {authorId !== currentUser && (
                <>
                    <Button onClick={handleContactSeller} variant="contained" startIcon={<ChatIcon />}>
                        Contact seller
                    </Button>
                    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                        <DialogTitle>Contact Seller</DialogTitle>
                        <DialogContent>
                            {messages.length > 0 ? (
                                <Chat messages={messages} chatConnectionString={chatConnectionString} sendMessage={sendMessage} />
                            ) : (
                                <>No messages</>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}

        </>
    )
}

export default ContactSeller;
//conditional rendering if user != author