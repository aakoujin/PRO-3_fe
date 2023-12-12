import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";


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


    return(
        <>
            <MessageContainer messages={messages}/>
            <SendMessageForm sendMessage={sendMessage} chatConnectionString={chatConnectionString}/>
        </>
    )
}

export default Chat;