import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <aside className="w-80 p-5 flex flex-col min-h-0 bg-base-100 dark:bg-base-200 border-r-2 border-base-300 rounded-3xl shadow-2xl font-sans animate-fadeIn transition-all duration-500 overflow-hidden group hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.18)] hover:scale-[1.01]">
      <div className="mb-4">
        <SearchInput />
      </div>
      <div className="h-1 w-2/3 mx-auto bg-base-300 rounded-full mb-4 transition-all duration-300 group-hover:w-3/4" />
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <Conversations />
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <button className="btn btn-outline btn-primary w-full rounded-xl shadow-sm hover:scale-[1.03] transition-transform" onClick={() => navigate("/about")}>About Us</button>
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;
