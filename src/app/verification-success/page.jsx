// app/verification-success/page.js
'use client';

import { useSearchParams } from 'next/navigation';

export default function VerificationSuccess() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="success-container">
      <h1>Email Verified Successfully!</h1>
      <p>Your email {email} has been verified.</p>
      <p>You may now return to your original device to complete the form.</p>
      <p>The form should automatically update to show your email is verified.</p>
    </div>
  );
}