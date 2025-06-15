import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect, AiOutlineShoppingCart, AiOutlineLineChart } from "react-icons/ai";
import { MdOutlineStorefront, MdOutlineTrendingUp, MdOutlinePeopleAlt, MdOutlineWavingHand } from "react-icons/md";
import { BsGraphUpArrow, BsCurrencyRupee, BsFilter } from "react-icons/bs";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import Loader from "../Layout/Loader";

const DashboardHero = () => {
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.order);
    const { seller } = useSelector((state) => state.seller);
    const { products } = useSelector((state) => state.products);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller._id));
        dispatch(getAllProductsShop(seller._id));
    }, [dispatch]);

    const availableBalance = seller?.availableBalance.toFixed(2);

    // Function to format currency in Indian format
    const formatIndianCurrency = (amount) => {
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return formatter.format(amount);
    };

    return (
        <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 relative">
                <div className="relative">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
                            <span className="text-4xl animate-bounce">🏪</span>
                        </div>
                        <div>
                            <div className="font-bold text-[32px] font-Poppins bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                                Dashboard Overview
                            </div>
                            <div className="text-gray-600 text-[18px] mt-1 font-medium">
                                Welcome back, {seller?.name}!
                            </div>
                        </div>
                    </div>
                    <div className="absolute -top-2 -left-2 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-2xl animate-pulse"></div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="backdrop-blur-md rounded-2xl p-6 border border-white/30 bg-white/40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <p className="text-sm text-gray-600 font-medium">Current Date</p>
                        <p className="text-xl font-bold text-gray-800 mt-1">
                            {new Date().toLocaleDateString('en-IN', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg transform group-hover:scale-110 transition-all duration-300">
                            <AiOutlineMoneyCollect className="text-white" size={24} />
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Total Revenue</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {formatIndianCurrency(availableBalance)}
                    </div>
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                        <BsGraphUpArrow className="mr-1 animate-pulse" />
                        <span>Available Balance</span>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg transform group-hover:scale-110 transition-all duration-300">
                            <AiOutlineShoppingCart className="text-white" size={24} />
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Total Orders</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                        {orders?.length || 0}
                    </div>
                    <div className="flex items-center text-purple-600 text-sm font-medium">
                        <MdOutlineTrendingUp className="mr-1 animate-pulse" />
                        <span>All Time Orders</span>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg transform group-hover:scale-110 transition-all duration-300">
                            <MdOutlineStorefront className="text-white" size={24} />
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Total Products</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                        {products?.length || 0}
                    </div>
                    <div className="flex items-center text-green-600 text-sm font-medium">
                        <AiOutlineLineChart className="mr-1 animate-pulse" />
                        <span>Active Products</span>
                    </div>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                                <AiOutlineShoppingCart className="text-5xl text-white filter drop-shadow-lg" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
                        </div>
                        <div>
                            <div className="font-black text-2xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                                Recent Orders
                            </div>
                            <div className="text-gray-600 text-base mt-1 font-medium">
                                Latest customer orders
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                            <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300">
                                <BsFilter className="text-gray-600" size={20} />
                            </button>
                            <select className="bg-transparent text-sm font-medium text-gray-600 focus:outline-none">
                                <option>All Orders</option>
                                <option>Processing</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                            </select>
                        </div>
                        <Link to="/dashboard-orders">
                            <Button
                                variant="contained"
                                className="!bg-gradient-to-r !from-indigo-500 !to-purple-600 !text-white hover:!from-indigo-600 hover:!to-purple-700 !transition-all !duration-300 !shadow-xl hover:!shadow-2xl !transform hover:!scale-105 !rounded-xl !px-6 !py-3 !font-semibold"
                                endIcon={<AiOutlineArrowRight className="animate-pulse" />}
                            >
                                View All
                            </Button>
                        </Link>
                    </div>
                </div>
                {isLoading ? (
                    <Loader />
                ) : orders?.length === 0 ? (
                    <div className="w-full h-[200px] flex items-center justify-center">
                        <div className="text-center">
                            <AiOutlineShoppingCart className="mx-auto text-gray-400" size={48} />
                            <p className="mt-4 text-gray-600">No orders found</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <DataGrid
                            rows={orders?.slice(0, 5) || []}
                            columns={[
                                { 
                                    field: "id", 
                                    headerName: "Order ID", 
                                    minWidth: 150,
                                    flex: 1,
                                    renderCell: (params) => (
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="p-2.5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex-shrink-0 transform hover:scale-110 transition-all duration-300">
                                                <AiOutlineShoppingCart className="text-blue-600" size={20} />
                                            </div>
                                            <div className="flex flex-col justify-center min-w-[100px]">
                                                <span className="font-medium text-gray-700 truncate leading-tight">#{params.value.slice(-6)}</span>
                                                <span className="text-xs text-gray-500 leading-tight mt-0.5">Order ID</span>
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    field: "total",
                                    headerName: "Total",
                                    minWidth: 120,
                                    flex: 1,
                                    renderCell: (params) => (
                                        <div className="flex items-center gap-2">
                                            <BsCurrencyRupee className="text-green-600" size={16} />
                                            <span className="font-medium text-gray-700">{params.value}</span>
                                        </div>
                                    ),
                                },
                                {
                                    field: "status",
                                    headerName: "Status",
                                    minWidth: 120,
                                    flex: 1,
                                    renderCell: (params) => (
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium
                                            ${params.value === "Delivered" ? "bg-green-100 text-green-800" :
                                            params.value === "Processing" ? "bg-yellow-100 text-yellow-800" :
                                            params.value === "Cancelled" ? "bg-red-100 text-red-800" :
                                            "bg-blue-100 text-blue-800"}`}>
                                            {params.value}
                                        </div>
                                    ),
                                },
                                {
                                    field: "createdAt",
                                    headerName: "Date",
                                    minWidth: 120,
                                    flex: 1,
                                    renderCell: (params) => (
                                        <div className="flex items-center gap-2">
                                            <MdOutlineTrendingUp className="text-purple-600" size={16} />
                                            <span className="text-gray-700">{params.value}</span>
                                        </div>
                                    ),
                                },
                                {
                                    field: "Preview",
                                    flex: 0.8,
                                    minWidth: 100,
                                    headerName: "",
                                    type: "number",
                                    sortable: false,
                                    renderCell: (params) => (
                                        <Link to={`/order/${params.id}`}>
                                            <button 
                                                className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                                                title="View Order"
                                            >
                                                <AiOutlineArrowRight size={18} className="group-hover:scale-110 transition-transform duration-200" />
                                            </button>
                                        </Link>
                                    ),
                                },
                            ]}
                            pageSize={5}
                            disableSelectionOnClick
                            autoHeight
                            className="!border-none !bg-white !rounded-lg w-full"
                            componentsProps={{
                                pagination: {
                                    className: "!text-gray-700",
                                },
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHero;