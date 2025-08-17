import type { SVGProps } from 'react';
import { Box } from 'lucide-react'; // Import Box from lucide-react

export const SunbedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 14v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" />
    <path d="M6 14l-3 5" />
    <path d="M18 14l3 5" />
    <path d="M11 10V6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
  </svg>
);

export const TableIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 8h18a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
    <path d="M12 8V6" />
    <path d="M12 18v-2" />
    <path d="M7 18v-2" />
    <path d="M17 18v-2" />
  </svg>
);

export const BoatIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 16.1A5 5 0 0 1 2 9.9V6a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v3.9a5 5 0 0 1 0 6.2V20a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
    <path d="M22 12H2" />
  </svg>
);

export const WorkspaceIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

export const RoomIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
);

export { Box };
