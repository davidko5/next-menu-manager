import React from 'react';

import { cn } from '@/app/lib/cn';
export type IconProps = React.SVGProps<SVGSVGElement>;

const ArrowLeftIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      {...props}
      className={cn('', className)}
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M15 8H1M1 8L8 15M1 8L8 1'
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
