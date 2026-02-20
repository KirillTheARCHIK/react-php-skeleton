import "@testing-library/jest-dom";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import Button from "components/Button";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AsyncSelect from "components/FormFields/AsyncSelect";
import { required } from "helpers/formValidators";
import { ColorModeContextProvider } from "providers";

function TestForm({ initialValues = {}, ...props }) {
  const [state, setState] = useState(initialValues);

  return (
    <ColorModeContextProvider>
      <div>Result: {printValue(state.select)}</div>
      <Form initialValues={state} onSubmit={setState}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="select" validate={required}>
              {({ input, meta }) => (
                <AsyncSelect
                  input={input}
                  placeholder="select"
                  meta={meta}
                  loadOptions={loadOptions}
                  {...props}
                />
              )}
            </Field>
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </form>
        )}
      </Form>
    </ColorModeContextProvider>
  );
}

const printValue = (value) =>
  Array.isArray(value)
    ? value.map((option) => option.id).toString()
    : value?.id;

const loadOptions = () =>
  new Promise((resolve) => {
    const options = {
      entries: [
        { id: 0, displayName: "0 option" },
        { id: 1, displayName: "1 option" },
        { id: 2, displayName: "2 option" },
        { id: 3, displayName: "3 option" },
        { id: 4, displayName: "4 option" },
      ],
      total: 5,
    };
    resolve(options);
  });

test("AsyncSelect selects a value", async () => {
  render(<TestForm />);
  const select = screen.getByPlaceholderText("select");
  await userEvent.type(select, "0");
  const foundOption = await screen.findByText("0 option");
  expect(foundOption).toBeVisible();
  await userEvent.click(foundOption);

  const submit = await screen.findByText("Submit");
  await userEvent.click(submit);
  expect(await screen.findByText("Result: 0")).toBeVisible();
});

test("AsyncSelect selects multiple values", async () => {
  render(<TestForm multiple={true} />);
  let select = screen.getByPlaceholderText("select");
  await userEvent.type(select, "0");
  const foundOption0 = await screen.findByText("0 option");
  expect(foundOption0).toBeVisible();
  await userEvent.click(foundOption0);

  select = await screen.findByPlaceholderText("select");
  await userEvent.type(select, "3");
  const foundOption3 = await screen.findByText("3 option");
  expect(foundOption3).toBeVisible();
  await userEvent.click(foundOption3);

  const submit = await screen.findByText("Submit");
  await userEvent.click(submit);
  expect(await screen.findByText("Result: 0,3")).toBeVisible();
});
