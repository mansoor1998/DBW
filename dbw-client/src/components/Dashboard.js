import React, { useEffect,useState } from 'react'
import { useForm } from 'react-hook-form';
import {useSelector} from 'react-redux';
import axios from 'axios';
import UploadedFileCard from './UploadedFileCard';
const Dashboard = () => {

    const user = useSelector((state) => state.userReducer);
    const [files, setFiles] = useState([]);
   
    const { register, handleSubmit, resetField } = useForm();
    const [autoTrigger, setAutoTrigger] = useState();
    const onSubmit = async (data) => {

        console.log(data.file[0])
        await axios.post("http://localhost:8080/stats", {
            uploaded_file:data.file[0],
            user_id:user.id,
            user_name:user.username,
        },{headers: {
            'Content-Type': 'multipart/form-data'
          }}).then((res) => {
            setAutoTrigger(res)
            resetField("file")
        }).catch(err => console.log(err))   
    
    }
    //dfdfsdf

    const getAllFiles = async () => {
        await axios.get("http://localhost:8080/getallfiles").then((res) => {
           setFiles(res.data.rows); 
        })
    }

    useEffect(() => {
        getAllFiles();
    }, [autoTrigger])

  return (
   <>
   <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 pb-3 overflow-scroll scrollbar-hide">
              <div className="sticky top-0 bg-white w-full h-12 p-2">
              <form onSubmit={handleSubmit(onSubmit)} className="flex w-full pl-3">
                <input type="file" {...register('file')} className="border-[1px] border-solid border-[#ccc]"/>
                <button className="bg-gray-800 text-white w-20 rounded-md ml-2 hover:bg-gray-700">Submit</button>
              </form>
              </div>
              {files && files.map((file, key) => (
                <div key={key}>
                    <UploadedFileCard fileName={file.file_name} ownerId={file.owner_id} fileHash={file.file_hash} blockedStatus={file.blocked_status}/>
                </div>
              ))}
              </div>
            </div>
            {/* /End replace */}   
          </div>
        </main>
   </>
  )
}

export default Dashboard