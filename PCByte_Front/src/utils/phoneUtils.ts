export function normalizePhone(phone: string): string {
  let value = phone.trim();

  if (!value) {
    return "";
  }

  // Elimina espacios, guiones y paréntesis
  value = value.replace(/[\s()-]/g, "");

  // +56912345678
  if (/^\+56\d{9}$/.test(value)) {
    return value;
  }

  // 56912345678
  if (/^56\d{9}$/.test(value)) {
    return `+${value}`;
  }

  // 912345678
  if (/^9\d{8}$/.test(value)) {
    return `+56${value}`;
  }

  // +56223456789
  if (/^\+56[2-9]\d{8}$/.test(value)) {
    return value;
  }

  // 56223456789
  if (/^56[2-9]\d{8}$/.test(value)) {
    return `+${value}`;
  }

  // 223456789
  if (/^[2-9]\d{8}$/.test(value)) {
    return `+56${value}`;
  }

  return value;
}

export function isValidPhone(phone: string): boolean {
  if (!phone.trim()) {
    return true; // Campo opcional
  }

  const normalized = normalizePhone(phone);

  return /^\+56(9\d{8}|[2-9]\d{8})$/.test(normalized);
}

export function formatPhone(phone: string): string {
  const normalized = normalizePhone(phone);

  if (!isValidPhone(normalized)) {
    return phone;
  }

  // Celular
  if (/^\+569\d{8}$/.test(normalized)) {
    return normalized.replace(
      /^\+569(\d{4})(\d{4})$/,
      "+56 9 $1 $2"
    );
  }

  // Fijo
  return normalized.replace(
    /^\+56([2-9])(\d{4})(\d{4})$/,
    "+56 $1 $2 $3"
  );
}