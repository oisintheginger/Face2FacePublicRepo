import React, { useContext } from 'react';
import { HomeIcon, KeyIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { FaBath, FaBed } from 'react-icons/fa';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import getSinglePropertyApi from 'src/apis/properties/getSinglePropertyApi';
import FeaturePill from 'src/components/SearchCard/FeaturePill/FeaturePill';
import Button from 'src/components/UI/Button/Button';
import PhImage from 'src/assets/img/property-ph.jpeg';
import { addressFromComponents } from 'src/shared/utility';
import { FACILITY_NAME_MAP } from 'src/configs/constants';
import { AuthContext } from 'src/contexts/AuthContext';
import { toast } from 'react-toastify';
import registerInterestApi from 'src/apis/interests/registerInterestApi';
import { ROUTES } from 'src/configs/routeNames';
import getMyInterestsApi from 'src/apis/interests/getMyInterestsApi';
import SimpleSlider from 'src/components/UI/SimpleSlider/SimpleSlider';
import Loadable from 'src/Layout/Loadable';

type Props = {};

const ViewListing = (props: Props) => {
  const params = useParams();

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const { isLoading, isError, data } = useQuery(
    ['properties', params.listingId],
    () =>
      getSinglePropertyApi(`${params.listingId}`, {
        params: {},
      }),
    {
      enabled: !!params.listingId,
    }
  );

  const { data: interestsData, isLoading: isMyInterestLoading } = useQuery(
    ['myInterests'],
    () => getMyInterestsApi({}),
    {
      enabled: !!params.listingId && !!user?.id,
    }
  );

  const isAlreadyInterested = !!interestsData?.data.interests.find(
    (intrst) => intrst.interestedUserID === (user?._id || user?.id)
  );

  const {
    mutate: mutateInterest,
    isSuccess,
    isLoading: isRegisterIntrstLoading,
  } = useMutation((propertyId: string) => registerInterestApi({ propertyId }), {
    onSuccess(data) {
      toast.success('Your interest has been registered');
      return;
    },
  });

  let content = null;

  const renderInterestButton = (
    ownerId: string,
    propertyId: string,
    myInterestsLoading: boolean
  ) => {
    if (user) {
      if ((user?._id || user?.id) === ownerId) {
        return (
          <Button
            text={'View Interested Users'}
            onClick={() => {
              navigate(`/listing-interests/${propertyId}`);
            }}
          />
        );
      } else {
        return (
          <Button
            text={
              isSuccess || isAlreadyInterested
                ? 'Already registered'
                : "I'm interested"
            }
            loading={isRegisterIntrstLoading}
            disabled={isSuccess || myInterestsLoading || isAlreadyInterested}
            onClick={() => {
              mutateInterest(propertyId);
            }}
          />
        );
      }
    } else {
      return (
        <Button
          text={isSuccess ? 'Pending owner response' : "I'm interested"}
          loading={isRegisterIntrstLoading}
          disabled={isSuccess}
          onClick={() => {
            if (!!user) {
              mutateInterest(propertyId);
            } else {
              navigate(ROUTES.LOGIN);
            }
          }}
        />
      );
    }
  };
  if (data?.data) {
    const {
      id,
      name,
      images,
      availableFrom,
      bathroomCount,
      bedroomCount,
      address,
      features,
      description,
      price,
      paymentFrequency,
      propertyCategory,
      propertyType,
      owner_id,
    } = data.data.propertyData;

    const imgArr = Object.values(images).filter(Boolean);

    content = (
      <>
        <h1 className="h2 mt-5 mb-5">{name}</h1>
        <SimpleSlider>
          {!!imgArr.length ? (
            imgArr.map((img, index) => {
              return (
                <div
                  key={index}
                  className="h-80 max-w-3xl overflow-hidden rounded-xl"
                >
                  <img
                    src={img}
                    className="h-full w-full object-cover"
                    alt={name + ' image 1'}
                  />
                </div>
              );
            })
          ) : (
            <div className="h-80 max-w-3xl overflow-hidden rounded-xl">
              <img
                src={PhImage}
                className="h-full w-full object-cover"
                alt={name + ' image 1'}
              />
            </div>
          )}
        </SimpleSlider>

        <div className="mt-10 flex gap-10">
          <div className="flex items-center gap-2">
            <KeyIcon className="w-8 text-primary" />{' '}
            <h4 className="capitalize">{propertyCategory}</h4>
          </div>
          <div className="flex items-center gap-2">
            <HomeIcon className="w-8 text-primary" />{' '}
            <h4 className="capitalize">{propertyType}</h4>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-8 w-8 shrink-0 text-primary" />{' '}
            <h4 className="text-base capitalize">
              {addressFromComponents(address)}
            </h4>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between rounded-xl bg-primary-100 bg-opacity-30 py-4 px-8">
          <h3 className="text-xl font-semibold">
            €{price} /{paymentFrequency}
          </h3>
          {renderInterestButton(owner_id, id, isMyInterestLoading)}
        </div>
        <div className="mt-14">
          <h2>Available From: {new Date(availableFrom).toDateString()}</h2>
        </div>
        <div className="mt-14">
          <h2>Description</h2>
          <article className="mt-4 whitespace-pre-line">{description}</article>
        </div>
        <div className="mt-14">
          <h2>Features</h2>
          <div className="mt-6 flex flex-wrap gap-5">
            <FeaturePill Icon={FaBed} text={`${bedroomCount} Bedroom`} />
            <FeaturePill Icon={FaBath} text={`${bathroomCount} Bath`} />
            {features.map((feature) => {
              return FACILITY_NAME_MAP.hasOwnProperty(feature) ? (
                <FeaturePill key={feature} text={FACILITY_NAME_MAP[feature]} />
              ) : null;
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen  px-20 pt-24 pb-20">
      <div className="min-h-full max-w-3xl">
        <Loadable isLoading={isLoading} isError={isError}>
          {content}
        </Loadable>
      </div>
    </div>
  );
};

export default ViewListing;
