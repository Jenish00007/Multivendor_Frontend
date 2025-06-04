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
        <div className="w-full p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div className="relative">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <span className="text-4xl">🏪</span>
                        </div>
                        <div>
                            <div className="font-bold text-[32px] font-Poppins bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                                Seller Dashboard
                            </div>
                            <div className="text-gray-600 text-[18px] mt-1 font-medium">
                                Manage your shop with powerful insights
                            </div>
                        </div>
                    </div>
                    <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"></div>
                </div>
                <div className="backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <p className="text-sm text-gray-500 font-medium">Current Date</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                            <AiOutlineMoneyCollect className="text-white" size={24} />
                        </div>
                        <div className="text-sm text-gray-500">Available Balance</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                        {formatIndianCurrency(availableBalance)}
                    </div>
                    <div className="flex items-center text-green-500 text-sm">
                        <BsGraphUpArrow className="mr-1" />
                        <span>Active Balance</span>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                            <AiOutlineShoppingCart className="text-white" size={24} />
                        </div>
                        <div className="text-sm text-gray-500">Total Orders</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                        {orders?.length || 0}
                    </div>
                    <div className="flex items-center text-purple-500 text-sm">
                        <MdOutlineTrendingUp className="mr-1" />
                        <span>All Time Orders</span>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                            <MdOutlineStorefront className="text-white" size={24} />
                        </div>
                        <div className="text-sm text-gray-500">Total Products</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                        {products?.length || 0}
                    </div>
                    <div className="flex items-center text-green-500 text-sm">
                        <AiOutlineLineChart className="mr-1" />
                        <span>Active Products</span>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                            <MdOutlinePeopleAlt className="text-white" size={24} />
                        </div>
                        <div className="text-sm text-gray-500">Total Customers</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                        {orders ? new Set(orders.map(order => order.user?._id)).size : 0}
                    </div>
                    <div className="flex items-center text-orange-500 text-sm">
                        <MdOutlineWavingHand className="mr-1" />
                        <span>Active Customers</span>
                    </div>
                </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                    <Link to="/dashboard-orders">
                        <Button
                            variant="contained"
                            className="!bg-blue-500 !text-white hover:!bg-blue-600 transition-colors duration-300"
                            endIcon={<AiOutlineArrowRight />}
                        >
                            View All
                        </Button>
                    </Link>
                </div>
                {isLoading ? (
                    <Loader />
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
                    <div className="p-2.5 bg-blue-50 rounded-lg flex-shrink-0">
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
            field: "status",
            headerName: "Status",
            minWidth: 130,
                                    flex: 1,
            renderCell: (params) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${params.value === "Delivered" ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="font-medium">{params.value}</span>
                </div>
            ),
        },
        {
                                    field: "totalPrice",
                                    headerName: "Total Price",
            minWidth: 130,
                                    flex: 1,
            renderCell: (params) => (
                                        <div className="flex items-center">
                                            <BsCurrencyRupee className="mr-1" />
                                            <span className="font-medium text-gray-700">{params.value}</span>
                                        </div>
                                    ),
                                },
                            ]}
                            pageSize={5}
                                disableSelectionOnClick
                                autoHeight
                            className="!border-none"
                            />
                        </div>
                )}
                    </div>
                </div>
    );
};

export default DashboardHero;