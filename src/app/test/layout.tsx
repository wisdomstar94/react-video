import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-video test',
  description: 'react-video test',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
