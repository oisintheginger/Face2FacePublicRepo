import { SelectOption } from 'src/components/UI/inputs/interfaces';
import { Property } from 'src/configs/interfaces';

export const addressFromComponents = (components: Property['address']) => {
  const { addressLine1, addressLine2, city, county, postcode, country } =
    components;

  const addCmpArr = [
    addressLine1,
    addressLine2,
    city,
    county,
    postcode,
    country,
  ];

  let addStr = '';

  addCmpArr.forEach((cmp, i) => {
    if (!!cmp.trim()) {
      if (i === addCmpArr.length - 1) {
        addStr = `${addStr}${cmp}`;
      } else {
        addStr = `${addStr}${cmp}, `;
      }
    }
  });

  return addStr;
};

export const getOptionWithValue = (
  options: readonly SelectOption[],
  valueToFind: SelectOption['value']
): SelectOption => {
  return options.find((opt) => opt.value === valueToFind) || options[0];
};

export const formatPlaceResult = (
  address_components: google.maps.places.PlaceResult['address_components'],
  geometry: google.maps.places.PlaceResult['geometry']
) => {
  const streetNumber =
    address_components?.find((cmp) => cmp.types.includes('street_number'))
      ?.long_name || '';
  const streetName =
    address_components?.find((cmp) => cmp.types.includes('route'))?.long_name ||
    '';
  const neighbourhood =
    address_components?.find(
      (cmp) =>
        cmp.types.includes('sublocality_level_1') ||
        cmp.types.includes('sublocality') ||
        cmp.types.includes('neighborhood')
    )?.long_name || '';
  const city =
    address_components?.find(
      (cmp) =>
        cmp.types.includes('locality') || cmp.types.includes('postal_town')
    )?.long_name || '';
  const county =
    address_components?.find((cmp) =>
      cmp.types.includes('administrative_area_level_1')
    )?.long_name || '';
  const postCode =
    address_components?.find((cmp) => cmp.types.includes('postal_code'))
      ?.long_name || '';
  const country =
    address_components?.find((cmp) => cmp.types.includes('country'))
      ?.long_name || '';

  const myPlaceResult = {
    addressline1: `${streetNumber ? streetNumber + ' ' : ''}${streetName}`,
    addressline2: neighbourhood,
    city: city,
    county: county,
    postcode: postCode,
    country: country,
    coords: [
      geometry?.location?.lat() as number,
      geometry?.location?.lng() as number,
    ],
  };

  return myPlaceResult;
};

export const formatDateForInput = (date: string) => {
  const dateInput = new Date('2022-12-15T00:00:00.000Z');
  const day = ('0' + dateInput.getDate()).slice(-2);
  const month = ('0' + (dateInput.getMonth() + 1)).slice(-2);
  return dateInput.getFullYear() + '-' + month + '-' + day;
};

export const joinClassNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};
