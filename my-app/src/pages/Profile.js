// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    headline: "",
    about: "",
    skills: "",
    education: "",
    experience: "",
  });

  useEffect(() => {
    axios.get("/api/user/me").then(res => {
      const { fullName, headline, about, skills, education, experience } = res.data;
      setFormData(prev => ({
        ...prev,
        fullName: fullName || "",
        headline: headline || "",
        about: about || "",
        skills: skills || "",
        education: education || "",
        experience: experience || "",
      }));
    });
  }, []);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put("/api/user/profile", formData);
      alert("Profile submitted. Wait for admin approval.");
    } catch (err) {
      console.error(err);
      alert("Profile update failed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["fullName", "headline", "about", "skills", "education", "experience"].map(field => (
          <div key={field}>
            <label className="block font-medium">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default Profile;
