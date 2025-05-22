// Validation helpers for provider GraphQL resolvers
export function validateEmail(email: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email address");
}
export function validateMobile(mobile: string) {
  if (!/^\d{10,15}$/.test(mobile)) throw new Error("Invalid mobile number");
}
export function validateBusinessTaxNumber(tax: string) {
  if (!/^[A-Z0-9]{10}$/.test(tax)) throw new Error("businessTaxNumber must be 10 uppercase letters or digits");
}
export function validateAddress(address: any) {
  const required = ["streetNumber", "streetName", "city", "state", "postcode"];
  for (const field of required) {
    if (!address[field]) throw new Error(`Address field ${field} is required`);
  }
}
export function validateFullName(fullName: any) {
  if (!fullName.firstName || !fullName.lastName) throw new Error("Both firstName and lastName are required");
}
