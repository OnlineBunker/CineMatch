import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function MainLayout() {
  return (
    <div style={{ 
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      background: "black"
    }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
