import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import styles from '../../../styles/styles'
import axios from "axios";
import { server } from "../../../server";

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${server}/categories`);
            setCategories(response.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setLoading(false);
        }
    };

    return (
        <div className="w-full py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Shop by Categories</h2>
                
                {loading ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                        {categories.map((category) => {
                            const handleSubmit = () => {
                                navigate(`/products?category=${category.name}`);
                            }
                            return (
                                <div
                                    className="group relative bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer flex flex-col items-center"
                                    key={category._id}
                                    onClick={handleSubmit}
                                >
                                    <div className="w-full aspect-square rounded-t-xl sm:rounded-t-2xl overflow-hidden">
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                alt={category.name}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400 text-sm">No image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 sm:p-4 text-center w-full">
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                            {category.name}
                                        </h3>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
                
                {!loading && categories.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                        <p className="text-gray-500 text-base sm:text-lg">No categories found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Categories