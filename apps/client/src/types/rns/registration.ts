import { PriceResponse, Duration } from "./common";

export interface RegistrationState {
  step: RegistrationStep;
  name: string;
  duration: Duration;
  price: PriceResponse | null;
  error: string | null;
}

export enum RegistrationStep {
  SEARCH = 'SEARCH',
  CONFIGURE = 'CONFIGURE',
  CONFIRM = 'CONFIRM',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface RegistrationFormData {
  name: string;
  duration: Duration;
  reverseRecord: boolean;
  customResolver?: string;
}

export interface RegistrationData {
  registration: {
    registrationDate: string;
    expiryDate: string;
  };
  nameRegistereds: {
    transactionID: string;
  }[];
}
