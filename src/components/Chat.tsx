import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";


interface MessageContainerProps {
    messages: MessageData[];
    sendMessage: any;
}

type MessageData = {
    currentUser: number;
    message: string;
};


const Chat = ({ messages, sendMessage }: MessageContainerProps) => {


    return(
        <>
            <MessageContainer messages={messages}/>
            <SendMessageForm sendMessage={sendMessage}/>
        </>
    )
}

export default Chat;