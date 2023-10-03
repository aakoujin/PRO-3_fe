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
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { AuthContext } from "../context/AuthProvider"

export function TopNavBar() {
    const authContext = useContext(AuthContext);
    const { authData, setState} = useContext(AuthContext);

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
        <AppBar style={{ background: "lightgray", color: "black", marginBottom: '20px'}} position="static">
            <Container>
                <Toolbar style={{maxWidth: "true"}}>
                    <div>
                        <Link component={RouterLink} to="/" color="inherit" underline="none" style={{ marginLeft: '20px', marginRight: '20px' }}>
                            Home
                        </Link>
                        <Link component={RouterLink} to="/about" color="inherit" underline="none" style={{ marginLeft: '20px', marginRight: '20px' }}>
                            About
                        </Link>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        {authContext.authData?.token ? (
                            <>
                                <Link component={RouterLink} to="/new" color="inherit" underline="none" style={{ marginLeft: '20px' }}>
                                    New listing
                                </Link>
                                <Link component={RouterLink} to="/mylistings" color="inherit" underline="none" style={{ marginLeft: '20px' }}>
                                    My listings
                                </Link>
                                <Link component={RouterLink} to="/savedlistings" color="inherit" underline="none" style={{ marginLeft: '20px' }}>
                                    Saved
                                </Link>
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
