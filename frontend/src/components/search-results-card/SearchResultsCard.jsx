import axios from "axios";
import React, { useEffect, useMemo, useState, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import PropTypes from "prop-types";
import MovieGenresContext from "../../contexts/MovieGenresContext";
import TvGenresContext from "../../contexts/TvGenresContext";
import styles from "./SearchResultsCard.module.css";
import {
  setScoreColor,
  setLocaleDate,
  getGenreName,
} from "../../services/utils";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function SearchResultsCard({
  requestType,
  movies,
  setMovies,
  pageNumber,
  setPageNumber,
  scoreFilter,
}) {
  const { movieGenres } = useContext(MovieGenresContext);
  const { tvGenres } = useContext(TvGenresContext);
  const [results] = useSearchParams();
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  /* Re-fetch data each page for Infinite Scroll */
  const fetchMoreData = () => {
    const query = results.get("query") || "";
    axios
      .get(
        `https://api.themoviedb.org/3/search/${requestType}?api_key=${API_KEY}&language=fr&query=${query}&page=${pageNumber}&include_adult=false`
      )
      .then(({ data }) => {
        if (data.page !== data.total_pages) {
          setMovies([...movies, ...data.results]);
        } else setHasMore(false);
      })
      .catch((err) =>
        err.response.status === 404 ? navigate("/not-found") : null
      );
  };

  useEffect(() => {
    if (pageNumber !== 1) fetchMoreData();
  }, [pageNumber]);

  /* Generate Filter States using Movie/TV Context */
  function getFilter() {
    if (scoreFilter === "all") return movies;
    if (scoreFilter === "2")
      return movies.filter((movie) => movie.vote_average >= 2);
    if (scoreFilter === "4")
      return movies.filter((movie) => movie.vote_average >= 4);
    if (scoreFilter === "6")
      return movies.filter((movie) => movie.vote_average >= 6);
    if (scoreFilter === "8")
      return movies.filter((movie) => movie.vote_average >= 8);
    return null;
  }

  /* Call genre data with UseMemo & set in filteredMovies */
  const filteredMovies = useMemo(() => getFilter(), [movies, scoreFilter]);

  const posterUrl = "https://image.tmdb.org/t/p/w200";

  return (
    <div className={styles.infiniteScrollBox} id="scroll-box">
      <InfiniteScroll
        dataLength={movies.length}
        next={() => setPageNumber(pageNumber + 1)}
        hasMore={hasMore}
        loader={<p className="results-number">Chargement...</p>}
        endMessage={
          <p className="results-number">Il n'y a pas plus de résultats.</p>
        }
        scrollableTarget="scroll-box"
      >
        <div className={styles.searchResults}>
          <div className={styles.searchCard}>
            {filteredMovies.map((movie) => (
              <Link
                key={movie.id}
                to={
                  requestType === "movie"
                    ? `/movie/${movie.id}`
                    : `/tv/${movie.id}`
                }
              >
                <div className={styles.cardContainer}>
                  <div className={styles.posterContainer}>
                    <img
                      src={
                        movie.poster_path
                          ? `${posterUrl}${movie.poster_path}`
                          : null
                      }
                      alt={
                        requestType === "movie"
                          ? movie.orginal_title
                          : movie.orginal_name
                      }
                      className={styles.poster}
                    />
                  </div>
                  <div className={styles.infoContainer}>
                    <div className={styles.movieHeader}>
                      <div>
                        <h4 className={styles.movieTitle}>
                          {requestType === "movie" ? movie.title : movie.name}
                        </h4>
                        <h5 className={styles.movieGenre}>
                          {requestType === "movie"
                            ? getGenreName(movie.genre_ids, movieGenres)
                            : null}
                          {requestType === "tv"
                            ? getGenreName(movie.genre_ids, tvGenres)
                            : null}
                        </h5>
                        <p className={styles.movieDate}>
                          {movie.release_date
                            ? setLocaleDate(movie.release_date)
                            : null}
                          {movie.first_air_date
                            ? setLocaleDate(movie.first_air_date)
                            : null}
                        </p>
                      </div>
                      <p
                        className={styles.movieScore}
                        style={{ color: setScoreColor(movie.vote_average) }}
                      >
                        {movie.vote_average.toFixed(1)}
                      </p>
                    </div>
                    <p className={styles.movieSynopsis}>
                      {`${movie.overview.slice(0, 75)}...`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
}

SearchResultsCard.propTypes = {
  requestType: PropTypes.string.isRequired,
  movies: PropTypes.shape().isRequired,
  setMovies: PropTypes.func.isRequired,
  pageNumber: PropTypes.number.isRequired,
  setPageNumber: PropTypes.func.isRequired,
  scoreFilter: PropTypes.string.isRequired,
};
