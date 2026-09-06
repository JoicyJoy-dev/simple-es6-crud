/// <reference types="node" />
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
const html = `
<!doctype html>
<html>
  <body>
    <form id="details-form">
      <input id="name" name="name" />
      <p id="name-error"></p>

      <input id="email" name="email" />
      <p id="email-error"></p>

      <input id="dob" name="dob" />
      <p id="dob-error"></p>

      <input id="phone" name="phone" />
      <p id="phone-error"></p>

      <button type="submit">Submit</button>
    </form>

    <table>
      <tbody id="records"></tbody>
    </table>
  </body>
</html>
`;
function setupDom() {
    const dom = new JSDOM(html, {
        url: "http://localhost",
    });
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.FormData = dom.window.FormData;
}
function fillForm(name, email, dob, phone) {
    const form = document.querySelector("#details-form");
    const nameInput = document.querySelector("#name");
    const emailInput = document.querySelector("#email");
    const dobInput = document.querySelector("#dob");
    const phoneInput = document.querySelector("#phone");
    assert.ok(form);
    assert.ok(nameInput);
    assert.ok(emailInput);
    assert.ok(dobInput);
    assert.ok(phoneInput);
    nameInput.value = name;
    emailInput.value = email;
    dobInput.value = dob;
    phoneInput.value = phone;
}
function submitForm() {
    const form = document.querySelector("#details-form");
    assert.ok(form);
    form.dispatchEvent(new window.Event("submit", {
        bubbles: true,
        cancelable: true,
    }));
}
describe("app", () => {
    beforeEach(async () => {
        setupDom();
        await import(`../src/app.js?${Date.now()}`);
    });
    it("adds a valid record to the table", () => {
        fillForm("John Smith", "john@example.com", "1990-01-01", "07123456789");
        submitForm();
        const tableBody = document.querySelector("#records");
        const rows = tableBody?.rows ?? [];
        assert.equal(rows.length, 1);
        assert.match(rows[0]?.children[0]?.textContent ?? "", /John Smith/);
        assert.equal(rows[0]?.cells[0]?.textContent, "John Smith");
        assert.equal(rows[0]?.children[1]?.textContent, "john@example.com");
        assert.equal(rows[0]?.children[2]?.textContent, "1990-01-01");
        assert.equal(rows[0]?.children[3]?.textContent, "07123456789");
    });
    it("does not add a record when validation fails", () => {
        fillForm("", "invalid-email", "", "123");
        submitForm();
        const rows = document.querySelectorAll("#records tr");
        assert.equal(rows.length, 0);
    });
    it("adds multiple records", () => {
        fillForm("John Smith", "john@example.com", "1990-01-01", "07123456789");
        submitForm();
        fillForm("Jane Smith", "jane@example.com", "1985-05-10", "07987654321");
        submitForm();
        const rows = document.querySelectorAll("#records tr");
        assert.equal(rows.length, 2);
    });
    it("edits an existing record", () => {
        fillForm("John Smith", "john@example.com", "1990-01-01", "07123456789");
        submitForm();
        const editButton = document.querySelector('[data-action="edit"]');
        assert.ok(editButton);
        editButton.click();
        fillForm("John Updated", "john.updated@example.com", "1991-02-02", "07111111111");
        submitForm();
        const rows = document.querySelectorAll("#records tr");
        assert.equal(rows.length, 1);
        assert.equal(rows[0]?.children[0]?.textContent, "John Updated");
        assert.equal(rows[0]?.children[1]?.textContent, "john.updated@example.com");
    });
    it("deletes a record", () => {
        fillForm("John Smith", "john@example.com", "1990-01-01", "07123456789");
        submitForm();
        const deleteButton = document.querySelector('[data-action="delete"]');
        assert.ok(deleteButton);
        deleteButton.click();
        const rows = document.querySelectorAll("#records tr");
        assert.equal(rows.length, 0);
    });
});
