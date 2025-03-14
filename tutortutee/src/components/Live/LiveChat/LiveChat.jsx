import { LazyLoadImage } from "react-lazy-load-image-component";

const LiveChat = () => {
  return (
    <div className="flex flex-col w-[35vw] h-[100vh] bg-green-50 px-3">
      <div className="min-h-[10vh] flex justify-between py-2 items-center">
        <div className="flex justify-between gap-[15px]">
          <div className="w-[80px] h-[80px]">
            <LazyLoadImage
              src={`${process.env.PUBLIC_URL}/image/default/profile.svg`}
              alt="프로필"
              className="w-full h-full object-cover fill border rounded-[10%]"
              width={80}
              height={80}
            />
          </div>
          <div>
            <div>
              <p className="text-lg text-blue--500 font-bold">
                name&nbsp;
                <span className="text-lg text-black font-semibold">
                  님의 LIVE
                </span>
              </p>
            </div>
            <div>참여자 수</div>
          </div>
        </div>
        <div>
          <button>나가기</button>
        </div>
      </div>
      <div className="min-h-[70vh] border">채팅list</div>
      <textarea className="min-h-[20vh] border" />
    </div>
  );
};

export default LiveChat;
