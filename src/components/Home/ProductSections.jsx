import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import ProductCard from "../Route/ProductCard/ProductCard";

const ProductSections = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [topOffers, setTopOffers] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [flashSaleItems, setFlashSaleItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const [recommended, offers, popular, latest, flashSale] = await Promise.all([
          axios.get(`${server}/user-products/recommended`),
          axios.get(`${server}/user-products/top-offers`),
          axios.get(`${server}/user-products/popular`),
          axios.get(`${server}/user-products/latest`),
          axios.get(`${server}/user-products/flash-sale`),
        ]);

        setRecommendedProducts(recommended.data.products);
        setTopOffers(offers.data.products);
        setPopularProducts(popular.data.products);
        setLatestProducts(latest.data.products);
        setFlashSaleItems(flashSale.data.flashSaleItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const renderProductSection = (title, products) => (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>{title}</h1>
      </div>
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
        {products && products.length !== 0 && (
          products.map((product) => (
            <ProductCard key={product._id} data={product} />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {renderProductSection("Recommended Products", recommendedProducts)}
      {renderProductSection("Top Offers", topOffers)}
      {renderProductSection("Most Popular", popularProducts)}
      {renderProductSection("Latest Products", latestProducts)}
      {renderProductSection("Flash Sale", flashSaleItems)}
    </div>
  );
};

export default ProductSections; 