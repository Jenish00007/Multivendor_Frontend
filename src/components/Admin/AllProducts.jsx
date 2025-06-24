import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye, AiOutlineShopping, AiOutlineClose, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsAdmin } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import { BsCurrencyRupee } from "react-icons/bs";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import { FiSearch } from "react-icons/fi";
import { BsFilter } from "react-icons/bs";

const AllProducts = () => {
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllProductsAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (allProducts && Array.isArray(allProducts)) {
      const formattedRows = allProducts
        .filter(item => item && item._id)
        .map(item => ({
          id: item._id,
          name: item.name || 'N/A',
          category: item.category,
          subcategory: item.subcategory,
          price: item.discountPrice || item.price,
          Stock: item.stock || 0,
          sold: item.sold_out || 0,
          images: Array.isArray(item.images) ? item.images : [item.images],
          description: item.description,
          tags: item.tags,
          originalPrice: item.originalPrice || item.price,
          discountPrice: item.discountPrice || item.price,
          shop: item.shop,
          unit: item.unit,
          maxPurchaseQuantity: item.maxPurchaseQuantity,
          createdAt: item.createdAt || new Date(),
        }));
      setRows(formattedRows);
    }
  }, [allProducts]);

  // Filter products based on search term and date range
  const filteredProducts = rows.filter((product) => {
    const productName = String(product.name || "").toLowerCase();
    const productId = String(product.id || "").toLowerCase();
    const categoryName = String(product.category?.name || product.category || "").toLowerCase();
    const subcategoryName = String(product.subcategory?.name || product.subcategory || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = productName.includes(search) || 
                         productId.includes(search) || 
                         categoryName.includes(search) || 
                         subcategoryName.includes(search);

    const productDate = new Date(product.createdAt);
    const start = startDate ? new Date(startDate) : null;

    const matchesDate = !start || productDate >= start;

    return matchesSearch && matchesDate;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setIsDeleting(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Authentication required. Please login again.");
          return;
        }

        const response = await axios.delete(`${server}/admin/product/${id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.data.success) {
          toast.success("Product deleted successfully!");
          dispatch(getAllProductsAdmin());
        } else {
          toast.error(response.data.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(error.response?.data?.message || "Failed to delete product. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (id) => {
    try {
      navigate(`/admin-edit-product/${id}`);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Failed to navigate to edit page. Please try again.");
    }
  };

  const handleCreate = () => {
    try {
      navigate('/admin-create-product');
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Failed to navigate to create page. Please try again.");
    }
  };

  const handlePreview = (product) => {
    const formattedProduct = {
      ...product,
      images: Array.isArray(product.images) ? product.images : [product.images],
      category: typeof product.category === 'object' ? product.category.name : product.category,
      subcategory: typeof product.subcategory === 'object' ? product.subcategory.name : product.subcategory,
      tags: typeof product.tags === 'string' ? product.tags.split(',').map(tag => tag.trim()) : product.tags || [],
      Stock: product.stock || 0,
      sold: product.sold_out || 0,
      originalPrice: product.originalPrice || product.price,
      discountPrice: product.discountPrice || product.price,
      shop: product.shop ? {
        name: product.shop.name,
        ratings: product.shop.ratings,
        avatar: product.shop.avatar
      } : null
    };
    setSelectedProduct(formattedProduct);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Function to format currency in Indian format
  const formatIndianCurrency = (amount) => {
    if (!amount) return '₹0.00';
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
      renderCell: (params) => (
        <div className="flex items-center">
          <span className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const categoryName = params.row.category?.name || params.row.category || '-';
        return (
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-purple-200">
              {categoryName}
            </div>
          </div>
        );
      },
    },
    {
      field: "subcategory",
      headerName: "Subcategory",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const subcategoryName = params.row.subcategory?.name || params.row.subcategory || '-';
        return (
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-blue-200">
              {subcategoryName}
            </div>
          </div>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 130,
      flex: 1,
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
      field: "Stock",
      headerName: "Stock",
      minWidth: 130,
      flex: 1,
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
      renderCell: (params) => (
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm border border-blue-200">
            {params.value} sold
          </div>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-gradient-to-br from-gray-100 to-slate-100 rounded-xl flex-shrink-0 shadow-sm">
            <AiOutlineShopping className="text-gray-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[120px]">
            <span className="font-semibold text-gray-800 truncate leading-tight">
              {new Date(params.row.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5 font-medium">Creation Date</span>
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
              title="Preview Product"
            >
              <AiOutlineEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
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
                Manage and track all products
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {filteredProducts?.length || 0} total products
                {(searchTerm || startDate) && (
                  <span className="ml-2 text-blue-600 font-medium">
                    (Filtered from {rows?.length || 0} total)
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[300px] pl-12 pr-6 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full min-h-[70vh] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
        
        {isLoading ? (
          <Loader />
        ) : filteredProducts?.length === 0 ? (
          <div className="w-full h-[400px] flex items-center justify-center">
            <div className="text-center">
              <AiOutlineShopping className="mx-auto text-gray-400" size={48} />
              <p className="mt-4 text-gray-600">No products found</p>
              <button
                onClick={handleCreate}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <AiOutlinePlus size={18} />
                <span>Create Your First Product</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full relative z-10">
            <DataGrid
              rows={filteredProducts}
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

      {/* Product Preview Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <AiOutlineClose size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.images.slice(1).map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image}
                          alt={`${selectedProduct.name} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium">
                        {selectedProduct.category}
                      </div>
                      {selectedProduct.subcategory && (
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                          {selectedProduct.subcategory}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Original Price:</span>
                      <div className="text-gray-500 line-through">₹{selectedProduct.originalPrice}</div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Discount Price:</span>
                      <div className="text-green-600 font-bold">₹{selectedProduct.discountPrice}</div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Stock:</span>
                      <div className={`px-4 py-2 rounded-xl font-semibold shadow-sm ${
                        selectedProduct.Stock > 0 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                          : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
                      }`}>
                        {selectedProduct.Stock > 0 ? `${selectedProduct.Stock} units` : 'Out of Stock'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Total Sold:</span>
                      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-xl font-semibold shadow-sm">
                        {selectedProduct.sold} units
                      </div>
                    </div>
                    {selectedProduct.unit && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Unit:</span>
                        <div className="text-gray-800 font-medium">{selectedProduct.unit}</div>
                      </div>
                    )}
                    {selectedProduct.maxPurchaseQuantity && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Max Purchase Quantity:</span>
                        <div className="text-gray-800 font-medium">{selectedProduct.maxPurchaseQuantity}</div>
                      </div>
                    )}
                    {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedProduct.shop && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-2">Shop Information</h4>
                      <div className="flex items-center gap-3">
                        {selectedProduct.shop.avatar && (
                          <img
                            src={selectedProduct.shop.avatar}
                            alt={selectedProduct.shop.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-800">{selectedProduct.shop.name}</div>
                          {selectedProduct.shop.ratings && (
                            <div className="text-sm text-gray-600">
                              Rating: {selectedProduct.shop.ratings.toFixed(1)} ⭐
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedProduct.description}
                    </p>
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

export default AllProducts;
