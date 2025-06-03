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
        <>
            {/* categories */}
            <div
                className={`${styles.section} bg-white p-6 rounded-lg mb-12`}
                id="categories"
            >
                {loading ? (
                    <div className="text-center">Loading categories...</div>
                ) : (
                    <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
                        {categories.map((category) => {
                            const handleSubmit = () => {
                                navigate(`/products?category=${category.name}`);
                            }
                            return (
                                <div
                                    className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden"
                                    key={category._id}
                                    onClick={handleSubmit}
                                >
                                    <h5 className={`text-[18px] leading-[1.3]`}>{category.name}</h5>
                                    {category.image && (
                                        <img
                                            src={category.image}
                                            className="w-[120px] object-cover"
                                            alt={category.name}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}

export default Categories