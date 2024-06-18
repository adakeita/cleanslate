import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import { UIProvider } from "../contexts/UIContext";

const Layout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <UIProvider>
      <div className="layout-container">
        <Navbar />
        <main className="main-content">
          <Outlet context={{ openModal, closeModal }} />
        </main>
        <Footer />
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {modalContent}
        </Modal>
      </div>
    </UIProvider>
  );
};

export default Layout;
