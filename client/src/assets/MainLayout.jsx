import Navbar from "../components/navbar.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: "0px" }}>
        <Outlet />
      </div>
    </>
  );
}
