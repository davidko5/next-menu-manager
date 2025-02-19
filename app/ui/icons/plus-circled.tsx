import React from 'react';

import { cn } from '@/app/lib/cn';
export type IconProps = React.SVGProps<SVGSVGElement>;

const PlusCircledIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      {...props}
      className={cn('', className)}
      width='18'
      height='20'
      viewBox='0 0 19 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M9.50002 6.66667V13.3333M6.16669 10H12.8334M17.8334 10C17.8334 14.6024 14.1024 18.3333 9.50002 18.3333C4.89765 18.3333 1.16669 14.6024 1.16669 10C1.16669 5.39763 4.89765 1.66667 9.50002 1.66667C14.1024 1.66667 17.8334 5.39763 17.8334 10Z'
        stroke='currentColor'
        strokeWidth='1.66667'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
);

PlusCircledIcon.displayName = 'SearchIcon';
export default PlusCircledIcon;
