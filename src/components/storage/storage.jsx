import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import TambahStorage from "./tambahstorage"; // Komponen untuk menambah storage
import EditStorage from "./editStorage"; // Komponen untuk mengedit storage
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";

const Storage = () => {
  const [project, setProject] = useState(null);
  const [storages, setStorages] = useState([]);
  const [showAddStorage, setShowAddStorage] = useState(false);
  const [showEditStorage, setShowEditStorage] = useState(false);
  const [currentStorage, setCurrentStorage] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectGuid = localStorage.getItem("currentProjectGuid");
        if (projectGuid) {
          const projectResponse = await axios.get(
            `${apiUrl}/projects/${projectGuid}`
          );
          setProject(projectResponse.data);

          const storagesResponse = await axios.get(
            `${apiUrl}/storages/by-project/${projectGuid}`
          );
          setStorages(storagesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching project or storages:", error);
      }
    };

    fetchProjectDetails();
  }, [apiUrl]);

  const handleAddStorage = (newStorage) => {
    setStorages((prevStorages) => [...prevStorages, newStorage]);
    setShowAddStorage(false);
    Swal.fire("Sukses", "Storage berhasil ditambahkan!", "success");
  };

  const handleEditStorage = (storage) => {
    setCurrentStorage(storage);
    setShowEditStorage(true);
  };

  const handleAddHost = () => {
    navigate("/hoststorage");
  };

  const handleStorageUpdated = (updatedStorage) => {
    setStorages((prevStorages) =>
      prevStorages.map((storage) =>
        storage.guid === updatedStorage.guid ? updatedStorage : storage
      )
    );
    setShowEditStorage(false);
  };

  const handleDeleteStorage = async (storage) => {
    const confirmDelete = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(
          `${apiUrl}/storages/${storage.guid}`
        );
        if (response.status === 200) {
          setStorages((prevStorages) =>
            prevStorages.filter((s) => s.guid !== storage.guid)
          );
          Swal.fire("Terhapus!", "Storage berhasil dihapus.", "success");
        }
      } catch (error) {
        console.error("Error deleting storage:", error);
        Swal.fire("Gagal", "Gagal menghapus storage.", "error");
      }
    }
  };

  if (!project) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <TailSpin height="60" width="60" color="#226195" ariaLabel="loading" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="d-flex flex-grow-1">
        <Sidebar />

        <div className="flex-grow-1 p-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Storage: {project.name}</h2>
            <div>
              <button className="btn btn-primary me-2" onClick={handleAddHost}>
                <i className="fas me-1"></i>Host
              </button>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddStorage(true)}
            >
              <i className="fas fa-plus me-1"></i>Tambah Storage
            </button>
          </div>

          {showAddStorage && (
            <TambahStorage
              onClose={() => setShowAddStorage(false)}
              onStorageAdded={handleAddStorage}
            />
          )}

          {showEditStorage && (
            <EditStorage
              storage={currentStorage}
              onClose={() => setShowEditStorage(false)}
              onStorageUpdated={handleStorageUpdated}
            />
          )}

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Host</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Nama Directory</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {storages.length > 0 ? (
                  storages.map((storage) => (
                    <tr key={storage.guid}>
                      <td>{storage.host}</td>
                      <td>{storage.username}</td>
                      <td>{storage.password}</td>
                      <td>{storage.directoryName}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleEditStorage(storage)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteStorage(storage)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Tidak ada storage yang tersedia
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storage;
