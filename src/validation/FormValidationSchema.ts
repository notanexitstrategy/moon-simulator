import * as yup from "yup";

const FormValidationSchema = yup.object().shape({
  shareQty: yup
    .number()
    .required("This is a required field.")
    .positive(
      "Please enter a positive number. If you own a negative amount of shares you're fucked."
    ),
  costBasis: yup.number().positive("Please enter a positive number."),
  showFloor: yup.boolean(),
  ceiling: yup
    .number()
    .required("This is a required field.")
    .positive("Please enter a positive number."),
  floor: yup
    .number()
    .required()
    .positive("Please enter a positive number.")
    .lessThan(yup.ref("ceiling")),
  increments: yup
    .number()
    .positive("Please enter a positive number.")
    .integer("Please enter a whole number."),
});

export default FormValidationSchema;
