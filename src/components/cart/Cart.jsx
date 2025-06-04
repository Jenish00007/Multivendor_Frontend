import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { backend_url } from "../../server";
import { addTocart, removeFromCart } from "../../redux/actions/cart";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  //remove from cart
  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  // Total price
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // Format price in Indian currency
  const formatIndianPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {cart && cart.length == 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Cart items is empot!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5 ">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              {/* item length */}
              <div className={`${styles.noramlFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {cart && cart.length} items
                </h5>
              </div>

              {/* Cart Single item */}
              <br />
              <div className="w-full border-t">
                {cart &&
                  cart.map((i, index) => {
                    return (
                      <CartSingle
                        data={i}
                        key={index}
                        quantityChangeHandler={quantityChangeHandler}
                        removeFromCartHandler={removeFromCartHandler}
                      />
                    );
                  })}
              </div>
            </div>

            <div className="px-5 mb-3">
              {/* Check out btn */}
              <Link to="/checkout">
                <div
                  className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px] hover:bg-[#d13a3a] transition-colors duration-300`}
                >
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                    Checkout Now ({formatIndianPrice(totalPrice)})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  // Format price in Indian currency
  const formatIndianPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const increment = (data) => {
    if (data.stock < value) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };

  // Decrement
  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  const getImageUrl = () => {
    if (!data.images || data.images.length === 0) {
      return "https://via.placeholder.com/130x130?text=No+Image";
    }

    const image = data.images[0];
    if (typeof image === 'string') {
      if (image.startsWith('http')) {
        return image;
      }
      return `${backend_url}/${image}`;
    }
    
    if (image.url) {
      if (image.url.startsWith('http')) {
        return image.url;
      }
      return `${backend_url}/${image.url}`;
    }

    return "https://via.placeholder.com/130x130?text=No+Image";
  };

  return (
    <>
      <div className="border-b p-4 hover:bg-gray-50 transition-colors duration-200">
        <div className="w-full flex items-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer hover:bg-[#d13a3a] transition-colors duration-200`}
              onClick={() => increment(data)}
            >
              <HiPlus size={18} color="#fff" />
            </div>
            <span className="font-medium">{data.qty}</span>
            <div
              className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer hover:bg-[#8f939b4f] transition-colors duration-200"
              onClick={() => decrement(data)}
            >
              <HiOutlineMinus size={16} color="#7d879c" />
            </div>
          </div>
          <img
            src={getImageUrl()}
            className="w-[130px] h-[130px] ml-2 mr-2 rounded-[5px] object-cover"
            alt={data.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/130x130?text=No+Image";
            }}
          />

          <div className="pl-[15px] flex-1">
            <h1 className="font-medium text-gray-800">{data.name}</h1>
            <h4 className="font-[400] text-[15px] text-[#00000082]">
              {formatIndianPrice(data.discountPrice)} × {value}
            </h4>
            <h4 className="font-[500] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
              {formatIndianPrice(totalPrice)}
            </h4>
          </div>
          <RxCross1
            size={20}
            color="#7d879c"
            className="cursor-pointer hover:text-red-500 transition-colors duration-200"
            onClick={() => removeFromCartHandler(data)}
          />
        </div>
      </div>
    </>
  );
};

export default Cart;
