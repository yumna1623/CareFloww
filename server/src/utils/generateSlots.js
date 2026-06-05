export const generateSlots = (startTime, endTime, duration) => {
  const slots = [];

  const [startHour, startMin] = startTime.split(":").map(Number);

  const [endHour, endMin] = endTime.split(":").map(Number);

  let current = startHour * 60 + startMin;

  const end = endHour * 60 + endMin;

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

  return slots;
};
