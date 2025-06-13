import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaUserShield } from "react-icons/fa";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { loadUser } from '../../redux/actions/user';

const AdminLogin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [visible, setVisible] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('Attempting admin login...');
            const response = await axios.post(
                `${server}/user/login-admin`,
                {
                    email,
                    password,
                },
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            console.log('Admin login response:', response.data);

            // Store the admin token
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                console.log('Admin token stored in localStorage');
                
                // Set default authorization header for all future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }

            // Load user data
            console.log('Dispatching loadUser action...');
            await dispatch(loadUser());
            
            toast.success("Admin Login Success!");
            navigate("/admin/dashboard");
        } catch (err) {
            console.error('Admin login error:', err);
            toast.error(err.response?.data?.message || "Admin login failed");
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <div className="flex justify-center">
                    <FaUserShield className="text-5xl text-blue-600" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Admin Login
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Please sign in to your admin account
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={visible ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {visible ? (
                                    <AiOutlineEye
                                        className="absolute right-2 top-2 cursor-pointer"
                                        size={25}
                                        onClick={() => setVisible(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="absolute right-2 top-2 cursor-pointer"
                                        size={25}
                                        onClick={() => setVisible(true)}
                                    />
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin; 