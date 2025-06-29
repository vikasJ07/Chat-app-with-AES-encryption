import { useAuthContext } from "../context/AuthContext";

const useRemoveUser = () => {
  const { authUser } = useAuthContext();

  const removeUser = async (userId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/user/${userId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to remove user");
      }

      // Refresh the page to update the user list
      window.location.reload();
    } catch (error) {
      console.error("Error in useRemoveUser: ", error.message);
      alert(error.message);
    }
  };

  return { removeUser };
};

export default useRemoveUser; 