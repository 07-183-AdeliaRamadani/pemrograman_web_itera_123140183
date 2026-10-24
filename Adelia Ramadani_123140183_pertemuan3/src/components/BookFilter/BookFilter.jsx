import PropTypes from "prop-types";
import { STATUS } from "../../utils/books";
import "./BookFilter.css";

export default function BookFilter({
  search,
  onSearch,
  status,
  onStatus,
  counts,
}) {
  return (
    <div className="filter-area">
      <label className="sr-only" htmlFor="search">
        Cari judul atau penulis
      </label>
      <div className="search-box">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          id="search"
          placeholder="Cari judul buku atau nama penulis..."
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
      <div className="filter-tabs" role="group" aria-label="Filter status buku">
        {Object.entries({ all: "Semua", ...STATUS }).map(([value, label]) => (
          <button
            type="button"
            key={value}
            aria-pressed={status === value}
            onClick={() => onStatus(value)}
          >
            {label}
            <span>{value === "all" ? counts.total : counts[value]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
BookFilter.propTypes = {
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onStatus: PropTypes.func.isRequired,
  counts: PropTypes.shape({
    total: PropTypes.number.isRequired,
    milik: PropTypes.number.isRequired,
    baca: PropTypes.number.isRequired,
    beli: PropTypes.number.isRequired,
  }).isRequired,
};
