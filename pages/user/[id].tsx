import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { prisma } from '../../lib/prisma'
import jwtDecode from 'jwt-decode'
import jwt from 'jsonwebtoken'

import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';


interface Receipts{
  receipts: {
    id: string
    title: string
    content: string
  }[]
}

interface FormData {
  title: string
  content: string
  id: string
}

const Home = ({userId}) => {
  const [form, setForm] = useState<FormData>({title: '', content: '', id: ''})
  const [receipts, setReceipts] = useState([{}]);
  const [change, setChange] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Array.from(getNya().then(e => {
      setReceipts(e)
    }))
  }, [change])

  const refreshData = () => {
    router.replace(router.asPath)
  }
  
  let data = {
    username: "",
    password: "",
  };

  if (typeof window !== "undefined") {
    // Perform localStorage action

    const item = localStorage.getItem("usertoken");

    if (!item) {
      router.push("/index");
      return;
    }
    
    // invalid token - synchronous
    const data_token = jwtDecode(item)
    
  }
  
  async function getNya() {
    const data = await axios.get('http://localhost:3000/api/user/'+ userId['id'], {
    withCredentials: true,
    headers: {
      'Authorization': localStorage.getItem("usertoken"),
    }})
    
    console.log("+=======================")
    console.log(data.data)
    console.log("+=======================")

    return data.data
  }

  async function create(data: FormData) {
    console.log("GET RUN")
    try {
      axios.post('http://localhost:3000/api/create', data, {
        withCredentials: true,
        headers: {
          'Authorization': localStorage.getItem("usertoken"),
        }
      }).then(() => {
        if(data.id) { 
          deleteReceipt(data.id)
          
          setForm({title: '', content: '', id: ''})
          
          refreshData()
        } else {
          setForm({title: '', content: '', id: ''}) 
          refreshData()
        }
      } 

      
        )
    } catch (error) {
      console.log(error);
    }
  }


  async function deleteReceipt(id: string) {
    try {
     axios.delete(`http://localhost:3000/api/receipt/${id}`, {
       headers: {
        withCredentials: true,
        "Content-Type": "application/json",
        'Authorization': localStorage.getItem("usertoken"),
       },
     }).then(() => {
      setChange(!change)
     })
    } catch (error) {
     console.log(error); 
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      console.log(data);
      data = {...data, userId: Number(userId['id'])};
      console.log(data);
      create(data) 
      setChange(!change)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex flex-row p-10 h-screen w-screen'>
        <div className='w-auto min-w-[25%] max-w-min mt-4 mx-auto space-y-6 flex flex-col items-stretch'>
            <h1 className="font-bold text-2xl mt-4 mb-2">Catat Resep Masakan</h1>
            <form onSubmit={e => {
                e.preventDefault()
                handleSubmit(form)
            }} className='w-auto min-w-[100%] max-w-min space-y-6 flex flex-col items-stretch'>
                <input type="text"
                placeholder="Resep Masakan"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nama Resep"
                />

                

                <textarea rows="8" onChange={e => setForm({...form, content: e.target.value})} value={form.content} className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Cara pembuatan..."></textarea>

                {/* <textarea 
                placeholder="Cara Membuat"
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
                className="border-2 rounded border-gray-600 p-1"
                /> */}
                <button type="submit" className="bg-orange-500 hover:bg-orange-400 text-white rounded p-1">Tambah Resep</button>
            </form>
        </div>
        <div className="w-auto min-w-[50%] max-w-min mt-4 mx-auto space-y-6 flex flex-col items-stretch">
            <h1 className="font-bold text-2xl mt-4">Daftar Resep Masakan</h1>
            <ul>
            {receipts.map(receipt => (
                <li key={receipt.id} className="border-b border-gray-600 p-2">
                <div className="flex justify-between">
                    <div className="flex-1">
                    <h3 className="font-bold">{receipt.title}</h3>
                    <p className="text-sm mb-5">{receipt.content}</p>
                    <div className='flex flex-row justify-between'>
                        <button onClick={() => setForm({title: receipt.title, content: receipt.content, id: receipt.id})} className="bg-orange-500 hover:bg-orange-400 mr-3 px-3 h-8 w-[45%] text-white rounded">Edit</button>
                        <button onClick={() => deleteReceipt(receipt.id)} className="bg-red-500 hover:bg-red-400 px-3 h-8 w-[45%] text-white rounded">Hapus</button>
                    </div>
                    </div>
                </div>
                </li>
            ))}
            </ul>
        </div>
    </div>
  )
}

export default Home


export const getServerSideProps: GetServerSideProps = async (context) => {
  
  const userId  = context.params
  console.log(userId['id']);

  


  const receipts = await prisma.receipt.findMany({
    select: {
      title: true,
      id: true,
      content: true
    },
    where : {
      userId:  Number(userId['id'])
    }
  })
  

  return {
    props: {
      userId
    }
  }
}