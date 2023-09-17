import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


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
    tags : TagItem[];
}

export interface ContentItem {
    id_content: number;
    media: string;
}

export interface TagItem{
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
                    {listing.post_desc}
                    </Typography>
                    <Typography>
                    {listing.price}
                    </Typography>
                  </CardContent>
                </Card>
        </>
    )

}

//export default Listing
//add handling for no-image case
//add edit functionality
