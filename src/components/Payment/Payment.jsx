import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineShoppingCart } from "react-icons/ai";

const Payment = () => {
    const [orderData, setOrderData] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        try {
            const savedOrderData = JSON.parse(localStorage.getItem("latestOrder"));
            if (!savedOrderData) {
                toast.error("No order data found. Please try again.");
                navigate("/checkout");
                return;
            }
            setOrderData(savedOrderData);
        } catch (error) {
            console.error("Error loading order data:", error);
            toast.error("Error loading order data. Please try again.");
            navigate("/checkout");
        }
    }, [navigate]);

    if (!orderData) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Loading...</h2>
                    <p className="text-gray-600 mt-2">Please wait while we load your order details.</p>
                </div>
            </div>
        );
    }

    // Pay-pal
    const createOrder = (data, actions) => {
        return actions.order
            .create({
                purchase_units: [
                    {
                        description: "Order Payment",
                        amount: {
                            currency_code: "INR",
                            value: orderData?.totalPrice,
                        },
                    },
                ],
                application_context: {
                    shipping_preference: "NO_SHIPPING",
                },
            })
            .then((orderID) => {
                return orderID;
            })
            .catch((error) => {
                console.error("PayPal order creation error:", error);
                toast.error("Error creating PayPal order. Please try again.");
                return null;
            });
    };

    const order = {
        cart: orderData?.cart,
        shippingAddress: orderData?.shippingAddress,
        user: user && user,
        totalPrice: orderData?.totalPrice,
    };

    const onApprove = async (data, actions) => {
        try {
            const details = await actions.order.capture();
            const { payer } = details;
            if (payer) {
                await paypalPaymentHandler(payer);
            }
        } catch (error) {
            console.error("PayPal payment error:", error);
            toast.error("Payment failed. Please try again.");
        }
    };

    const paypalPaymentHandler = async (paymentInfo) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            order.paymentInfo = {
                id: paymentInfo.payer_id,
                status: "succeeded",
                type: "Paypal",
            };

            await axios.post(`${server}/order/create-order`, order, config);
            setOpen(false);
            navigate("/order/success");
            toast.success("Order successful!");
            localStorage.setItem("cartItems", JSON.stringify([]));
            localStorage.setItem("latestOrder", JSON.stringify([]));
            window.location.reload();
        } catch (error) {
            console.error("PayPal payment processing error:", error);
            toast.error("Error processing payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const paymentData = {
        amount: Math.round(orderData?.totalPrice * 100),
    };

    const paymentHandler = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            toast.error("Payment system is not ready. Please try again.");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.post(
                `${server}/payment/process`,
                paymentData,
                config
            );

            const client_secret = data.client_secret;
            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                },
            });

            if (result.error) {
                toast.error(result.error.message);
            } else if (result.paymentIntent.status === "succeeded") {
                order.paymentInfo = {
                    id: result.paymentIntent.id,
                    status: result.paymentIntent.status,
                    type: "Credit Card",
                };

                await axios.post(`${server}/order/create-order`, order, config);
                setOpen(false);
                navigate("/order/success");
                toast.success("Order successful!");
                localStorage.setItem("cartItems", JSON.stringify([]));
                localStorage.setItem("latestOrder", JSON.stringify([]));
                window.location.reload();
            }
        } catch (error) {
            console.error("Payment processing error:", error);
            toast.error("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const cashOnDeliveryHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            order.paymentInfo = {
                type: "Cash On Delivery",
            };

            await axios.post(`${server}/order/create-order`, order, config);
            setOpen(false);
            navigate("/order/success");
            toast.success("Order successful!");
            localStorage.setItem("cartItems", JSON.stringify([]));
            localStorage.setItem("latestOrder", JSON.stringify([]));
            window.location.reload();
        } catch (error) {
            console.error("COD order creation error:", error);
            toast.error("Error creating order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center py-8">
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-3 text-gray-700">Processing payment...</p>
                    </div>
                </div>
            )}
            <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
                <div className="w-full 800px:w-[65%]">
                    <PaymentInfo
                        user={user}
                        open={open}
                        setOpen={setOpen}
                        onApprove={onApprove}
                        createOrder={createOrder}
                        paymentHandler={paymentHandler}
                        cashOnDeliveryHandler={cashOnDeliveryHandler}
                        loading={loading}
                    />
                </div>
                <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
                    <CartData orderData={orderData} />
                </div>
            </div>
        </div>
    );
};

const PaymentInfo = ({
    user,
    open,
    setOpen,
    onApprove,
    createOrder,
    paymentHandler,
    cashOnDeliveryHandler,
    loading,
}) => {
    const [select, setSelect] = useState(1);

    return (
        <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
            {/* select buttons */}
            <div>
                <div className="flex w-full pb-5 border-b mb-2">
                    <div
                        className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center cursor-pointer"
                        onClick={() => setSelect(1)}
                    >
                        {select === 1 ? (
                            <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
                        ) : null}
                    </div>
                    <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                        Pay with Debit/credit card
                    </h4>
                </div>

                {/* pay with card */}
                {select === 1 ? (
                    <div className="w-full flex border-b">
                        <form className="w-full" onSubmit={paymentHandler}>
                            <div className="w-full flex pb-3">
                                <div className="w-[50%]">
                                    <label className="block pb-2">Name on Card</label>
                                    <input
                                        required
                                        value={user && user.name}
                                        className={`${styles.input} !w-[95%]`}
                                        readOnly
                                    />
                                </div>
                                <div className="w-[50%]">
                                    <label className="block pb-2">Exp Date</label>
                                    <CardExpiryElement
                                        className={`${styles.input} !h-[35px]`}
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: "19px",
                                                    lineHeight: 1.5,
                                                    color: "#444",
                                                },
                                                empty: {
                                                    color: "#3a120a",
                                                    backgroundColor: "transparent",
                                                    "::placeholder": {
                                                        color: "#444",
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="w-full flex pb-3">
                                <div className="w-[50%]">
                                    <label className="block pb-2">Card Number</label>
                                    <CardNumberElement
                                        className={`${styles.input} !h-[35px]`}
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: "19px",
                                                    lineHeight: 1.5,
                                                    color: "#444",
                                                },
                                                empty: {
                                                    color: "#3a120a",
                                                    backgroundColor: "transparent",
                                                    "::placeholder": {
                                                        color: "#444",
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                                <div className="w-[50%]">
                                    <label className="block pb-2">CVV</label>
                                    <CardCvcElement
                                        className={`${styles.input} !h-[35px]`}
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: "19px",
                                                    lineHeight: 1.5,
                                                    color: "#444",
                                                },
                                                empty: {
                                                    color: "#3a120a",
                                                    backgroundColor: "transparent",
                                                    "::placeholder": {
                                                        color: "#444",
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                            <input
                                type="submit"
                                value={loading ? "Processing..." : "Submit"}
                                disabled={loading}
                                className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600] ${
                                    loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            />
                        </form>
                    </div>
                ) : null}
            </div>

            <br />
            {/* paypal payment */}
            <div>
                <div className="flex w-full pb-5 border-b mb-2">
                    <div
                        className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center cursor-pointer"
                        onClick={() => setSelect(2)}
                    >
                        {select === 2 ? (
                            <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
                        ) : null}
                    </div>
                    <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                        Pay with Paypal
                    </h4>
                </div>

                {/* pay with payment  */}
                {select === 2 ? (
                    <div>
                        <div
                            className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600] ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            onClick={() => !loading && setOpen(true)}
                        >
                            {loading ? "Processing..." : "Pay Now"}
                        </div>
                        {open && (
                            <div className="w-full fixed top-0 left-0 bg-[#00000039] h-screen flex items-center justify-center z-[99999]">
                                <div className="w-full 800px:w-[40%] h-screen 800px:h-[80vh] bg-white rounded-[5px] shadow flex flex-col justify-center p-8 relative overflow-y-scroll">
                                    <div className="w-full flex justify-end p-3">
                                        <RxCross1
                                            size={30}
                                            className="cursor-pointer absolute top-5 right-3"
                                            onClick={() => setOpen(false)}
                                        />
                                    </div>
                                    <PayPalScriptProvider
                                        options={{
                                            "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
                                            currency: "INR",
                                        }}
                                    >
                                        <PayPalButtons
                                            style={{ layout: "vertical" }}
                                            onApprove={onApprove}
                                            createOrder={createOrder}
                                            disabled={loading}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>

            <br />
            {/* cash on delivery */}
            <div>
                <div className="flex w-full pb-5 border-b mb-2">
                    <div
                        className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center cursor-pointer"
                        onClick={() => setSelect(3)}
                    >
                        {select === 3 ? (
                            <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
                        ) : null}
                    </div>
                    <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                        Cash on Delivery
                    </h4>
                </div>

                {select === 3 ? (
                    <div>
                        <button
                            className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600] ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            onClick={cashOnDeliveryHandler}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Confirm Order"}
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

const CartData = ({ orderData }) => {
    return (
        <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
            <div className="flex items-center">
                <AiOutlineShoppingCart size={25} className="mr-2" />
                <h3 className="text-[20px] font-[500]">Order Summary</h3>
            </div>
            <div className="mt-4">
                <div className="flex justify-between pb-3">
                    <h3 className="text-[18px] font-[400]">Subtotal:</h3>
                    <h5 className="text-[18px] font-[600]">₹{orderData?.subTotalPrice}</h5>
                </div>
                <div className="flex justify-between pb-3">
                    <h3 className="text-[18px] font-[400]">Shipping:</h3>
                    <h5 className="text-[18px] font-[600]">₹{orderData?.shipping}</h5>
                </div>
                <div className="flex justify-between pb-3">
                    <h3 className="text-[18px] font-[400]">Tax:</h3>
                    <h5 className="text-[18px] font-[600]">₹{orderData?.tax}</h5>
                </div>
                <div className="flex justify-between pb-3">
                    <h3 className="text-[18px] font-[400]">Total:</h3>
                    <h5 className="text-[18px] font-[600]">₹{orderData?.totalPrice}</h5>
                </div>
            </div>
        </div>
    );
};

export default Payment;