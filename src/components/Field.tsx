import { useField } from "formik";

interface NumberFieldProps {
  name: string;
  placeholder?: string;
}

const Field = ({ name, placeholder }: NumberFieldProps) => {
  const [field, meta] = useField(name);

  return (
    <div className="input">
      <input
        {...field}
        style={{
          width: `${
            (field.value
              ? field.value.toString().length
              : placeholder?.length || 1) + 1
          }ch`,
        }}
        name={name}
        min="0"
        placeholder={field.value || placeholder || ""}
        type="number"
      />

      <div
        className={`input-underline ${
          meta.error ? "input-underline-error" : ""
        }`}
      />
      {[69, 420].includes(field.value) && (
        <div className="input-nice">Nice &#128527;</div>
      )}
    </div>
  );
};

export default Field;
