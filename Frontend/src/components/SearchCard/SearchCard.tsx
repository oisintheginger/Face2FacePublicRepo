import React from 'react';
import FeaturePill from 'src/components/SearchCard/FeaturePill/FeaturePill';
import { FaBed, FaBath } from 'react-icons/fa';
import { MapPinIcon } from '@heroicons/react/24/solid';

import PhImage from 'src/assets/img/property-ph.jpeg';

type SearchCardProps = {
  isSaved?: boolean;
  category?: string;
  type?: string;
  title: React.ReactNode;
  price: number;
  frequency: string;
  address: string;
  bedCount: number;
  bathCount: number;
  featureCount: number;
  imgSrc: string;
} & (
  | {
      isPreviewing: true;
      propertyId?: undefined;
    }
  | {
      isPreviewing?: false;
      propertyId: string;
    }
) &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const SearchCard: React.FC<SearchCardProps> = ({
  isSaved,
  address,
  isPreviewing,
  title,
  price,
  frequency,
  bedCount,
  bathCount,
  featureCount,
  category,
  type,
  propertyId,
  imgSrc,
  ...searchCardProps
}) => {
  return (
    <div
      className={` location-card grid ${
        isPreviewing ? '' : 'cursor-pointer'
      } grid-cols-6 gap-5 rounded-xl bg-white p-3 shadow-inner transition-shadow duration-700 ease-in-out hover:shadow-md`}
      {...searchCardProps}
    >
      <div className="col-span-2 h-44 overflow-hidden rounded-lg border">
        <img
          alt="tree"
          className="h-full w-full object-cover object-center transition-all hover:scale-110 "
          src={!!imgSrc ? imgSrc : PhImage}
        />
      </div>
      <div className="relative col-span-4 flex flex-col">
        <div className="flex flex-1 flex-col justify-between pr-16 pt-1">
          <h4>{title || 'Cempaka Indah Land, City Park'}</h4>
          <p className="mt-2 ml-[-0.225rem] overflow-hidden text-ellipsis whitespace-nowrap text-gray-600">
            <MapPinIcon className="mr-1 mb-1 inline-block h-5 w-5" />
            {address ||
              '684 Redbud Drive, Surabaya, East Surabaya,East East Surabaya'}
          </p>
          <div className="mt-1 flex items-baseline space-x-5">
            <p className=" text-lg font-semibold text-primary-800">
              €{price?.toFixed(2)}
              <small className="text-gray-600">/{frequency}</small>
            </p>
            <p className="capitalize">
              {type} <span className="lowercase">for</span> {category}
            </p>
          </div>
        </div>
        <div className="mt-2 flex justify-between py-1">
          <div className="flex gap-3  text-gray-800">
            <FeaturePill Icon={FaBed} text={`${bedCount} Bed`} />
            <FeaturePill Icon={FaBath} text={`${bathCount} Bath`} />
            <FeaturePill text={`${featureCount}+`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
