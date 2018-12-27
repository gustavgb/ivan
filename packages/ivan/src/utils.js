const uppercase = /^[A-Z][A-Za-z0-9_-]{0,}$/

export const isUpperCase = (str) => uppercase.test(str)
