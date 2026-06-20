export function getInitials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function capitalize(text = "") {
  return text.charAt(0).toUpperCase() + text.slice(1);
}