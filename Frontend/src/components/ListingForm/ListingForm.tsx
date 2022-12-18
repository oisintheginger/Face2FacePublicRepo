import React, { useEffect, useRef, useState } from 'react';
import { SelectOption } from 'src/components/UI/inputs/interfaces';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from 'src/components/UI/Button/Button';
import InputPrepend from 'src/components/UI/inputs/attachments/InputPrepend';
import Input from 'src/components/UI/inputs/Input';
import MyPlacesSelect from 'src/components/UI/inputs/MyPlacesSelect';
import MyReactSelect from 'src/components/UI/inputs/MySelect';
import {
  CATEGORY_OPTIONS,
  FACILITY_OPTIONS,
  FREQUENCY_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from 'src/configs/selectOptions';
import usePlacesAutocomplete, { getDetails } from 'use-places-autocomplete';
import { FaBath, FaBed, FaEuroSign } from 'react-icons/fa';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import MyRadioGroup from 'src/components/UI/inputs/RadioGroup';
import MyTextArea from 'src/components/UI/inputs/MyTextArea';
import { toast } from 'react-toastify';
import MediaPreview from 'src/components/MediaPreview/MediaPreview';
import SearchCard from 'src/components/SearchCard/SearchCard';
import createPropertyApi from 'src/apis/properties/createPropertyApi';
import { useMutation, useQueryClient } from 'react-query';
import { ROUTES } from 'src/configs/routeNames';
import { useNavigate } from 'react-router-dom';
import {
  addressFromComponents,
  formatDateForInput,
  formatPlaceResult,
  getOptionWithValue,
} from 'src/shared/utility';
import {
  ListingFormFields,
  ListingFormProps,
} from 'src/components/ListingForm/interfaces';
import updatePropertyApi from 'src/apis/properties/updatePropertyApi';

const ListingForm: React.FC<ListingFormProps> = ({
  currentStep,
  setCurrentStep,
  formMode,
  propertyData,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue: setFormValue,
    formState: { errors, isValid, isDirty },
  } = useForm<ListingFormFields>({
    reValidateMode: 'onChange',
    shouldUnregister: false,
  });

  let content = null;

  const isEditing = formMode === 'edit';

  const queryClient = useQueryClient();

  const [uploadedFiles, setUploadedFiles] = useState<
    { file: File | null; data: FileReader['result'] }[]
  >([]);

  const isInitialSuggestion = useRef(true);

  const navigate = useNavigate();

  const {
    ready,
    value,
    suggestions: { status, data: suggestionsResults },
    setValue: setSearchValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: 'initMap',
    requestOptions: {
      componentRestrictions: {
        country: ['ie'],
      },
      types: ['street_address', 'postal_code'],
    },
    debounce: 300,
    cache: 0,
  });

  const { mutate, isLoading } = useMutation(
    (propertyData: FormData) =>
      isEditing
        ? updatePropertyApi(propertyData, {
            onUploadProgress: (ev) =>
              setUploadProgress(Math.round((ev.loaded * 100) / ev.total!)),
          })
        : createPropertyApi(propertyData, {
            onUploadProgress: (ev) =>
              setUploadProgress(Math.round((ev.loaded * 100) / ev.total!)),
          }),
    {
      onSuccess(data) {
        if (isEditing) {
          toast.success('Edited Listing Successfully');
          queryClient.invalidateQueries(['myProperties']);
          return navigate(ROUTES.MY_LISTINGS);
        }

        toast.success('Property Listing Successful');
        return navigate(ROUTES.SEARCH);
      },
      onError(error) {
        setUploadProgress(0);
      },
    }
  );

  const submitHandler: SubmitHandler<ListingFormFields> = async (data) => {
    const {
      title,
      amount,
      bedroomCount,
      propertyType,
      frequency,
      category,
      place_result,
      bathroomCount,
      availableFrom,
      facilities,
      description,
      propertyId,
    } = data;

    if (currentStep === 6) {
      console.log(data, 'ListingFormFields data');

      const address = [
        place_result.addressline1,
        place_result.addressline2,
        place_result.city,
        place_result.county,
        place_result.postcode,
        place_result.country,
      ].join(',');

      const formData = new FormData();
      formData.append('propertyName', title);
      formData.append('propertyPrice', `${amount}`);
      formData.append('propertyCategory', `${category.value}`);
      formData.append('paymentFrequency', `${frequency.value}`);
      formData.append('propertyType', `${propertyType.value}`);
      formData.append('bedroomCount', `${bedroomCount}`);
      formData.append('bathroomCount', `${bathroomCount}`);
      formData.append('availableFrom', availableFrom);
      formData.append('description', description);
      formData.append('latitude', `${place_result.coords[0]}`);
      formData.append('longitude', `${place_result.coords[1]}`);
      formData.append('propertyFeatures', facilities as unknown as Blob);

      // formData formats are different for update and create
      if (isEditing) {
        formData.append('propertyId', propertyId);
        formData.append('addressLine1', place_result.addressline1);
        formData.append('addressLine2', place_result.addressline2);
        formData.append('city', place_result.city);
        formData.append('county', place_result.county);
        formData.append('postcode', place_result.postcode);
        formData.append('country', place_result.country);
        uploadedFiles.forEach((item, index) => {
          if (!!item.file) {
            formData.append(`image${index + 1}`, item.file);
          }
        });
      } else {
        formData.append('propertyAddress', address);
        uploadedFiles.forEach((item) => {
          if (!!item.file) {
            formData.append('propertyImages', item.file);
          }
        });
      }

      mutate(formData);
    }
  };

  const handleSelect = (res: { description: string } & SelectOption) => {
    console.log(res, 'called res');
    setSearchValue(res?.description, false);
    clearSuggestions();

    getDetails({
      placeId: `${res.value}`,
      fields: [
        'address_components',
        'adr_address',
        'formatted_address',
        'geometry.location',
        'type',
        'name',
        'url',
        'vicinity',
      ],
    })
      .then((details) => {
        console.log('Details: ', details);

        // Extracting address details from google place result

        const { address_components, geometry } =
          details as google.maps.places.PlaceResult;

        const myPlaceResult = formatPlaceResult(address_components, geometry);

        // Setting this extract data as a form value
        setFormValue('place_result', myPlaceResult);
        setFormValue('address', res);
      })
      .catch((error) => {
        setCurrentStep(1);
        toast.error(error);
      });
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadedFiles?.length > 5) {
      toast.error("We don't need more than 6 photos");
      return;
    }
    const fileList = e.target.files;
    var fileListArr = !!fileList ? Array.from(fileList) : [];

    fileListArr.forEach((fileItem) => {
      const fileSizeKiloBytes = fileItem.size / 1024;
      const MAX_FILE_SIZE = 5120; // 5MB

      if (fileSizeKiloBytes < MAX_FILE_SIZE) {
        const reader = new FileReader();
        // eslint-disable-next-line no-loop-func

        reader.onload = (readEvt) => {
          setUploadedFiles((s) => [
            ...s,
            { file: fileItem, data: readEvt?.target?.result || null },
          ]);
        };
        reader.readAsDataURL(fileItem);
      } else {
        toast.error('File is too large (max. 5MB)');
      }
    });
  };

  const photoRemoveHandler = (id: number) => {
    setUploadedFiles((s) =>
      s.filter((data, index) => {
        return index !== id;
      })
    );
  };

  switch (currentStep) {
    case 1:
      content = (
        <div className="max-w-xl px-8 pt-12">
          <MyPlacesSelect
            label="Full Address"
            isDisabled={!ready}
            errors={errors}
            placeholder=""
            groupClasses="col-span-2"
            suggestions={status === 'OK' ? suggestionsResults : []}
            onSelectPlace={handleSelect}
            inputValue={value}
            setSearchValue={setSearchValue}
            controllerProps={{
              control,
              name: 'address',
              rules: { required: 'Address is required' },
              defaultValue: null,
              shouldUnregister: false,
            }}
            autoFocus
          />
          <div className="flex ">
            <Input
              id="amount"
              label="Rent Amount"
              type="number"
              className="pl-9"
              inputMode="numeric"
              min={0}
              defaultValue=""
              inputRef={register('amount', {
                required: 'Amount is required',
                valueAsNumber: true,
              })}
              errors={errors}
            >
              <InputPrepend Icon={FaEuroSign} />
            </Input>
            <MyReactSelect
              label="Frequency"
              id="frequency"
              controllerProps={{
                control,
                name: 'frequency',
                defaultValue: FREQUENCY_OPTIONS[1],
                shouldUnregister: false,
              }}
              errors={errors}
              options={FREQUENCY_OPTIONS}
              isClearable={false}
            />
          </div>
        </div>
      );
      break;
    case 2:
      content = (
        <div className="max-w-xl px-8 pt-12">
          <MyReactSelect
            label="Listing category"
            id="category"
            controllerProps={{
              control,
              name: 'category',
              rules: {
                required: 'Select a category',
              },
              defaultValue: null,
              shouldUnregister: false,
            }}
            errors={errors}
            options={CATEGORY_OPTIONS}
            isClearable={false}
            autoFocus={true}
          />
          <MyReactSelect
            label="Property Type"
            id="propertyType"
            controllerProps={{
              control,
              name: 'propertyType',
              rules: {
                required: 'Select a property type',
              },
              defaultValue: null,
              shouldUnregister: false,
            }}
            errors={errors}
            options={PROPERTY_TYPE_OPTIONS}
            isClearable={false}
            autoFocus={true}
          />
          <div className="flex ">
            <Input
              id="bedroomCount"
              label="Bedroom Count"
              type="number"
              className="pl-9"
              inputMode="numeric"
              min={0}
              max={7}
              inputRef={register('bedroomCount', {
                required: 'Value is required',
                valueAsNumber: true,
              })}
              defaultValue=""
              errors={errors}
            >
              <InputPrepend Icon={FaBed} />
            </Input>
            <Input
              label="Bathroom Count"
              id="bathroomCount"
              type="number"
              className="pl-9"
              inputMode="numeric"
              min={0}
              max={7}
              inputRef={register('bathroomCount', {
                required: 'Value is required',
                valueAsNumber: true,
              })}
              defaultValue=""
              errors={errors}
              autoFocus={false}
            >
              <InputPrepend Icon={FaBath} />
            </Input>
          </div>
          <Input
            id="availableFrom"
            label="Available From"
            type="date"
            className="pl-9"
            inputRef={register('availableFrom', {
              required: 'Date is required',
            })}
            min={new Date().toJSON().slice(0, 10)}
            errors={errors}
          >
            <InputPrepend Icon={CalendarDaysIcon} />
          </Input>
        </div>
      );
      break;
    case 3:
      content = (
        <div className="max-w-xl px-8 pt-12">
          <MyRadioGroup
            label="Property Facilities"
            id="facilities"
            isMulti
            groupClasses=""
            controllerProps={{
              name: 'facilities',
              control: control,
              rules: {},
              shouldUnregister: false,
              defaultValue: [],
            }}
            options={FACILITY_OPTIONS}
            errors={errors}
            radiosContainerClasses="grid grid-cols-2 gap-4"
          />
        </div>
      );
      break;

    case 4:
      content = (
        <div className="max-w-xl px-8 pt-12">
          <Input
            id="title"
            label="Listing Title"
            placeholder="Keep it short but sweet"
            type="text"
            className=""
            inputRef={register('title', {
              required: 'A Title is required',
              maxLength: {
                value: 50,
                message: 'Title is too long (Max 50 chars.)',
              },
            })}
            defaultValue=""
            errors={errors}
          />
          <MyTextArea
            id="description"
            label="Listing Description"
            className=""
            placeholder="Tell us everything about your property..."
            inputRef={register('description', {
              required: 'A description is required',
              minLength: {
                value: 10,
                message: 'Description is too short (Min 10 chars.)',
              },
              maxLength: {
                value: 1000,
                message: 'Description is too long (Max 1000 chars.)',
              },
            })}
            defaultValue=""
            errors={errors}
            rows={12}
          />
        </div>
      );
      break;

    case 5:
      content = (
        <div className="max-w-xl px-8 pt-12">
          <div>
            <label className="text-md mb-2 block font-medium text-gray-700">
              Upload Property Images
            </label>
            <label
              htmlFor="file-upload"
              className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6"
            >
              <div className="space-y-1 text-center">
                <MdOutlineAddAPhoto className="mx-auto h-12 w-12 text-gray-400" />

                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="focus-within:ring-primary-500 hover:text-primary-500 relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2"
                  >
                    <span>Click to browse</span>
                    <input
                      accept="image/*"
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={onFileUpload}
                    />
                  </label>
                  <p className="pl-1"></p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, up to 5MB</p>
              </div>
            </label>
          </div>

          <div className="mt-6">
            {!!uploadedFiles.length ? (
              <MediaPreview
                photos={uploadedFiles.map((f) => f.data)}
                removeHandler={photoRemoveHandler}
                productPhotoProgress
              />
            ) : null}
          </div>
        </div>
      );
      break;

    case 6:
      const {
        bedroomCount,
        amount,
        frequency,
        bathroomCount,
        facilities,
        address,
        title,
      } = getValues();
      content = (
        <div className="max-w-4xl py-8 pt-12">
          <SearchCard
            title={title}
            address={address.description}
            bedCount={bedroomCount}
            bathCount={bathroomCount}
            featureCount={facilities.length}
            price={amount}
            frequency={`${frequency.value}`}
            imgSrc={uploadedFiles?.[0]?.data as string}
            isPreviewing
          />
        </div>
      );
      break;

    default:
      break;
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleNextStep = () => {
    handleSubmit(submitHandler)();
    if (isEditing) {
      if ((isValid || !isDirty) && currentStep < 6) {
        setCurrentStep((s) => s + 1);
      }
    } else {
      if (isValid && currentStep < 6) {
        setCurrentStep((s) => s + 1);
      }
    }
  };

  useEffect(() => {
    if (!!isEditing && !!propertyData) {
      console.log({ propertyData });
      setSearchValue(addressFromComponents(propertyData.address));
      setFormValue('propertyId', propertyData.id);
      setFormValue('amount', Number(propertyData.price));
      setFormValue(
        'category',
        getOptionWithValue(CATEGORY_OPTIONS, propertyData.propertyCategory)
      );
      setFormValue(
        'frequency',
        getOptionWithValue(FREQUENCY_OPTIONS, propertyData.paymentFrequency)
      );
      setFormValue(
        'propertyType',
        getOptionWithValue(PROPERTY_TYPE_OPTIONS, propertyData.propertyType)
      );
      setFormValue('bedroomCount', Number(propertyData.bedroomCount));
      setFormValue('bathroomCount', Number(propertyData.bathroomCount));
      setFormValue(
        'availableFrom',
        formatDateForInput(propertyData.availableFrom)
      );
      setFormValue('facilities', propertyData.features);
      setFormValue('title', propertyData.name);
      setFormValue('description', propertyData?.description || '');
      setUploadedFiles((s) => {
        //create our upload images preview state
        console.log(propertyData.images);
        return Object.values(propertyData.images)
          .filter(Boolean)
          .map((imgSrc) => {
            return {
              data: imgSrc,
              file: null,
            };
          });
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      isEditing &&
      !!suggestionsResults.length &&
      isInitialSuggestion.current === true
    ) {
      handleSelect({
        description: suggestionsResults[0].description,
        label: suggestionsResults[0].description,
        value: suggestionsResults[0].place_id,
      });
      isInitialSuggestion.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestionsResults, isInitialSuggestion.current]);

  return (
    <div className="">
      {content}
      <div className="mt-12 flex gap-5">
        {currentStep > 1 ? (
          <Button
            variant="link"
            text="Back"
            onClick={() => {
              handlePrevStep();
            }}
            className=""
          />
        ) : null}
        <Button
          loading={isLoading}
          text={currentStep === 6 ? 'Finish' : 'Next'}
          onClick={() => {
            handleNextStep();
          }}
          className=""
        />
      </div>
      {currentStep === 6 && !!uploadProgress && (
        <p className="mt-3">Uploading...{uploadProgress}%</p>
      )}
    </div>
  );
};

export default ListingForm;
