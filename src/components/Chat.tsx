import { Paper } from "@mui/material";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";
import { useEffect, useRef } from 'react';

interface MessageContainerProps {
    messages: MessageData[];
    chatConnectionString: string;
    sendMessage: any;
    viewer: number;
}

type MessageData = {
    currentUser: number;
    message: string;
};


const Chat = ({ messages, chatConnectionString, sendMessage, viewer }: MessageContainerProps) => {
   


    return (
        <>
            <Paper elevation={3} sx={{padding:"15px"}}>
                <MessageContainer messages={messages} viewer={viewer} />
                <SendMessageForm sendMessage={sendMessage} chatConnectionString={chatConnectionString} />
                
            </Paper>
        </>
    )
}

export default Chat;