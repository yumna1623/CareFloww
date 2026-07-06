import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function TrackAppointment() {
  const { id } = useParams();

  const [track, setTrack] = useState(null);

  useEffect(() => {
    fetchTrack();

    const interval = setInterval(fetchTrack, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchTrack = async () => {
    try {
      const { data } = await api.get(
        `/appointments/track/${id}`
      );

      setTrack(data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!track) {
    return (
      <div className="pt-24 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="pt-24 max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6">
          Track Appointment
        </h1>

        <p>
          <b>Doctor:</b>{" "}
          {track.appointment.doctor.name}
        </p>

        <p>
          <b>Specialization:</b>{" "}
          {track.appointment.doctor.specialization}
        </p>

        <p>
          <b>Date:</b>{" "}
          {new Date(
            track.appointment.appointmentDate
          ).toLocaleDateString()}
        </p>

        <p>
          <b>Time:</b>{" "}
          {track.appointment.slotStartTime}
        </p>

        <hr className="my-6" />

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-100 rounded-lg p-5">
            <h2 className="font-bold">
              Your Queue
            </h2>

            <p className="text-4xl">
              {track.appointment.queuePosition}
            </p>
          </div>

          <div className="bg-green-100 rounded-lg p-5">
            <h2 className="font-bold">
              Current Queue
            </h2>

            <p className="text-4xl">
              {track.currentQueue}
            </p>
          </div>

          <div className="bg-yellow-100 rounded-lg p-5">
            <h2 className="font-bold">
              People Ahead
            </h2>

            <p className="text-4xl">
              {track.peopleAhead}
            </p>
          </div>

          <div className="bg-purple-100 rounded-lg p-5">
            <h2 className="font-bold">
              {track.countdown
                ? "Time Remaining"
                : "Estimated Wait"}
            </h2>

            {track.countdown ? (
              <p className="text-2xl font-bold">
                {track.countdown.days}d{" "}
                {track.countdown.hours}h{" "}
                {track.countdown.minutes}m
              </p>
            ) : (
              <p className="text-4xl">
                {track.estimatedWait} min
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}