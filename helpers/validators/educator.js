
import * as yup from 'yup';
import { isValidObjectId } from 'mongoose';



const DATE_REGEX = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
const PASSWORD_REGEX = /^[a-zA-Z0-9]{8,}$/;

export const registerEducatorsSchema = yup
  .object({
    firstName: yup.string(),
    lastName: yup.string(),
    surName:  yup.string(),
    user: yup.string()
    .required('id must be a valid ObjectId')
    .trim()
    .transform((value) => {
      if (isValidObjectId(value)) {
        return value;
      }

      return '';
    }),
    age: yup.number().required().positive().integer(),
    addresses:  yup.array().of(
      yup.object(),
    ),
  
  })
  .required();
  