

import { useState, useEffect } from "react";
import api from "../api/axios";
import LeaveManagement from "../components/doctor/LeaveManagement";

const LeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaves from backend
 const fetchLeaves = async () => {
  try {
    const { data } = await api.get("/doctors/leave");

    console.log("Frontend:", data);

    setLeaves(data);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="space-y-8">
      {/* Add New Leave Form */}
      <div className="max-w-2xl">
        <LeaveManagement onLeaveAdded={fetchLeaves} />
      </div>

      {/* Leave History Table */}
      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-xl font-bold mb-4">Leave History</h2>
        {loading ? (
          <p>Loading history...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-sm text-slate-500">Date</th>
                <th className="pb-3 text-sm text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-4 font-medium">
                    {new Date(leave.leaveDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase">
                      {leave.status || "Confirmed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeavePage;