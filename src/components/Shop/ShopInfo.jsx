import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { backend_url, server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useNavigate } from "react-router-dom";


const ShopInfo = ({ isOwner }) => {
    const [data, setData] = useState({});
    const { products } = useSelector((state) => state.products);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllProductsShop(id));
        setIsLoading(true);
        axios.get(`${server}/shop/get-shop-info/${id}`).then((res) => {
            setData(res.data.shop);
            setIsLoading(false);
        }).catch((error) => {
            console.log(error);
            setIsLoading(false);
        })
    }, [])

    const logoutHandler = async () => {
        axios.get(`${server}/shop/logout`, {
            withCredentials: true,
        });
        localStorage.clear();
        navigate("/shop-login");
        window.location.reload();
    };

    const totalReviewsLength =
        products &&
        products.reduce((acc, product) => acc + product.reviews.length, 0);

    const totalRatings = products && products.reduce((acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0), 0);

    const averageRating = totalRatings / totalReviewsLength || 0;

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl shadow-2xl p-4 sm:p-6 max-w-2xl mx-auto transform hover:scale-[1.01] transition-all duration-500 overflow-hidden border border-gray-100/50">
                    <div className="w-full py-4 sm:py-6">
                        <div className="w-full flex flex-col items-center justify-center space-y-4">
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full blur-xl opacity-30 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                                <img
                                    src={`${data.avatar}`}
                                    alt=""
                                    className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] object-cover rounded-full border-4 border-white shadow-2xl relative z-10 transform group-hover:scale-105 transition duration-500"
                                />
                            </div>
                            <div className="text-center space-y-3">
                                <h3 className="text-[20px] sm:text-[24px] font-bold text-gray-800 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
                                    {data.name}
                                </h3>
                                <p className="text-[14px] sm:text-[16px] text-gray-600 text-center max-w-lg leading-relaxed px-2">
                                    {data.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                        <div className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:border-blue-500/20 group">
                            <h5 className="font-semibold text-gray-700 mb-2 flex items-center text-sm sm:text-base group-hover:text-blue-600 transition-colors duration-300">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Address
                            </h5>
                            <h4 className="text-gray-600 pl-6 text-sm sm:text-base group-hover:text-gray-800 transition-colors duration-300">{data.address}</h4>
                        </div>

                        <div className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:border-blue-500/20 group">
                            <h5 className="font-semibold text-gray-700 mb-2 flex items-center text-sm sm:text-base group-hover:text-blue-600 transition-colors duration-300">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Phone Number
                            </h5>
                            <h4 className="text-gray-600 pl-6 text-sm sm:text-base group-hover:text-gray-800 transition-colors duration-300">{data.phoneNumber}</h4>
                        </div>

                        <div className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:border-blue-500/20 group">
                            <h5 className="font-semibold text-gray-700 mb-2 flex items-center text-sm sm:text-base group-hover:text-blue-600 transition-colors duration-300">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Total Products
                            </h5>
                            <h4 className="text-gray-600 pl-6 text-sm sm:text-base group-hover:text-gray-800 transition-colors duration-300">{products && products.length}</h4>
                        </div>

                        <div className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:border-blue-500/20 group">
                            <h5 className="font-semibold text-gray-700 mb-2 flex items-center text-sm sm:text-base group-hover:text-blue-600 transition-colors duration-300">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                Shop Ratings
                            </h5>
                            <div className="flex items-center pl-6">
                                <h4 className="text-gray-600 mr-2 font-semibold text-sm sm:text-base group-hover:text-gray-800 transition-colors duration-300">{averageRating.toFixed(1)}/5</h4>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(averageRating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:border-blue-500/20 group">
                            <h5 className="font-semibold text-gray-700 mb-2 flex items-center text-sm sm:text-base group-hover:text-blue-600 transition-colors duration-300">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Joined On
                            </h5>
                            <h4 className="text-gray-600 pl-6 text-sm sm:text-base group-hover:text-gray-800 transition-colors duration-300">{data?.createdAt?.slice(0, 10)}</h4>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="mt-6 sm:mt-8 space-y-3">
                            <Link to="/settings" className="block">
                                <div className={`${styles.button} !rounded-xl h-[42px] hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 bg-gradient-to-r from-blue-500 to-purple-600`}>
                                    <span className="text-white font-medium flex items-center justify-center text-sm sm:text-base">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit Shop
                                    </span>
                                </div>
                            </Link>

                            <div 
                                className={`${styles.button} !rounded-xl h-[42px] hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer`}
                                onClick={logoutHandler}
                            >
                                <span className="text-white font-medium flex items-center justify-center text-sm sm:text-base">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Log Out
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ShopInfo;