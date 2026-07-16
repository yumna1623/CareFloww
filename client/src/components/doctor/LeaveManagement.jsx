import { useState } from "react";
import api from "../../api/axios";

const LeaveManagement = ({ onLeaveAdded }) => {
  const [leaveDate, setLeaveDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddLeave = async (e) => {
    e.preventDefault();

    if (!leaveDate) {
      return alert("Please select a date.");
    }

    try {
      setLoading(true);

      const { data } = await api.post("/doctors/leave", {
        leaveDate,
      });

      alert(data.message);

      setLeaveDate("");

      // Tell the parent (LeavePage) to refetch the leave list
      if (onLeaveAdded) {
        onLeaveAdded();
      }
    } catch (err) {
      console.log(err.response?.data);

      alert(
        err.response?.data?.message ||
          "Failed to add leave."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border p-6">

      <h2 className="text-2xl font-bold mb-6">
        Leave Management
      </h2>

      <form
        onSubmit={handleAddLeave}
        className="space-y-4"
      >

        <input
          type="date"
          value={leaveDate}
          onChange={(e) =>
            setLeaveDate(e.target.value)
          }
          min={new Date().toISOString().split("T")[0]}
          className="w-full border rounded-lg p-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition disabled:bg-gray-400"
        >
          {loading ? "Adding..." : "Add Leave"}
        </button>

      </form>

    </div>
  );
};

export default LeaveManagement;