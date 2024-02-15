import modalActions from "./modal-actions";
import ModalOne from "@/components/modals/modal-1";
import ModalTwo from "@/components/modals/modal-2";

const modalList = {
  [modalActions.MODAL_ONE]: ModalOne,
  [modalActions.MODAL_TWO]: ModalTwo,
};

export default modalList;
