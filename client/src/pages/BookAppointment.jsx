import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({ patientName: '', age: '', doctorId: '', slot: '' });
  const [selectedDoc, setSelectedDoc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get('/doctors');
        setDoctors(data);
      } catch (err) { console.error("Error fetching doctors", err); }
    };
    fetchDoctors();
  }, []);

  // Doctor change hone par uske slots filter karna
  const handleDoctorChange = (e) => {
    const dId = e.target.value;
    const doc = doctors.find((d) => d.id === dId);
    setSelectedDoc(doc);
    setFormData({ ...formData, doctorId: dId, slot: '' });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', formData);
      alert("Booking successful! Confirmation email has been sent.");
      navigate('/patient/dashboard');
    } catch (err) { alert("Booking failed."); }
  };

  return (
    <div className="pt-24 px-10 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
      <form onSubmit={handleBooking} className="bg-white p-8 shadow-lg rounded-xl border">
        <input className="w-full p-3 mb-4 border rounded" placeholder="Patient Name" required onChange={(e) => setFormData({...formData, patientName: e.target.value})} />
        <input type="number" className="w-full p-3 mb-4 border rounded" placeholder="Age" required onChange={(e) => setFormData({...formData, age: e.target.value})} />

        {/* Doctor Select */}
        <select className="w-full p-3 mb-4 border rounded" onChange={handleDoctorChange} required>
          <option value="">Select a Doctor</option>
          {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>)}
        </select>

        {/* Slots Select - Sirf tab dikhega jab doctor select hoga */}
        {selectedDoc && (
          <select className="w-full p-3 mb-4 border rounded" required onChange={(e) => setFormData({...formData, slot: e.target.value})}>
            <option value="">Select Slot</option>
            {selectedDoc.slots?.length > 0 ? (
              selectedDoc.slots.map((s, i) => <option key={i} value={s}>{s}</option>)
            ) : (
              <option disabled>No slots available</option>
            )}
          </select>
        )}

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Confirm Booking</button>
      </form>
    </div>
  );
};
export default BookAppointment;