import React from 'react'
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";


const Hero = () => {
    return (
        <div
            className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex}`}
            style={{
                backgroundImage:
                    "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)",
            }}
        >
            <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
                <h1
                    className={`text-[35px] leading-[1.2] 800px:text-[60px] font-[600] capitalize bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent`}
                >
                    Fresh Groceries <br /> Delivered to Your Door
                </h1>
                <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#000000ba]">
                    Discover our wide selection of fresh fruits, vegetables, dairy products, and pantry essentials. <br /> 
                    Shop from the comfort of your home and get your groceries delivered right to your doorstep. <br /> 
                    Quality products, competitive prices, and convenient delivery - all in one place.
                </p>
                <Link to="/products" className="inline-block">
                    <div className={`${styles.button} mt-5`}>
                        <span className="text-[#fff] font-[Poppins] text-[18px]">
                            Shop Now
                        </span>
                    </div>
                </Link>

            </div>

        </div>
    )
}

export default Hero