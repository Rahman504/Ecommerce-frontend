import { Link } from "react-router-dom";
import React from 'react';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Our Store</h1>
      <p>Browse our collection of amazing products!</p>
      <Link to='/products' className="explore">Explore {'>>>'}</Link>
    </div>
  );
};

export default Home;
