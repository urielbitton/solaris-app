import React from 'react'
import './styles/AppInputs.css'

export function AppInput(props) {
 
  const {title, iconclass, className, descriptText} = props
   
  return ( 
    <label className={`appinput commoninput ${className?className:""} ${descriptText?"descriptinput":""}`}> 
      { title && <h6>{title}</h6> }
      <i className={iconclass}></i> 
      {
        descriptText?<div>
          <input style={{paddingRight: iconclass?"40px":"10px"}} {...props} />
          <span></span>
          <small className="descript">{descriptText}</small>
        </div>:
        <input style={{paddingRight: iconclass?"40px":"10px"}} {...props} />
      }
    </label>
  )   
}     

export function AppSelect(props) {
  const { options, namebased, title, onChange, onClick, value, className} = props
  let optionsdata = options?.map((data,i) =>
    <option key={i} selected={data.selected} disabled={data.disabled} value={namebased?data.value:data.name?data.name.toLowerCase():data.name} name={namebased?data.name:null}>  
        {data.name}
    </option>
  )  
  return ( 
    <label className={`appselect commoninput ${className?className:""}`} onClick={(e) => onClick&&onClick(e)}>
      <h6>{title}</h6>
      <select onChange={(e) => onChange(e)} value={value}>
        {optionsdata}
      </select>
    </label>
  )
} 

export function AppTextarea(props) {
 
  const {title, iconclass, className} = props
   
  return ( 
    <label className={`apptextarea commoninput ${className?className:""}`}> 
      <h6>{title}</h6>
      <i className={iconclass}></i> 
      <textarea style={{paddingRight: iconclass?"40px":"10px"}} {...props} />
    </label>
  )   
} 
 
export function AppSwitch(props) { 

  const {iconclass,title,onChange,checked, className} = props

  return (   
    <div className={`appswitch commoninput ${className?className:""}`}>  
    <h6><i className={iconclass}></i>{title}</h6> 
    <label className="form-switch">
        <input type="checkbox" onChange={(e) => onChange(e)} checked={checked}/>
        <i></i> 
    </label>   
    </div>
  )  
} 

