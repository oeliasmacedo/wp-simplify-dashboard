
import React, { ReactNode } from "react";

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="rounded-md border p-8 text-center">
      <p className="text-muted-foreground">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
