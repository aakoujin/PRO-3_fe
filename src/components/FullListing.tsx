import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Container,
  Paper,
  Grid,
  IconButton,
  Chip
} from "@mui/material";
import { ArrowBack, ArrowForward, BrokenImage } from "@mui/icons-material";
import { ListingItem, TagItem } from "./Listing";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { AuthContext } from "../context/AuthProvider"
import axios from "../api/axios"
import VisibilityIcon from '@mui/icons-material/Visibility';
import SimilarListingsContainer from "./SimilarListingsContainer";
import ContactSeller from "./ContactSeller";
import LocationInfo from "./LocationInfo";
import SellIcon from '@mui/icons-material/Sell';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export interface ListingAuthor {
  name: string;
  surname: string;
  phonenumber: string;
  username: string;
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
  const [authorId, setAuthorId] = useState<number | undefined>();
  const [viewerId, setViewerId] = useState<number | undefined>();

  useEffect(() => {
    fetchListing();
  }, []);

  const fetchListing = async () => {

    const result =
      await axios.get("/Listing/" + params.id,
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          method: 'GET'
        })
    /*await fetch(
      "http://localhost:42999/api/Listing/" + params.id,
      {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        method: "GET"
      }
    );*/

    //const returnedListing = await result.json();
    const returnedListing = await result.data;
    setAuthorId(returnedListing.id_user);

    const author =
      await axios.get("/User/postedby/" + returnedListing.id_user,
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          method: 'GET'
        })

    const viewer =
      await axios.get("/User/viewer/",
        {
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${authContext.authData?.token}` },
          withCredentials: true
        })
    const tempViewer = await viewer.data;
    setViewerId(tempViewer);

    /*await fetch(
      "http://localhost:42999/api/User/postedby/" + returnedListing.id_user,
      {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        method: "GET"
      }
    )*/
    //const returnedAuthor = await author.json();
    const returnedAuthor = await author.data;

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
    setTags(returnedListing.tags)
    setSimilar(similarListings.data);
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
      prevIndex === 0 ? displayableMedia.length - 1 : prevIndex - 1
    );
  };

  const goToNextPicture = () => {
    setCurrentPictureIndex((prevIndex) =>
      prevIndex === displayableMedia.length - 1 ? 0 : prevIndex + 1
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
      <Grid container spacing={2} margin={2} >
        <Grid item xs={12} marginRight={4}>
          <Paper elevation={3} sx={{ padding: "20px" }}>
            {displayableMedia && displayableMedia.length > 0 ? (
              <Grid item xs={12}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconButton onClick={goToPreviousPicture}>
                    <ArrowBack />
                  </IconButton>
                  <img
                    src={displayableMedia[currentPictureIndex].media}
                    alt={`Picture ${currentPictureIndex + 1}`}
                    style={{ maxWidth: "100%", maxHeight: "400px" }}
                  />
                  <IconButton onClick={goToNextPicture}>
                    <ArrowForward />
                  </IconButton>
                </div>
              </Grid>
            ) : (
              <Grid container justifyContent="center" alignItems="center" sx={{ height: '400px' }}>
                <BrokenImage fontSize="large" />
                <Typography variant="h6">No content</Typography>
              </Grid>
            )}
          </Paper>
        </Grid>

        <Grid container spacing={1} marginTop={1} marginRight={4}
        >
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: "20px", marginLeft: 2 }}>
              <Grid item xs={12} sx={{ marginTop: "5px", marginBottom: "15px" }} >
                <Typography variant="h5">{displayableListing.post_name}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "5px", marginBottom: "15px" }}>
                <Chip size="medium" variant="outlined" label={"Asking price: " + displayableListing.price + " $"} icon={<SellIcon />} />

              </Grid>
              <Grid item xs={12} sx={{ marginTop: "5px", marginBottom: "15px" }}>
                {tags!.map((tagItem) => (
                  <Chip
                    key={tagItem.id_tag}
                    label={tagItem.tag_name}
                    variant="outlined"
                    sx={{ marginRight: 1 }}
                  />
                ))}
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px", marginBottom: "20px" }}>
                <Typography variant="h6">Description</Typography>
                <Typography variant="body1"
                  sx={{
                    marginTop: 2,
                    marginBottom: 4
                  }}
                >{displayableListing.post_desc}</Typography>
              </Grid>
              <Grid item xs={12}>

                <Chip variant="outlined" label={"Posted:" + new Date(displayableListing.post_date).toLocaleDateString()} icon={<CalendarMonthIcon />} ></Chip>
              </Grid>
              <Grid item xs={12} sx={{ marginTop: 2, marginBottom: 2 }}>
                {authContext.authData?.token ? (
                  <Grid item xs={12}>{isSaved ? (
                    <BookmarkIcon color="primary" onClick={handleRemoveFromBookmarkClick} />
                  ) : (
                    <BookmarkBorderIcon onClick={handleAddToBookmarkClick} />
                  )}</Grid>
                ) : (<></>)}
              </Grid>
              <Grid item xs={12}>
                <Chip label={displayableListing.state} icon={<VisibilityIcon />} />
              </Grid>

            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={1} marginTop={1} marginRight={4}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: "20px", marginLeft: 2 }}>
              <Grid item xs={12}
                sx={{
                  marginBottom: 3
                }}
              >
                <LocationInfo locations={listing.locations} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Seller Information {<AccountCircleIcon />}</Typography>
                <Typography variant="body1">
                  Name: {displayableAuthor.name} {displayableAuthor.surname}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Phone number: +380 {displayableAuthor.phonenumber}
                </Typography>
              </Grid>
              <Grid item xs={12}
                sx={{
                  marginTop: 2,
                  marginBottom: 2
                }}
              >
                {authContext.authData?.token ? (
                  viewerId === authorId ? (
                    <></>
                  ) : (
                    <ContactSeller username={author.username} listing={listing.id_listing} authorId={authorId} />
                  )
                ) : (
                  <></>
                )}

              </Grid>

            </Paper>
          </Grid>
        </Grid>
      </Grid>

      <Grid container marginBottom={10}>
        <Grid item xs={12} sx={{ marginLeft: 4 }}>
          <Paper elevation={3} style={{ padding: "20px", }}>
            <SimilarListingsContainer similarListings={similar} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
