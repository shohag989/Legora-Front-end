import React from 'react';
import Image from 'next/image';
import { FiStar, FiMapPin } from 'react-icons/fi';

interface ServiceCardProps {
  title: string;
  designerName: string;
  price: string;
  rating: number;
  location: string;
  imageUrl: string;
  avatarUrl: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  designerName,
  price,
  rating,
  location,
  imageUrl,
  avatarUrl
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/10">
        <Image 
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <FiStar className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-text">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-text text-lg leading-tight line-clamp-2">{title}</h3>
          <span className="font-bold text-primary whitespace-nowrap ml-3">{price}</span>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <div className="w-8 h-8 rounded-full overflow-hidden relative bg-muted/20">
            <Image src={avatarUrl} alt={designerName} fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text">{designerName}</span>
            <div className="flex items-center text-xs text-muted">
              <FiMapPin className="w-3 h-3 mr-1" />
              {location}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
