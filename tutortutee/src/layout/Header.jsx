import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import LoginHeader from "./header/LoginHeader";

const Header = () => {
  const isLoggedIn = useSelector((state) => state.member.isLoggedIn);

  return (
    <>
      <div>{isLoggedIn ? <LoginHeader /> : ""};</div>
    </>
  );
};
export default Header;
