import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Container,
  Paper,
  Grid,
  IconButton
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { ListingItem } from "./Listing";

export function FullListing() {
  const params = useParams();

  const [listing, setListing] = useState<ListingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPictureIndex, setCurrentPictureIndex] = useState(0);

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
      setListing(returnedListing);
      setLoading(false);
  };

 
  
  
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

  if (!listing) {
    return (
      <Container>
        <Typography variant="h6">Listing not found.</Typography>
      </Container>
    );
  }

  console.log(displayableMedia.$values[currentPictureIndex])
  return (
    <Container>
    <Paper elevation={3} style={{ padding: "20px" }}>
      <Grid container spacing={2}>
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
        <Grid item xs={12}>
          <Typography variant="body2">Price: ${displayableListing.price}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{displayableListing.post_desc}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">
            Posted: {new Date(displayableListing.post_date).toLocaleDateString()}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  </Container>
);
}