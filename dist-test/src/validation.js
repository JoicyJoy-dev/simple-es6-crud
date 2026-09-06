export function validateName(name) {
    if (name.trim() === "")
        return "Name is required";
    return null;
}
export function validateEmail(email) {
    if (email.trim() === "")
        return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return "Enter a valid email address";
    return null;
}
export function validateDOB(dob) {
    if (dob.trim() === "")
        return "Date of birth is required";
    const date = new Date(dob);
    if (Number.isNaN(date.getTime())) {
        return "Enter a valid date of birth";
    }
    const today = new Date();
    if (date > today)
        return "Date of birth cannot be in the future";
    return null;
}
export function validatePhone(phone) {
    if (phone.trim() === "")
        return "Phone number is required";
    if (!/^[+0-9\s()-]+$/.test(phone)) {
        return "Enter a valid phone number";
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
        return "Enter a valid phone number";
    }
    return null;
}
