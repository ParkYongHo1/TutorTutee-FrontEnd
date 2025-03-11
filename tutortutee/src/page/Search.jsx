import { useState } from "react";
import { useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useUploadImage from "../util/getImage";
import { Link } from "react-router-dom";
import SearchUserList from "../components/search/SearchUserList";

const Search = () => {
  return (
    <div className="flex flex-col items-center">
      <SearchUserList />
    </div>
  );
};

export default Search;
