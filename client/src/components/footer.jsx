import '../styles/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">CineMatch</div>

      <ul className="footer-links">
        <li>
          <a
            href="https://www.instagram.com/yash_d_dhankhar"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </li>

        <li>
          <a
            href="https://github.com/OnlineBunker"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </li>

        <li>
          <a
            href="https://www.linkedin.com/in/yash-d-dhankhar"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
