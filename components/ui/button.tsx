import type { AnchorHTMLAttributes } from 'react';

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: 'dark' | 'light' | 'text'; href: string };

export function Button({ variant = 'dark', className = '', children, ...props }: ButtonProps) {
  return <a className={`button button-${variant} ${className}`} {...props} />;
}
