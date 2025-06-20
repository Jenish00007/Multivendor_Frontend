import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect, AiOutlineShoppingCart, AiOutlineLineChart, AiOutlineEye, AiOutlineClose } from "react-icons/ai";
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
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Function to format time only
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Function to format date and time
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return `${formattedDate} ${formattedTime}`;
    };

    const handlePreview = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    // Get recent orders (last 5)
    const recentOrders = orders?.slice(0, 5) || [];

    const columns = [
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 150,
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center gap-3 w-full">
                    <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0 shadow-sm">
                        <AiOutlineShoppingCart className="text-indigo-600" size={20} />
                    </div>
                    <div className="flex flex-col justify-center min-w-[100px]">
                        <span className="font-semibold text-gray-800 truncate leading-tight">#{params.value.slice(-6)}</span>
                        <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Order ID</span>
                    </div>
                </div>
            ),
        },
        {
            field: "customerName",
            headerName: "Customer",
            minWidth: 150,
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center gap-3 w-full">
                    <div className="p-2.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex-shrink-0 shadow-sm">
                        <MdOutlinePeopleAlt className="text-purple-600" size={20} />
                    </div>
                    <div className="flex flex-col justify-center min-w-[120px]">
                        <span className="font-semibold text-gray-800 truncate leading-tight">{params.value}</span>
                        <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Customer</span>
                    </div>
                </div>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 140,
            flex: 1,
            renderCell: (params) => {
                const status = params.getValue(params.id, "status");
                const statusConfig = {
                    Delivered: {
                        bg: "from-green-100 to-emerald-100",
                        text: "text-green-700",
                        border: "border-green-200",
                        icon: "✓",
                        label: "Delivered"
                    },
                    Processing: {
                        bg: "from-yellow-100 to-amber-100",
                        text: "text-yellow-700",
                        border: "border-yellow-200",
                        icon: "⟳",
                        label: "Processing"
                    },
                    Pending: {
                        bg: "from-blue-100 to-indigo-100",
                        text: "text-blue-700",
                        border: "border-blue-200",
                        icon: "⏳",
                        label: "Pending"
                    },
                    Cancelled: {
                        bg: "from-red-100 to-pink-100",
                        text: "text-red-700",
                        border: "border-red-200",
                        icon: "✕",
                        label: "Cancelled"
                    }
                };
                const config = statusConfig[status] || statusConfig.Processing;
                return (
                    <div className="flex items-center justify-start w-full">
                        <div className={`px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm bg-gradient-to-r ${config.bg} ${config.text} border ${config.border}`}>
                            {config.label}
                        </div>
                    </div>
                );
            },
        },
        {
            field: "total",
            headerName: "Total",
            minWidth: 140,
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center gap-3 w-full">
                    <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex-shrink-0 shadow-sm">
                        <BsCurrencyRupee className="text-green-600" size={20} />
                    </div>
                    <div className="flex flex-col justify-center min-w-[100px]">
                        <span className="font-semibold text-gray-800 truncate leading-tight">{params.value}</span>
                        <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Amount</span>
                    </div>
                </div>
            ),
        },
        {
            field: "createdAt",
            headerName: "Date",
            minWidth: 140,
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center gap-3 w-full">
                    <div className="p-2.5 bg-gradient-to-br from-gray-100 to-slate-100 rounded-xl flex-shrink-0 shadow-sm">
                        <MdOutlineTrendingUp className="text-gray-600" size={20} />
                    </div>
                    <div className="flex flex-col justify-center min-w-[100px]">
                        <span className="font-semibold text-gray-800 truncate leading-tight">{params.value}</span>
                        <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Order Date</span>
                    </div>
                </div>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 120,
            flex: 0.8,
            renderCell: (params) => {
                return (
                    <div className="flex items-center justify-start gap-2 w-full">
                        <button
                            onClick={() => handlePreview(params.row)}
                            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                            title="View Order Details"
                        >
                            <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
                        </button>
                    </div>
                );
            },
        },
    ];

    const row = [];

    recentOrders.forEach((item) => {
        const { _id, ...itemWithoutId } = item;
        row.push({
            id: _id || '',
            customerName: item.user?.name || "N/A",
            status: item.status || 'N/A',
            total: item.totalPrice ? formatIndianCurrency(item.totalPrice) : 'N/A',
            createdAt: new Date(item.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            ...itemWithoutId
        });
    });

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

            {/* Recent Orders Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                                <span className="text-5xl filter drop-shadow-lg">🛍️</span>
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
                            <div className="text-sm text-gray-500 mt-1">
                                {recentOrders?.length || 0} recent orders in your store
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
                ) : recentOrders?.length === 0 ? (
                    <div className="w-full h-[200px] flex items-center justify-center">
                        <div className="text-center">
                            <AiOutlineShoppingCart className="mx-auto text-gray-400" size={48} />
                            <p className="mt-4 text-gray-600">No recent orders found</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full min-h-[400px] relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100/30 to-purple-100/30 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100/30 to-blue-100/30 rounded-full blur-2xl"></div>

                        <div className="w-full relative z-10">
                            <DataGrid
                                rows={row}
                                columns={columns}
                                pageSize={5}
                                disableSelectionOnClick
                                autoHeight
                                className="!border-none"
                                getRowHeight={() => 'auto'}
                                rowHeight={80}
                                componentsProps={{
                                    footer: {
                                        sx: {
                                            position: 'relative',
                                            overflow: 'visible'
                                        }
                                    },
                                    panel: {
                                        sx: {
                                            overflow: 'visible'
                                        }
                                    }
                                }}
                                sx={{
                                    '& .MuiDataGrid-root': {
                                        border: 'none !important',
                                        background: 'transparent !important',
                                        borderRadius: '20px !important',
                                        overflow: 'hidden !important'
                                    },
                                    '& .MuiDataGrid-main': {
                                        overflow: 'visible !important'
                                    },
                                    '& .MuiDataGrid-virtualScroller': {
                                        marginTop: '8px !important',
                                        overflow: 'visible !important'
                                    },
                                    '& .MuiDataGrid-virtualScrollerContent': {
                                        padding: '0 12px !important',
                                        overflow: 'visible !important'
                                    },
                                    '& .MuiDataGrid-virtualScrollerRenderZone': {
                                        transform: 'none !important',
                                        position: 'relative !important',
                                        overflow: 'visible !important'
                                    },
                                    '& .MuiDataGrid-footerContainer': {
                                        position: 'relative !important',
                                        overflow: 'visible !important',
                                        marginTop: '20px !important',
                                        background: 'transparent !important',
                                        borderTop: '1px solid rgba(226, 232, 240, 0.5) !important'
                                    },
                                    '& .MuiDataGrid-panel': {
                                        overflow: 'visible !important'
                                    },
                                    '& .MuiDataGrid-panelContent': {
                                        overflow: 'visible !important'
                                    },
                                    '& .MuiDataGrid-cell': {
                                        display: 'flex !important',
                                        alignItems: 'center !important',
                                        justifyContent: 'flex-start !important',
                                        padding: '16px 20px !important',
                                        height: '100% !important',
                                        minHeight: '80px !important',
                                        borderBottom: '1px solid rgba(226, 232, 240, 0.3) !important',
                                        overflow: 'visible !important',
                                        background: 'transparent !important',
                                        transition: 'all 0.3s ease !important'
                                    },
                                    '& .MuiDataGrid-cell:hover': {
                                        background: 'rgba(255, 255, 255, 0.1) !important',
                                        transform: 'translateY(-1px) !important'
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        padding: '20px !important',
                                        height: 'auto !important',
                                        minHeight: '70px !important',
                                        alignItems: 'center !important',
                                        whiteSpace: 'normal !important',
                                        background: 'transparent !important',
                                        borderBottom: '2px solid rgba(79, 70, 229, 0.2) !important',
                                        overflow: 'visible !important'
                                    },
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        fontWeight: '800 !important',
                                        color: '#1e293b !important',
                                        whiteSpace: 'normal !important',
                                        lineHeight: '1.3 !important',
                                        display: 'flex !important',
                                        alignItems: 'center !important',
                                        textTransform: 'uppercase !important',
                                        fontSize: '0.85rem !important',
                                        letterSpacing: '0.1em !important',
                                        height: 'auto !important',
                                        minHeight: '40px !important',
                                        overflow: 'visible !important',
                                        textOverflow: 'unset !important'
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%) !important',
                                        borderBottom: '2px solid rgba(79, 70, 229, 0.2) !important',
                                        overflow: 'visible !important',
                                        backdropFilter: 'blur(10px) !important'
                                    },
                                    '& .MuiDataGrid-row': {
                                        minHeight: '80px !important',
                                        marginBottom: '4px !important',
                                        overflow: 'visible !important',
                                        borderRadius: '12px !important',
                                        transition: 'all 0.3s ease !important'
                                    },
                                    '& .MuiDataGrid-row:hover': {
                                        background: 'rgba(255, 255, 255, 0.9) !important',
                                        transform: 'translateY(-2px) !important',
                                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1) !important'
                                    },
                                    '& .MuiDataGrid-virtualScrollerContent': {
                                        overflow: 'visible !important'
                                    },
                                    '& .MuiDataGrid-virtualScrollerRenderZone': {
                                        overflow: 'visible !important'
                                    },
                                    '& .MuiTablePagination-root': {
                                        color: '#64748b !important',
                                        fontWeight: '600 !important'
                                    },
                                    '& .MuiTablePagination-selectIcon': {
                                        color: '#6366f1 !important'
                                    },
                                    '& .MuiIconButton-root': {
                                        color: '#6366f1 !important',
                                        transition: 'all 0.3s ease !important'
                                    },
                                    '& .MuiIconButton-root:hover': {
                                        background: 'rgba(99, 102, 241, 0.1) !important',
                                        transform: 'scale(1.1) !important'
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Order Preview Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Order Details</h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <AiOutlineClose size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Order Information */}
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Order ID:</span>
                                            <span className="font-medium bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1 rounded-lg">#{selectedOrder.id.slice(-6)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Total Amount:</span>
                                            <span className="font-medium bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-lg">{selectedOrder.total}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={`font-medium px-3 py-1 rounded-lg ${
                                                selectedOrder.status === 'Delivered' 
                                                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                                                    : selectedOrder.status === 'Processing'
                                                    ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700'
                                                    : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700'
                                            }`}>
                                                {selectedOrder.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Order Date & Time:</span>
                                            <span className="font-medium bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-lg">{formatDateTime(selectedOrder.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-medium">{selectedOrder.user?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium">{selectedOrder.user?.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="font-medium">{selectedOrder.user?.phoneNumber || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h3>
                                    <div className="space-y-4">
                                        {selectedOrder.cart?.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                                                    <img
                                                        src={item.images[0]?.url || item.images[0]}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-800 text-lg mb-1 truncate">{item.name}</h4>
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-gray-500">Quantity:</span>
                                                            <span className="font-medium text-gray-700">{item.qty}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-gray-500">Price:</span>
                                                            <span className="font-medium text-gray-700">₹{item.discountPrice || item.price}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-gray-500">Total:</span>
                                                            <span className="font-medium text-gray-700">₹{(item.discountPrice || item.price) * item.qty}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Information */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Address:</span>
                                            <span className="font-medium text-right">{selectedOrder.shippingAddress?.address1 || selectedOrder.shippingAddress?.address || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">City:</span>
                                            <span className="font-medium">{selectedOrder.shippingAddress?.city || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">State:</span>
                                            <span className="font-medium">{selectedOrder.shippingAddress?.state || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Country:</span>
                                            <span className="font-medium">{selectedOrder.shippingAddress?.country || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Zip Code:</span>
                                            <span className="font-medium">{selectedOrder.shippingAddress?.zipCode || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHero;