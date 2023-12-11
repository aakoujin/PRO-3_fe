import React, { useContext, useEffect, useState } from 'react';
import axios from "../api/axios";
import { TextField, Button, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthProvider";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';

interface UserInfo {
    name: string;
    surname: string;
    phonenumber: string;
    email: string;
}


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
        <Container>
            <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    maxWidth: '400px',
                    margin: '0 auto',
                    padding: 3,
                }}>
                    {modifiedUserInfo ? (
                        <div>
                            <TextField
                                label="Name"
                                name="name"
                                value={modifiedUserInfo.name}
                                onChange={handleInputChange}
                                sx={{ width: '100%', marginBottom: 1 }}
                            />
                            <TextField
                                label="Surname"
                                name="surname"
                                value={modifiedUserInfo.surname}
                                onChange={handleInputChange}
                                sx={{ width: '100%', marginBottom: 1 }}
                            />
                            <TextField
                                label="Phone"
                                name="phonenumber"
                                value={modifiedUserInfo.phonenumber}
                                onChange={handleInputChange}
                                sx={{ width: '100%', marginBottom: 1 }}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={modifiedUserInfo.email}
                                onChange={handleInputChange}
                                sx={{ width: '100%', marginBottom: 1 }}
                            />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginTop: 2,
                            }}>
                                <Button onClick={handleSaveChanges} variant="contained" color="primary"
                                startIcon={<CheckIcon/>}
                                >
                                    Save Changes
                                </Button>
                                <Button onClick={handleDiscard} variant="contained" color="secondary"
                                startIcon={<CancelIcon/>}
                                >
                                    Discard
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p>Loading user information...</p>
                    )}
                </div>
            </Paper>
        </Container>
    );
}

export default EditUserInfoComponent;

// TODO FIX: react-dom.development.js:86 Warning: `value` prop on `input` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.