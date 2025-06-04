import React, { useState } from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { backend_url } from "../../../server";
import { RxHamburgerMenu } from "react-icons/rx";

const DashboardHeader = ({ setOpenSidebar, openSidebar }) => {
    const { seller } = useSelector((state) => state.seller);
    const { appName, logo } = useSelector((state) => state.appSettings);
    
    return (
        <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
            <div className="flex items-center">
                <RxHamburgerMenu
                    size={30}
                    className="mr-4 cursor-pointer md:hidden"
                    onClick={() => setOpenSidebar(!openSidebar)}
                />
                <Link to="/dashboard" className="flex items-center group">
                    <div className="relative">
                        <img
                            src={logo}
                            alt={appName}
                            className="w-[140px] h-[100px] object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </Link>
            </div>
            <div className="flex items-center">
                <div className="flex items-center mr-4">
                    <Link to="/dashboard-coupouns" className="800px:block hidden">
                        <div className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300">
                            <AiOutlineGift
                                color="#555"
                                size={24}
                                className="cursor-pointer"
                            />
                        </div>
                    </Link>
                    <Link to="/dashboard-events" className="800px:block hidden">
                        <div className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300">
                            <MdOutlineLocalOffer
                                color="#555"
                                size={24}
                                className="cursor-pointer"
                            />
                        </div>
                    </Link>
                    <Link to="/dashboard-products" className="800px:block hidden">
                        <div className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300">
                            <FiShoppingBag
                                color="#555"
                                size={24}
                                className="cursor-pointer"
                            />
                        </div>
                    </Link>
                    <Link to="/dashboard-orders" className="800px:block hidden">
                        <div className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300">
                            <FiPackage color="#555" size={24} className="cursor-pointer" />
                        </div>
                    </Link>
                    <Link to="/dashboard-messages" className="800px:block hidden">
                        <div className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300">
                            <BiMessageSquareDetail
                                color="#555"
                                size={24}
                                className="cursor-pointer"
                            />
                        </div>
                    </Link>
                    <Link to={`/shop/${seller._id}`}>
                        <div className="relative group">
                            <img
                                src={`${backend_url}${seller.avatar}`}
                                alt=""
                                className="w-[50px] h-[50px] rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all duration-300"
                            />
                            <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;