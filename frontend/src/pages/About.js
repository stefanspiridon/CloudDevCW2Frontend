import React from "react";
import Navbar from "../components/Navbar";
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'

function About() {
  return (
    <div className="about">
        <Navbar />
        <h1>About Us</h1>
    </div>
  );
}

export default About;
