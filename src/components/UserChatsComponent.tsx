import React, { useState, useEffect, useContext } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from "../api/axios"
import { AuthContext } from "../context/AuthProvider"
import { useNavigate } from 'react-router-dom';

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


const UserChatsComponent = () => {
  const [tabValue, setTabValue] = useState<'Buy' | 'Sell'>('Buy');
  const [buyChats, setBuyChats] = useState<ChatRoomProps[]>([]);
  const [sellChats, setSellChats] = useState<ChatRoomProps[]>([]);

  const authContext = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/Chat/getOutcommingChats', {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
        withCredentials: true
    })
      .then((response) => setBuyChats(response.data));

    axios.get('/Chat/getIncommingChats', {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
        withCredentials: true
    })
      .then((response) => setSellChats(response.data));
  }, []);

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: 'Buy' | 'Sell') => {
    setTabValue(newValue);
  };

  const handleCardClick = (id_chat_room: number) => {
    console.log(`/chat/${id_chat_room}`)
    navigate(`/chats/${id_chat_room}`);
  };

  return (
    <div>
      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        centered
      >
        <Tab label="Buy" value="Buy" />
        <Tab label="Sell" value="Sell" />
      </Tabs>
      {tabValue === 'Buy' && (
        <div>
          {buyChats.map((item: ChatRoomProps, index: number) => (
            <Card key={index} onClick={() => handleCardClick(item.id_chat_room)}>
              <CardContent>
                <Typography variant="body1">
                  To: {item.second_user}
                </Typography>
                <Typography variant="body1">
                  For: {item.listing}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {tabValue === 'Sell' && (
        <div>
          {sellChats.map((item: ChatRoomProps, index: number) => (
            <Card key={index} onClick={() => handleCardClick(item.id_chat_room)}>
              <CardContent>
                <Typography variant="body1">
                  From: {item.first_user}
                </Typography>
                <Typography variant="body1">
                  For: {item.listing}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserChatsComponent;