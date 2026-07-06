const DoctorStats = ({ stats }) => {
  const cards = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      color: "bg-blue-500",
    },
    {
      title: "Pending",
      value: stats.pendingAppointments,
      color: "bg-yellow-500",
    },
    {
      title: "Completed",
      value: stats.completedAppointments,
      color: "bg-green-500",
    },
    {
      title: "Missed",
      value: stats.missedAppointments,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow border p-6"
        >
          <div
            className={`w-12 h-12 rounded-lg ${card.color} mb-4`}
          ></div>

          <h3 className="text-gray-500">
            {card.title}
          </h3>

          <p className="text-3xl font-bold mt-2">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DoctorStats;