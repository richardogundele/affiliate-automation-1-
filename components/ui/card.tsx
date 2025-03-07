import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

export const Card = ({ children }: CardProps) => {
  return <div className="border rounded-lg shadow-md p-4">{children}</div>;
};

interface CardHeaderProps {
  children: ReactNode;
}

export const CardHeader = ({ children }: CardHeaderProps) => {
  return <div className="border-b mb-2">{children}</div>;
};

export const CardContent = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export const CardTitle = ({ children }: { children: ReactNode }) => {
  return <h3 className="text-lg font-bold">{children}</h3>;
};
