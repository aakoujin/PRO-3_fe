import React, { useState, useEffect, useContext } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from "../api/axios"
import { AuthContext } from "../context/AuthProvider"
import { useNavigate } from 'react-router-dom';
import { CardMedia, Chip, Grid } from '@mui/material';
import { BrokenImage } from '@mui/icons-material';
import SellIcon from '@mui/icons-material/Sell';

type ChatRoomProps = {
  id_chat_room: number;
  first_user: number;
  second_user: number;
  listing: number;
  connection_string: string;
  media: string;
  price: number;
  name: string;
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
            <Card
              sx={{
                padding: 1,
                margin: 1
              }}
              key={index} onClick={() => handleCardClick(item.id_chat_room)}>
              <CardContent>
                <Grid container>
                  <Grid item xs={4}>
                    {item.media && item.media.length > 0 ? (
                      <CardMedia
                        component="div"
                        sx={{
                          // 16:9
                          //pt: '56.25%',
                          height: 160,
                          width: 250,
                          objectFit: "contain"
                        }}
                        image={item.media}
                      />) : (
                      <CardMedia sx={{
                        // 16:9
                        //pt: '56.25%',
                        height: 160,
                        width: 250,
                        objectFit: "contain"
                      }}>
                        <BrokenImage />
                      </CardMedia>
                    )}
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">
                      Resume your conversation for:
                    </Typography>
                    <Typography sx={{ mt: 1, mb: 5 }} variant="h5">
                      {item.name}
                    </Typography>
                  <Chip size="medium" variant="outlined" label={"Asking price: " + item.price + " $"} icon={<SellIcon />} />
                </Grid>

              </Grid>
            </CardContent>
            </Card>
      ))}
    </div>
  )
}
{
  tabValue === 'Sell' && (
    <div>
      {sellChats.map((item: ChatRoomProps, index: number) => (
        <Card
          sx={{
            padding: 1,
            margin: 1
          }}
          key={index} onClick={() => handleCardClick(item.id_chat_room)}>
          <CardContent>
            <Grid container>
              <Grid item xs={4}>
                {item.media && item.media.length > 0 ? (
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      //pt: '56.25%',
                      height: 160,
                      width: 250,
                      objectFit: "contain"
                    }}
                    image={item.media}
                  />) : (
                  <CardMedia sx={{
                    // 16:9
                    //pt: '56.25%',
                    height: 160,
                    width: 250,
                    objectFit: "contain"
                  }}>
                    <BrokenImage />
                  </CardMedia>
                )}
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  Resume your conversation for:
                </Typography>
                <Typography sx={{ mt: 1, mb: 5 }} variant="body1">
                  {item.name}
                </Typography>
                <Chip size="medium" variant="outlined" label={"Asking price: " + item.price + " $"} icon={<SellIcon />} />
              </Grid>

            </Grid>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
    </div >
  );
};

export default UserChatsComponent;