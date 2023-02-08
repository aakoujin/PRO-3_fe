import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export interface ListingItem {
    id_listing: number;
    user: number;
    post_name: string;
    post_desc: string;
    post_date: string;
    state: number;
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

    function handleClick(){
        navigate("/"+ listing.id_listing);
    }

    return (
        <>
            <Card onClick={handleClick}>
                <div className='listing'>
                    {listing.id_listing}
                    {listing.post_name}
                </div>
            </Card>
        </>
    )

}

export default Listing
//Object.values(listing.contents.$values)[0].media