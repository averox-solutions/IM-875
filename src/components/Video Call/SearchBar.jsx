import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";

const SearchBar = ({ searchInput, setSearchInput }) => {
  const { t } = useTranslation();

  const onChangeHandler = (event) => {
    setSearchInput(event.target.value);
  };

  const debouncedOnChangeHandler = useMemo(
    () => debounce(onChangeHandler, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedOnChangeHandler.cancel();
    };
  }, [debouncedOnChangeHandler]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
      <svg
        style={{ position: "absolute", top: "130px", left: "25px", height: "24px", width: "24px", fill: "#4B882B" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
      >
        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
      </svg>
      <input
        style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", border: "none", width: "25%", padding: "12px", borderRadius: "8px", outline: "none" }}
        type="text"
        name="search"
        placeholder={t("     Search here ......")}
        onChange={debouncedOnChangeHandler}
        onFocus={(e) => (e.target.style.borderColor = "#4B882B")}
        onBlur={(e) => (e.target.style.borderColor = "#4B882B")}
      />
      <button
        style={{ padding: "12px 30px", border: "none", borderRadius: "10px", background: "rgb(75, 136, 43)", color: "#fff", fontWeight: "bold", fontSize: "15px" }}
      >
        {t("New Room")}
      </button>
    </div>
  );
};

SearchBar.propTypes = {
  searchInput: PropTypes.string,
  setSearchInput: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  searchInput: "",
};

export default SearchBar;
