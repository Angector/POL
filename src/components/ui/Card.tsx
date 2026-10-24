import type { ElementType, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Card({ children, className = '', as: Component = 'div' }: CardProps) {
  return (
    <Component
      className={`bg-command-panel border border-command-border rounded-lg p-6 ${className}`}
    >
      {children}
    </Component>
  );
}
