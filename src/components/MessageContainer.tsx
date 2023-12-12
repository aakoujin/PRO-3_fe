import { Paper } from '@mui/material';


interface MessageContainerProps {
    messages: MessageData[];
}

type MessageData = {
    currentUser: number;
    message: string;
};

const MessageContainer = ({ messages }: MessageContainerProps) => {

    return (
        <>
            
                {messages.map((m, index) =>
                    <div key={index}>
                        <div>{m.message}</div>
                        <div>{m.currentUser}</div>
                    </div>
                )}
                 

        </>
    )
}

export default MessageContainer;