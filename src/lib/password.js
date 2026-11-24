export const passwordRules = [['At least 8 characters', v => v.length >= 8], ['One uppercase letter', v => /[A-Z]/.test(v)], ['One lowercase letter', v => /[a-z]/.test(v)], ['One number', v => /[0-9]/.test(v)], ['One special character', v => /[^A-Za-z0-9\s]/.test(v)]];
export const strongPassword = value => passwordRules.every(([, test]) => test(value));
