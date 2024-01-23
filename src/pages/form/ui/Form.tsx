import {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useState,
  MouseEvent,
} from "react";

import styles from "./styles.module.scss";

type FormProps = Record<string, never>;

type FormInputProps = {
  name: string;
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

type FormButtonProps = {
  handleSubmit: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const Form: FC<FormProps> = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState({ email: "", password: "" });

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setFormData((state) => ({ ...state, [name]: value }));

    // validation
    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      setFormError((state) => ({ ...state, email: "Invalid email" }));
    } else if (name === "password" && value.length < 6) {
      setFormError((state) => ({ ...state, password: "Password too short" }));
    } else {
      // clear validation errors
      setFormError((state) => ({ ...state, [name]: "" }));
    }
  }, []);

  const handleSubmit = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const validationErrors: Record<"email" | "password", string> =
        Object.keys(formData).reduce(
          (errors, name) => {
            if (formData[name as "email" | "password"] === "") {
              errors[name] = `${
                name[0].toUpperCase() + name.slice(1)
              } is required;`;
            }
            return errors;
          },
          {} as Record<string, string>,
        );

      if (Object.values(validationErrors).every((error) => error === "")) {
        console.log("pass");
      } else {
        console.log("does not pass");
      }
      console.log(formError, formData);
    },
    [formError, formData],
  );

  return (
    <form className={styles.form}>
      <FormInput
        value={formData.email}
        label="Email"
        name="email"
        handleChange={handleChange}
      />
      <FormInput
        value={formData.password}
        label="Password"
        name="password"
        handleChange={handleChange}
      />
      <FormSubmitButton handleSubmit={handleSubmit} />
    </form>
  );
};

const FormInput: FC<FormInputProps> = memo(
  ({ name, value, handleChange, label }) => {
    return (
      <label>
        {label}
        <input type="text" name={name} onChange={handleChange} value={value} />
      </label>
    );
  },
);

const FormSubmitButton: FC<FormButtonProps> = memo(({ handleSubmit }) => {
  return (
    <button type="submit" onClick={handleSubmit}>
      Submit
    </button>
  );
});
