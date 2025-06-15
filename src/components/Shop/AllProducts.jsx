import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye, AiOutlineShopping, AiOutlineClose, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct, getAllProductsShop } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import { BsCurrencyRupee } from "react-icons/bs";
import { backend_url } from "../../server";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await dispatch(deleteProduct(id));
        if (response.type === "deleteProductSuccess") {
          toast.success("Product deleted successfully!");
          dispatch(getAllProductsShop(seller._id));
        } else {
          toast.error("Failed to delete product. Please try again.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Error deleting product. Please try again.");
      }
    }
  };

  const handlePreview = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    window.location.href = `/dashboard-edit-product/${id}`;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
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
      headerName: "Product ID",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlineShopping className="text-indigo-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">#{params.value.slice(-6)}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Product ID</span>
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
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg ring-2 ring-white">
          <img
            src={params.row.images[0]}
            alt="Product"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/50";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Product Name",
      minWidth: 200,
      flex: 1,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center">
          <span className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 130,
      flex: 1,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-sm">
            <div className="flex items-center">
              <BsCurrencyRupee className="mr-1" size={14} />
              <span className="font-bold text-sm">{params.value}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 130,
      flex: 1,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center">
          <div className={`px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm ${
            params.value > 0 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' 
              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
          }`}>
            {params.value > 0 ? `${params.value} units` : 'Out of Stock'}
          </div>
        </div>
      ),
    },
    {
      field: "sold",
      headerName: "Sold",
      minWidth: 130,
      flex: 1,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-blue-200">
            {params.value} sold
          </div>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 180,
      flex: 1,
      headerClassName: 'custom-header',
      cellClassName: 'custom-cell',
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-start gap-2 w-full">
            <button 
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => handlePreview(params.row)}
              title="Preview Product"
            >
              <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => handleEdit(params.row.id)}
              title="Edit Product"
            >
              <AiOutlineEdit size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              onClick={() => handleDelete(params.row.id)}
              title="Delete Product"
            >
              <AiOutlineDelete size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        );
      },
    },
  ];

  const row = [];

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.discountPrice,
        stock: item.stock,
        sold: item.sold_out,
        images: item.images,
        description: item.description,
        category: item.category,
        tags: item.tags,
        originalPrice: item.originalPrice,
        discountPrice: item.discountPrice,
        shop: item.shop,
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
                <span className="text-5xl filter drop-shadow-lg">📦</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"></div>
            </div>
            <div>
              <div className="font-black text-4xl font-Poppins bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                All Products
              </div>
              <div className="text-gray-600 text-lg mt-2 font-medium">
                Manage your product inventory with ease
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {products?.length || 0} products in your store
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
        </div>
        <Link
          to="/dashboard-create-product"
          className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <AiOutlinePlus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Create Product
        </Link>
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

      {/* Enhanced Product Preview Modal */}
      {isModalOpen && selectedProduct && (
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
                    Product Preview
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
                  {/* Product Images */}
                  <div className="space-y-4">
                    <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl">
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {selectedProduct.images.slice(1).map((image, index) => (
                        <div key={index} className="relative w-full h-24 rounded-xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                          <img
                            src={image}
                            alt={`${selectedProduct.name} ${index + 2}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/100";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-3xl font-bold text-gray-900 leading-tight">{selectedProduct.name}</h4>
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl font-semibold text-sm shadow-sm">
                        {typeof selectedProduct.category === 'object' ? selectedProduct.category.name : selectedProduct.category}
                      </div>
                    </div>

                    <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl shadow-inner">
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Original Price:</span>
                        <span className="text-gray-500 line-through text-lg font-semibold">₹{selectedProduct.originalPrice}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Discount Price:</span>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg">
                          <span className="text-xl font-bold">₹{selectedProduct.discountPrice}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Stock:</span>
                        <div className={`px-4 py-2 rounded-xl font-semibold shadow-sm ${
                          selectedProduct.stock > 0 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
                        }`}>
                          {selectedProduct.stock > 0 ? `${selectedProduct.stock} units` : 'Out of Stock'}
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600 font-medium">Total Sold:</span>
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-xl font-semibold shadow-sm">
                          {selectedProduct.sold} units
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-lg font-bold text-gray-900">Description</h5>
                      <p className="text-gray-600 leading-relaxed bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        {selectedProduct.description}
                      </p>
                    </div>

                    {selectedProduct.tags && (
                      <div className="space-y-3">
                        <h5 className="text-lg font-bold text-gray-900">Tags</h5>
                        <div className="flex flex-wrap gap-2">
                          {(typeof selectedProduct.tags === 'string' 
                            ? selectedProduct.tags.split(',').map(tag => tag.trim())
                            : Array.isArray(selectedProduct.tags) 
                              ? selectedProduct.tags 
                              : []
                          ).map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 text-sm font-semibold text-blue-600 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
  );
};

export default AllProducts;