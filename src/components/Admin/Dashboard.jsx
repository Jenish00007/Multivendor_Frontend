import React, { useEffect, useState } from "react";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineShoppingCart, AiOutlineDollar, AiOutlineShop, AiOutlineUser, AiOutlineEye, AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalSellers: 0,
    totalUsers: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    fetchStats();
  }, [dispatch]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${server}/admin/dashboard-stats`, { 
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (res.data) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error.response || error);
      toast.error("Failed to fetch dashboard statistics");
    }
  };

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

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <AiOutlineShoppingCart className="text-blue-500" size={24} />,
      color: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Total Revenue",
      value: formatIndianCurrency(stats.totalRevenue),
      icon: <AiOutlineDollar className="text-green-500" size={24} />,
      color: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "Total Sellers",
      value: stats.totalSellers,
      icon: <AiOutlineShop className="text-purple-500" size={24} />,
      color: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <AiOutlineUser className="text-orange-500" size={24} />,
      color: "bg-orange-50",
      textColor: "text-orange-700",
    },
  ];

  // Get latest 5 orders
  const latestOrders = adminOrders?.slice(0, 5) || [];

  return (
    <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 pt-1 mt-6 md:mt-10">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Monitor your platform's performance</p>
      </div>

      {/* Stats Cards */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[340px] grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} rounded-lg shadow-lg p-4 sm:p-6 min-w-[250px] transition-transform duration-300 hover:scale-[1.03]`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-600">{stat.title}</h3>
                  <p className={`text-xl sm:text-2xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className="p-2 sm:p-3 rounded-full bg-white shadow-md">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Orders Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Latest Orders</h2>
        {adminOrderLoading ? (
          <Loader />
        ) : latestOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {latestOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-blue-100 text-blue-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatIndianCurrency(order.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handlePreview(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <AiOutlineEye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Order #{selectedOrder._id.slice(-6)}</h3>
                  <p className="text-sm text-gray-500">Status: {selectedOrder.status}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{selectedOrder.user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedOrder.user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedOrder.user?.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-green-600">{formatIndianCurrency(selectedOrder.totalPrice)}</span>
                  </div>
                </div>

                {selectedOrder.shippingAddress && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.address1}</p>
                      {selectedOrder.shippingAddress.address2 && (
                        <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.address2}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country} {selectedOrder.shippingAddress.zipCode}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.cart?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.images[0]?.url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                        <p className="text-sm text-gray-600">{formatIndianCurrency(item.discountPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 