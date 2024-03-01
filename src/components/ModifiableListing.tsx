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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { BrokenImage } from "@mui/icons-material";


export default function ModifiableListing(listing: ListingItem, onDelete : (id: number) => void) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const navigate = useNavigate();

    const authContext = useContext(AuthContext)

    function handleClick() {
        navigate("/" + listing.id_listing);
    }
    const displayableMedia = listing.contents as any
    const handleEditClick = () => {
        navigate(`/${listing.id_listing}/edit`);
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

        //
            // if (onDelete && typeof onDelete === 'function') {
            //     onDelete(listing.id_listing);
            // }
        setShowDeleteDialog(false);
        window.location.reload();
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
    };

    return (

        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Card
                sx={{ height: '90%', display: 'flex', flexDirection: 'column' }}
                onClick={handleClick}
            >
                {displayableMedia && displayableMedia.length > 0 ? (
                    <CardMedia
                        component="div"
                        sx={{
                            // 16:9
                            pt: '56.25%',
                        }}
                        image={displayableMedia[0].media}
                    />) : (
                    <CardMedia sx={{
                        pt: '50.25%',
                    }}>
                        <BrokenImage />
                    </CardMedia>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {listing.post_name.length <= 18 ? listing.post_name : (listing.post_name.substring(0, 18) + "...")}
                    </Typography>
                    <Typography>
                        {listing.price} $
                    </Typography>
                    <Typography>
                        Posted: {new Date(listing.post_date).toLocaleDateString()}
                    </Typography>

                </CardContent>
            </Card>

            <Button onClick={handleEditClick} startIcon={<EditIcon />}>
                Edit
            </Button>

            <Button onClick={handleDeleteClick} startIcon={<DeleteIcon />}
                sx={{
                    background: '#404040',
                    color: '#bf4040'
                }}
            >
                Delete
            </Button>
            <Modal open={showDeleteDialog} onClose={handleDeleteCancel}>
                <Box
                    sx={{
                        position: 'absolute',
                        width: 300,
                        bgcolor: '#1a1a1a',
                        p: 3,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '1px solid #d3d3d3',
                        borderRadius: '3px',
                        padding: '10px',
                        margin: 2
                    }}
                >
                    <Typography variant="h6">Confirm Deletion</Typography>
                    <Typography variant="body1">Are you sure you want to delete your listing?</Typography>
                    <Button variant="contained" color="primary" onClick={handleDeleteConfirm}
                        sx={{
                            marginTop: 1,
                            marginBottom: 1,
                            marginRight: 1
                        }}
                    >
                        Yes
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDeleteCancel}
                        sx={{
                            marginTop: 1,
                            marginBottom: 1,
                            marginRight: 1
                        }}
                    >
                        No
                    </Button>
                </Box>
            </Modal>
        </Card>

    )

}