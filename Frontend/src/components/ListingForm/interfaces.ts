import { SelectOption } from 'src/components/UI/inputs/interfaces';
import { Property } from 'src/configs/interfaces';

export type ListingFormProps = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
} & (
  | {
      formMode: 'edit';
      propertyData: Property;
    }
  | {
      formMode: 'create';
      propertyData?: undefined;
    }
);

export type ListingFormFields = {
  address: { description: string } & SelectOption;
  amount: number;
  place_result: {
    addressline1: string;
    addressline2: string;
    city: string;
    county: string;
    postcode: string;
    country: string;
    coords: number[];
  };
  category: SelectOption;
  frequency: SelectOption;
  propertyType: SelectOption;
  bedroomCount: number;
  bathroomCount: number;
  availableFrom: string;
  facilities: SelectOption['value'][];
  title: string;
  description: string;
  propertyId: string;
};
