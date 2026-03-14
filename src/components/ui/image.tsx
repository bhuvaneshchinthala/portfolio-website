import { type ImgHTMLAttributes, forwardRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import './image.css';

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fittingType?: 'contain' | 'cover' | 'fill';
};

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, className, fittingType, alt, ...props }, ref) => {
    const [imgSrc, setImgSrc] = useState<string | undefined>(src);

    useEffect(() => {
      setImgSrc(src);
    }, [src]);

    if (!src) {
      return <div data-empty-image className={cn("bg-gray-200", className)} {...props} />;
    }

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt || ""}
        className={cn(className, "object-cover")} // Default to object-cover
        onError={() => console.warn(`Failed to load image: ${src}`)}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';
