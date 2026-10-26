class SiteFooter extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;

    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>
        :host {
          display: block;
          color: #f4f4f1;
          font-family: "Inter", "Outfit", sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        footer {
          padding: 40px 24px 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          background: #080908;
        }
        .inner {
          width: min(1240px, 100%);
          margin: 0 auto;
        }
        .footer-main {
          display: grid;
          grid-template-columns: minmax(220px, 1.4fr) 1fr 1fr;
          gap: 48px;
          padding-bottom: 32px;
        }
        .brand {
          display: inline-block;
          margin-bottom: 10px;
          font-size: 30px;
          font-weight: 700;
          line-height: 1;
          text-decoration: none;
        }
        .brand span {
          color: #aab99f;
        }
        .tagline {
          max-width: 240px;
          margin: 0;
          color: #a3a5a1;
          font-size: 13px;
          line-height: 1.6;
        }
        h2 {
          margin: 2px 0 14px;
          color: #858782;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }
        nav,
        .social-links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 20px;
        }
        a {
          color: #e8e9e5;
          font-size: 12px;
          text-decoration: none;
          transition: color 150ms ease;
        }
        a:hover,
        a:focus-visible {
          color: #aab99f;
        }
        a:focus-visible {
          outline: 2px solid #aab99f;
          outline-offset: 4px;
        }
        .social-links a {
          display: grid;
          width: 40px;
          height: 40px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
        }
        .social-links a:hover {
          background: #fff;
        }
        .social-links img {
          display: block;
          width: 19px;
          height: 19px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          transition: filter 150ms ease;
        }
        .social-links a:hover img {
          filter: brightness(0);
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          color: #777a75;
          font-size: 10px;
        }
        .footer-bottom p {
          margin: 0;
        }
        @media (max-width: 640px) {
          footer {
            padding: 32px 16px 16px;
          }
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 28px 18px;
            padding-bottom: 24px;
          }
          .identity {
            grid-column: 1 / -1;
          }
          nav,
          .social-links {
            gap: 10px 14px;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 6px;
          }
        }
      </style>
      <footer>
        <div class="inner">
          <div class="footer-main">
            <div class="identity">
              <a class="brand" href="index.html#home" aria-label="LOOO home">LOOO<span>.</span></a>
              <p class="tagline">Locally owned, nationally inspired. Good pairs for real life.</p>
            </div>
            <div>
              <h2>Explore</h2>
              <nav aria-label="Footer navigation">
                <a href="collections.html">Collection</a>
                <a href="about.html">About us</a>
                <a href="index.html#testimonials">Testimonials</a>
                <a href="contact.html">Contact us</a>
              </nav>
            </div>
            <div>
              <h2>Follow</h2>
              <div class="social-links" aria-label="Social media">
                <a href="https://www.instagram.com/nike/" aria-label="Instagram" target="_blank" rel="noreferrer"><img src="assets/social/instagram.svg" alt="" aria-hidden="true" /></a>
                <a href="https://www.tiktok.com/@nike" aria-label="TikTok" target="_blank" rel="noreferrer"><img src="assets/social/tiktok.svg" alt="" aria-hidden="true" /></a>
                <a href="https://www.facebook.com/nike/" aria-label="Facebook" target="_blank" rel="noreferrer"><img src="assets/social/facebook.svg" alt="" aria-hidden="true" /></a>
                <a href="https://wa.me/?text=Check%20out%20LOOO" aria-label="WhatsApp" target="_blank" rel="noreferrer"><img src="assets/social/whatsapp.svg" alt="" aria-hidden="true" /></a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>© ${new Date().getFullYear()} LOOO. All rights reserved.</p>
            <p>Independent footwear, selected with care.</p>
          </div>
        </div>
      </footer>
    `;
  }
}

if (!customElements.get("site-footer")) {
  customElements.define("site-footer", SiteFooter);
}