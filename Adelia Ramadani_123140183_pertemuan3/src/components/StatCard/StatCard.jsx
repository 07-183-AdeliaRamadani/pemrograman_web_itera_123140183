import PropTypes from "prop-types";

export default function StatCard({ label, value, symbol, accent = false }) {
  return (
    <article className={`stat-card ${accent ? "stat-accent" : ""}`}>
      <div>
        <p>{label}</p>
        <strong>{String(value).padStart(2, "0")}</strong>
        <span className="stat-unit"> buku</span>
      </div>
      <span className="stat-icon" aria-hidden="true">
        {symbol}
      </span>
    </article>
  );
}
StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
  accent: PropTypes.bool,
};
