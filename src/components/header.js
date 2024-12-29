import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './header.css';
import logo from '../assets/logo.png';

//declares a functional component, to use in other parts of the application 
//other files can now import this using import Header from './Header'
export default function Header() {
    //specifies what will be rendered on the screen when the component is used 
    return (
        //adding a navigation component, assigning looks
<Navbar bg="dark" data-bs-theme="dark" expand="lg" className="header">
  {/* Ensure proper padding of components */}
  <Container> 
    {/* Make the title, make it link to the homepage */}
    <Navbar.Brand href="/">
      <div className="brand-container">
        {/* Display the logo */}
        <img
          src={logo}
          alt="Audio Wave Logo"
          className="brand-logo"
        />
        {/* Display the text next to the logo */}
        <span className="brand-text">Soundscape of Spotify</span>
      </div>
    </Navbar.Brand>
    {/* Button for toggling the collapsible menu (visible on smaller screens) */}
    {/*<Navbar.Toggle aria-controls="basic-navbar-nav" />*/}
    {/* Wraps the content (links) that will collapse or expand */}
    <Navbar.Collapse id="basic-navbar-nav">
      {/* Container for navigation links */}
      <Nav className="me-auto">
        {/* Navigation links to different pages */}
        <Nav.Link href="/top-artists">Top Artists</Nav.Link>
        <Nav.Link href="/top-tracks">Top Tracks</Nav.Link>
        <Nav.Link href="/top-genres">Top Genres</Nav.Link>
        <Nav.Link href="/recently-played">Recently Played</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

      );
}
