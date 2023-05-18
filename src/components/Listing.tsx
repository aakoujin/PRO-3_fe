import { useContext } from "react";
import { Card, CardImg } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

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
    }
}

export interface ContentItem {
    id_content: number;
    media: string;
}


//function Listing({id_listing, user, post_name, post_desc, post_date, state, contents } : ListingItem){
function Listing(listing: ListingItem) {
    const navigate = useNavigate();

    const authContext = useContext(AuthContext)

    function handleClick() {
        navigate("/" + listing.id_listing);
    }
    const displayableMedia = listing.contents as any

    //console.log(authContext.authData?.token)

    return (
        <>
            <Card onClick={handleClick}>
                <CardImg variant="top" height="200px" style={{ objectFit: "cover" }} src={displayableMedia.$values[0].media} alt="placeholder" />
                <div className='listing'>
                    {listing.post_name}
                    {listing.price}
                </div>
            </Card>
        </>
    )

}

export default Listing
//add handling for no-image case