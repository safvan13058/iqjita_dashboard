// import React from 'react';

const MailPage = () => {
  return (
    <div style={{ height: '100vh', width: '100%', border: 'none' }}>
      {/* <h2 style={{ textAlign: 'center', margin: '20px 0' }}>My Mailbox</h2> */}
      <iframe
        src="https://mail.hostinger.com/?clearSession=true&_user=hr@iqjita.com" // Change this to your Hostinger mail URL
        style={{
          width: '100%',
          height: '90vh',
          border: 'none',
        }}
        title="Hostinger Mailbox"
      />
    </div>
  );
};

export default MailPage;
