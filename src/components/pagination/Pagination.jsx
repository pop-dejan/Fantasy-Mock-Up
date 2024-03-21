import "./Pagination.scss";
import "bootstrap/dist/css/bootstrap.min.css";

function Pagination({
  playersPerPage,
  totalPlayers,
  paginatePrev,
  paginateNext,
  paginatePrevEnd,
  paginateNextEnd,
  disablePrevious,
  disableNext,
  currentPage,
}) {
  const pageNumbers = Math.ceil(totalPlayers / playersPerPage);

  return (
    <>
      <nav>
        <ul className="pagination custom-pagination">
          <button
            className="page-item previous-end my-disabled"
            disabled={disablePrevious}
            onClick={() => paginatePrevEnd()}
          >
            <span aria-hidden="true" className="arrow">
              &laquo;
            </span>
          </button>

          <button
            className="page-item previous my-disabled"
            disabled={disablePrevious}
            onClick={() => paginatePrev()}
          >
            <span aria-hidden="true" className="arrow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="Chevrons__ChevronLeft-ifqxdy-0 bekMVQ"
              >
                <path
                  fillRule="evenodd"
                  d="M17.0003375,23.99975 C16.7018422,23.99975 16.4063468,23.8872518 16.1783503,23.6592553 L5.34101967,12.8204247 C4.88652678,12.3674318 4.88652678,11.6324432 5.34101967,11.1794503 L16.1783503,0.340619674 C16.6328432,-0.113873225 17.3663318,-0.113873225 17.8208247,0.340619674 C18.2753176,0.793612596 18.2753176,1.52860111 17.8208247,1.98309401 L7.80248121,11.9999375 L17.8208247,22.018281 C18.2753176,22.4697739 18.2753176,23.2062624 17.8208247,23.6592553 C17.5943282,23.8872518 17.2973329,23.99975 17.0003375,23.99975"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </button>

          <li className="page-item counter">
            <span className="current">{currentPage} </span>
            <span className="of">of</span> {pageNumbers}
          </li>

          <button
            className="page-item next"
            disabled={disableNext}
            onClick={() => paginateNext(pageNumbers)}
          >
            <span aria-hidden="true" className="arrow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="Chevrons__ChevronRight-ifqxdy-1 hBRSDO"
              >
                <path
                  fillRule="evenodd"
                  d="M17.0003375,23.99975 C16.7018422,23.99975 16.4063468,23.8872518 16.1783503,23.6592553 L5.34101967,12.8204247 C4.88652678,12.3674318 4.88652678,11.6324432 5.34101967,11.1794503 L16.1783503,0.340619674 C16.6328432,-0.113873225 17.3663318,-0.113873225 17.8208247,0.340619674 C18.2753176,0.793612596 18.2753176,1.52860111 17.8208247,1.98309401 L7.80248121,11.9999375 L17.8208247,22.018281 C18.2753176,22.4697739 18.2753176,23.2062624 17.8208247,23.6592553 C17.5943282,23.8872518 17.2973329,23.99975 17.0003375,23.99975"
                  transform="rotate(-180 11.58 12)"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </button>

          <button
            className="page-item next-end"
            disabled={disableNext}
            onClick={() => paginateNextEnd(pageNumbers)}
          >
            <span aria-hidden="true" className="arrow">
              &raquo;
            </span>
          </button>
        </ul>
      </nav>
    </>
  );
}

export default Pagination;
