import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import LeaveForm from './components/LeaveForm';
import OnCallSchedule from './components/OnCallSchedule';
import LeaveTable from './components/LeaveTable';
import { apiClient } from './api';

export default function App() {
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [onCall, setOnCall] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersData = await apiClient.getUsers();
      setUsers(usersData);

      const leavesData = await apiClient.getLeaves();
      setLeaves(leavesData);

      const onCallData = await apiClient.getOnCallSchedule();
      setOnCall(onCallData);

      setError(null);
    } catch (err) {
      console.error("Hiba az adatszinkronizálás során:", err);
      setError(err.message || "Hiba történt az adatok letöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus === 'Approved') {
        await apiClient.approveLeave(id);
      } else {
        await apiClient.rejectLeave(id);
      }
      fetchData();
    } catch (err) {
      console.error("Hiba a státusz módosítás során:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Fejléc */}
      <header className="bg-blue-600 text-white shadow-md p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Calendar size={32} />
          <h1 className="text-2xl font-bold">Team Leave & On-Call Manager</h1>
        </div>
      </header>

      {/* Loading jelző */}
      {loading && (
        <div className="max-w-7xl mx-auto px-6 mt-4 flex items-center gap-2 text-blue-600 font-medium text-sm">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          Adatok frissítése...
        </div>
      )}

      {/* Hiba üzenet */}
      {error && !loading && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl">
            <p className="font-semibold">Hiba történt a szinkronizáció során:</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Fő tartalom */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bal oszlop */}
        <div className="space-y-8 lg:col-span-1">
          <LeaveForm users={users} onLeaveCreated={fetchData} />
          <OnCallSchedule onCall={onCall} />
        </div>

        {/* Jobb oszlop */}
        <div className="lg:col-span-2">
          <LeaveTable leaves={leaves} onStatusChange={handleStatusChange} />
        </div>
      </main>
    </div>
  );
}