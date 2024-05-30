"use client";

import { useAuth } from "@pangeacyber/react-auth";

const User = () => {
  const { user } = useAuth();

  return (
    <main>
      <div>
        <h2>Hello {user?.profile?.first_name}!</h2>
        <p>This is a private page, only authenticated users can view this.</p>
      </div>
    </main>
  );
};

export default User;
