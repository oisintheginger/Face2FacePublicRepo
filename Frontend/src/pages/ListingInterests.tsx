import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import getUsersInterestByProperty from 'src/apis/interests/getUsersInterestByProperty';
import rejectInterestInvitationApi from 'src/apis/interests/rejectInterestInvitationApi';
import sendInterestInvitationApi from 'src/apis/interests/sendInterestInvitationApi';
import AvatarPlaceholder from 'src/components/UI/Avatar/Avatar';
import Button from 'src/components/UI/Button/Button';
import { INTEREST_STATUS_MAP } from 'src/configs/constants';
import { Interest } from 'src/configs/interfaces';
import { joinClassNames } from 'src/shared/utility';

type Props = {};

const ListingInterests = (props: Props) => {
  const params = useParams();

  const { data } = useQuery(
    ['propertyInterests', params.listingId],
    () =>
      getUsersInterestByProperty(`${params.listingId}`, {
        params: {},
      }),
    {
      enabled: !!params.listingId,
      cacheTime: 0,
    }
  );

  const [resultState, setResultState] = useState<
    Record<string, Interest['interestStatus'] | 'loading' | 'error'>
  >({});

  const { mutate: acceptMutate } = useMutation(
    (interestData: { interestId: string }) =>
      sendInterestInvitationApi(interestData),
    {
      onMutate: ({ interestId }) => {
        setResultState((s) => ({ ...s, [interestId]: 'loading' }));
      },
      onSuccess: ({ data }, { interestId }) => {
        setResultState((s) => ({ ...s, [interestId]: 1 }));
        toast.success(`Invitation sent successfully`);
      },
      onError: ({ data }, { interestId }) => {
        setResultState((s) => ({ ...s, [interestId]: 'error' }));
      },
    }
  );

  const { mutate: rejectMutate } = useMutation(
    (interestData: { interestId: string }) =>
      rejectInterestInvitationApi(interestData),
    {
      onMutate: ({ interestId }) => {
        setResultState((s) => ({ ...s, [interestId]: 'loading' }));
      },
      onSuccess: ({ data }, { interestId }) => {
        setResultState((s) => ({ ...s, [interestId]: 2 }));
        toast.info(`Interest has been rejected`);
      },
      onError: ({ data }, { interestId }) => {
        setResultState((s) => ({ ...s, [interestId]: 'error' }));
      },
    }
  );

  let content = null;

  if (data?.data) {
    const { property, interestData } = data.data;
    content = (
      <>
        <h1 className="mb-8">
          <span className="text-primary-800">
            Users Interested in "{property.name}"
          </span>
        </h1>
        <div className="">
          {interestData.map(({ user: interestedUser, interest }) => {
            return (
              <div
                key={interestedUser.id}
                className="mb-6 grid grid-cols-3 gap-6"
              >
                <div className="relative col-span-1 flex flex-col justify-center rounded-lg bg-white p-5 shadow-sm">
                  <p
                    className={joinClassNames(
                      interest.interestStatus === 0 ? 'text-gray-600' : '',
                      interest.interestStatus === 1 ? 'text-green-600' : '',
                      interest.interestStatus === 2 ? 'text-red-500' : '',
                      'absolute right-5 top-4 text-sm capitalize italic '
                    )}
                  >
                    {INTEREST_STATUS_MAP[interest.interestStatus]}
                  </p>
                  <div className="mb-1 flex flex-col items-center justify-center">
                    <div className="relative text-gray-300">
                      {!!interestedUser?.avatar ? (
                        <div className="inline-block h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                          <img
                            src={interestedUser.avatar}
                            className="h-full w-full object-cover"
                            alt="your avatar"
                          />
                        </div>
                      ) : (
                        <AvatarPlaceholder className="max-h-16 max-w-[4rem]" />
                      )}
                    </div>

                    <p className="mb-4 mt-1 text-center  text-gray-800">
                      {interestedUser?.name}
                    </p>
                    <div className="flex space-x-6">
                      {/*  Hide accept button only if the interest has been accepted */}
                      {(interest.interestStatus !== 1 ||
                        (resultState[interest.id] &&
                          resultState?.[interest.id] !== 1)) && (
                        <Button
                          className="bg-green-600 px-4 py-2"
                          text="Accept"
                          loading={resultState[interest.id] === 'loading'}
                          disabled={resultState[interest.id] === 'loading'}
                          onClick={() => {
                            acceptMutate({
                              interestId: interest.id,
                            });
                          }}
                        />
                      )}
                      {/* Show reject button only if the interest has not been accepted or rejected */}
                      {(![1, 2].includes(interest.interestStatus) ||
                        (resultState?.[interest.id] &&
                          ![1, 2].some(
                            (status) => status === resultState[interest.id]
                          ))) && (
                        <Button
                          variant="link"
                          className="border-2 border-red-500 px-4 py-2 text-red-500"
                          text="Reject"
                          loading={resultState[interest.id] === 'loading'}
                          disabled={resultState[interest.id] === 'loading'}
                          onClick={() => {
                            rejectMutate({
                              interestId: interest.id,
                            });
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-2 rounded-xl bg-white p-6 shadow-sm">
                  <h3 className="mb-5 text-xl">Bio</h3>
                  {interestedUser?.description ? (
                    <article className="whitespace-pre-line">
                      {interestedUser?.description}
                    </article>
                  ) : (
                    <article className="text-gray-200">No Bio yet..</article>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <div className="">
      <div className=" grid grid-cols-5 text-gray-900">
        <div className="col-span-4 flex h-screen flex-col overflow-y-auto p-10 pr-8  pt-32 pb-2">
          {content}
        </div>
      </div>
    </div>
  );
};

export default ListingInterests;
