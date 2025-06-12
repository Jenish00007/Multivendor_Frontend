import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import { backend_url } from "../../server";
import Ratings from "../Products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";

const ShopProfileData = ({ isOwner }) => {
    const { products } = useSelector((state) => state.products);
    const { events } = useSelector((state) => state.events);
    const { seller } = useSelector((state) => state.seller);
    const { id } = useParams();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllEventsShop(seller._id));
    }, [dispatch]);

    const [active, setActive] = useState(1);

    const allReviews =
        products && products.map((product) => product.reviews).flat();

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
            <div className="backdrop-blur-sm bg-white/30 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100/50">
                <div className="flex flex-col sm:flex-row w-full items-center justify-between mb-8 sm:mb-12">
                    <div className="w-full flex flex-wrap gap-6 sm:gap-8 mb-6 sm:mb-0">
                        <div 
                            className={`flex items-center transition-all duration-300 ease-in-out relative group ${
                                active === 1 ? "border-b-2 border-blue-500" : ""
                            }`}
                            onClick={() => setActive(1)}
                        >
                            <h5
                                className={`font-[600] text-[18px] sm:text-[20px] ${
                                    active === 1 
                                        ? "text-blue-600" 
                                        : "text-gray-600 group-hover:text-blue-600"
                                } cursor-pointer pr-[20px] transition-all duration-300 relative`}
                            >
                                <span className="relative z-10 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    Shop Products
                                </span>
                                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                                    active === 1 ? "w-full" : "group-hover:w-full"
                                }`}></span>
                            </h5>
                        </div>
                        <div 
                            className={`flex items-center transition-all duration-300 ease-in-out relative group ${
                                active === 2 ? "border-b-2 border-blue-500" : ""
                            }`}
                            onClick={() => setActive(2)}
                        >
                            <h5
                                className={`font-[600] text-[18px] sm:text-[20px] ${
                                    active === 2 
                                        ? "text-blue-600" 
                                        : "text-gray-600 group-hover:text-blue-600"
                                } cursor-pointer pr-[20px] transition-all duration-300 relative`}
                            >
                                <span className="relative z-10 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Running Events
                                </span>
                                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                                    active === 2 ? "w-full" : "group-hover:w-full"
                                }`}></span>
                            </h5>
                        </div>
                        <div 
                            className={`flex items-center transition-all duration-300 ease-in-out relative group ${
                                active === 3 ? "border-b-2 border-blue-500" : ""
                            }`}
                            onClick={() => setActive(3)}
                        >
                            <h5
                                className={`font-[600] text-[18px] sm:text-[20px] ${
                                    active === 3 
                                        ? "text-blue-600" 
                                        : "text-gray-600 group-hover:text-blue-600"
                                } cursor-pointer pr-[20px] transition-all duration-300 relative`}
                            >
                                <span className="relative z-10 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    Shop Reviews
                                </span>
                                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                                    active === 3 ? "w-full" : "group-hover:w-full"
                                }`}></span>
                            </h5>
                        </div>
                    </div>
                    {isOwner && (
                        <div className="flex-shrink-0">
                            <Link to="/dashboard">
                                <div className={`${styles.button} !rounded-xl h-[42px] hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 bg-gradient-to-r from-blue-500 to-purple-600`}>
                                    <span className="text-[#fff] font-medium flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Go Dashboard
                                    </span>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    {active === 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {products &&
                                products.map((i, index) => (
                                    <div 
                                        key={index} 
                                        className="group relative flex flex-col h-full transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl rounded-2xl overflow-hidden bg-white/50 backdrop-blur-md border border-gray-100/50 hover:border-blue-500/20"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex-grow">
                                            <ProductCard data={i} isShop={true} />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}

                    {active === 2 && (
                        <div className="w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {events &&
                                    events.map((i, index) => (
                                        <div 
                                            key={index} 
                                            className="group relative flex flex-col h-full transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl rounded-2xl overflow-hidden bg-white/50 backdrop-blur-md border border-gray-100/50 hover:border-blue-500/20"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex-grow">
                                                <ProductCard
                                                    data={i}
                                                    isShop={true}
                                                    isEvent={true}
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            {events && events.length === 0 && (
                                <div className="text-center py-12 sm:py-16 bg-white/50 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100/50">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h5 className="text-[16px] sm:text-[18px] text-gray-600 font-medium">
                                        No Events available for this shop!
                                    </h5>
                                </div>
                            )}
                        </div>
                    )}

                    {active === 3 && (
                        <div className="w-full space-y-6">
                            {allReviews &&
                                allReviews.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className="w-full flex p-6 sm:p-8 bg-white/50 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:border-blue-500/20 group"
                                    >
                                        <div className="relative">
                                            <div className="relative">
                                                <img
                                                    src={item.user.avatar ? `${backend_url}/${item.user.avatar}` : "https://via.placeholder.com/60?text=User"}
                                                    className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full object-cover border-2 border-gray-100 shadow-sm group-hover:border-blue-500/20 transition-colors duration-300"
                                                    alt={item.user.name || "User"}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/60?text=User";
                                                    }}
                                                />
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div className="pl-4 sm:pl-6 flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-2 sm:mb-3">
                                                <h1 className="font-[600] text-gray-800 text-base sm:text-lg group-hover:text-blue-600 transition-colors duration-300">{item.user.name}</h1>
                                                <div className="flex items-center">
                                                    <Ratings rating={item.rating} />
                                                </div>
                                            </div>
                                            <p className="font-[400] text-gray-600 mb-2 sm:mb-3 leading-relaxed text-sm sm:text-base group-hover:text-gray-800 transition-colors duration-300">{item?.comment}</p>
                                            <p className="text-gray-400 text-[13px] sm:text-[14px] flex items-center group-hover:text-gray-500 transition-colors duration-300">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            {allReviews && allReviews.length === 0 && (
                                <div className="text-center py-12 sm:py-16 bg-white/50 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100/50">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                    </div>
                                    <h5 className="text-[16px] sm:text-[18px] text-gray-600 font-medium">
                                        No Reviews available for this shop!
                                    </h5>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopProfileData;