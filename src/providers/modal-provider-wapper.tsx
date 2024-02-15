"use client";
import { ModalProvider } from "@4i/modal-manager";

interface ModalProviderWrapperProps {
  modalList: any;
}

const ModalProviderWrapper = (props: ModalProviderWrapperProps) => {
  return <ModalProvider {...props} />;
};

export default ModalProviderWrapper;
