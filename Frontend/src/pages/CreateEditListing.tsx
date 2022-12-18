import { useContext, useEffect, useState } from 'react';
import Stepper from 'src/components/ListingForm/Stepper/Stepper';
import ListingForm from 'src/components/ListingForm/ListingForm';
import { LISTING_STEPS } from 'src/configs/constants';
import { AuthContext } from 'src/contexts/AuthContext';
import { useQuery } from 'react-query';
import getSinglePropertyApi from 'src/apis/properties/getSinglePropertyApi';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from 'src/configs/routeNames';

type PageProps = {
  pageMode: 'create' | 'edit';
};

const CreateEditListing: React.FC<PageProps> = ({ pageMode }) => {
  const [currentStep, setCurrentStep] =
    useState<typeof LISTING_STEPS[number]['id']>(1);

  const { user } = useContext(AuthContext);

  const params = useParams();

  const navigate = useNavigate();

  const isEditing = pageMode === 'edit';

  const { data } = useQuery(
    ['properties', params.listingId],
    () =>
      getSinglePropertyApi(`${params.listingId}`, {
        params: {},
      }),
    {
      enabled: !!params.listingId && isEditing,
    }
  );

  useEffect(() => {
    //redirect user if property does not belong to them
    if (data?.data.propertyData && !!user) {
      if (data?.data.propertyData.owner_id !== (user?._id || user?.id)) {
        return navigate(ROUTES.HOME, {
          replace: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, user]);

  return (
    <div className="min-h-screen px-20 pt-24">
      <h1 className="mt-5 mb-5">
        {isEditing ? 'Edit' : 'Create'} Property Listing
      </h1>
      <div className="max-w-3xl">
        <Stepper steps={LISTING_STEPS} current={currentStep} />
      </div>

      {isEditing ? (
        data?.data ? (
          <ListingForm
            currentStep={currentStep}
            formMode={pageMode}
            setCurrentStep={setCurrentStep}
            propertyData={data?.data.propertyData}
          />
        ) : (
          <div>Loading</div>
        )
      ) : (
        <ListingForm
          currentStep={currentStep}
          formMode={pageMode}
          setCurrentStep={setCurrentStep}
        />
      )}
    </div>
  );
};

export default CreateEditListing;
