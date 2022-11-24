import React, {Component} from 'react';
import {Card, Button} from 'react-bootstrap';
import { Content } from './Content';

interface ListingItem {
    id_listing: number;
    user: number;
    post_name: string;
    post_desc: string;
    post_date: string;
    state: number;
    content: Content;
}

export class Listing extends Component{
    render(){
        return(
            <Card>
            <Card.Img variant="top" src="..." alt='placeholder'/>    
            <Card.Body>
              <Card.Title>Special title treatment</Card.Title>
              <Card.Text>
                With supporting text below as a natural lead-in to additional content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        )
    }
}