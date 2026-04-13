export default function DocumentsPage() {
  const footerText =
    'Reporting harassment: IITM BS Degree Team is committed to ensuring that everyone is equally valued and treats one another with respect...';

  const documents = [
    { type: 'IITM_ID_CARD', name: 'Student Identity Card-2025' },
    { type: 'IITM_ID_CARD', name: 'Student Identity Card-2026' },
    { type: 'RECEIPT', name: 'F3-2025 FEE RECEIPT (QUALIFIER)' },
    { type: 'RECEIPT', name: 'Receipt of payment - F1-2026' },
    { type: 'RECEIPT', name: 'Receipt of payment - F3-2025' },
    { type: 'TERMWISE_PROGRESS_CARD', name: '2025 September Progress Card' },
  ];

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#32325d', marginBottom: 20 }}>
        Student Documents
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
                Document Type
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
                Document
              </th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={index}>
                <td
                  style={{
                    padding: '10px 16px',
                    fontSize: 13,
                    color: '#525f7f',
                    borderBottom: '1px solid #e9ecef',
                  }}
                >
                  {doc.type}
                </td>
                <td
                  style={{
                    padding: '10px 16px',
                    fontSize: 13,
                    borderBottom: '1px solid #e9ecef',
                  }}
                >
                  <a
                    href="#"
                    download
                    style={{ color: '#aa3535', textDecoration: 'none' }}
                  >
                    {doc.name}
                  </a>
                </td>
              </tr>
            ))}
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
          <span style={{ fontSize: 13, color: '#525f7f' }}>Showing 1 to 6 of 6 entries</span>
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
                background: '#aa3535',
                border: '1px solid #aa3535',
                padding: '4px 12px',
                borderRadius: 4,
                fontSize: 12,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              1
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
