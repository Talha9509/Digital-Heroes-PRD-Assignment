export default function HowItWorksPage() {
  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <h1>How it works</h1>
      <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
        This platform blends three simple ingredients: your scores, a
        monthly draw, and a constant stream of charitable giving.[file:1]
      </p>
      <ol style={{ marginTop: '1.5rem', paddingLeft: '1.1rem' }}>
        <li>
          <strong>Subscribe</strong> – choose monthly or yearly and set
          your charity contribution percentage (minimum 10%).[file:1]
        </li>
        <li>
          <strong>Record scores</strong> – after each round, log your
          Stableford score and date. We always keep your latest 5 scores
          and show them in reverse chronological order.[file:1]
        </li>
        <li>
          <strong>Enter the monthly draw</strong> – your score history
          becomes your entry into the monthly number draw.[file:1]
        </li>
        <li>
          <strong>Win, verify, withdraw</strong> – if your numbers hit,
          upload proof, let an admin verify, and then track payout
          status from your dashboard.[file:1]
        </li>
      </ol>
    </div>
  );
}