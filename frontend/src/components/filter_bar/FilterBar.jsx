import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import styles from "./FilterBar.module.css";
import MovieGenresContext from "../../contexts/MovieGenres";
import TvGenresContext from "../../contexts/TvGenres";

export default function FilterBar({ filter, setFilter, requestType }) {
  const { movieGenres } = useContext(MovieGenresContext);
  const { tvGenres } = useContext(TvGenresContext);

  const [isActive, setIsActive] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.navIcon}>
        <button
          type="button"
          className={
            isActive ? styles.hamburgerIconIsActive : styles.hamburgerIcon
          }
          onClick={() => setIsActive(!isActive)}
        >
          <div className={isActive ? styles.barIsActive : styles.bar} />
        </button>
      </div>
      <div className={isActive ? styles.navListIsActive : styles.navList}>
        <ul className={styles.switchTypeContainer}>
          <h5>Genres</h5>
          <li>
            <button
              type="button"
              className={`${
                filter === "all"
                  ? styles.buttonSelectTypeEnabled
                  : styles.buttonSelectType
              }`}
              onClick={() => setFilter("all")}
            >
              Tout
            </button>
            <button
              type="button"
              className={styles.buttonSelectType}
              onClick={() => setIsActive(!isActive)}
            >
              Rechercher
            </button>
          </li>
          <li>
            {requestType === "movie" &&
              movieGenres.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  className={`${
                    filter === `${genre.name}`
                      ? styles.buttonSelectTypeEnabled
                      : styles.buttonSelectType
                  }`}
                  onClick={() => setFilter(`${genre.name}`)}
                >
                  {genre.name}
                </button>
              ))}
            {requestType === "tv" &&
              tvGenres.map((genre) => (
                <button
                  type="button"
                  className={`${
                    filter === `${genre.name}`
                      ? styles.buttonSelectTypeEnabled
                      : styles.buttonSelectType
                  }`}
                  onClick={() => setFilter(`${genre.name}`)}
                >
                  {genre.name}
                </button>
              ))}
          </li>
          <li>
            <button
              type="button"
              className={`${
                filter === "score"
                  ? styles.buttonSelectTypeEnabled
                  : styles.buttonSelectType
              }`}
              onClick={() => setFilter("score")}
            >
              Note +7
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

FilterBar.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  requestType: PropTypes.string.isRequired,
};