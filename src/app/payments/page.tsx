export default function PaymentsPage() {
  const footerText =
    'Reporting harassment: IITM BS Degree Team is committed to ensuring that everyone is equally valued and treats one another with respect...';

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#32325d', marginBottom: 20 }}>
        Pending Payments
      </h1>

      <div style={{ background: '#fff', padding: 24, borderRadius: 4, marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: '#525f7f', margin: 0 }}>No pending payments.</p>
      </div>

      <div style={{ fontSize: 12, color: '#8898aa', padding: '16px 0', lineHeight: 1.6 }}>
        {footerText}
      </div>
    </div>
  );
}
