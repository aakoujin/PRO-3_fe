import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { ListingItem } from "./Listing";
import { Box, Button, Modal } from "@mui/material";
import axios from "../api/axios";


export default function ModifiableListing(listing: ListingItem) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const navigate = useNavigate();

    const authContext = useContext(AuthContext)

    function handleClick() {
        navigate("/" + listing.id_listing);
    }
    const displayableMedia = listing.contents as any
    const handleEditClick = () => {
        navigate(`/edit/${listing.id_listing}`);
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    async function handleDeleteConfirm() {
        const saved =
            await axios.delete(`/Listing/${listing.id_listing}`,
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
                    withCredentials: true
                }
            ).then((response) => {
                if (response.status === 200) {
                    navigate("/mylistings");
                }
            })
                .catch((error) => {
                    console.error('Error:', error);
                });


        setShowDeleteDialog(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
    };

    return (
        <div>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Card
                    sx={{ height: '90%', display: 'flex', flexDirection: 'column' }}
                    onClick={handleClick}
                >
                    <CardMedia
                        component="div"
                        sx={{
                            // 16:9
                            pt: '56.25%',
                        }}
                        image={displayableMedia[0].media}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {listing.post_name}
                        </Typography>
                        <Typography>
                            {listing.price} $
                        </Typography>
                        <Typography>
                            Posted: {new Date(listing.post_date).toLocaleDateString()}
                        </Typography>

                    </CardContent>
                </Card>

                <Button onClick={handleEditClick}>
                    Edit
                </Button>

                <Button onClick={handleDeleteClick}>
                    Delete
                </Button>
                <Modal open={showDeleteDialog} onClose={handleDeleteCancel}>
                    <Box
                        sx={{
                            position: 'absolute',
                            width: 300,
                            bgcolor: 'white',
                            p: 3,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <Typography variant="h6">Confirm Deletion</Typography>
                        <Typography variant="body1">Are you sure you want to delete your listing?</Typography>
                        <Button variant="contained" color="primary" onClick={handleDeleteConfirm}>
                            Yes
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleDeleteCancel}>
                            No
                        </Button>
                    </Box>
                </Modal>
            </Card>
        </div>
    )

}