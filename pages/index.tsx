import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { prisma } from '../lib/prisma'
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import jwtDecode from 'jwt-decode';

function Login() {
    const [Username, setUsername] = useState("");
    const [Password, setPassword] = useState("");
    const router = useRouter()

    const onSubmit = () => {
        
        const data = {
            username: Username,
            password: Password,
        };
        
        console.log("kelucuan");
        axios.post("http://localhost:3000/api/login", data).then((response) => {
            localStorage.setItem("usertoken", response.data.data);
            const payload = jwtDecode(response.data.data);
            console.log(payload);
            console.log(payload['id']);
            router.push("/user/" + payload['id'])
        }).catch((error) => {console.log(error);});
    }

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden bg-orange-200">
            <div className="w-full p-6 m-auto bg-orange-100 rounded-md shadow-md lg:max-w-md">
                <div>
                        <h3 className="text-4xl font-bold text-orange-600 text-center">
                            Login
                        </h3>
                </div>
                <form className="mt-6" onSubmit={e => {e.preventDefault()}}>
                    <div className="mb-2">
                        <label
                            htmlFor="username"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            name='username'
                            value={Username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name='password'
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mt-6">
                        <button onClick={onSubmit} className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-orange-700 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600">
                            Masuk
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-xs font-light text-center text-gray-700">
                    {" "}
                    Dont have an account?{" "}
                    <a
                        href="registration"
                        className="font-medium text-orange-600 hover:underline"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
  )
}

export default Login;
