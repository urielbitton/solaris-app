import React from 'react';
import { useHistory } from "react-router-dom";
import { convertFireDateToString } from "../../utils/utilities";

export default function StudentRow(props) {

  const { firstName, lastName, email, userID, photoURL, city, country, dateCreated } = props.student
  const history = useHistory()

  return (
    <div 
      className="admin-row student-row"
      onClick={() => history.push(`/profile/${userID}`)}
    >
      <h6 className="with-img">
        <img src={photoURL} alt="" />
        {firstName} {lastName}
      </h6>
      <h6 className="medium">{email}</h6>
      <h6 className="medium">{userID}</h6>
      <h6>{city}</h6>
      <h6>{country}</h6>
      <h6>{convertFireDateToString(dateCreated)}</h6>
    </div>
  )
}
