import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../index";
import { toast } from 'react-toastify';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const Doctors = () => {

  const [doctors, setDoctors] = useState([]);
  const {isAuthenticated} = useContext(Context);

  useEffect(() => {
    const fetchDoctor = async() => {
      try {
        const { data } = await axios.get("/api/v1/user/doctors", 
          {withCredentials : true}
        );
        setDoctors(data.doctor); 
      } 
      catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchDoctor();
  }, []);

  if(!isAuthenticated){
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <section className='page doctors'>
        <h1>DOCTORS</h1>
        <div className='banner'>
          {
            doctors && doctors.length > 0 ? (doctors.map(element => {
              return(
                <div className="card">
                  <img src={element.docAvatar && element.docAvatar.url} alt='Doctor Avator'/>
                  <h4>{`${element.firstName} ${element.lastName}`}</h4>
                  <div className="details">
                    <p>
                      Email : <sapn>{element.email}</sapn>
                    </p>
                    <p>
                      Phone : <sapn>{element.phone}</sapn>
                    </p>
                    <p>
                      DOB : <sapn>{element.dob.substring(0, 10)}</sapn>
                    </p>
                    <p>
                      Department : <sapn>{element.doctorDepartment}</sapn>
                    </p>
                    <p>
                      UID : <sapn>{element.uid}</sapn>
                    </p>
                    <p>
                      Gender : <sapn>{element.gender}</sapn>
                    </p>
                  </div>
                </div>
              )
            })) : <h1>No Registered Doctors Found !</h1>
          }
        </div>
      </section>
    </>
  )
}

export default Doctors;