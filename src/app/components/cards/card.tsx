import React from "react";

interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Card = React.memo(function Card({
  title,
  description,
  icon,
  className = "",
}: CardProps) {
  return (
    <div
      className={`flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      {icon && (
        <div className="mb-4 flex items-center justify-center text-2xl">
          {icon}
        </div>
      )}
      <h3 className="mb-2 font-semibold text-card-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
});
