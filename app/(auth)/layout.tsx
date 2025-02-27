import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className="bg-primary auth-layout">{children}</div>;
};

export default AuthLayout;
