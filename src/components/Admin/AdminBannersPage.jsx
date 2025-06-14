import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { 
  getAllAdminBanners, 
  deleteAdminBanner,
  createAdminBanner,
  updateAdminBanner 
} from "../../redux/actions/adminBanner";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineAppstore } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { BsFilter } from "react-icons/bs";
import { server } from "../../server";
import Loader from "../Layout/Loader";

const AdminBannersPage = () => {
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state) => state.adminBanner);
  const [open, setOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    image: null,
  });

  useEffect(() => {
    dispatch(getAllAdminBanners());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedBanner) {
        await dispatch(updateAdminBanner({ 
          id: selectedBanner._id, 
          formData: formDataToSend 
        }));
      } else {
        await dispatch(createAdminBanner(formDataToSend));
      }

      setOpen(false);
      setSelectedBanner(null);
      setFormData({
        title: "",
        description: "",
        link: "",
        image: null,
      });
    } catch (error) {
      toast.error(error.message || "Error saving banner");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAdminBanner(id));
      await dispatch(getAllAdminBanners());
    } catch (error) {
      toast.error(error.message || "Error deleting banner");
    }
  };

  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title || "",
      description: banner.description || "",
      link: banner.link || "",
      image: null,
    });
    setOpen(true);
  };

  const columns = [
    {
      field: "id",
      headerName: "Banner ID",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlineAppstore className="text-indigo-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">#{params.value ? params.value.slice(-6) : 'N/A'}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Banner ID</span>
          </div>
        </div>
      ),
    },
    {
      field: "image",
      headerName: "Image",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <div className="w-[50px] h-[50px] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <img
            src={params.value}
            alt={params.row.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/50";
            }}
          />
        </div>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      minWidth: 180,
      flex: 1.5,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlineAppstore className="text-blue-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[120px]">
            <span className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer truncate leading-tight">{params.value || 'N/A'}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Banner Title</span>
          </div>
        </div>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 200,
      flex: 1.2,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-3 py-1.5 rounded-lg font-medium text-sm shadow-sm border border-gray-200">
            {params.value || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      field: "link",
      headerName: "Link",
      minWidth: 150,
      flex: 1.2,
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1.5 rounded-lg font-medium text-sm shadow-sm border border-green-200">
            {params.value || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => (
        <div className="text-gray-600">
          {new Date(params.value).toLocaleDateString()}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => (
        <div className="flex items-center justify-start gap-2 w-full">
          <button 
            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            onClick={() => handleEdit(params.row)}
            title="Edit Banner"
          >
            <AiOutlineEdit size={18} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
          <button
            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            onClick={() => handleDelete(params.row._id)}
            title="Delete Banner"
          >
            <AiOutlineDelete size={18} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      ),
    },
  ];

  const rows = banners?.map((banner) => ({
    id: banner._id,
    _id: banner._id,
    title: banner.title,
    description: banner.description,
    link: banner.link,
    image: banner.image,
    createdAt: banner.createdAt,
    tags: Array.isArray(banner.tags) ? banner.tags : [],
  })) || [];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div className="relative">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                  <AiOutlineAppstore className="text-4xl text-white filter drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
              </div>
              <div>
                <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                  All Banners
                </div>
                <div className="text-gray-600 text-lg mt-2 font-medium">
                  Manage and monitor all promotional banners
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {banners?.length || 0} total banners
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
          </div>
        </div>

        <div className="w-full min-h-[70vh] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
          
          <div className="w-full relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    placeholder="Search banners..."
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
                onClick={() => {
                  setSelectedBanner(null);
                  setFormData({ title: "", description: "", link: "", image: null });
                  setOpen(true);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <AiOutlineAppstore size={18} />
                <span className="text-sm font-medium">Add New Banner</span>
              </button>
            </div>

            {loading ? (
              <Loader />
            ) : rows.length === 0 ? (
              <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-xl shadow-lg">
                <div className="text-center">
                  <AiOutlineAppstore className="mx-auto text-gray-400" size={48} />
                  <p className="mt-4 text-gray-600">No banners found</p>
                </div>
              </div>
            ) : (
              <div className="w-full overflow-x-auto bg-white rounded-xl shadow-lg p-4">
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={12}
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
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              {selectedBanner ? "Edit Banner" : "Add New Banner"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  accept="image/*"
                  required={!selectedBanner}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {selectedBanner ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBannersPage; 