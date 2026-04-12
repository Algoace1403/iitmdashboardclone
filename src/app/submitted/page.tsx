export default function SubmittedPage() {
  const footerText =
    'Reporting harassment: IITM BS Degree Team is committed to ensuring that everyone is equally valued and treats one another with respect...';

  const submittedDocs = [
    {
      color: '#2dce89',
      name: 'Class 12th or Equivalent Marksheet / Degree Certificate / Certificate of Highest Level of Education',
      status: 'Document is under verification',
    },
    {
      color: '#fb6340',
      name: 'OBC-NCL / EWS Certificate',
      status: null,
    },
    {
      color: '#2dce89',
      name: 'ID Card Scan',
      status: null,
    },
    {
      color: '#2dce89',
      name: 'JEE qualification proof',
      status: null,
    },
    {
      color: '#fb6340',
      name: 'Signature',
      status: 'Document is under verification',
    },
    {
      color: '#fb6340',
      name: 'Photograph',
      status: 'Document is under verification',
    },
  ];

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#32325d', marginBottom: 20 }}>
        Submitted Documents
      </h1>

      <div style={{ background: '#fff', padding: 24, borderRadius: 4, marginBottom: 24 }}>
        {submittedDocs.map((doc, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 0',
              borderBottom: index < submittedDocs.length - 1 ? '1px solid #e9ecef' : 'none',
              gap: 12,
            }}
          >
            {/* Colored circle */}
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: doc.color,
                flexShrink: 0,
              }}
            />

            {/* Document name */}
            <div style={{ flex: 1, fontSize: 13, color: '#525f7f', lineHeight: 1.5 }}>
              {doc.name}
            </div>

            {/* VIEW DOCUMENT button */}
            <button
              style={{
                background: '#2dce89',
                color: '#fff',
                border: 'none',
                padding: '4px 12px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              VIEW DOCUMENT
            </button>

            {/* Status text */}
            {doc.status && (
              <span
                style={{
                  fontSize: 12,
                  color: '#fb6340',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {doc.status}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: '#8898aa', padding: '16px 0', lineHeight: 1.6 }}>
        {footerText}
      </div>
    </div>
  );
}
