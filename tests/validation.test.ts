import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  validateName,
  validateEmail,
  validateDOB,
  validatePhone,
} from "../src/validation.js";

describe("validateName", () => {
  it("returns an error when name is empty", () => {
    assert.equal(validateName(""), "Name is required");
  });

  it("returns null for a valid name", () => {
    assert.equal(validateName("John Smith"), null);
  });
});

describe("validateEmail", () => {
  it("returns an error when email is empty", () => {
    assert.equal(validateEmail(""), "Email is required");
  });

  it("return an error for an invalid email", () => {
    assert.equal(validateEmail("invalid-email"), "Enter a valid email address");
  });

  it("return null for a valid email", () => {
    assert.equal(validateEmail("test@test.com"), null);
  });
});
