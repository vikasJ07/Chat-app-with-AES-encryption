import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsSend } from "react-icons/bs";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users", {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      alert("Access denied or session expired.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/admin/user/${id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      alert("Error deleting user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Full Name</th>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Gender</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="p-2 border">{user.fullName}</td>
              <td className="p-2 border">{user.username}</td>
              <td className="p-2 border">{user.gender}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border">
                <button
                  onClick={() => deleteUser(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
