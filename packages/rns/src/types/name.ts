import { FormattedDateTime } from '../utils';

export interface NameDetailsProps {
  name: string;
  expiryDate?: Date;
  gracePeriodEnds?: Date;
  owner?: string;
  records?: {
    eth?: string;
    btc?: string;
    website?: string;
  };
}



export interface NameDates {
  expiry: FormattedDateTime;
  gracePeriod: FormattedDateTime;
  registration: FormattedDateTime;
}

export interface NameDetails {
  name: string;
  ownerAddress: string;
  displayAddress: string;
  contractAddress: string;
  roles: string[];
  dates: NameDates;
  status: 'available' | 'registered';
}

export interface Name {
  name: string;
  labelName: string;
  expiryDateWithGrace: string;
}

export interface NameDetail {
  name: string;
  labelHash: string;
  expiryDateWithGrace: string;
  owner: string;
  registration: {
    registrationDate: string;
    expiryDate: string;
  };
  resolver: {
    address: string;
  };
}