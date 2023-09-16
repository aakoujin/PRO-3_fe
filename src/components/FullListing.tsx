import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Container,
  Paper,
  Grid,
  IconButton,
  ListItem,
  ListItemText
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { ListingItem, TagItem } from "./Listing";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { AuthContext } from "../context/AuthProvider"
import axios from "../api/axios"
import VisibilityIcon from '@mui/icons-material/Visibility';
import SimilarListingsContainer from "./SimilarListingsContainer";



export interface ListingAuthor {
  name: string;
  surname: string;
  phonenumber: string;
}

export function FullListing() {
  const params = useParams();

  const authContext = useContext(AuthContext);

  const [listing, setListing] = useState<ListingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPictureIndex, setCurrentPictureIndex] = useState(0);
  const [author, setAuthor] = useState<ListingAuthor | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [tags, setTags] = useState<TagItem[] | null>(null);
  const [similar, setSimilar] = useState<ListingItem[] | null>(null);

  useEffect(() => {
    fetchListing();
  }, []);

  const fetchListing = async () => {

    const result = await fetch(
      "http://localhost:42999/api/Listing/" + params.id,
      {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        method: "GET"
      }
    );
    const returnedListing = await result.json();

    const author = await fetch(
      "http://localhost:42999/api/User/postedby/" + returnedListing.id_user,
      {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        method: "GET"
      }
    )
    const returnedAuthor = await author.json();

    const saved =
      await axios.get("/SavedListing/checkSaved/" + params.id,
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
          withCredentials: true
        }
      )

    const similarListings =
      await axios.get("/Listing/similar/" + params.id,
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        }
      )

    var checked = await saved.data
    if (checked == params.id) { setIsSaved(true) }
    else { setIsSaved(false) }

    setListing(returnedListing);
    setAuthor(returnedAuthor)
    setLoading(false);
    setTags(returnedListing.tags.$values)
    setSimilar(similarListings.data.$values);
  };

  async function handleAddToBookmarkClick() {

    const save = {
      id_listing: params.id
    }

    const result =
      await axios.post("/SavedListing/addToSaved",
        JSON.stringify(save),
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
          withCredentials: true
        }
      )
    var checked = await result.data

    console.log(checked)

    setIsSaved(!isSaved);
  }

  async function handleRemoveFromBookmarkClick() {
    console.log("delete")

    const result =
      await axios.delete("/SavedListing/removeFromSaved/" + params.id,
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
          withCredentials: true
        }
      )
    var checked = await result.data

    console.log(checked)


    setIsSaved(!isSaved);
  }



  const goToPreviousPicture = () => {
    setCurrentPictureIndex((prevIndex) =>
      prevIndex === 0 ? displayableMedia.$values.length - 1 : prevIndex - 1
    );
  };

  const goToNextPicture = () => {
    setCurrentPictureIndex((prevIndex) =>
      prevIndex === displayableMedia.$values.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  const displayableListing = listing as ListingItem
  const displayableMedia = displayableListing.contents as any
  const displayableAuthor = author as ListingAuthor


  if (!listing) {
    return (
      <Container>
        <Typography variant="h6">Listing not found.</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Grid container spacing={2} margin={2}>
          <Grid item xs={12}>
            <Typography variant="h5">{displayableListing.post_name}</Typography>
          </Grid>
          <Grid item xs={12}>
            {displayableMedia && displayableMedia.$values.length > 0 && (
              <Grid item xs={12}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconButton onClick={goToPreviousPicture}>
                    <ArrowBack />
                  </IconButton>
                  <img
                    src={displayableMedia.$values[currentPictureIndex].media}
                    alt={`Picture ${currentPictureIndex + 1}`}
                    style={{ maxWidth: "100%", maxHeight: "400px" }}
                  />
                  <IconButton onClick={goToNextPicture}>
                    <ArrowForward />
                  </IconButton>
                </div>
              </Grid>
            )}
          </Grid>

          <Grid item xs={12} marginTop={2}>
            <Typography variant="body1">Price: ${displayableListing.price}</Typography>
          </Grid>
          <>
            {tags!.map((tagItem) => (
              <div key={tagItem.id_tag} style={{ border: '1px solid black', padding: '5px', margin: '5px' }}>
                {tagItem.tag_name}
              </div>
            ))}
          </>
          <Grid item xs={12}>
            <Typography variant="body1">{displayableListing.post_desc}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              Posted: {new Date(displayableListing.post_date).toLocaleDateString()}
            </Typography>
          </Grid>
          <>
            {authContext.authData?.token ? (
              <Grid item xs={12}>{isSaved ? (
                <BookmarkIcon color="primary" onClick={handleRemoveFromBookmarkClick} />
              ) : (
                <BookmarkBorderIcon onClick={handleAddToBookmarkClick} />
              )}</Grid>
            ) : (<></>)}
          </>
        </Grid>
        <Grid container spacing={2} margin={2} marginTop={3.5}>
          <Grid item xs={12}>
            <Typography variant="body1">
              Seller: {displayableAuthor.name} {displayableAuthor.surname}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              Contact: +380 {displayableAuthor.phonenumber}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              <VisibilityIcon
                style={{ color: 'gray' }} />
              : {displayableListing.state}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "10px" }}>
        <SimilarListingsContainer similarListings={similar} />
      </Paper>
    </Container>
  );
}
