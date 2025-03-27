
import { Link } from "react-router-dom";

const ProductCard = ({ image, name, discountedPrice, price, id }) => {

  return (
      <div className="productcard">
        <Link to={`/products/${id}`} className="link">
          <img src={image} alt="img" />
          <article>
            <p>{name}</p>
            <p>&#8358 {discountedPrice.toFixed(2).toLocaleString()}</p>
            <p id="price" style={{marginTop: "2px"}}>$ {price}</p>
          </article>
        </Link>   
      </div>
      
  );
};

export default ProductCard;
