import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useLogoutAdminMutation } from "../redux/apis/authApi";
import { useDispatch } from "react-redux";
import { adminLogout } from "../redux/slices/adminauthslice";
import { useNavigate } from "react-router-dom";

const LogoutDropdown = ({ closeDropdown }) => {
  const [logoutAdmin, { isLoading }] = useLogoutAdminMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAdmin().unwrap();

      dispatch(adminLogout()); // Clear redux state
      navigate("/login", { replace: true });

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-50">
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-gray-100 text-sm"
      >
        <FaSignOutAlt />
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
};

export default LogoutDropdown;