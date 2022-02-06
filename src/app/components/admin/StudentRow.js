import React from 'react';
import { useHistory } from "react-router-dom";
import { convertFireDateToString, truncateText } from "../../utils/utilities";

export default function StudentRow(props) {

  const { firstName, lastName, email, userID, photoURL, city, country, dateCreated } = props.student
  const history = useHistory()

  return (
    <div 
      className="admin-row student-row"
      onClick={() => history.push(`/profile/${userID}`)}
    >
      <h6 className="with-img medium">
        <img src={photoURL} alt="" />
        {firstName} {lastName}
      </h6>
      <h6 title={email} className="medium">{truncateText(email, 25)}</h6>
      <h6 title={userID} className="medium">{truncateText(userID, 25)}</h6>
      <h6>{city}</h6>
      <h6>{country}</h6>
      <h6>{convertFireDateToString(dateCreated)}</h6>
    </div>
  )
}
