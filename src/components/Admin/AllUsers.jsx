import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../redux/actions/user";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineArrowRight } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import { BsFilter } from "react-icons/bs";
import Loader from "../Layout/Loader";
import { AiOutlineClose } from "react-icons/ai";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${server}/admin/user/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      toast.success("User deleted successfully!");
      dispatch(getAllUsers());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handlePreview = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      minWidth: 180,
      flex: 0.8,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-blue-50 rounded-lg flex-shrink-0">
            <AiOutlineUser className="text-blue-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-medium text-gray-700 truncate leading-tight">#{params.value.slice(-6)}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5">User ID</span>
          </div>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-purple-50 rounded-lg flex-shrink-0">
            <AiOutlineUser className="text-purple-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[120px]">
            <span className="font-medium text-gray-700 truncate leading-tight">{params.value}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5">Full Name</span>
          </div>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1.2,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-green-50 rounded-lg flex-shrink-0">
            <AiOutlineMail className="text-green-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[150px]">
            <span className="font-medium text-gray-700 truncate leading-tight">{params.value}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5">Email Address</span>
          </div>
        </div>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      minWidth: 160,
      flex: 0.8,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-orange-50 rounded-lg flex-shrink-0">
            <AiOutlinePhone className="text-orange-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-medium text-gray-700 truncate leading-tight">{params.value}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5">Phone Number</span>
          </div>
        </div>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 160,
      flex: 0.8,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-red-50 rounded-lg flex-shrink-0">
            <AiOutlineUser className="text-red-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-medium text-gray-700 truncate leading-tight">{params.value}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5">User Role</span>
          </div>
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
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <button
          onClick={() => handlePreview(params.row)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
        >
          <span>View</span>
          <AiOutlineUser className="transform group-hover:translate-x-1 transition-transform" />
        </button>
      ),
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <button
          onClick={() => handleDelete(params.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
        >
          <span>Delete</span>
          <AiOutlineDelete className="transform group-hover:translate-x-1 transition-transform" />
        </button>
      ),
    },
  ];

  const row = [];
  users &&
    users.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        email: item.email,
        phoneNumber: item.phoneNumber,
        role: item.role,
        ...item // Include all user data for the modal
      });
    });

  return (
    <div className="w-full p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-2">
          <div>
            <h6 className="text-[32px] font-Poppins text-gray-800 font-bold flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <AiOutlineUser className="text-blue-600" size={28} />
              </div>
              All Users
            </h6>
            <p className="text-gray-600 mt-2 ml-1">Manage and monitor all users</p>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full sm:w-[300px] pl-12 pr-6 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <BsFilter size={20} />
              <span className="text-sm font-semibold">Filter</span>
            </button>
          </div>
        </div>

        <div className="w-full min-h-[75vh] bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 transform transition-all duration-300 hover:shadow-2xl">
          {isLoading ? (
            <Loader />
          ) : row.length === 0 ? (
            <div className="w-full h-[400px] flex items-center justify-center">
              <div className="text-center">
                <AiOutlineUser className="mx-auto text-gray-400" size={48} />
                <p className="mt-4 text-gray-600">No users found</p>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={12}
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

      {/* User Preview Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">User Details</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">Role: {selectedUser.role}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedUser.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined:</span>
                    <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Addresses</h4>
                    <div className="space-y-2">
                      {selectedUser.addresses.map((address, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">{address.address1}</p>
                          {address.address2 && (
                            <p className="text-sm text-gray-600">{address.address2}</p>
                          )}
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.country} {address.zipCode}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
