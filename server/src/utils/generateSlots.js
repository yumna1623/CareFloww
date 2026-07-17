export const generateSlots = (startTime, endTime, duration) => {
  console.log("generateSlots() called");
  console.log("startTime:", startTime);
  console.log("endTime:", endTime);
  console.log("duration:", duration);

  const slots = [];

  if (!startTime || !endTime || !duration) {
    console.log("Missing values");
    return [];
  }

  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  console.log("Parsed Start:", startHour, startMin);
  console.log("Parsed End:", endHour, endMin);

  let current = startHour * 60 + startMin;
  const end = endHour * 60 + endMin;

  console.log("Current Minutes:", current);
  console.log("End Minutes:", end);

  while (current + duration <= end) {
    const slotStart = current;
    const slotEnd = current + duration;

    const format = (mins) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;

      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    slots.push({
      start: format(slotStart),
      end: format(slotEnd),
    });

    current += duration;
  }

  console.log("Returning Slots:", slots);

  return slots;
};