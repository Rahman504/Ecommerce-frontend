import ProductCard from './productcard';
import React, { useState, useEffect } from "react";

const Products = () => {
    const [allproduct, setallProduct] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // 1. State for search input

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products`, { method: "GET" })
            .then((res) => res.json())
            .then(response => {
                setallProduct(response.products);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    // 2. Logic to filter products based on the search term
    const filteredProducts = allproduct.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className='all'>
            {/* 3. Search Bar UI */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className='all-products'>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <ProductCard
                            key={index}
                            id={product._id}
                            image={product.imageUrl[0]}
                            name={product.name}
                            discountedPrice={product.discountedPrice}
                            price={product.price}
                        />
                    ))
                ) : (
                    <div className="no-results">
                        <p>No products found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Products;