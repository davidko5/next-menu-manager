import React from 'react';

import { cn } from '@/app/lib/cn';
export type IconProps = React.SVGProps<SVGSVGElement>;

const ArrowLeftIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      {...props}
      className={cn('', className)}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M19 12H5M5 12L12 19M5 12L12 5'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
);

ArrowLeftIcon.displayName = 'ArrowLeftIcon';
export default ArrowLeftIcon;
