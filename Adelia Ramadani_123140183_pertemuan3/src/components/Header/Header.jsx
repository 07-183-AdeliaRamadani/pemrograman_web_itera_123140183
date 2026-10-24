import PropTypes from "prop-types";

export default function Header({
  eyebrow,
  title,
  description,
  illustration = false,
}) {
  return (
    <section className="intro">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>
          {title}
          <span className="pink">.</span>
        </h1>
        <p className="intro-description">{description}</p>
      </div>
      {illustration && (
        <div className="book-art" aria-hidden="true">
          <span className="art-star">✦</span>
          <div className="art-label">a little reading club ♡</div>
          <div className="art-book book-one">
            ONE MORE
            <br />
            <b>chapter.</b>
            <span>♡</span>
          </div>
          <div className="art-book book-two">little stories</div>
          <div className="art-book book-three">BIG DREAMS</div>
          <span className="art-sparkle">✧</span>
        </div>
      )}
    </section>
  );
}
Header.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  illustration: PropTypes.bool,
};
