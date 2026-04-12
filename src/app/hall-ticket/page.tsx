export default function HallTicketPage() {
  const footerText =
    'Reporting harassment: IITM BS Degree Team is committed to ensuring that everyone is equally valued and treats one another with respect...';

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#32325d', marginBottom: 20 }}>
        Hall Ticket &amp; Exam Cities
      </h1>

      {/* Hall Tickets For Download */}
      <div style={{ background: '#fff', padding: 24, marginBottom: 24, borderRadius: 4 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#32325d', marginBottom: 16 }}>
          Hall Tickets For Download
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f8f8' }}>
              <th style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#525f7f', borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
                Exam name
              </th>
              <th style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#525f7f', borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
                Exam Date
              </th>
              <th style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#525f7f', borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
                Hall Ticket
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                2026 Apr 12 QUIZ2 Hall Ticket
              </td>
              <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                12 Apr 2026
              </td>
              <td style={{ padding: '10px 16px', fontSize: 13, borderBottom: '1px solid #e9ecef' }}>
                <button
                  style={{
                    background: '#fff',
                    border: '1px solid #ccc',
                    padding: '4px 16px',
                    borderRadius: 4,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  DOWNLOAD
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Exam City Preferences */}
      <div style={{ background: '#fff', padding: 24, marginBottom: 24, borderRadius: 4 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#32325d', marginBottom: 16 }}>
          Exam City Preferences
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f8f8' }}>
                <th style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#525f7f', borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
                  Exam name
                </th>
                <th style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#525f7f', borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
                  Dates
                </th>
                <th style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#525f7f', borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
                  Preference 1
                </th>
                <th style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#525f7f', borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
                  Preference 2
                </th>
                <th style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#525f7f', borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
                  Last Date to Edit Preference
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  Quiz 1
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  15 March 2026
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  Karnataka | Bengaluru South
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  Karnataka | Bengaluru North
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  Closed for edits
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  Quiz 2
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  12 April 2026
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  Karnataka | Bengaluru South
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  Karnataka | Bengaluru North
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  Closed for edits
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  End Term Exams
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  10 May 2026
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  Karnataka | Bengaluru South
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  Karnataka | Bengaluru North
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#525f7f', borderBottom: '1px solid #e9ecef' }}>
                  15 April 2026
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 20 }}>
          <button
            style={{
              background: '#fff',
              border: '1px solid #800020',
              color: '#800020',
              padding: '8px 20px',
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            EDIT EXAM CITY PREFERENCES
          </button>
        </div>
      </div>

      <div style={{ fontSize: 12, color: '#8898aa', padding: '16px 0', lineHeight: 1.6 }}>
        {footerText}
      </div>
    </div>
  );
}
