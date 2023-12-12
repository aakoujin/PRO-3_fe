import { Paper } from "@mui/material";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";
import { useEffect, useRef } from 'react';

interface MessageContainerProps {
    messages: MessageData[];
    chatConnectionString: string;
    sendMessage: any;
}

type MessageData = {
    currentUser: number;
    message: string;
};


const Chat = ({ messages, chatConnectionString, sendMessage }: MessageContainerProps) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    return (
        <>
            <Paper elevation={3} sx={{padding:"15px"}}>
                <MessageContainer messages={messages} />
                <SendMessageForm sendMessage={sendMessage} chatConnectionString={chatConnectionString} />
                <div ref={messagesEndRef}></div>
            </Paper>
        </>
    )
}

export default Chat;