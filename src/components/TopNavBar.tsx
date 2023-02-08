import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export function TopNavBar(){
    return(
        <Navbar className="bg-white shadow-sm mb-3">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link to="/" as={NavLink}>
                        Home
                    </Nav.Link>
                    <Nav.Link to="/new" as={NavLink}>
                        New listing
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}