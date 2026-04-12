export default function CertificatesPage() {
  const footerText =
    'Reporting harassment: IITM BS Degree Team is committed to ensuring that everyone is equally valued and treats one another with respect...';

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#32325d', marginBottom: 20 }}>
        Student Certificates
      </h1>

      <div style={{ background: '#fff', padding: 24, borderRadius: 4, marginBottom: 24 }}>
        {/* Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 13, color: '#525f7f' }}>
            Show{' '}
            <select
              style={{
                border: '1px solid #ccc',
                borderRadius: 4,
                padding: '2px 8px',
                fontSize: 13,
              }}
              defaultValue="10"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>{' '}
            entries
          </div>
          <div style={{ fontSize: 13, color: '#525f7f' }}>
            Search:{' '}
            <input
              type="text"
              style={{
                border: '1px solid #ccc',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 13,
              }}
            />
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f8f8' }}>
              <th
                style={{
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#525f7f',
                  borderBottom: '2px solid #e0e0e0',
                  textAlign: 'left',
                }}
              >
                Certificate Type
              </th>
              <th
                style={{
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#525f7f',
                  borderBottom: '2px solid #e0e0e0',
                  textAlign: 'left',
                }}
              >
                Certificate
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={2}
                style={{
                  padding: '20px 16px',
                  fontSize: 13,
                  color: '#525f7f',
                  textAlign: 'center',
                  borderBottom: '1px solid #e9ecef',
                }}
              >
                No data available in table
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <span style={{ fontSize: 13, color: '#525f7f' }}>Showing 0 to 0 of 0 entries</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                padding: '4px 12px',
                borderRadius: 4,
                fontSize: 12,
                color: '#525f7f',
                cursor: 'pointer',
              }}
            >
              Previous
            </button>
            <button
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                padding: '4px 12px',
                borderRadius: 4,
                fontSize: 12,
                color: '#525f7f',
                cursor: 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: '#8898aa', padding: '16px 0', lineHeight: 1.6 }}>
        {footerText}
      </div>
    </div>
  );
}
