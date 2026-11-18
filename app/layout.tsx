import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shiraz Zafar — Product & Systems Engineer',
  description: 'Senior product and systems engineering for SaaS, AI platforms, and real-time products.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
