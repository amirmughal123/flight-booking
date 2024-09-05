// schemas/flightBookingSchema.js
import * as Yup from 'yup';

export const flightBookingSchema = Yup.object({
  from: Yup.string().required('From is required'),
  to: Yup.string().required('To is required'),
  dates: Yup.string().required('Dates are required'),
  class: Yup.string().required('Class is required'),
});
