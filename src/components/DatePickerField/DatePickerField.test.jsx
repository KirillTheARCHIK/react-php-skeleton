import "@testing-library/jest-dom";
import { useState } from "react";
import { Form } from "react-final-form";
import DatePickerField from "components/DatePickerField/index";
import Button from "components/Button";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function TestForm({ initialValues }) {
  const [state, setState] = useState(initialValues);

  return (
    <section>
      <div>Result: {state?.date}</div>
      <Form initialValues={state} onSubmit={setState}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <DatePickerField name="date" />
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </form>
        )}
      </Form>
    </section>
  );
}

test("DatePickerField updates value", async () => {
  render(<TestForm />);
  const input = screen.getByPlaceholderText("дд.мм.гггг");
  await userEvent.type(input, "31.01.2024{Enter}");
  const submit = screen.getByText("Submit");
  await userEvent.click(submit);
  expect(await screen.findByText("Result: 2024-01-31T00:00:00")).toBeVisible();
});

test("DatePickerField displays initial value", async () => {
  render(<TestForm initialValues={{ date: "2024-01-31T00:00:00" }} />);
  const input = screen.getByDisplayValue("31.01.2024");
  expect(input).toBeVisible();
});
