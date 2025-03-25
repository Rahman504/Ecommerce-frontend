
import { Link } from "react-router-dom";

const ProductCard = ({ image, name, discountedPrice, price, id }) => {

  return (
      <div className="productcard">
        <Link to={`/products/${id}`} className="link">
          <img src={image} alt="img" />
          <article>
            <p>{name}</p>
            <p>$ {discountedPrice.toFixed(2)}</p>
            <p id="price" style={{marginTop: "2px"}}>$ {price}</p>
          </article>
        </Link>   
      </div>
      
  );
};

export default ProductCard;
