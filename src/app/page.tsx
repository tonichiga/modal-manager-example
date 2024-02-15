"use client";
import { modalActions } from "@/controllers/modals";
import { modal } from "@4i/modal-manager";
import Image from "next/image";

export default function Home() {
  const handleOpenModalOne = () => {
    modal.call(modalActions.MODAL_ONE, {
      title: "Modal One",
    });
  };

  const handleOpenModalTwo = () => {
    modal.call(modalActions.MODAL_TWO, {
      title: "Modal TWO",
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-24 w-full max-w-[800px]">
      <div className="brightness-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className=" relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="flex gap-[1rem] translate-y-[300%] w-full">
        <button
          onClick={handleOpenModalOne}
          className="w-[100%] h-[40px] rounded-[8px] bg-blue-700 active:brightness-50"
        >
          Open modal one
        </button>
        <button
          onClick={handleOpenModalTwo}
          className="w-[100%] h-[40px] rounded-[8px] bg-blue-500 active:brightness-50"
        >
          Open modal two
        </button>
      </div>
    </main>
  );
}
