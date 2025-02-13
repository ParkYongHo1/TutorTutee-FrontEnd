import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="w-[500px] font-bold bg-white rounded-[5px] text-black border z-30 absolute top-[50px] right-[600px]">
      <div className="text-lg  w-full p-6">
        <p className="text-center font-bold text-2xl w-full">회원탈퇴</p>
        <div className="flex items-center justify-start">
          <p className="my-[20px]">{message}</p>
        </div>
        <div className="flex h-[50px] bg-red--100 mb-2">
          <p className="w-[10px] bg-red--300"></p>
          <div className="flex items-center px-4">
            <LazyLoadImage
              src={`${process.env.PUBLIC_URL}/image/default/warn.svg`}
              alt="실패 아이콘"
              className="m-auto"
              width={30}
              height={30}
            />
            <p className="text-xs ml-2">
              탈퇴하면 기존 데이터를 복구할수 없게 됩니다.
            </p>
          </div>
        </div>
        <div className="flex justify-end w-full text-end">
          <button
            onClick={onConfirm}
            className="mr-[20px] bg-black text-white p-2 w-[100px] text-sm"
          >
            확인
          </button>
          <button
            onClick={onCancel}
            className="border text-black p-2 w-[100px] text-sm"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
