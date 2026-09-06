import {
  validateName,
  validateEmail,
  validateDOB,
  validatePhone,
} from "./validation.js";

type PersonalRecord = {
  name: string;
  email: string;
  dob: string;
  phone: string;
};

const records: PersonalRecord[] = [];
let editingIndex: number | null = null;

const form = document.querySelector<HTMLFormElement>("#details-form");
const recordsContainer =
  document.querySelector<HTMLTableSectionElement>("#records");

const nameErrorElement =
  document.querySelector<HTMLParagraphElement>("#name-error");
const emailErrorElement =
  document.querySelector<HTMLParagraphElement>("#email-error");
const dobErrorElement =
  document.querySelector<HTMLParagraphElement>("#dob-error");
const phoneErrorElement =
  document.querySelector<HTMLParagraphElement>("#phone-error");

const nameInput = document.querySelector<HTMLInputElement>("#name");
const emailInput = document.querySelector<HTMLInputElement>("#email");
const dobInput = document.querySelector<HTMLInputElement>("#dob");
const phoneInput = document.querySelector<HTMLInputElement>("#phone");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = String(formData.get("name"));
  const email = String(formData.get("email"));
  const dob = String(formData.get("dob"));
  const phone = String(formData.get("phone"));

  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const dobError = validateDOB(dob);
  const phoneError = validatePhone(phone);

  nameInput?.setAttribute("aria-invalid", String(!!nameError));
  emailInput?.setAttribute("aria-invalid", String(!!emailError));
  dobInput?.setAttribute("aria-invalid", String(!!dobError));
  phoneInput?.setAttribute("aria-invalid", String(!!phoneError));

  if (nameErrorElement) nameErrorElement.textContent = nameError ?? "";
  if (emailErrorElement) emailErrorElement.textContent = emailError ?? "";
  if (dobErrorElement) dobErrorElement.textContent = dobError ?? "";
  if (phoneErrorElement) phoneErrorElement.textContent = phoneError ?? "";

  if (nameError || emailError || dobError || phoneError) {
    // Move focus to the first field with an error
    if (nameError) {
      nameInput?.focus();
    } else if (emailError) {
      emailInput?.focus();
    } else if (dobError) {
      dobInput?.focus();
    } else if (phoneError) {
      phoneInput?.focus();
    }

    return;
  }

  const record: PersonalRecord = {
    name,
    email,
    dob,
    phone,
  };

  if (editingIndex === null) {
    records.push(record);
  } else {
    records[editingIndex] = record;
    editingIndex = null;
  }

  renderRecords();
  form.reset();
});

recordsContainer?.addEventListener("click", (event) => {
  const target = event.target as HTMLButtonElement;
  const action = target.dataset.action;
  const index = Number(target.dataset.index);

  if (action === "delete") {
    records.splice(index, 1);

    if (editingIndex === index) {
      editingIndex = null;
      form?.reset();
    } else if (editingIndex !== null && editingIndex > index) {
      editingIndex--;
    }

    renderRecords();
  }

  if (action === "edit") {
    const record = records[index];

    if (!record) return;

    editingIndex = index;

    if (nameInput) nameInput.value = record.name;
    if (emailInput) emailInput.value = record.email;
    if (dobInput) dobInput.value = record.dob;
    if (phoneInput) phoneInput.value = record.phone;
  }
});

function renderRecords(): void {
  if (!recordsContainer) return;

  recordsContainer.innerHTML = "";

  records.forEach((record, index) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const emailCell = document.createElement("td");
    const dobCell = document.createElement("td");
    const phoneCell = document.createElement("td");
    const actionCell = document.createElement("td");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    nameCell.textContent = record.name;
    emailCell.textContent = record.email;
    dobCell.textContent = record.dob;
    phoneCell.textContent = record.phone;

    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.dataset.action = "edit";
    editButton.dataset.index = String(index);

    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.index = String(index);

    actionCell.append(editButton, deleteButton);
    row.append(nameCell, emailCell, dobCell, phoneCell, actionCell);
    recordsContainer.appendChild(row);
  });
}
