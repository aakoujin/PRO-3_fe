import { Paper, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';


interface MessageContainerProps {
    messages: MessageData[];
    viewer: number;
}

type MessageData = {
    currentUser: number;
    message: string;
};

const MessageContainer = ({ messages, viewer }: MessageContainerProps) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    console.log(messages)
    return (

        <div style={{ overflowY: 'auto', maxHeight: '400px', marginRight: 1 }}>
            {messages.map((m, index) => (
                <div
                    key={index}
                    style={{
                        display: 'flex',
                        justifyContent: parseInt(m.currentUser.toString()) === viewer ? 'flex-end' : 'flex-start',
                        marginBottom: '10px',
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            backgroundColor: parseInt(m.currentUser.toString()) === viewer ? '#303030' : '#303030',
                            color: parseInt(m.currentUser.toString()) === viewer ? 'white' : 'inherit',
                            padding: '10px',
                            borderRadius:
                            parseInt(m.currentUser.toString())=== viewer ? '16px 0 16px 16px' : '0 16px 16px 16px',
                            maxWidth: '70%',
                            wordWrap: 'break-word',
                            textAlign: parseInt(m.currentUser.toString()) === viewer ? 'right' : 'left',
                        }}
                    >
                        <Typography variant="body1">{m.message}</Typography>
                        <div ref={messagesEndRef}></div>
                    </Paper>
                </div>
            ))}
        </div>
    );
};

export default MessageContainer;
