import React, { useState, useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import { AiOutlineShoppingCart, AiOutlineArrowRight, AiOutlineClose, AiOutlineEye } from "react-icons/ai";
import { MdOutlineTrendingUp } from "react-icons/md";
import { BsCurrencyRupee, BsFilter } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import Loader from "../components/Layout/Loader";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, [dispatch]);

  const handlePreview = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

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

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 180,
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
      field: "status",
      headerName: "Status",
      minWidth: 160,
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
          <div className="flex items-center w-full">
            <div className={`px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${config.bg} ${config.text} border ${config.border} shadow-sm flex items-center gap-2 min-w-[120px]`}>
              <span className="text-lg">{config.icon}</span>
              {config.label}
            </div>
          </div>
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items",
      type: "number",
      minWidth: 160,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center w-full">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex-shrink-0 shadow-sm">
              <AiOutlineShoppingCart className="text-purple-600" size={20} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-semibold text-gray-800 leading-tight">{params.value}</span>
              <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Total Items</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "total",
      headerName: "Total Amount",
      type: "number",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center w-full">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex-shrink-0 shadow-sm">
              <BsCurrencyRupee className="text-green-600" size={20} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-semibold text-gray-800 truncate leading-tight">{params.value}</span>
              <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Amount Paid</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center w-full">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-gray-100 to-blue-100 rounded-xl flex-shrink-0 shadow-sm">
              <MdOutlineTrendingUp className="text-gray-600" size={20} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-semibold text-gray-800 truncate leading-tight">{params.value}</span>
              <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Order Date</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center justify-start gap-2 w-full">
          <button 
            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            onClick={() => handlePreview(params.row)}
            title="View Order Details"
          >
            <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      ),
    },
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: formatIndianCurrency(item?.totalPrice),
        status: item?.status,
        createdAt: item?.createdAt.slice(0, 10),
        ...item // Include all order data for the modal
      });
    });

  return (
    <div>
      <AdminHeader setOpenSidebar={setOpenSidebar} openSidebar={openSidebar} />
      <div className="w-full flex">
        <div className="flex items-start w-full">
          <div className={`${openSidebar ? 'w-[250px]' : 'w-[80px]'} 800px:w-[330px]`}>
            <AdminSideBar active={4} openSidebar={openSidebar} />
          </div>
          <div className="w-full">
            {adminOrderLoading ? (
              <Loader />
            ) : (
              <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                  <div className="relative">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                          <span className="text-5xl filter drop-shadow-lg">📦</span>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
                      </div>
                      <div>
                        <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                          Latest Orders
                        </div>
                        <div className="text-gray-600 text-lg mt-2 font-medium">
                          Manage and track all customer orders
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {adminOrders?.length || 0} total orders
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-[300px] pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white/80 backdrop-blur-sm"
                      />
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300 shadow-sm">
                      <BsFilter size={18} />
                      <span className="text-sm font-medium">Filter</span>
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="w-full min-h-[70vh] relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
                  
                  <style>
                    {`
                      .MuiDataGrid-root {
                        border: none !important;
                        background: transparent !important;
                        border-radius: 20px !important;
                        overflow: hidden !important;
                      }
                      .MuiDataGrid-main {
                        overflow: visible !important;
                      }
                      .MuiDataGrid-virtualScroller {
                        margin-top: 8px !important;
                        overflow: visible !important;
                      }
                      .MuiDataGrid-virtualScrollerContent {
                        padding: 0 12px !important;
                        overflow: visible !important;
                      }
                      .MuiDataGrid-virtualScrollerRenderZone {
                        transform: none !important;
                        position: relative !important;
                        overflow: visible !important;
                      }
                      .MuiDataGrid-footerContainer {
                        position: relative !important;
                        overflow: visible !important;
                        margin-top: 20px !important;
                        background: transparent !important;
                        border-top: 1px solid rgba(226, 232, 240, 0.5) !important;
                      }
                      .MuiDataGrid-panel {
                        overflow: visible !important;
                      }
                      .MuiDataGrid-panelContent {
                        overflow: visible !important;
                      }
                      .MuiDataGrid-cell {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: flex-start !important;
                        padding: 20px 24px !important;
                        height: 100% !important;
                        min-height: 90px !important;
                        border-bottom: 1px solid rgba(226, 232, 240, 0.3) !important;
                        overflow: visible !important;
                        background: transparent !important;
                        transition: all 0.3s ease !important;
                        white-space: normal !important;
                        line-height: 1.5 !important;
                      }
                      .MuiDataGrid-cell[data-field="itemsQty"],
                      .MuiDataGrid-cell[data-field="total"],
                      .MuiDataGrid-cell[data-field="createdAt"],
                      .MuiDataGrid-cell[data-field="status"] {
                        justify-content: flex-start !important;
                        padding-left: 24px !important;
                      }
                      .MuiDataGrid-cell[data-field="itemsQty"] > div,
                      .MuiDataGrid-cell[data-field="total"] > div,
                      .MuiDataGrid-cell[data-field="createdAt"] > div,
                      .MuiDataGrid-cell[data-field="status"] > div {
                        margin-left: 0 !important;
                      }
                      .MuiDataGrid-cell:hover {
                        background: rgba(255, 255, 255, 0.1) !important;
                        transform: translateY(-1px) !important;
                      }
                      .MuiDataGrid-columnHeader {
                        padding: 24px !important;
                        height: auto !important;
                        min-height: 80px !important;
                        align-items: center !important;
                        white-space: normal !important;
                        background: transparent !important;
                        border-bottom: 2px solid rgba(79, 70, 229, 0.2) !important;
                        overflow: visible !important;
                      }
                      .MuiDataGrid-columnHeaderTitle {
                        font-weight: 800 !important;
                        color: #1e293b !important;
                        white-space: normal !important;
                        line-height: 1.3 !important;
                        display: flex !important;
                        align-items: center !important;
                        text-transform: uppercase !important;
                        font-size: 0.85rem !important;
                        letter-spacing: 0.1em !important;
                        height: auto !important;
                        min-height: 40px !important;
                        overflow: visible !important;
                        text-overflow: unset !important;
                      }
                      .MuiDataGrid-columnHeaders {
                        background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%) !important;
                        border-bottom: 2px solid rgba(79, 70, 229, 0.2) !important;
                        overflow: visible !important;
                        backdrop-filter: blur(10px) !important;
                      }
                      .MuiDataGrid-row {
                        min-height: 90px !important;
                        margin-bottom: 4px !important;
                        overflow: visible !important;
                        border-radius: 12px !important;
                        transition: all 0.3s ease !important;
                      }
                      .MuiDataGrid-row:hover {
                        background: rgba(255, 255, 255, 0.9) !important;
                        transform: translateY(-2px) !important;
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
                      }
                      .MuiDataGrid-virtualScrollerContent {
                        overflow: visible !important;
                      }
                      .MuiDataGrid-virtualScrollerRenderZone {
                        overflow: visible !important;
                      }
                      .MuiTablePagination-root {
                        color: #64748b !important;
                        font-weight: 600 !important;
                      }
                      .MuiTablePagination-selectIcon {
                        color: #6366f1 !important;
                      }
                      .MuiIconButton-root {
                        color: #6366f1 !important;
                        transition: all 0.3s ease !important;
                      }
                      .MuiIconButton-root:hover {
                        background: rgba(99, 102, 241, 0.1) !important;
                        transform: scale(1.1) !important;
                      }
                      .MuiDataGrid-columnSeparator {
                        display: none !important;
                      }
                      .MuiDataGrid-cellLeft {
                        text-align: left !important;
                      }
                      .MuiDataGrid-cellRight {
                        text-align: right !important;
                      }
                      .MuiDataGrid-cellCenter {
                        text-align: center !important;
                      }
                    `}
                  </style>

                  {row.length === 0 ? (
                    <div className="w-full h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <AiOutlineShoppingCart className="mx-auto text-gray-400" size={48} />
                        <p className="mt-4 text-gray-600">No orders found</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full relative z-10">
                      <DataGrid
                        rows={row}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        autoHeight
                        className="!border-none"
                        getRowHeight={() => 'auto'}
                        rowHeight={90}
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
                          '& .MuiDataGrid-cell': {
                            overflow: 'visible',
                            padding: '20px 24px',
                            minHeight: '90px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                          },
                          '& .MuiDataGrid-cell[data-field="itemsQty"], & .MuiDataGrid-cell[data-field="total"], & .MuiDataGrid-cell[data-field="createdAt"], & .MuiDataGrid-cell[data-field="status"]': {
                            justifyContent: 'flex-start',
                            paddingLeft: '24px'
                          },
                          '& .MuiDataGrid-cell[data-field="itemsQty"] > div, & .MuiDataGrid-cell[data-field="total"] > div, & .MuiDataGrid-cell[data-field="createdAt"] > div, & .MuiDataGrid-cell[data-field="status"] > div': {
                            marginLeft: '0'
                          },
                          '& .MuiDataGrid-row': {
                            overflow: 'visible',
                            minHeight: '90px'
                          },
                          '& .MuiDataGrid-virtualScroller': {
                            overflow: 'visible !important'
                          },
                          '& .MuiDataGrid-virtualScrollerContent': {
                            overflow: 'visible !important'
                          },
                          '& .MuiDataGrid-virtualScrollerRenderZone': {
                            overflow: 'visible !important'
                          },
                          '& .MuiDataGrid-columnHeader': {
                            padding: '24px',
                            minHeight: '80px',
                            alignItems: 'center'
                          },
                          '& .MuiDataGrid-columnHeaders': {
                            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                            borderBottom: '2px solid rgba(79, 70, 229, 0.2)'
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Order Preview Modal */}
                {isModalOpen && selectedOrder && (
                  <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                      </div>

                      <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full border border-white/20">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <AiOutlineEye className="text-white" size={24} />
                              </div>
                              Order Details
                            </h3>
                            <button
                              onClick={closeModal}
                              className="text-white/80 hover:text-white focus:outline-none transition-all duration-200 p-2 hover:bg-white/20 rounded-xl"
                            >
                              <AiOutlineClose size={24} />
                            </button>
                          </div>
                        </div>

                        <div className="bg-white px-6 py-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Order Summary */}
                            <div className="space-y-6">
                              <div className="space-y-3">
                                <h4 className="text-3xl font-bold text-gray-900 leading-tight">Order #{selectedOrder.id.slice(-6)}</h4>
                                <div className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl font-semibold text-sm shadow-sm">
                                  {selectedOrder.status}
                                </div>
                              </div>

                              <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl shadow-inner">
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="text-gray-600 font-medium">Total Items:</span>
                                  <span className="text-gray-800 font-semibold">{selectedOrder.itemsQty} items</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="text-gray-600 font-medium">Total Amount:</span>
                                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg">
                                    <span className="text-xl font-bold">{selectedOrder.total}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="text-gray-600 font-medium">Order Date:</span>
                                  <span className="text-gray-800 font-semibold">{selectedOrder.createdAt}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                  <span className="text-gray-600 font-medium">Payment Status:</span>
                                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-xl font-semibold shadow-sm">
                                    Paid
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Customer Details */}
                            <div className="space-y-6">
                              <h5 className="text-xl font-bold text-gray-900">Customer Information</h5>
                              <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl shadow-inner">
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="text-gray-600 font-medium">Name:</span>
                                  <span className="text-gray-800 font-semibold">{selectedOrder.user?.name}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                  <span className="text-gray-600 font-medium">Email:</span>
                                  <span className="text-gray-800 font-semibold">{selectedOrder.user?.email}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                  <span className="text-gray-600 font-medium">Phone:</span>
                                  <span className="text-gray-800 font-semibold">{selectedOrder.user?.phoneNumber}</span>
                                </div>
                              </div>

                              <h5 className="text-xl font-bold text-gray-900">Shipping Address</h5>
                              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-gray-600 leading-relaxed">
                                  {selectedOrder.shippingAddress?.address1}, {selectedOrder.shippingAddress?.address2}<br />
                                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br />
                                  {selectedOrder.shippingAddress?.zipCode}, {selectedOrder.shippingAddress?.country}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 flex justify-end">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl border border-transparent shadow-lg px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-base font-semibold text-white hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:scale-105"
                            onClick={closeModal}
                          >
                            <AiOutlineClose size={18} />
                            Close Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrders;
