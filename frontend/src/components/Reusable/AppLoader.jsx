import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const spinnerVariants = cva('flex-col items-center justify-center', {
  variants: {
    show: {
      true: 'flex',
      false: 'hidden',
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      small: 'size-6',
      medium: 'size-8',
      large: 'size-12',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export function SpinnerSm({ size, show, children, className, global=true }) {
  return (
    <div className="flex min-h-[60vh]">
      <div 
        className={`${ global? "absolute": "" } 
          top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-background`
        }
      >
        <span className={spinnerVariants({ show })}>
          <Loader2 className={cn(loaderVariants({ size }), className)} />
          {children}
        </span>

      </div>

    </div>
  );
}