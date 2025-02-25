import Manager from "./Manager";

function uniqueID() {
  return Math.floor(Math.random() * Date.now());
}

export const constants = {
  CHANGE: "change",
  CLOSE: "close",
};

interface QueueState {
  queue: string[];
  closedModalName?: string | undefined;
  lastOpenedModal?: string | undefined;
}

interface ModalState {
  isHaveOpenModals: boolean;
  queue: string[];
  closedModalName?: string | undefined;
  lastOpenedModal?: string | undefined;
}

export interface Options {
  hideBackdrop?: boolean;
  extraClass?: string;
  openMinimized?: boolean;
}

export class ModalManager extends Manager {
  queue: string[] = [];
  modalData: Map<string, any> = new Map(); // Сохраняем данные для каждого модального окна
  _openModalStateCallback: null | ((props: ModalState) => void);

  constructor() {
    super();
    this.create = this.create.bind(this);
    this.call = this.call.bind(this);
    this._openModalStateCallback = null;
  }

  create<T>(
    name: string,
    payload: { modalId: number; data?: T },
    options?: Options
  ) {
    const modalId = String(payload.modalId);
    this.modalData.set(modalId, { name, payload, options });

    // Используем setTimeout для обеспечения асинхронного выполнения
    setTimeout(() => {
      this.emitter.emit(constants.CHANGE, name, payload, options);
    }, 0);

    return modalId;
  }

  call<T>(name: string, data?: T, options?: Options) {
    const modalId = uniqueID();
    const id = this.create<T>(name, { modalId, data }, options);

    const lastOpenedModal = name;
    this.queue.push(id);

    // Используем setTimeout чтобы дать React возможность обновить DOM
    setTimeout(() => {
      this._openModalStateCallback?.(
        this.getQueueState({
          queue: this.queue,
          lastOpenedModal,
        })
      );
    }, 0);

    return id;
  }

  close<T>(position?: T) {
    this.emitter.emit(constants.CLOSE, position ?? this.queue?.length - 1);
    const closedModalName = this.queue[this.queue.length - 1];
    this.queue.pop();

    this._openModalStateCallback?.(
      this.getQueueState({
        queue: this.queue,
        closedModalName,
      })
    );
  }

  getQueueState({ queue, closedModalName, lastOpenedModal }: QueueState) {
    return {
      isHaveOpenModals: queue.length > 0,
      queue,
      lastOpenedModal: lastOpenedModal,
      closedModalName,
    };
  }

  onOpenModalState(callback: (state: ModalState) => void) {
    this._openModalStateCallback = callback;
  }

  // Получить количество открытых модальных окон
  getModalCount() {
    return this.queue.length;
  }

  // Метод для закрытия всех модальных окон
  closeAll() {
    if (this.queue.length === 0) return;

    setTimeout(() => {
      this.emitter.emit(constants.CLOSE, "all");
      this.queue = [];
      this.modalData.clear();

      this._openModalStateCallback?.(
        this.getQueueState({
          queue: this.queue,
          closedModalName: undefined,
        })
      );
    }, 0);
  }
}

const modal = new ModalManager();
export { modal };
export default modal;
