import React, { useState, useEffect } from "react";
import { AddDataModal } from "./AddModalPengaduan";
import { EditDataModal } from "./EditModalPengaduan";
import Button from "../components/common/Button";

export const PengaduanWarga = () => {
  const [dataList, setDataList] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [shouldFetchData, setShouldFetchData] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000");
        const data = await response.json();
        if (Array.isArray(data)) {
          setDataList(data);
        } else {
          console.error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [shouldFetchData]);

  // Add data
  const handleAddData = async (newData) => {
    try {
      const response = await fetch("http://localhost:8000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        setShouldFetchData((prev) => !prev); // Trigger refetch
        setAddModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  // Edit data
  const handleEditData = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:8000/${updatedData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setShouldFetchData((prev) => !prev); // Trigger refetch
        setEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  // Delete data
  const handleDeleteData = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setShouldFetchData((prev) => !prev); // Trigger refetch
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (data) => {
    setSelectedData(data); // Set selectedData sesuai dengan item yang dipilih
    setEditModalOpen(true); // Buka modal edit
  };

  return (
    <div className="p-6">
      <Button
        onClick={() => setAddModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Tambah Data
      </Button>

      {/* Tabel Data */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Complain</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dataList.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                Tidak ada data.
              </td>
            </tr>
          ) : (
            dataList.map((data) => (
              <tr key={data.id}>
                <td className="border px-4 py-2">{data.nama}</td>
                <td className="border px-4 py-2">{data.complain}</td>
                <td className="border px-4 py-2">
                  {data.status === "pending" ? "Pending" : "Selesai"}
                </td>
                <td className="border px-4 py-2 flex gap-2">
                  <Button
                    onClick={() => handleOpenEditModal(data)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteData(data.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modals */}
      <AddDataModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddData}
      />
      {selectedData && (
        <EditDataModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleEditData}
          data={selectedData} // Data yang akan diedit
        />
      )}
    </div>
  );
};