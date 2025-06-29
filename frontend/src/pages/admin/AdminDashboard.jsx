import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useGetUsers from "../../hooks/useGetUsers";
import useRemoveUser from "../../hooks/useRemoveUser";
import { FaUsers, FaUserCheck, FaUserTimes, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const { users, loading } = useGetUsers();
  const { removeUser } = useRemoveUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("fullName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!authUser || authUser.role !== "admin") {
      navigate("/login");
    }
  }, [authUser, navigate]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRemoveUser = async (userId) => {
    setSelectedUser(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await removeUser(selectedUser);
      toast.success("User removed successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = users
    .filter((user) =>
      Object.values(user).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortField]?.toString().toLowerCase() || "";
      const bValue = b[sortField]?.toString().toLowerCase() || "";
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((user) => user.isActive).length,
    maleUsers: users.filter((user) => user.gender === "male").length,
    femaleUsers: users.filter((user) => user.gender === "female").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadein" style={{ minHeight: "100vh" }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-base-content font-sans">Admin Dashboard</h1>
        <div className="join">
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered join-item font-sans focus:scale-105 transition-transform duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn join-item">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat shadow rounded-box">
          <div className="stat-figure text-primary">
            <FaUsers className="text-3xl" />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{stats.totalUsers}</div>
        </div>
        <div className="stat shadow rounded-box">
          <div className="stat-figure text-success">
            <FaUserCheck className="text-3xl" />
          </div>
          <div className="stat-title">Active Users</div>
          <div className="stat-value text-success">{stats.activeUsers}</div>
        </div>
        <div className="stat shadow rounded-box">
          <div className="stat-figure text-info">
            <FaUsers className="text-3xl" />
          </div>
          <div className="stat-title">Male Users</div>
          <div className="stat-value text-info">{stats.maleUsers}</div>
        </div>
        <div className="stat shadow rounded-box">
          <div className="stat-figure text-secondary">
            <FaUsers className="text-3xl" />
          </div>
          <div className="stat-title">Female Users</div>
          <div className="stat-value text-secondary">{stats.femaleUsers}</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-box shadow">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("fullName")}
              >
                <div className="flex items-center gap-2">
                  Full Name
                  {sortField === "fullName" && (
                    sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />
                  )}
                </div>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("username")}
              >
                <div className="flex items-center gap-2">
                  Username
                  {sortField === "username" && (
                    sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />
                  )}
                </div>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("gender")}
              >
                <div className="flex items-center gap-2">
                  Gender
                  {sortField === "gender" && (
                    sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />
                  )}
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover">
                <td>{user.fullName}</td>
                <td>{user.username}</td>
                <td>{user.gender}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRemoveUser(user._id)}
                      className="btn btn-error btn-sm"
                    >
                      <FaUserTimes className="mr-2" />
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm User Removal</h3>
            <p className="py-4">Are you sure you want to remove this user? This action cannot be undone.</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={confirmDelete}>
                Remove User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 