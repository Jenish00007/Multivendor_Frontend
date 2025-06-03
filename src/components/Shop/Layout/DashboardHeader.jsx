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
                <Link to="/dashboard" className="flex items-center">
                    <div className="relative">
                        <img
                            src={logo}
                            alt={appName}
                            className="w-[140px] h-[100px] object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    {/* <h1 className="text-2xl font-bold ml-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                        {appName}
                    </h1> */}
                </Link>
            </div>
            <div className="flex items-center">
                <div className="flex items-center mr-4">
                    <Link to="/dashboard-coupouns" className="800px:block hidden">
                        <AiOutlineGift
                            color="#555"
                            size={30}
                            className="mx-5 cursor-pointer"
                        />
                    </Link>
                    <Link to="/dashboard-events" className="800px:block hidden">
                        <MdOutlineLocalOffer
                            color="#555"
                            size={30}
                            className="mx-5 cursor-pointer"
                        />
                    </Link>
                    <Link to="/dashboard-products" className="800px:block hidden">
                        <FiShoppingBag
                            color="#555"
                            size={30}
                            className="mx-5 cursor-pointer"
                        />
                    </Link>
                    <Link to="/dashboard-orders" className="800px:block hidden">
                        <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
                    </Link>
                    <Link to="/dashboard-messages" className="800px:block hidden">
                        <BiMessageSquareDetail
                            color="#555"
                            size={30}
                            className="mx-5 cursor-pointer"
                        />
                    </Link>
                    <Link to={`/shop/${seller._id}`}>
                        <img
                            src={`${backend_url}${seller.avatar}`}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;