export interface User {
  id?: string;
  name: string;
  email: string;
  description?: string;
  avatar?: string;
  _id?: string;
}

export interface Property {
  owner_id: string;
  name: string;
  price: number;
  propertyCategory: string;
  propertyType: string;
  paymentFrequency: string;
  bedroomCount: number;
  bathroomCount: number;
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    county: string;
    postcode: string;
    country: string;
    coords: {
      type: 'Point';
      coordinates: [number, number];
    };
    _id: string;
    __v: 0;
  };
  availableFrom: string;
  postcode: string;
  features: string[];
  images: {
    image1: string;
    image2: string;
    image3: string;
    image4: string;
    image5: string;
    image6: string;
  };
  description: string;
  _id: string;
  __v: number;
  id: string;
}

export interface Interest {
  id: string;
  propertyID: string;
  interestedUserID: string;
  propertyOwnerID: string;
  propertyDetails: Property;
  interestStatus: 0 | 1 | 2;
  _id: string;
  __v: number;
}
