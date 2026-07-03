import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    doctorId: "",
    appointmentDate: "",
    slot: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get("/doctors");
        setDoctors(data);
      } catch (err) {
        console.error("Error fetching doctors", err);
      }
    };

    fetchDoctors();
  }, []);

  // Fetch available slots
  const fetchSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;

    try {
      const { data } = await api.get(
        `/doctors/${doctorId}/slots/${date}`
      );

      console.log("Slots:", data);

      setSlots(data);
    } catch (err) {
      console.error("Error fetching slots", err);
      setSlots([]);
    }
  };

  // Doctor Changed
  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;

    const doc = doctors.find((d) => d.id === doctorId);

    setSelectedDoc(doc);

    setFormData((prev) => ({
      ...prev,
      doctorId,
      slot: "",
    }));

    if (formData.appointmentDate) {
      fetchSlots(doctorId, formData.appointmentDate);
    }
  };
  

  // Date Changed
  const handleDateChange = (e) => {
    const date = e.target.value;

    setFormData((prev) => ({
      ...prev,
      appointmentDate: date,
      slot: "",
    }));

    if (formData.doctorId) {
      fetchSlots(formData.doctorId, date);
    }
  };

  // Booking
 const handleBooking = async (e) => {
  e.preventDefault();

  try {
    await api.post("/appointments/book", {
      doctorId: formData.doctorId,
      appointmentDate: formData.appointmentDate,
      slotStartTime: formData.slot,
    });

    alert("Appointment booked successfully!");
    navigate("/patient/dashboard");
  } catch (err) {
    console.log(err.response?.data);
    alert(err.response?.data?.message || "Booking failed");
  }
};

  return (
    <div className="pt-24 px-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Book an Appointment
      </h1>

      <form
        onSubmit={handleBooking}
        className="bg-white shadow-lg border rounded-xl p-8 space-y-4"
      >
        {/* Patient Name */}
        <input
          type="text"
          placeholder="Patient Name"
          className="w-full border rounded p-3"
          value={formData.patientName}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              patientName: e.target.value,
            }))
          }
          required
        />

        {/* Age */}
        <input
          type="number"
          placeholder="Age"
          className="w-full border rounded p-3"
          value={formData.age}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              age: e.target.value,
            }))
          }
          required
        />

        {/* Doctor */}
        <select
          className="w-full border rounded p-3"
          value={formData.doctorId}
          onChange={handleDoctorChange}
          required
        >
          <option value="">Select Doctor</option>

          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.specialization}
            </option>
          ))}
        </select>

        {/* Appointment Date */}
        <input
          type="date"
          className="w-full border rounded p-3"
          value={formData.appointmentDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split("T")[0]}
          max={
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          }
          required
        />

        {/* Slots */}
        {selectedDoc && (
          <select
            className="w-full border rounded p-3"
            value={formData.slot}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                slot: e.target.value,
              }))
            }
            required
          >
            <option value="">Select Slot</option>

            {slots.length > 0 ? (
              slots.map((slot, index) => (
                <option
                  key={index}
                  value={slot.start}
                  disabled={!slot.available}
                >
                  {slot.start} - {slot.end}
                  {!slot.available ? " (Booked)" : ""}
                </option>
              ))
            ) : (
              <option disabled>No Slots Available</option>
            )}
          </select>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;