
import { Link } from "react-router-dom";

const ProductCard = ({ image, name, discountedPrice, price, id }) => {

  return (
      <div className="productcard">
        <Link to={`/products/${id}`} className="link">
          <img src={image} alt="img" />
          <article>
            <p>{name}</p>
            <p>₦ {discountedPrice.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

            <p id="price" style={{marginTop: "2px"}}>₦ {price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </article>
        </Link>   
      </div>
      
  );
};

export default ProductCard;
