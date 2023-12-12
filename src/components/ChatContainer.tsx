import { useContext, useEffect, useState } from "react";
import axios from "../api/axios"
import { AuthContext } from "../context/AuthProvider"
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Chat from "./Chat";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Container, Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";


type ChatRoomProps = {
    id_chat_room: number;
    first_user: number;
    second_user: number;
    listing: number;
    connection_string: string;
    chat_room_messages: ChatRoomMessage[];
};

type ChatRoomMessage = {
    id_chat_room_message: number;
    chat_room_id: number;
    sender: string;
    message_content: string;
};

type MessageData = {
    currentUser: number;
    message: string;
};


const ChatContainer = () => {
    const params = useParams();
    const [chatConnectionString, setChatConnectionString] = useState<string | null>();
    const [connection, setConnection] = useState<HubConnection | null>();
    const [messages, setMessages] = useState<MessageData[] | null>([]);
    const [chat, setChat] = useState<ChatRoomProps | null>(null);
    const [currentUser, setCurrectUser] = useState<string | null>();
    const [showChat, setShowChat] = useState(false);
    const [viewer, setViewer] = useState<number>(null);

    const [open, setOpen] = useState(false);

    const authContext = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        fetchConnection();
    }, []);

    const fetchConnection = async () => {
        var result =
            await axios.get("/Chat/" + params.id,
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
                    withCredentials: true
                })
                .then((response) => setChat(response.data));

    }

    useEffect(() => {
        if (chat) {
            setCurrectUser(chat.connection_string.split('_')[0]);
            setChatConnectionString(chat.connection_string);
            getHistory(chat.connection_string);
            setOpen(true);
            //joinRoom();
        }
    }, [chat]);


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
        //console.log(result.data)

        const transformedMessages: MessageData[] = result.data.map(item => ({
            currentUser: parseInt(item.sender),
            message: item.message_content
        }));

        setMessages(transformedMessages);
    }

    const joinRoom = async () => {
        try {

            const connection = new HubConnectionBuilder()
                .withUrl("http://localhost:42999/chat")
                .configureLogging(LogLevel.Information)
                .build();

            connection.on("ReceiveMessage", (currentUser, message) => {
                setMessages(messages => [...messages, { currentUser, message }])
                //console.log(messages);
            });

            await connection.start();
            await connection.invoke("JoinRoom", { chatConnectionString });

            setConnection(connection);

        } catch (e) {
            console.log(e)
        }
    }



    const sendMessage = async (message, chatConnectionString) => {
        try {
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

        } catch (e) {
            console.log(e)
        }
    }


    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        joinRoom();
        setShowChat(true);
        setOpen(true);
        getViewer();
    };

    const handleClose = () => {
        setOpen(false);
        connection.stop();
        navigate("/chats")
    };

    const getViewer = async () => {
        const result =
            await axios.get("/User/viewer",
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
                    withCredentials: true
                }
            )
        
        await setViewer(result.data)
        console.log(result.data)
    }

    return (<>

        <Container maxWidth="lg" sx={{
            mb: 5,
            mt: 2
        }}>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Contact Seller</DialogTitle>
                <DialogContent>

                    {!showChat && (
                        <Box
                            position="fixed"
                            top={0}
                            left={0}
                            width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bgcolor="rgba(0, 0, 0, 0.5)"
                        >
                            <Button variant="contained" onClick={handleButtonClick}>View messages</Button>
                        </Box>
                    )}
                    {showChat && (
                        <Chat
                            messages={messages}
                            chatConnectionString={chatConnectionString}
                            sendMessage={sendMessage}
                            viewer={viewer}
                        />
                    )}
                </DialogContent>
            </Dialog>

        </Container>

    </>)
}

export default ChatContainer;