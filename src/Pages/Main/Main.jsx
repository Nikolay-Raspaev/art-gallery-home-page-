import React, { useState, useEffect } from "react";
import logo from "../../svg/logo.svg";
import sun_white from "../../svg/sun-white.svg";
import sun_black from "../../svg/sun-black.svg";
import PaintingList from "./components/PaintingList/PaintingList";
import Pagination from "./components/Pagination/Pagination";
import Filter from "./components/Filter/Filter";
import {useReplaceFieldsIdInPaintings} from "./hooks/useMain";
import QueryService from "./API/QueryService";
import {useFetching} from "./hooks/useFetching";
import {getPageCount} from "./components/utils/pages";
import {useLocation} from "react-router-dom";

const Main = (props) => {
  const host = "https://test-front.framework.team";

  const [paintingName, setPaintingName] = useState("");

  const [paintings, setPaintings] = useState([]);

  const [authors, setAuthors] = useState([]);

  const [selectedAuthorID, setSelectedAuthorId] = useState(0);

  const [locations, setLocations] = useState([]);

  const [selectedLocationId, setSelectedLocationId] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const [limit, setLimit] = useState(12);

  const [totalPages, setTotalPages] = useState(0);

  const [dateValue, setDateValue] = useState({ from: "", before: "" });

  const newPaintings = useReplaceFieldsIdInPaintings(
    paintings,
    authors,
    locations
  );

  const location = useLocation();

  const setParam = () => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get("_page");
    if (page) setCurrentPage(page);

    const limit = searchParams.get("_limit");
    if (limit) setLimit(limit);

    const authorId = searchParams.get("authorId");
    if (authorId) setSelectedAuthorId(authorId);

    const locationId = searchParams.get("locationId");
    if (locationId) setSelectedLocationId(locationId);

    const name = searchParams.get("name");
    if (name) setPaintingName(name);

    const created_gte = searchParams.get("created_gte");
    if (created_gte) setDateValue({ ...dateValue, from: created_gte });

    const created_lte = searchParams.get("created_lte");
    if (created_lte) setDateValue({ ...dateValue, before: created_lte });

    console.log(searchParams.toString());
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAuthorID, selectedLocationId, paintingName, dateValue]);

  useEffect(() => {
    getAuthors();
    getLocations();
    setTimeout(function () {
      setParam();
    }, 100);
  }, []);

  useEffect(() => {
    fetchPaintings();
  }, [
    selectedAuthorID,
    selectedLocationId,
    paintingName,
    dateValue,
    currentPage,
  ]);

  const [fetchPaintings, paintingError, isLoaded] = useFetching(async() =>{
    const response = await QueryService.getPaintings(host, currentPage, limit, selectedAuthorID, selectedLocationId, paintingName, dateValue);
    setPaintings(response.data);
    const totalCount = response.headers.get("x-total-count");
    setTotalPages(getPageCount(totalCount, limit))
  })

  const getAuthors = async () => {
    const authors = await QueryService.getAuthors(host);
    setAuthors(authors);
  };

  const getLocations = async () => {
    const locations = await QueryService.getLocations(host);
    setLocations(locations);
  };

  return (
    <div
      className={props.isThemeLight ? "page page__light" : "page page__dark"}
    >
      <div className="page__svg">
        <img src={logo} className="page__svg__logo" alt="Framework Team Logo" />
        {props.isThemeLight ? (
          <img
            src={sun_black}
            className="page__svg__switch"
            alt="Switch Theme"
            onClick={() => props.handleThemeChange(!props.isThemeLight)}
          />
        ) : (
          <img
            src={sun_white}
            className="page__svg__switch"
            alt="Switch Theme"
            onClick={() => props.handleThemeChange(!props.isThemeLight)}
          />
        )}
      </div>
      <Filter
        isThemeLight={props.isThemeLight}
        paintingName={paintingName}
        setPaintingName={setPaintingName}
        selectedAuthorID={selectedAuthorID}
        setSelectedAuthorId={setSelectedAuthorId}
        authors={authors}
        selectedLocationId={selectedLocationId}
        setSelectedLocationId={setSelectedLocationId}
        locations={locations}
        dateValue={dateValue}
        setDateValue={setDateValue}
      />
      {paintingError &&
        <h1 style={{display:'flex', justifyContent: 'center'}}>Произошла ошибка {paintingError}</h1>}
      <PaintingList paintings={newPaintings} host={host} isLoaded={isLoaded} />
      {newPaintings.length !== 0 && (
        <Pagination
          isThemeLight={props.isThemeLight}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Main;
