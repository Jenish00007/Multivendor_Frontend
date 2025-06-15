import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye, AiOutlineShop, AiOutlineMail, AiOutlinePhone, AiOutlineArrowRight, AiOutlinePlus } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/sellers";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { BsFilter } from "react-icons/bs";
import AddVendor from "./AddVendor";

const AllSellers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sellers = [], isLoading = true } = useSelector((state) => state.seller || {});
  const [open, setOpen] = useState(false);
  const [openAddVendor, setOpenAddVendor] = useState(false);
  const [userId, setUserId] = useState("");
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  useEffect(() => {
    if (sellers && Array.isArray(sellers)) {
      const formattedRows = sellers
        .filter(item => item && item._id)
        .map(item => ({
          id: item._id,
          name: item.name || 'N/A',
          email: item.email || 'N/A',
          phoneNumber: item.phoneNumber || 'N/A',
          status: item.status || 'inactive',
          avatar: item.avatar || null,
        }));
      setRows(formattedRows);
    }
  }, [sellers]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${server}/admin/dashboard-stats`, { withCredentials: true });
        if (res.data) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to fetch dashboard statistics");
      }
    };
    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      const res = await axios.delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true });
      toast.success(res.data.message);
      dispatch(getAllSellers());
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting seller");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreview = (id) => {
    navigate(`/shop/preview/${id}`);
  };

  const columns = [
    { 
      field: "id", 
      headerName: "Shop ID", 
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlineShop className="text-indigo-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">#{params.value.slice(-6)}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Shop ID</span>
          </div>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Shop Name",
      minWidth: 200,
      flex: 1.5,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg ring-2 ring-white">
            <img
              src={params.row.avatar}
              alt={params.row.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/50";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>
          <div className="flex flex-col justify-center min-w-[120px]">
            <span className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer truncate leading-tight">{params.row.name}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Shop Name</span>
          </div>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
      flex: 2,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlineMail className="text-green-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[180px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">{params.row.email}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Email Address</span>
          </div>
        </div>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlinePhone className="text-orange-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[120px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">{params.row.phoneNumber}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Contact Number</span>
          </div>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-start gap-2 w-full">
            <button 
              onClick={() => handlePreview(params.row.id)}
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              title="Preview Shop"
            >
              <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => {
                setUserId(params.row.id);
                setOpen(true);
              }}
              title="Delete Shop"
            >
              <AiOutlineDelete size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sellers data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Delete Confirmation Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Delete Seller</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <RxCross1 size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this seller? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(userId)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div className="relative">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                <span className="text-5xl filter drop-shadow-lg">🏬</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
            </div>
            <div>
              <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
              All Sellers
          </div>
              <div className="text-gray-600 text-lg mt-2 font-medium">
                Manage and monitor all registered sellers
          </div>
              <div className="text-sm text-gray-500 mt-1">
                {rows?.length || 0} sellers in your platform
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
              <DataGrid
                rows={rows}
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
                padding: '20px 24px !important',
                height: '100% !important',
                minHeight: '90px !important',
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
                padding: '24px !important',
                height: 'auto !important',
                minHeight: '80px !important',
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
                minHeight: '90px !important',
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
    </div>
  );
};

export default AllSellers;
