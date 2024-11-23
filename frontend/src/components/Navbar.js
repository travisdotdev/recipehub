import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/" style={styles.link}>Home</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/search" style={styles.link}>Recipe Search</Link> 
        </li>
        <li style={styles.navItem}>
          <Link to="/recipe/1" style={styles.link}>Recipe Detail</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/shopping-list" style={styles.link}>Shopping List</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/about-us" style={styles.link}>About Us</Link>
        </li>
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    padding: '1rem',
    backgroundColor: '#282c34',
  },
  navList: {
    display: 'flex',
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    marginRight: '1rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  }
};

export default Navbar;
