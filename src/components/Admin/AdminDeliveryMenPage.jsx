import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDeliveryMen, approveDeliveryMan, rejectDeliveryMan } from "../../redux/actions/deliveryman";
import { server } from "../../server";
import { toast } from "react-toastify";
import { FaTruck, FaCheck, FaTimes, FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { BsFilter } from "react-icons/bs";
import { motion } from "framer-motion";
import axios from "axios";
import Loader from "../Layout/Loader";

const AdminDeliveryMenPage = () => {
  const dispatch = useDispatch();
  const { deliveryMen, loading, error } = useSelector((state) => state.deliveryman);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: "",
    idProof: null,
    currentPhoto: null,
  });

  useEffect(() => {
    dispatch(getAllDeliveryMen());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${server}/deliveryman/register`, {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Delivery man registered successfully!");
        setShowAddForm(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          address: "",
          vehicleType: "",
          vehicleNumber: "",
          licenseNumber: "",
          idProof: null,
          currentPhoto: null,
        });
        dispatch(getAllDeliveryMen());
      } else {
        toast.error(data.message || "Error registering delivery man");
      }
    } catch (error) {
      toast.error("Error registering delivery man");
    }
  };

  const handleEdit = (deliveryMan) => {
    setSelectedDeliveryMan(deliveryMan);
    setFormData({
      name: deliveryMan.name,
      email: deliveryMan.email,
      phoneNumber: deliveryMan.phoneNumber,
      address: deliveryMan.address,
      vehicleType: deliveryMan.vehicleType,
      vehicleNumber: deliveryMan.vehicleNumber,
      licenseNumber: deliveryMan.licenseNumber,
      idProof: null,
      currentPhoto: deliveryMan.idProof,
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && key !== 'currentPhoto') {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      console.log('Sending edit request for delivery man:', selectedDeliveryMan._id);
      const response = await axios.put(
        `${server}/deliveryman/edit/${selectedDeliveryMan._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log('Edit response:', response.data);

      if (response.data.success) {
        toast.success("Delivery man updated successfully!");
        setShowEditForm(false);
        setSelectedDeliveryMan(null);
        dispatch(getAllDeliveryMen());
      } else {
        toast.error(response.data.message || "Error updating delivery man");
      }
    } catch (error) {
      console.error('Edit error:', error);
      toast.error(error.response?.data?.message || "Error updating delivery man");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery man?")) {
      try {
        const response = await axios.delete(
          `${server}/deliveryman/delete/${id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          toast.success("Delivery man deleted successfully!");
          dispatch(getAllDeliveryMen());
        } else {
          toast.error(response.data.message || "Error deleting delivery man");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting delivery man");
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${server}/deliveryman/approve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Delivery man approved successfully!");
        dispatch(getAllDeliveryMen());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error approving delivery man");
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this delivery man?")) {
      try {
        const response = await axios.delete(
          `${server}/deliveryman/reject/${id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          toast.success("Delivery man rejected successfully!");
          dispatch(getAllDeliveryMen());
        } else {
          toast.error(response.data.message || "Error rejecting delivery man");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error rejecting delivery man");
      }
    }
  };

  return (
    <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div className="relative">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                <FaTruck className="text-4xl text-white filter drop-shadow-lg" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
            </div>
            <div>
              <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                Delivery Men
              </div>
              <div className="text-gray-600 text-lg mt-2 font-medium">
                Manage and monitor all delivery personnel
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {deliveryMen?.length || 0} total delivery men
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full min-h-[70vh] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
        
        <div className="w-full relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="Search delivery men..."
                  className="w-full sm:w-[300px] pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md">
                <BsFilter size={18} />
                <span className="text-sm font-medium">Filter</span>
              </button>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaUserPlus size={18} />
              <span className="text-sm font-medium">Add New Delivery Man</span>
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="w-full overflow-x-auto bg-white rounded-xl shadow-lg p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Man</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deliveryMen?.map((deliveryMan) => (
                    <tr key={deliveryMan._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-sm">
                              <FaTruck className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{deliveryMan.name}</div>
                            <div className="text-xs text-gray-500">{deliveryMan.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{deliveryMan.phoneNumber}</div>
                        <div className="text-xs text-gray-500">{deliveryMan.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-3 py-1.5 rounded-lg font-medium text-sm shadow-sm border border-gray-200">
                          {deliveryMan.vehicleType} - {deliveryMan.vehicleNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-lg ${
                            deliveryMan.isApproved
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                              : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          {deliveryMan.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {!deliveryMan.isApproved && (
                            <button
                              onClick={() => handleApprove(deliveryMan._id)}
                              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                              title="Approve Delivery Man"
                            >
                              <FaCheck size={16} className="group-hover:scale-110 transition-transform duration-200" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(deliveryMan)}
                            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                            title="Edit Delivery Man"
                          >
                            <FaEdit size={16} className="group-hover:scale-110 transition-transform duration-200" />
                          </button>
                          <button
                            onClick={() => handleDelete(deliveryMan._id)}
                            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                            title="Delete Delivery Man"
                          >
                            <FaTrash size={16} className="group-hover:scale-110 transition-transform duration-200" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-xl shadow-lg mb-8"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Delivery Man</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof</label>
                  <input
                    type="file"
                    name="idProof"
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Register
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {showEditForm && selectedDeliveryMan && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-xl shadow-lg mb-8"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Delivery Man</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current ID Proof</label>
                  {formData.currentPhoto && (
                    <img
                      src={formData.currentPhoto}
                      alt="Current ID Proof"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New ID Proof (Optional)</label>
                  <input
                    type="file"
                    name="idProof"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedDeliveryMan(null);
                  }}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors shadow-lg"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Update
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
    </div>
  );
};

export default AdminDeliveryMenPage; 