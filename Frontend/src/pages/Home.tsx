import { useForm, SubmitHandler } from 'react-hook-form';
import { createSearchParams, useNavigate } from 'react-router-dom';
import Button from 'src/components/UI/Button/Button';
import { SelectOption } from 'src/components/UI/inputs/interfaces';
import MyPlacesSelect from 'src/components/UI/inputs/MyPlacesSelect';
import MySelect from 'src/components/UI/inputs/MySelect';
import { ROUTES } from 'src/configs/routeNames';
import { CATEGORY_OPTIONS } from 'src/configs/selectOptions';
import usePlacesAutocomplete from 'use-places-autocomplete';

type Props = {};

export interface HomeFormFields {
  location: { description: string } & SelectOption;
  type: SelectOption;
}

const Home = (props: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<HomeFormFields>();

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
      types: [
        'administrative_area_level_3',
        'locality',
        'sublocality',
        'neighborhood',
      ],
    },
    debounce: 300,
  });

  const navigate = useNavigate();

  const handleSearchInput = (value: string) => {
    // Update the keyword of the input element
    setSearchValue(value);
  };

  const submitHandler: SubmitHandler<HomeFormFields> = async ({
    location,
    type,
  }) => {
    console.log();
    navigate({
      pathname: ROUTES.SEARCH,
      search: `${createSearchParams({
        addressSearch: location?.description,
        propertyCategory: `${type?.value || ''}`,
      })}`,
    });
  };

  const handleSelect = (res: { description: any } | undefined) => {
    console.log(res, 'called res');
    setSearchValue(res?.description, false);
    clearSuggestions();

    // });
  };

  return (
    <div className="my-auto min-h-full px-6 py-12 pt-28 text-center text-gray-800 md:px-12 lg:text-left">
      <div className="container mx-auto xl:px-32">
        <div className="grid items-center lg:grid-cols-2">
          <div className="relative mb-12 md:mt-12 lg:mt-0 lg:mb-0">
            <div
              className="absolute block min-w-max -translate-y-1/2 rounded-lg px-6 py-12 shadow-lg md:px-12 lg:-mr-14"
              style={{
                background: 'hsla(0, 0%, 100%, 0.55)',
                backdropFilter: 'blur(30px)',
              }}
            >
              <h1 className="mb-12 text-4xl font-bold tracking-tight md:text-5xl xl:text-6xl">
                Your home search <br />
                <span className="text-primary">starts here</span>
              </h1>

              <div className="grid grid-cols-4 gap-3">
                <MySelect
                  label=""
                  options={CATEGORY_OPTIONS}
                  errors={errors}
                  placeholder="Category"
                  prefix="foo"
                  groupClasses="col-span-1 "
                  controllerProps={{
                    control,
                    name: 'type',
                    rules: {},
                    defaultValue: null,
                    shouldUnregister: true,
                  }}
                />

                <MyPlacesSelect
                  label=""
                  isDisabled={!ready}
                  errors={errors}
                  placeholder="Area, city, county"
                  groupClasses="col-span-2"
                  suggestions={status === 'OK' ? suggestionsResults : []}
                  onSelectPlace={handleSelect}
                  inputValue={value}
                  setSearchValue={handleSearchInput}
                  controllerProps={{
                    control,
                    name: 'location',
                    rules: {},
                    defaultValue: null,
                    shouldUnregister: true,
                  }}
                />

                <Button
                  className="col-span-1 mb-6 "
                  onClick={handleSubmit(submitHandler)}
                  text="SEARCH"
                />
              </div>
            </div>
          </div>
          <div className="md:mb-12 lg:mb-0">
            <img
              src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg"
              className="w-full rounded-lg shadow-lg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
