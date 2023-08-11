import { useContext, useEffect, useState } from 'react';
import axios from "../api/axios"
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, ThemeProvider, createTheme, Button } from '@mui/material';
import { AuthContext, authData } from "../context/AuthProvider"


interface UserInfo {
    name: string;
    surname: string;
    phonenumber: string;
    email: string;
}

function UserInfoComponent() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    const authContext = useContext(AuthContext)
    const defaultTheme = createTheme();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('/User/userInfo', {
                    headers: {
                        Authorization: `Bearer ${authContext.authData?.token}`,
                    },
                });

                setUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleModifyClick = () => {
        navigate('/editUserInfo', { state: { userInfo } });
      };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Paper elevation={3} style={{ padding: defaultTheme.spacing(3), margin: defaultTheme.spacing(2) }}>
                <Typography variant="h5" gutterBottom>
                    User Information
                </Typography>
                {userInfo ? (
                    <div>
                        <Typography variant="body1">
                            Name: {userInfo.name} {userInfo.surname}
                        </Typography>
                        <Typography variant="body1">Phone: {userInfo.phonenumber}</Typography>
                        <Typography variant="body1">Email: {userInfo.email}</Typography>
                        <Button onClick={handleModifyClick} variant="contained">
                            Modify
                        </Button>
                    </div>
                ) : (
                    <Typography variant="body1">Loading user information...</Typography>
                )}
            </Paper>
        </ThemeProvider>
    );
}

export default UserInfoComponent;