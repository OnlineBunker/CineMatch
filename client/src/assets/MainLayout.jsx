import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: "0px" }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
