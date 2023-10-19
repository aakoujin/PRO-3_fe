import { useContext, useEffect, useState } from "react";
import axios from "../api/axios"
import { AuthContext } from "../context/AuthProvider"
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Chat from "./Chat";
import { useParams } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

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

    const authContext = useContext(AuthContext);

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
            setCurrectUser(chat.connection_string.split('_')[0])
            setChatConnectionString(chat.connection_string)
            //joinRoom();
        }
    }, [chat]);

    const joinRoom = async () => {
        try {
            
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

    const sendMessage = async (message) => {
        try {
            await connection.invoke("SendMessage", message);

        } catch (e) {
            console.log(e)
        }
    }


    return (<>

        <Container>
            <Button onClick={joinRoom}>
                View messages
            </Button>
            {messages.length > 0 ? (
                <Chat messages={messages} sendMessage={sendMessage} />
            ) : (<>
            </>)}
        </Container>
        

    </>)
}

export default ChatContainer;