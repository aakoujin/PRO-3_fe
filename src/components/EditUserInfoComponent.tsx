import React, { useContext, useEffect, useState } from 'react';
import axios from "../api/axios";
import { TextField, Button, ThemeProvider, createTheme, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthProvider";

interface UserInfo {
    name: string;
    surname: string;
    phonenumber: string;
    email: string;
}

const defaultTheme = createTheme();

const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    width: '100%',
                },
            },
        },
    },
});

function EditUserInfoComponent() {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [modifiedUserInfo, setModifiedUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const fetchUserInfoForEdit = async () => {
            try {
                const response = await axios.get('/User/userInfo', {
                    headers: {
                        Authorization: `Bearer ${authContext.authData?.token}`,
                    },
                });

                setUserInfo(response.data);
                setModifiedUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfoForEdit();
    }, []);

    const handleSaveChanges = async () => {
        try {
            await axios.put('/User', modifiedUserInfo, {
                headers: {
                    Authorization: `Bearer ${authContext.authData?.token}`,
                },
            });
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    const handleDiscard = () => {
        navigate('/');
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setModifiedUserInfo((prevUserInfo: UserInfo | null) => ({
            ...(prevUserInfo as UserInfo),
            [name]: value,
        }));
    };

    return (
        <ThemeProvider theme={theme}>
            <Paper elevation={3} style={{ padding: defaultTheme.spacing(3), margin: defaultTheme.spacing(2) }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: defaultTheme.spacing(2),
                    maxWidth: '400px',
                    margin: '0 auto',
                    padding: defaultTheme.spacing(3),
                }}>
                    {modifiedUserInfo ? (
                        <div>
                            <TextField
                                label="Name"
                                name="name"
                                value={modifiedUserInfo.name}
                                onChange={handleInputChange}
                                style={{ width: '100%', marginBottom: defaultTheme.spacing(1) }}
                            />
                            <TextField
                                label="Surname"
                                name="surname"
                                value={modifiedUserInfo.surname}
                                onChange={handleInputChange}
                                style={{ width: '100%', marginBottom: defaultTheme.spacing(1) }}
                            />
                            <TextField
                                label="Phone"
                                name="phonenumber"
                                value={modifiedUserInfo.phonenumber}
                                onChange={handleInputChange}
                                style={{ width: '100%', marginBottom: defaultTheme.spacing(1) }}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={modifiedUserInfo.email}
                                onChange={handleInputChange}
                                style={{ width: '100%', marginBottom: defaultTheme.spacing(1) }}
                            />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginTop: defaultTheme.spacing(2),
                            }}>
                                <Button onClick={handleSaveChanges} variant="contained" color="primary">
                                    Save Changes
                                </Button>
                                <Button onClick={handleDiscard} variant="contained" color="secondary">
                                    Discard
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p>Loading user information...</p>
                    )}
                </div>
            </Paper>
        </ThemeProvider>
    );
}

export default EditUserInfoComponent;

// TODO FIX: react-dom.development.js:86 Warning: `value` prop on `input` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.