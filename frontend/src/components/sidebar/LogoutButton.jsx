import useLogout from "../../hooks/useLogout";
import { BiLogOut } from "react-icons/bi";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <button className="btn btn-outline btn-primary w-full mt-4" onClick={logout} disabled={loading}>
      {!loading ? (
        <BiLogOut className="w-6 h-6" />
      ) : (
        <span className="loading loading-spinner loading-sm"></span>
      )}
      {!loading && "Logout"}
    </button>
  );
};

export default LogoutButton;
