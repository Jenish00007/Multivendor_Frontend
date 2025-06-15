import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import {
    AiFillHeart,
    AiFillStar,
    AiOutlineEye,
    AiOutlineHeart,
    AiOutlineShoppingCart,
    AiOutlineStar,
    AiOutlineTag,
    AiOutlineShop,
    AiOutlineFire,
} from "react-icons/ai";
import { backend_url } from "../../../server";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard.jsx";
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '../../../redux/actions/wishlist';
import { addTocart } from '../../../redux/actions/cart';
import { toast } from 'react-toastify';
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data, isEvent }) => {
    const { wishlist } = useSelector((state) => state.wishlist);
    const { cart } = useSelector((state) => state.cart);
    const [click, setClick] = useState(false);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (wishlist && wishlist.find((i) => i._id === data._id)) {
            setClick(true);
        } else {
            setClick(false);
        }
    }, [wishlist]);

    const removeFromWishlistHandler = (data) => {
        setClick(!click);
        dispatch(removeFromWishlist(data));
    }

    const addToWishlistHandler = (data) => {
        setClick(!click);
        dispatch(addToWishlist(data))
    }

    const addToCartHandler = (id) => {
        const isItemExists = cart && cart.find((i) => i._id === id);
        if (isItemExists) {
            toast.error("Item already in cart!")
        } else {
            if (data.stock < 1) {
                toast.error("Product stock limited!")
            } else {
                const cartData = { ...data, qty: 1 };
                dispatch(addTocart(cartData));
                toast.success("Item added to cart successfully!")
            }
        }
    }

    const getImageUrl = () => {
        if (!data.images || data.images.length === 0) {
            return "https://via.placeholder.com/400x400?text=No+Image";
        }

        const image = data.images[0];
        if (typeof image === 'string') {
            if (image.startsWith('http')) {
                return image;
            }
            return image;
        }
        
        if (image.url) {
            if (image.url.startsWith('http')) {
                return image.url;
            }
            return image.url;
        }

        return "https://via.placeholder.com/400x400?text=No+Image";
    };

    return (
        <div className='w-full h-auto min-h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer'>
            <div className='flex justify-end'>
                {click ? (
                    <AiFillHeart
                        size={28}
                        className="cursor-pointer absolute right-4 top-4 text-red-500 transform transition-all duration-300 hover:scale-110 z-10 p-2 bg-white/80 rounded-full shadow-sm hover:shadow-md"
                        onClick={() => removeFromWishlistHandler(data)}
                        title='Remove from wishlist'
                    />
                ) : (
                    <AiOutlineHeart
                        size={28}
                        className="cursor-pointer absolute right-4 top-4 text-gray-600 transform transition-all duration-300 hover:scale-110 z-10 p-2 bg-white/80 rounded-full shadow-sm hover:shadow-md"
                        onClick={() => addToWishlistHandler(data)}
                        title='Add to wishlist'
                    />
                )}
            </div>

            <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
                <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-50">
                    <img
                        src={getImageUrl()}
                        alt={data.name}
                        className='w-full h-full object-contain transform transition-transform duration-300 hover:scale-110'
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                        }}
                    />
                    {data.discountPrice && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm flex items-center">
                            <AiOutlineTag className="mr-1" />
                            {Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}% OFF
                        </div>
                    )}
                </div>
            </Link>

            <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
                <div className="flex items-center mt-2">
                    <img 
                        src={data?.shop?.avatar ? data.shop.avatar : "https://via.placeholder.com/30x30?text=Shop"}
                        alt={data?.shop?.name || "Shop"}
                        className="w-6 h-6 rounded-full object-cover mr-2"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/30x30?text=Shop";
                        }}
                    />
                    <h5 className={`${styles.shop_name} text-blue-500 truncate`}>{data?.shop?.name || "Shop"}</h5>
                </div>
            </Link>

            <Link to={`/product/${data._id}`}>
                <h4 className='pb-3 font-[500] text-gray-800 hover:text-blue-500 transition-colors duration-300 line-clamp-2 min-h-[3rem]'>
                    {data.name}
                </h4>

                <div className='flex items-center mb-2'>
                    <Ratings rating={data?.ratings} />
                    <span className="text-gray-500 text-sm ml-2">({data?.ratings})</span>
                </div>

                <div className='py-2 flex items-center justify-between flex-wrap gap-2'>
                    <div className='flex items-center'>
                        <h5 className={`${styles.productDiscountPrice} text-red-500 font-bold`}>
                            {data.originalPrice === 0 ? data.originalPrice : data.discountPrice}₹
                        </h5>
                        {data.originalPrice && (
                            <h4 className={`${styles.price} text-gray-500 line-through ml-2`}>
                                {data.originalPrice}₹
                            </h4>
                        )}
                    </div>
                </div>
            </Link>

            <div className="absolute right-4 top-16 z-10">
                <AiOutlineShoppingCart
                    size={30}
                    className="cursor-pointer text-gray-600 transform transition-all duration-300 hover:scale-110 hover:text-green-500 p-2 bg-white/80 rounded-full shadow-sm hover:shadow-md"
                    onClick={() => addToCartHandler(data._id)}
                    title='Add to cart'
                />
            </div>

            {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
    )
}

export default ProductCard