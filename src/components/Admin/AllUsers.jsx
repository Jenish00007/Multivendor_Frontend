import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../redux/actions/user";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineEye } from "react-icons/ai";
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
    if (window.confirm("Are you sure you want to delete this user?")) {
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
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlineUser className="text-indigo-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">#{params.value.slice(-6)}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">User ID</span>
          </div>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <span className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-blue-200">
            {params.value}
          </div>
        </div>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-green-200">
            {params.value}
          </div>
        </div>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className={`px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm ${
            params.value === 'admin' 
              ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200' 
              : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200'
          }`}>
            {params.value}
          </div>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-start gap-2 w-full">
            <button 
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => handlePreview(params.row)}
              title="Preview User"
            >
              <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => handleDelete(params.row.id)}
              title="Delete User"
            >
              <AiOutlineDelete size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        );
      },
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
        ...item
      });
    });

  return (
    <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div className="relative">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                <span className="text-5xl filter drop-shadow-lg">👥</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
            </div>
            <div>
              <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                All Users
              </div>
              <div className="text-gray-600 text-lg mt-2 font-medium">
                Manage and monitor all registered users
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {users?.length || 0} users in your platform
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full sm:w-[300px] pl-12 pr-6 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            <BsFilter size={20} />
            <span className="text-sm font-semibold">Filter</span>
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
          `}
        </style>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader />
          </div>
        ) : row.length === 0 ? (
          <div className="w-full h-[400px] flex items-center justify-center">
            <div className="text-center">
              <AiOutlineUser className="mx-auto text-gray-400" size={48} />
              <p className="mt-4 text-gray-600">No users found</p>
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
                  overflow: 'visible'
                },
                '& .MuiDataGrid-row': {
                  overflow: 'visible'
                },
                '& .MuiDataGrid-virtualScroller': {
                  overflow: 'visible !important'
                },
                '& .MuiDataGrid-virtualScrollerContent': {
                  overflow: 'visible !important'
                },
                '& .MuiDataGrid-virtualScrollerRenderZone': {
                  overflow: 'visible !important'
                }
              }}
            />
          </div>
        )}
      </div>

      {/* User Preview Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">User Details</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                  <AiOutlineUser className="text-indigo-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold text-gray-800">{selectedUser.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                  <AiOutlineMail className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{selectedUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                  <AiOutlinePhone className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-800">{selectedUser.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                  <AiOutlineUser className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-semibold text-gray-800">{selectedUser.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
