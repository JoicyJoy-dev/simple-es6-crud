/// <reference types="node" />
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateName, validateEmail, validateDOB, validatePhone, } from "../src/validation.js";
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
describe("validateDOB", () => {
    it("returns an error when date of birth is empty", () => {
        assert.equal(validateDOB(""), "Date of birth is required");
    });
    it("returns an error when date of birth is in the future", () => {
        assert.equal(validateDOB("2999-01-01"), "Date of birth cannot be in the future");
    });
    it("returns null for a valid date of birth", () => {
        assert.equal(validateDOB("1990-01-01"), null);
    });
});
describe("validatePhone", () => {
    it("returns an error when phone number is empty", () => {
        assert.equal(validatePhone(""), "Phone number is required");
    });
    it("returns an error for an invalid phone number", () => {
        assert.equal(validatePhone("abc123"), "Enter a valid phone number");
    });
    it("returns an error when phone number is too short", () => {
        assert.equal(validatePhone("12345"), "Enter a valid phone number");
    });
    it("returns null for a valid phone number", () => {
        assert.equal(validatePhone("07123456789"), null);
    });
});
