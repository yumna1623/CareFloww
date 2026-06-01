export const calculateSlot = (
  startTime,
  consultationDuration,
  queuePosition,
) => {
  const [hours, minutes] = startTime.split(":").map(Number);

  const totalMinutes = hours * 60 + minutes;

  const slotStart = totalMinutes + (queuePosition - 1) * consultationDuration;

  const slotEnd = slotStart + consultationDuration;

  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);

    const m = mins % 60;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return {
    slotStartTime: formatTime(slotStart),

    slotEndTime: formatTime(slotEnd),

    estimatedWait: (queuePosition - 1) * consultationDuration,
  };
};
