import React from 'react';
import './styles/FileItem.css'
import { fileTypeConverter, truncateText } from "../../utils/utilities";

export default function FileItem(props) {

  const { file, customType, deleteClick, showDelete, truncateTextAmount=30 } = props

  return (
    <div
      className='file-item'
      title={file.fileName}
    >
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
          <h6>
            {truncateText(!customType ? file.name : file.fileName, truncateTextAmount)}
          </h6>
          <small>{fileTypeConverter(!customType ? file.type : file.fileType).name} file</small>
        </div>
        <div className="options-container download-container">
          <a 
            href={file.file} 
            download
          >
            <i className="fal fa-cloud-download"></i>
          </a>
        </div>
        { showDelete ?
          <div 
            className="options-container delete-container"
            onClick={() => deleteClick()}
          >
            <i className="fal fa-trash-alt"></i>
          </div> :
          <></>
        }
    </div>
  )
}
