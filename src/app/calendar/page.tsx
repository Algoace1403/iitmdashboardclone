export default function CalendarPage() {
  const footerText =
    'Reporting harassment: IITM BS Degree Team is committed to ensuring that everyone is equally valued and treats one another with respect...';

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#32325d', marginBottom: 8 }}>
        Academic Calendar
      </h1>
      <p style={{ fontSize: 13, color: '#525f7f', marginBottom: 24, lineHeight: 1.6 }}>
        We recommend that you add all the calendars listed to your student email&apos;s Google
        Calendar by clicking the &apos;Add Calendar&apos; buttons.
      </p>

      {/* Common Term Calendar */}
      <div style={{ background: '#fff', padding: 24, marginBottom: 24, borderRadius: 4 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#32325d', margin: 0 }}>
            Common Term Calendar
          </h2>
          <button
            style={{
              background: '#2dce89',
              color: '#fff',
              border: 'none',
              padding: '6px 16px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ADD CALENDAR
          </button>
        </div>
        <p style={{ fontSize: 13, color: '#525f7f', lineHeight: 1.6, margin: 0 }}>
          The calendar shows the overall term schedule including weekly content release dates,
          assignment deadlines, quiz dates, end term dates, course registration dates, etc.
        </p>
      </div>

      {/* Course Calendars */}
      <div style={{ background: '#fff', padding: 24, marginBottom: 24, borderRadius: 4 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#32325d', marginBottom: 12 }}>
          COURSE CALENDARS:
        </h2>
        <p style={{ fontSize: 13, color: '#525f7f', lineHeight: 1.6, margin: 0 }}>
          The course calendars include dates specific to the courses you have registered for - like
          sessions, mock tests, etc.
        </p>
      </div>

      <div style={{ fontSize: 12, color: '#8898aa', padding: '16px 0', lineHeight: 1.6 }}>
        {footerText}
      </div>
    </div>
  );
}
