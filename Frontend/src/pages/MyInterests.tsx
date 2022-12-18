import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import getMyInterestsApi from 'src/apis/interests/getMyInterestsApi';
import SearchCard from 'src/components/SearchCard/SearchCard';
import Loadable from 'src/Layout/Loadable';
import { addressFromComponents } from 'src/shared/utility';

type Props = {};

const MyInterests = (props: Props) => {
  const navigate = useNavigate();

  const {
    data: interestsData,
    isLoading,
    isError,
  } = useQuery(['myInterests'], () => getMyInterestsApi({}));

  return (
    <div className="">
      <div className=" grid grid-cols-5 text-gray-900">
        <div className="col-span-4 flex h-screen flex-col p-10 pr-8  pt-32 pb-2">
          <h1 className="mb-4">
            <span className="text-primary-800">My Interested Properties</span>
          </h1>
          <Loadable isLoading={isLoading} isError={isError}>
            <div className="flex min-h-0 flex-1 snap-y flex-col gap-7 overflow-y-auto pr-2">
              {interestsData?.data.interests.map((intrst, index) => {
                const {
                  id,
                  name,
                  address,
                  bedroomCount,
                  bathroomCount,
                  features,
                  price,
                  paymentFrequency,
                  images,
                } = intrst.propertyDetails;

                const addressStr = addressFromComponents(address);

                return (
                  <SearchCard
                    key={id}
                    propertyId={id}
                    title={name}
                    address={addressStr}
                    bedCount={bedroomCount}
                    bathCount={bathroomCount}
                    featureCount={features.length}
                    price={price}
                    frequency={`${paymentFrequency}`}
                    imgSrc={images.image1}
                    onClick={() => navigate(`/listing/${id}`)}
                  />
                );
              })}
            </div>
          </Loadable>

          <div className="py-4">
            {/* <Pagination
              setPageSize={() => {}}
              setCurrentPage={() => {}}
              isDataLoading={false}
              currentPage={page}
              lastPage={1}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInterests;
