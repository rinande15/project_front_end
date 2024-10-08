import React, { useState } from "react";
import "./editwebspace.css";
import Swal from "sweetalert2";

function EditWebSpace({ webSpace, onClose, onWebSpaceUpdated }) {
  const [webSpaceData, setWebSpaceData] = useState({ ...webSpace });

  const handleChange = (e) => {
    setWebSpaceData({
      ...webSpaceData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with updated data:", webSpaceData);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/web-spaces/${webSpace.guid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webSpaceData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorResponse.message}`
        );
      }

      // SweetAlert success notification
      Swal.fire({
        title: "Success",
        text: "Web space berhasil diperbarui!",
        icon: "success",
        confirmButtonText: "OK",
      });

      const result = await response.json();
      console.log("Updated web space data from server:", result);
      onWebSpaceUpdated(result);
      onClose();
    } catch (error) {
      console.error("Error updating web space:", error.message);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui web space!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center">
      <div className="modal-content p-4 rounded shadow">
        <div className="modal-header">
          <h2 className="h5">Edit Web Space</h2>
          <button
            className="btn-close ms-auto"
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="host" className="form-label">
                Host
              </label>
              <select
                className="form-select"
                name="host"
                value={webSpaceData.host}
                onChange={handleChange}
                required
              >
                <option value="Nginx">Nginx</option>
                <option value="Apache">Apache</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="url" className="form-label">
                URL
              </label>
              <input
                type="text"
                className="form-control"
                name="url"
                value={webSpaceData.url}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="directory" className="form-label">
                Directory
              </label>
              <input
                type="text"
                className="form-control"
                name="directory"
                value={webSpaceData.directory}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="language" className="form-label">
                Bahasa
              </label>
              <select
                className="form-select"
                name="language"
                value={webSpaceData.language}
                onChange={handleChange}
              >
                <option value="NodeJS">NodeJS</option>
                <option value="Python">Python</option>
              </select>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4 w-100"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditWebSpace;
