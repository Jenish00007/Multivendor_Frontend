import React from 'react'
import Header from "../components/Layout/Header";
import Hero from '../components/Route/Hero/Hero';
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import Events from "../components/Events/Events";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Footer from "../components/Layout/Footer";
import ProductSections from "../components/Home/ProductSections";

const HomePage = () => {
    return (
        <div>
            <Header activeHeading={1} />
            <Hero />
            <Categories />
            <ProductSections />
            <BestDeals />
            <Events />
            <FeaturedProduct />
            <Footer />
        </div>
    )
}

export default HomePage