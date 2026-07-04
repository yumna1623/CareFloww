const DashboardCards = ({ stats }) => {
  const cards = [
    {
      title: "Upcoming",
      value: stats?.upcomingAppointments || 0,
      color: "bg-blue-500",
    },
    {
      title: "Completed",
      value: stats?.completedAppointments || 0,
      color: "bg-green-500",
    },
    {
      title: "Missed",
      value: stats?.missedAppointments || 0,
      color: "bg-red-500",
    },
    {
      title: "Cancelled",
      value: stats?.cancelledAppointments || 0,
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-2xl shadow-md border p-6 hover:shadow-xl transition"
        >
          <div
            className={`w-14 h-14 rounded-xl ${card.color} flex items-center justify-center text-white text-2xl font-bold`}
          >
            {card.value}
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-700">
            {card.title}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;