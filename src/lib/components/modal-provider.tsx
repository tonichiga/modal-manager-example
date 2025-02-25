"use client";

import React, { useEffect, useRef, useState } from "react";
import { modal, constants } from "../utils/ModalManager";

export type ModalList = { [key: string]: React.ComponentType<any> };

interface ModalProviderProps {
  modalList: ModalList;
  isOverflow?: boolean;
  className?: string;
  backdropClassName?: string;
  onModalStateChange?: (
    modalState: boolean,
    data: ModalData[],
    names: string[]
  ) => void;
}

type ModalData = {
  id: string;
  name: string;
  payload: any;
  options?: any;
};

const ModalProvider: React.FC<ModalProviderProps> = ({
  modalList,
  isOverflow = true,
  className = "",
  backdropClassName = "",
  onModalStateChange,
}) => {
  const [modals, setModals] = useState<ModalData[]>([]);
  const modalRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const applyCloseStyles = (modalIndex: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const modalElement = document.querySelector(
        `[data-modal-index="${modalIndex}"]`
      ) as HTMLElement;

      if (!modalElement) {
        resolve(false);
        return;
      }

      modalElement.classList.add("modal_closing");
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  };

  useEffect(() => {
    if (onModalStateChange && modals.length >= 0) {
      const data = modals.map((modal) => modal.payload);
      const names = modals.map((modal) => modal.name);
      onModalStateChange(modals.length > 0, data, names);
    }
  }, [modals, onModalStateChange]);

  useEffect(() => {
    // Toggle body overflow
    if (typeof document !== "undefined") {
      document.body.style.overflow =
        isOverflow && modals.length > 0 ? "hidden" : "";
    }
  }, [modals.length, isOverflow]);

  useEffect(() => {
    const handleOpenModal = (name: string, payload: any, options?: any) => {
      const id = `modal-${payload.modalId || Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      setModals((prevModals) => [
        ...prevModals,
        { id, name, payload, options },
      ]);
    };

    const handleClose = async (position: number | string) => {
      console.log("POS", position);
      if (position === "all") {
        // Закрыть все модальные окна с анимацией
        for (let i = modals.length - 1; i >= 0; i--) {
          await applyCloseStyles(i);
        }
        setModals([]);
        return;
      }

      if (typeof position === "number") {
        // Обработка числовых позиций
        let indexToRemove: number = position;

        if (indexToRemove < 0 || indexToRemove >= modals.length) {
          // Если индекс невалидный, закрываем последний
          indexToRemove = modals.length - 1;
        }

        if (indexToRemove >= 0 && indexToRemove < modals.length) {
          await applyCloseStyles(indexToRemove);

          setModals((prevModals) =>
            prevModals.filter((_, index) => index !== indexToRemove)
          );
        }
      }
    };

    // Добавляем обработчики событий
    modal.emitter.on(constants.CHANGE, handleOpenModal);
    modal.emitter.on(constants.CLOSE, handleClose);

    return () => {
      // Удаляем обработчики при размонтировании
      modal.emitter.off(constants.CHANGE, handleOpenModal);
      modal.emitter.off(constants.CLOSE, handleClose);
    };
  }, [modals]);

  const handleCloseModal = (index: number) => {
    modal.close(index);
  };

  const saveModalRef = (id: string, ref: HTMLDivElement | null) => {
    if (ref) {
      modalRefs.current.set(id, ref);
    } else {
      modalRefs.current.delete(id);
    }
  };

  // Предотвратить всплытие клика для модального контента
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {modals.map((modalItem, index) => {
        const { name, payload, options, id } = modalItem;
        const Modal =
          modalList[name] || (() => <div>Modal not found: {name}</div>);
        const hideBackdrop = options?.hideBackdrop || false;
        const extraClass = options?.extraClass || "";

        return (
          <div
            key={id}
            data-modal-id={id}
            data-modal-index={index}
            className={`modal_container ${extraClass}`}
          >
            {!hideBackdrop && (
              <div
                onClick={() => handleCloseModal(index)}
                className="modal_backdrop"
              />
            )}
            <div
              className={`${className} modal_paper`}
              onClick={stopPropagation}
              ref={(ref) => saveModalRef(id, ref)}
            >
              <Modal {...(payload.data || {})} modalIndex={index} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ModalProvider;
