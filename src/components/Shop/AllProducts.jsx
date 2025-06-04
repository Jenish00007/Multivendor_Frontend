import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye, AiOutlineShopping, AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
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
          const updatedProducts = products.filter((product) => product._id !== id);
          dispatch({
            type: "getAllProductsShopSuccess",
            payload: updatedProducts,
          });
        } else {
          toast.error(response.payload || "Failed to delete product");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(error.response?.data?.message || "Error deleting product");
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
          <div className="p-2.5 bg-blue-50 rounded-lg flex-shrink-0">
            <AiOutlineShopping className="text-blue-600" size={20} />
          </div>
          <div className="flex flex-col justify-center min-w-[100px]">
            <span className="font-medium text-gray-700 truncate leading-tight">#{params.value.slice(-6)}</span>
            <span className="text-xs text-gray-500 leading-tight mt-0.5">Product ID</span>
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
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={params.row.images[0]}
            alt="Product"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/50";
            }}
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <span className="font-medium text-gray-700">{params.value}</span>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <BsCurrencyRupee className="mr-1" />
          <span className="font-medium text-gray-700">{params.value}</span>
        </div>
      ),
    },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center">
          <span className={`font-medium ${params.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {params.value > 0 ? params.value : 'Out of Stock'}
          </span>
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
          <span className="font-medium text-gray-700">{params.value}</span>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-start gap-2 w-full">
            <button 
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
              onClick={() => handlePreview(params.row)}
            >
              <AiOutlineEye size={18} />
            </button>
            <button 
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
              onClick={() => handleEdit(params.row.id)}
            >
              <AiOutlineEdit size={18} />
            </button>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
              onClick={() => handleDelete(params.row.id)}
            >
              <AiOutlineDelete size={18} />
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
    <div className="w-full p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div className="relative">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <span className="text-4xl">📦</span>
            </div>
            <div>
              <div className="font-bold text-[32px] font-Poppins bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                All Products
              </div>
              <div className="text-gray-600 text-[18px] mt-1 font-medium">
                Manage your product inventory
              </div>
            </div>
          </div>
          <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"></div>
        </div>
        <Link to="/dashboard-create-product">
          <Button
            variant="contained"
            className="!bg-blue-500 !text-white hover:!bg-blue-600 transition-colors duration-300"
          >
            Create Product
          </Button>
        </Link>
      </div>

      <div className="w-full min-h-[65vh] bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl border border-white/50">
        <style>
          {`
            .custom-header {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
              color: #1e293b !important;
              font-weight: 700 !important;
              font-size: 0.875rem !important;
              padding: 24px 20px !important;
              border-bottom: 3px solid #e2e8f0 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.1em !important;
              position: relative !important;
            }
            .custom-header::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 3px;
              background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
            }
            .custom-cell {
              padding: 24px 20px !important;
              font-size: 0.875rem !important;
              border-bottom: 1px solid #f1f5f9 !important;
            }
            .MuiDataGrid-row {
              border-bottom: 1px solid #f1f5f9 !important;
              transition: all 0.3s ease-in-out !important;
              position: relative !important;
            }
            .MuiDataGrid-row:hover {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
              transform: translateY(-2px) !important;
              box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
              border-radius: 12px !important;
              margin: 2px 8px !important;
              border: 1px solid #e2e8f0 !important;
            }
            .MuiDataGrid-cell:focus {
              outline: none !important;
            }
            .MuiDataGrid-columnSeparator {
              display: none !important;
            }
            .MuiDataGrid-footerContainer {
              border-top: 2px solid #e2e8f0 !important;
              padding: 24px 20px !important;
              margin-top: 12px !important;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
            }
            .MuiTablePagination-root {
              color: #64748b !important;
            }
            .MuiTablePagination-select {
              color: #1e293b !important;
              font-weight: 600 !important;
              padding: 10px 18px !important;
              border-radius: 8px !important;
              background-color: #ffffff !important;
            }
            .MuiTablePagination-selectIcon {
              color: #64748b !important;
            }
            .MuiIconButton-root {
              color: #64748b !important;
              transition: all 0.3s ease-in-out !important;
              padding: 12px !important;
              border-radius: 10px !important;
            }
            .MuiIconButton-root:hover {
              background-color: #3b82f6 !important;
              color: #ffffff !important;
              transform: scale(1.1) !important;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
            }
            .MuiDataGrid-root {
              border: none !important;
              height: calc(65vh - 100px) !important;
              border-radius: 16px !important;
              overflow: hidden !important;
            }
            .MuiDataGrid-columnHeaders {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
              border-bottom: 3px solid #e2e8f0 !important;
            }
            .MuiDataGrid-virtualScrollerContent {
              padding: 8px !important;
            }
            .MuiDataGrid-cell {
              display: flex !important;
              align-items: center !important;
              justify-content: flex-start !important;
              padding: 16px 20px !important;
              height: 100% !important;
              min-height: 80px !important;
              border-bottom: none !important;
            }
            .MuiDataGrid-columnHeader {
              padding: 20px !important;
              height: 72px !important;
              align-items: center !important;
            }
            .MuiDataGrid-columnHeaderTitle {
              font-weight: 700 !important;
              color: #1e293b !important;
              white-space: normal !important;
              line-height: 1.3 !important;
              display: flex !important;
              align-items: center !important;
              text-transform: uppercase !important;
              font-size: 0.8rem !important;
              letter-spacing: 0.1em !important;
            }
            .MuiDataGrid-row {
              min-height: 80px !important;
              margin-bottom: 8px !important;
            }
            .MuiDataGrid-virtualScroller {
              margin-top: 8px !important;
            }
            .MuiDataGrid-virtualScrollerContent {
              padding: 0 8px !important;
            }
            .MuiDataGrid-virtualScrollerRenderZone {
              transform: none !important;
            }
            @media (max-width: 768px) {
              .MuiDataGrid-cell {
                padding: 12px !important;
                min-height: 72px !important;
              }
              .MuiDataGrid-columnHeader {
                padding: 12px !important;
              }
              .custom-cell {
                font-size: 0.75rem !important;
              }
              .MuiDataGrid-row {
                min-height: 72px !important;
              }
              .MuiDataGrid-columnHeaderTitle {
                font-size: 0.7rem !important;
              }
            }
          `}
        </style>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="w-full overflow-x-auto">
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
              className="!border-none"
              getRowHeight={() => 'auto'}
              rowHeight={80}
            />
          </div>
        )}
      </div>

      {/* Product Preview Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Product Details</h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <AiOutlineClose size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Images */}
                  <div className="space-y-4">
                    <div className="relative w-full h-80 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400";
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.slice(1).map((image, index) => (
                        <div key={index} className="relative w-full h-20 rounded-lg overflow-hidden bg-gray-100">
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
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{selectedProduct.name}</h4>
                      <p className="text-sm text-gray-500">
                        Category: {typeof selectedProduct.category === 'object' ? selectedProduct.category.name : selectedProduct.category}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Original Price:</span>
                        <span className="text-gray-900 line-through">₹{selectedProduct.originalPrice}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Discount Price:</span>
                        <span className="text-xl font-bold text-blue-600">₹{selectedProduct.discountPrice}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Stock:</span>
                        <span className={`font-medium ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedProduct.stock > 0 ? selectedProduct.stock : 'Out of Stock'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Sold:</span>
                        <span className="font-medium text-gray-900">{selectedProduct.sold}</span>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">Description</h5>
                      <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                    </div>

                    {selectedProduct.tags && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">Tags</h5>
                        <div className="flex flex-wrap gap-2">
                          {(typeof selectedProduct.tags === 'string' 
                            ? selectedProduct.tags.split(',').map(tag => tag.trim())
                            : Array.isArray(selectedProduct.tags) 
                              ? selectedProduct.tags 
                              : []
                          ).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
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
