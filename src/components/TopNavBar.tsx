import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Link,
    Container,
    Chip,
} from '@mui/material';
import { AccountCircle, Add, Bookmark, Home, List, QuestionMark, Search } from '@mui/icons-material';
import { AuthContext } from "../context/AuthProvider"

export function TopNavBar() {
    const authContext = useContext(AuthContext);
    const { authData, setState } = useContext(AuthContext);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        if (setState) {
            setState({ token: "" });
            localStorage.removeItem("authToken");
        }
        handleMenuClose();
    };

    return (
        <AppBar position="sticky">
            <Container>
                <Toolbar style={{ maxWidth: "true" }}>
                    <div>
                        <Chip icon={<Home />}
                            style={{  }}
                            clickable
                            component={RouterLink}
                            to="/"
                            label="Home" />
                        <Chip icon={<QuestionMark />}
                            style={{ marginLeft: '10px' }}
                            clickable
                            component={RouterLink}
                            to="/about"
                            label="About" />
                        <Chip icon={<Search />}
                            style={{ marginLeft: '10px' }}
                            clickable
                            component={RouterLink}
                            to="/search"
                            label="Search" />
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        {authContext.authData?.token ? (
                            <>
                                <Chip icon={<Add />}
                                    style={{ marginLeft: '10px' }}
                                    clickable component={RouterLink}
                                    to="/new"
                                    label="Add Listing" />
                                <Chip icon={<List />}
                                    style={{ marginLeft: '10px' }}
                                    clickable
                                    component={RouterLink}
                                    to="/mylistings"
                                    label="My Listings" />
                                <Chip icon={<Bookmark />}
                                    style={{ marginLeft: '10px' }}
                                    clickable
                                    component={RouterLink}
                                    to="/savedlistings"
                                    label="Saved" />
                            </>
                        ) : (<></>
                        )}
                        <IconButton color="inherit" onClick={handleMenuOpen}>
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {authContext.authData?.token ? (
                                [
                                    <MenuItem key="account" component={RouterLink} to="/userInfo" onClick={handleMenuClose}>
                                        My account
                                    </MenuItem>,
                                    <MenuItem key="chat" component={RouterLink} to="/chats" onClick={handleMenuClose}>
                                        My chats
                                    </MenuItem>,
                                    <MenuItem key="logout" component={RouterLink} to="/" onClick={handleLogout}>
                                        Logout
                                    </MenuItem>
                                ]
                            ) : (
                                [
                                    <MenuItem key="login" component={RouterLink} to="/login" onClick={handleMenuClose}>
                                        Login
                                    </MenuItem>,
                                    <MenuItem key="register" component={RouterLink} to="/register" onClick={handleMenuClose}>
                                        Register
                                    </MenuItem>
                                ]
                            )}
                        </Menu>
                    </div>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
