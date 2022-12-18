import { Popover, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import deletePropertyApi from 'src/apis/properties/deletePropertyApi';
import getOwnPropertiesApi from 'src/apis/properties/getOwnPropertiesApi';
import SearchCard from 'src/components/SearchCard/SearchCard';
import Button from 'src/components/UI/Button/Button';
import Loadable from 'src/Layout/Loadable';
import { addressFromComponents } from 'src/shared/utility';

type Props = {};

const MyListings = (props: Props) => {
  const [page] = React.useState(1);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery(
    ['myProperties', page],
    () =>
      getOwnPropertiesApi({
        params: {
          page: page,
          limit: 25,
          sortBy: 'availableFrom',
          maxPrice: 100000,
          minPrice: 0,
        },
      }),
    {
      keepPreviousData: true,
    }
  );

  const { mutate: deleteMutate, isLoading: isDeleteLoading } = useMutation(
    (propertyId: string) => deletePropertyApi(propertyId),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['myProperties']);
        toast.info(`Property has been deleted`);
      },
    }
  );

  return (
    <div className="">
      <div className=" grid grid-cols-5 text-gray-900">
        <div className="col-span-4 flex h-screen flex-col p-10 pr-8  pt-32 pb-2">
          <h1 className="mb-4">
            <span className="text-primary-800">My Listings</span>
          </h1>
          <Loadable isLoading={isLoading} isError={isError}>
            <div className="flex min-h-0 flex-1 snap-y flex-col gap-7 overflow-y-auto pr-2">
              {data?.data.Properties.map((property, index) => {
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
                } = property;

                const addressStr = addressFromComponents(address);

                return (
                  <div key={id} className="relative">
                    <Popover className="z-8 relative top-full">
                      {({ close }) => (
                        <>
                          <Popover.Button
                            as={Button}
                            text="Delete"
                            loading={isDeleteLoading}
                            className={`absolute right-2 bottom-2 z-[5] bg-red-500 px-4 py-2 hover:bg-red-600 active:bg-red-600`}
                          />
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                          >
                            <Popover.Panel className="absolute left-full -top-9 z-10 mt-3 w-screen max-w-max -translate-x-full transform px-4 sm:px-0">
                              <div className=" overflow-hidden rounded-lg bg-white p-5 shadow-lg ring-1 ring-black ring-opacity-5">
                                <p>You sure to delete this listing?</p>
                                <div className="mt-6 flex justify-center space-x-5">
                                  <Button
                                    className="bg-red-500 px-4 py-2 hover:bg-red-600 active:bg-red-600"
                                    text="Yes"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteMutate(id);
                                      close();
                                    }}
                                  />
                                  <Button
                                    variant="link"
                                    className=" px-4 py-2"
                                    text="Cancel"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      close();
                                    }}
                                  />
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                    <div>
                      <Button
                        className="absolute right-2 top-2 z-[5] px-4 py-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-listing/${id}`);
                        }}
                        text="Edit"
                      />
                    </div>
                    <Link to={`/listing/${id}`}>
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
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
          </Loadable>

          {/* <div className="py-4">
            <Pagination
              setPageSize={() => {}}
              setCurrentPage={() => {}}
              isDataLoading={false}
              currentPage={page}
              lastPage={1}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MyListings;
