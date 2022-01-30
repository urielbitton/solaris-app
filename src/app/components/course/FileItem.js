import React from 'react';
import './styles/FileItem.css'
import { fileTypeConverter, truncateText } from "../../utils/utilities";

export default function FileItem(props) {

  const { file, customType } = props

  return <div className='file-item'>
    <div 
      className='icon-container' 
      style={{background: `${fileTypeConverter(!customType ? file.type : file.fileType).color}33`}}
    >
      <i 
        className={fileTypeConverter(!customType ? file.type : file.fileType).icon} 
        style={{color: fileTypeConverter(!customType ? file.type : file.fileType).color}}
      ></i>
    </div>
    <div className='file-name'>
      <h6 
        title={file.name}
      >
        {truncateText(!customType ? file.name : file.fileName, 30)}
      </h6>
      <small>{fileTypeConverter(!customType ? file.type : file.fileType).name} file</small>
    </div>
  </div>
}
