import React from 'react';
import { useQuery } from 'react-query';
import { Link, useSearchParams } from 'react-router-dom';
import getAllPropertiesApi from 'src/apis/properties/getAllPropertiesApi';
import Map from 'src/components/Map/Map';
import Pagination from 'src/components/navigation/Pagination/Pagination';
import SearchCard from 'src/components/SearchCard/SearchCard';
import Loadable from 'src/Layout/Loadable';
import { addressFromComponents } from 'src/shared/utility';

type Props = {};

const Search = (props: Props) => {
  const [searchParams] = useSearchParams();
  const [page] = React.useState(Number(searchParams.get('page')) || 1);

  console.log({ searchParams });

  const { isLoading, isError, data } = useQuery(
    ['properties', page],
    () =>
      getAllPropertiesApi({
        params: {
          page: page,
          addressSearch: searchParams.get('addressSearch') || 'Ireland',
          limit: searchParams.get('limit') || 25,
          sortBy: searchParams.get('availableFrom') || '',
          maxPrice: searchParams.get('maxPrice') || 100000,
          minPrice: searchParams.get('minPrice') || 0,
        },
      }),
    {
      keepPreviousData: true,
    }
  );

  return (
    <div className="">
      <div className=" grid grid-cols-5 text-gray-900">
        <div className="col-span-3 flex h-screen flex-col p-10 pr-8  pt-32 pb-2">
          <h1 className="mb-4">
            <span className="text-lg text-gray-700">Listed properties in </span>
            <span className="text-primary-800">
              {searchParams.get('addressSearch') || 'Ireland'}
            </span>
          </h1>
          <Loadable isLoading={isLoading} isError={isError}>
            <div className="flex min-h-0 flex-1 snap-y flex-col gap-7 overflow-y-scroll pr-2">
              {data?.data.properties.map((property, index) => {
                const {
                  id,
                  name,
                  address,
                  bedroomCount,
                  bathroomCount,
                  propertyCategory,
                  propertyType,
                  features,
                  price,
                  paymentFrequency,
                  images,
                } = property;

                const addressStr = addressFromComponents(address);

                return (
                  <Link key={id} to={`/listing/${id}`}>
                    <SearchCard
                      key={id}
                      propertyId={id}
                      title={name}
                      address={addressStr}
                      bedCount={bedroomCount}
                      type={propertyType}
                      category={propertyCategory}
                      bathCount={bathroomCount}
                      featureCount={features.length}
                      price={price}
                      frequency={`${paymentFrequency}`}
                      imgSrc={images.image1}
                    />
                  </Link>
                );
              })}
            </div>
            <div className="py-4">
              <Pagination
                setPageSize={() => {}}
                setCurrentPage={() => {}}
                isDataLoading={false}
                currentPage={page}
                lastPage={1}
              />
            </div>
          </Loadable>
        </div>
        <div className="map-view  col-span-2 max-h-screen overflow-hidden pt-20">
          <Map
            coords={data?.data.properties.map((property) => ({
              latitude: property.address.coords.coordinates[1],
              longitude: property.address.coords.coordinates[0],
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
