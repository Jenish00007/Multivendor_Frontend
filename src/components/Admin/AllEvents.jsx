import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineCalendar, AiOutlineDollar, AiOutlineStock, AiOutlineFire, AiOutlineGift, AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllEventsAdmin } from "../../redux/actions/event";
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";

const AllEvents = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllEventsAdmin());
  }, [dispatch]);

  const handlePreview = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
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
    { field: "id", headerName: "Event ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/event/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  allEvents &&
    allEvents.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: formatIndianCurrency(item.discountPrice),
        stock: item.stock,
        sold: item.sold_out,
      });
    });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <AiOutlineCalendar className="text-purple-500" />
          All Events
        </h1>
        <p className="text-gray-500 mt-1">Manage and monitor all promotional events</p>
      </div>
      {allEvents && allEvents.length > 0 ? (
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          className="!border-none"
          componentsProps={{
            pagination: {
              className: "!text-gray-700",
            },
          }}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No events found</p>
        </div>
      )}

      {/* Event Preview Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Event Details</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedEvent.name}</h3>
                  <p className="text-sm text-gray-500">Event ID: {selectedEvent._id}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-green-600">{formatIndianCurrency(selectedEvent.discountPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-medium">{selectedEvent.stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sold Out:</span>
                    <span className="font-medium">{selectedEvent.sold_out}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{new Date(selectedEvent.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{new Date(selectedEvent.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}
              </div>

              {/* Event Image */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Event Image</h4>
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={selectedEvent.images[0]?.url}
                    alt={selectedEvent.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEvents;
