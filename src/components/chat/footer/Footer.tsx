import Send from "@/assets/svgs/chat/send.svg?react";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface FooterProps {
  isBuyer: boolean;
  isSending: boolean;
  onSubmit: (text: string) => boolean;
  onComplete: () => void;
}

const Footer = ({ isBuyer, isSending, onSubmit, onComplete }: FooterProps) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) {
      setText("");
      return;
    }

    if (onSubmit(text)) setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (isSending) {
      e.preventDefault();
      return;
    }

    // 모바일에서는 Enter를 디폴트 값이 되도록
    const isMobile = "ontouchstart" in window;

    if (e.key === "Enter" && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 w-full z-50">
      {isBuyer && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-grey04 bg-white">
          <p className="text-reg12 text-darkgrey01">
            거래가 무사히 성사되면
            <br />
            거래완료 버튼을 눌러주세요.
          </p>
          <button
            onClick={onComplete}
            className="px-4 py-1 text-med16 text-darkgrey02 border border-grey10 rounded-md cursor-pointer hover:bg-lightpink"
          >
            거래완료
          </button>
        </div>
      )}

      <div className="bg-white w-full px-3 py-2 border-t border-grey04">
        <div className="flex items-center gap-2 bg-grey02 rounded-xl px-2 py-1">
          <TextareaAutosize
            minRows={1}
            maxRows={3}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메세지를 입력하세요"
            className="flex-1 px-3 py-1 text-med14 text-darkgrey02 placeholder-grey11 outline-none bg-transparent resize-none"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isSending}
            className="w-10 h-7 flex items-center justify-center bg-mainpink disabled:bg-grey06 rounded-xl cursor-pointer"
          >
            <Send className="w-3 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
