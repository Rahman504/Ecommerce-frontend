 
import ProductCard from './productcard';
import React, { useState, useEffect } from "react";

const Products = () => {
    const [allproduct, setallProduct] = useState([])
    useEffect(() => {
      fetch(`${process.env.API_BASE_URL}/api/products`, {method: "GET"})
      .then((res) => res.json())
      .then(response => {
        setallProduct(response.products)
      })
      .catch(err => {
        console.log(err);
      })
    }, [])
  return (
    <section className='all'>
      <div className='all-products'>
        {
          allproduct.map((product, index) => {
            return  <ProductCard
              key={index}
              id={product._id}
              image={product.imageUrl[0]}
              name={product.name}
              discountedPrice={product.discountedPrice}
              price={product.price}
            />
          })
        }
      </div>
    </section>
  );
};

export default Products;
