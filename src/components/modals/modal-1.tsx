"use client";

import { modalActions } from "@/controllers/modals";
import { modal } from "@4i/modal-manager";

export interface ModalOneProps {
  title: string;
}

const ModalOne = ({ title }: ModalOneProps) => {
  return (
    <div className="bg-blue-600 rounded-[8px] w-[50vw] h-[40vh] flex flex-col justify-between items-center p-[1rem] pt-[10rem]">
      <h1>{title}</h1>

      <div className="mb-[1rem] w-full flex flex-col gap-[1rem] items-center">
        <button
          className="w-[100%] h-[40px] rounded-[8px] bg-blue-500 active:brightness-50"
          onClick={modal.close}
        >
          Click to close
        </button>
        <button
          className="w-[100%] h-[40px] rounded-[8px] bg-blue-500 active:brightness-50"
          onClick={() => {
            modal.call(modalActions.MODAL_TWO, {
              title: "Modal Two",
            });
          }}
        >
          Click to open modal two
        </button>
      </div>
    </div>
  );
};

export default ModalOne;
