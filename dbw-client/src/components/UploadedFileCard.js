import React from 'react'
import {Dropdown, Menu} from "antd";
import FileIcon from "../Assets/FileIcon.svg";
import VertDotsIcon from "../Assets/VertDots.svg";
import { useSelector } from 'react-redux';
import axios from 'axios';



const UploadedFileCard = (props) => {
    const user = useSelector((state) => state.userReducer);

    const downloadFile = async () => {
        await axios({
            url: `http://localhost:8080/load?file=${props.fileHash}`, //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', props.fileName); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    const FileMenu = (
        <Menu className="">
            <Menu.Item key={1}>
                Check
            </Menu.Item>
            {user.id===props.ownerId ? 
            <Menu.Item key={3}>
            Block
            </Menu.Item>
            :
            <Menu.Item key={4}>
                Request Unblock
            </Menu.Item>
            }
            <Menu.Item key={5} onClick={downloadFile}>
                Download
            </Menu.Item>
        </Menu>
    )
  return (
    <div className="flex flex-row items-center justify-around p-3">
            <img src={FileIcon} alt=""/>
            <div className="flex flex-col grow ml-4 justify-center">
                <h1>{props.fileName}</h1>
                {/* <h3 className="w-[185px] h-[16px] font-normal text-[12px] leading-[12px]" >5 MB <span className="
                text-[16px] font-bold
                ">.</span> 11-11-1111 <span className="
                text-[16px] font-bold
                ">.</span> <span className=" text-[#EB5757] font-normal text-[12px]">13 days left</span> </h3> */}
            </div>
            <div>
            <Dropdown overlay={FileMenu} trigger={['click']} position="bottomRight">
            <img className="cursor-pointer" src={VertDotsIcon} alt=""/>
            </Dropdown>
            </div>
        </div>
  )
}

export default UploadedFileCard;