import { useState } from "react";
import { useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useUploadImage from "../util/getImage";
import { Link } from "react-router-dom";
import SearchUser from "../components/search/SearchUser";

const Search = () => {

  return (
    <div className="flex flex-col items-center">
        <SearchUser/>
        {/* <div className="grid grid-cols-3 gap-10 w-[1020px] items-center m-auto relative">
            <div className="border-2 border-gray rounded-lg items-center text-center p-5">
                추천 튜터
            </div>
            <div className="col-span-2">
            02
            </div>
        </div> */}
    </div>
  );
};

export default Search;
