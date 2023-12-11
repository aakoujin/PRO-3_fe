import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { BrokenImage } from "@mui/icons-material";


export interface ListingItem {
  id_listing: number;
  user: number;
  post_name: string;
  post_desc: string;
  post_date: string;
  state: number;
  price: number;
  contents: {
    [key: string]: ContentItem
  };
  locations: Location[];
  tags: TagItem[];
}

type Location = {
  id_location: number;
  id_listing: number;
  country: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
};

export interface ContentItem {
  id_content: number;
  media: string;
}

export interface TagItem {
  id_tag: number;
  id_parent: number;
  tag_name: string;
}


//function Listing({id_listing, user, post_name, post_desc, post_date, state, contents } : ListingItem){
export default function Listing(listing: ListingItem) {
  const navigate = useNavigate();

  const authContext = useContext(AuthContext)

  function handleClick() {
    navigate("/" + listing.id_listing);
  }
  const displayableMedia = listing.contents as any

  //console.log(authContext.authData?.token)

  return (
    <>

      <Card
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
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
    </>
  )

}

//export default Listing
//add handling for no-image case
//add edit functionality
