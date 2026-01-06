import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/navBar";
import Sidebar from "../components/sidebar";

const Layout = () => {
  return (
    <Box minH="100vh" bg={{ _light: "gray.50", _dark: "gray.900" }}>
      <Box display={{ base: "none", md: "block" }}>
        <Sidebar />
      </Box>
      <NavBar />
      <Box
        ml={{ base: 0, md: "260px" }}
        pt="70px"
        minH="100vh"
        transition="margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        <Box p={6}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
