export const STORAGE_KEYS = {
  TOKEN: 'FACEFIND@TOKEN',
  USER: 'FACEFIND@USER',
};

export const FACILITY_NAME_MAP: Record<string, string> = {
  furnished: 'Furnished',
  wifi: 'Wifi',
  heating: 'Heating',
  dishwasher: 'Dish Washer',
  washing_machine: 'Washing Machine',
  dryer: 'Dryer',
  alarm: 'Alarm',
  cable: 'Cable TV',
  pets: 'Pets Friendly',
  parking: 'Parking',
  serviced: 'Serviced Property',
  wheelchair: 'Wheelchair Access',
} as const;

export const LISTING_STEPS: readonly { id: number; name: string }[] = [
  {
    id: 1,
    name: 'Address & Price',
  },
  {
    id: 2,
    name: 'Property Details',
  },
  {
    id: 3,
    name: 'Facilities',
  },

  {
    id: 4,
    name: 'Description',
  },
  {
    id: 5,
    name: 'Pictures',
  },
  {
    id: 6,
    name: 'Review',
  },
] as const;

export const INTEREST_STATUS_MAP = {
  0: 'Pending',
  1: 'Accepted',
  2: 'Rejected',
} as const;
