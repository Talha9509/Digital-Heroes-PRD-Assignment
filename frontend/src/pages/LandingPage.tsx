import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-root">
      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">Play for change, not just score</p>
          <h1>
            Turn your weekly rounds
            <br />
            into monthly impact.
          </h1>
          <p className="hero-sub">
            Subscribe, record your Stableford scores, and enter a monthly
            draw where a share of every entry fuels real charitable work.
            No leaderboards. No pressure. Just momentum.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="primary-button">
              Start your impact subscription
            </Link>
            <Link to="/how-it-works" className="secondary-link">
              Learn how it works →
            </Link>
          </div>
          <div className="hero-footnote">
            A portion of every subscription is committed to the charities
            you choose.
          </div>
        </div>

        <div className="hero-panel card">
          <h2>One subscription. Three outcomes.</h2>
          <ul className="pill-list">
            <li>Track your last 5 Stableford scores with zero friction.</li>
            <li>Automatically enter monthly draw‑based prize pools.</li>
            <li>Direct a share of your fee to a cause you care about.</li>
          </ul>
          <div className="mini-grid">
            <div>
              <div className="metric-label">Charities supported</div>
              <div className="metric-value">12</div>
            </div>
            <div>
              <div className="metric-label">Average prize pool</div>
              <div className="metric-value">₹75,000</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}