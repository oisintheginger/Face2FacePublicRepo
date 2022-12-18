export const PAGE_SIZE_OPTIONS = [
  { label: 'Show 5', value: 5 },
  { label: 'Show 10', value: 10 },
  { label: 'Show 20', value: 20 },
  { label: 'Show 35', value: 35 },
  { label: 'Show 50', value: 50 },
] as const;

export const FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
] as const;

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'studio', label: 'Studio' },
  { value: 'flat', label: 'Flat' },
] as const;

export const FACILITY_OPTIONS = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'wifi', label: 'Wifi' },
  { value: 'heating', label: 'Heating' },
  { value: 'dishwasher', label: 'Dish Washer' },
  { value: 'washing_machine', label: 'Washing Machine' },
  { value: 'dryer', label: 'Dryer' },
  { value: 'alarm', label: 'Alarm' },
  { value: 'cable', label: 'Cable TV' },
  { value: 'pets', label: 'Pets Friendly' },
  { value: 'parking', label: 'Parking' },
  { value: 'serviced', label: 'Serviced Property' },
  { value: 'wheelchair', label: 'Wheelchair Access' },
];

export const CATEGORY_OPTIONS = [
  { value: 'rent', label: 'Rent' },
  { value: 'shared', label: 'Shared' },
] as const;
