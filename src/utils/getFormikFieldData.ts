import { FormikValues, useFormik } from 'formik';

export function getFormikFieldData<IS extends FormikValues>(
  formik: ReturnType<typeof useFormik<IS>>,
  fieldName: keyof ReturnType<typeof useFormik<IS>>['initialValues'],
) {
  const isError = Boolean(formik.touched[fieldName]) && Boolean(formik.errors[fieldName]);

  const errorText = isError ? formik.errors[fieldName] : undefined;

  const fieldProps = formik.getFieldProps(String(fieldName));

  return { isError, errorText, fieldProps };
}
