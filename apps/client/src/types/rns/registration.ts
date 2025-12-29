export interface RegistrationData {
  registration: {
    registrationDate: string;
    expiryDate: string;
  };
  nameRegistereds: {
    transactionID: string;
  }[];
}
