import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HubSpotForm } from "./HubSpotForm";

const { submit } = vi.hoisted(() => ({ submit: vi.fn() }));
vi.mock("@workspace/api-client-react", () => ({ submitHubspotForm: submit }));
vi.mock("@/lib/feedbackSurvey", () => ({ notifySubmissionSuccess: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));
const success = "وصلتنا رسالتك! بنرد عليك خلال أوقات الدوام.";
const error = "صار خلل بسيط، جرّب مرة ثانية أو راسلنا على الإيميل.";
const overrides = { firstName: "الاسم", email: "الإيميل", message: "رسالتك (اختياري)", submit: "أرسل", successTitle: success, successBody: "", retryable: error, consentUnavailable: error };

afterEach(cleanup);
beforeEach(() => { submit.mockReset(); });

function filledForm() {
  render(<HubSpotForm locale="ar" testId="form" errorMessage={error} copyOverrides={overrides} requiredMessage="نسيت هالخانة" />);
  fireEvent.click(screen.getByRole("checkbox", { name: "أستكشف الخيارات فقط" }));
  fireEvent.change(screen.getByLabelText(/الإيميل/), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText(/رقم الهاتف/), { target: { value: "0500000000" } });
}

describe("scoped Arabic contact labels", () => {
  it("requires at least one reason and submits every reason still checked", async () => {
    submit.mockResolvedValue({ hubspotSubmitted: true, notificationEmailSent: true });
    render(<HubSpotForm locale="ar" testId="form" errorMessage={error} copyOverrides={overrides} requiredMessage="نسيت هالخانة" />);
    fireEvent.change(screen.getByLabelText(/الإيميل/), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/رقم الهاتف/), { target: { value: "0500000000" } });
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    for (const [name, value] of [
      ["أستخدم نظام موارد بشرية بالفعل", "existing_hr"],
      ["أستكشف الخيارات فقط", "exploring"],
      ["أبحث عن نظام موارد بشرية", "seeking_hr"],
    ]) {
      fireEvent.click(screen.getByRole("checkbox", { name }));
      expect(form.checkValidity()).toBe(true);
      expect(new FormData(form).getAll("intents")).toContain(value);
    }
    fireEvent.click(screen.getByRole("checkbox", { name: "أستكشف الخيارات فقط" }));
    fireEvent.submit(form);
    await waitFor(() => expect(submit).toHaveBeenCalledWith(expect.objectContaining({ intents: ["existing_hr", "seeking_hr"] })));
  });
  it("retains form fields and translates empty required validation", () => {
    render(<HubSpotForm locale="ar" errorMessage={error} copyOverrides={overrides} requiredMessage="نسيت هالخانة" />);
    expect(screen.getByLabelText("الاسم")).toBeTruthy();
    expect(screen.getByLabelText("رسالتك (اختياري)")).toBeTruthy();
    const email = screen.getByLabelText(/الإيميل/) as HTMLInputElement;
    fireEvent.invalid(email);
    expect(email.validationMessage).toBe("نسيت هالخانة");
    fireEvent.input(email, { target: { value: "test@example.com" } });
    expect(email.validationMessage).toBe("");
    expect(submit).not.toHaveBeenCalled();
  });
  it("uses the provided success copy without the old point offer", async () => {
    submit.mockResolvedValue({ hubspotSubmitted: true, notificationEmailSent: true });
    filledForm();
    fireEvent.submit(screen.getByTestId("form"));
    await waitFor(() => expect(screen.getByText(success)).toBeTruthy());
    expect(screen.queryByText(/5,000/)).toBeNull();
    expect(submit).toHaveBeenCalledOnce();
  });
  it("uses the provided error message for a failed request", async () => {
    submit.mockRejectedValue({ status: 503 });
    filledForm();
    fireEvent.submit(screen.getByTestId("form"));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(error));
  });
  it("leaves English labels unchanged without overrides", () => {
    render(<HubSpotForm locale="en" errorMessage="Error" />);
    expect(screen.getByLabelText("First name")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Send" })).toBeTruthy();
  });
});
