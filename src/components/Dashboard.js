import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../index";
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import {GoCheckCircleFill} from "react-icons/go";
import {AiFillCloseCircle} from "react-icons/ai"
import { toast } from 'react-toastify';

const Dashboard = () => {

  const {isAuthenticated, user} = useContext(Context);

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Appointments
  useEffect(() => {
    const fetchAppointment = async() => {
      try {
        const { data } = await axios.get("http://localhost:9000/api/v1/appointment/getall",
          {withCredentials : true}
        );
        setAppointments(data.appointment)
      } 
      catch (error) {
        setAppointments([]);
        console.log("Some Error Occured while fetching appointments !",error);
      }
    };

    fetchAppointment();
  }, [])

  // Doctors
  useEffect(() => {
    const fetchDoctor = async() => {
      try {
        const { data } = await axios.get("http://localhost:9000/api/v1/user/doctors", 
          {withCredentials : true}
        );
        setDoctors(data.doctor); 
      } 
      catch (error) {
        console.log("Some Error Occured while fetching appointments !",error);
      }
    };

    fetchDoctor();
  }, []);

  // Handle Update Status
  const handleUpdateStatus = async (appointmentID, status) => {
    try {
      const { data } = await axios.put(
        `https://hospital-management-system-backend-edeu.onrender.com/api/v1/appointment/update/${appointmentID}`,
        {status},
        {withCredentials : true}
      );
      setAppointments((prevAppointments) => 
        prevAppointments.map((appointment) => 
          appointment._id === appointmentID
          ? {...appointment, status}
          : appointment
        )
      );
      toast.success(data.message);
    } 
    catch (error) {
      toast.error(error.response.data.message);
    }
  }

  if(!isAuthenticated){
    return <Navigate to={"/login"}/>
  }

  return (
    <>
        <section className="dashboard page">
          <div className='banner'>
            <div className="firstBox">
              <img src='../doc.png' alt='docImg' />
              <div className="content">

                <div>
                  <p>Hello ,</p>
                  <h5>
                    {user && `${user.firstName} ${user.lastName}`}
                  </h5>
                </div>

                <p>
                A doctor's dashboard is a centralized digital interface that provides real-time access to patient data, streamlines healthcare management, and enhances clinical decision-making.
                </p>

              </div>
            </div>

            <div className="secondBox">
              <p>Total Appointments</p>
              <h3>{appointments.length}</h3>
            </div>

            <div className="thirdBox">
              <p>Registered Doctors</p>
              <h3>{doctors.length}</h3>
            </div>
          </div>

          <div className='banner'>
            <h5>Appointments</h5>
            <table>

              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Visited</th>
                </tr>
              </thead>

              <tbody>
                {
                  appointments && appointments.length > 0 ? (
                    appointments.map(appointment => {
                      return(
                        <tr key={appointment._id}>
                          <td data-label="Patient">
                            {`${appointment.firstName} ${appointment.lastName}`}
                          </td>
                          <td data-label="Date">
                            {appointment.appointment_date.substring(0,16)}
                          </td>
                          <td data-label="Doctor">
                            {`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                          </td>
                          <td data-label="Department">
                            {appointment.department}
                          </td>
                          <td data-label="Status" className="status">
                            <select 
                              className={
                                appointment.status === "Pending" 
                                ? "value-pending" 
                                : appointment.status === "Rejected" 
                                ? "value-rejected" 
                                : "value-accepted"
                              }
                              value={appointment.status}
                              onChange={(e) => handleUpdateStatus(appointment._id, e.target.value)}  
                            >
                              <option value="Pending" className="value-pending">Pending</option>
                              <option value="Accepted" className="value-accepted">Accepted</option>
                              <option value="Rejected" className="value-rejected">Rejected</option>
                            </select>
                          </td>
                          <td data-label="Visited" className="visited">
                            {
                              appointment.hasVisited === true ? 
                              <GoCheckCircleFill className='green'/> 
                              : 
                              <AiFillCloseCircle className='red'/>
                            }
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <h1>NO APPOINTMENTS !</h1>
                  )
                }
              </tbody>


            </table>
          </div>
        </section>
    </>
  )
}

export default Dashboard;