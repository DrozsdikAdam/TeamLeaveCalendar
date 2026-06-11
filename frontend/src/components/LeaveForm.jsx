import { useState } from "react";
import { FileText } from "lucide-react";
import { apiClient } from "../api";

export default function LeaveForm({ users, onLeaveCreated }) {
    const todayStr = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        employeeName: "",
        startDate: "",
        endDate: "",
        reason: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [warning, setWarning] = useState("");

    const handleChange = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setWarning("");

        if (!formData.employeeName || !formData.startDate || !formData.endDate || !formData.reason) {
            setError("Minden mező kötelező!");
            return;
        }

        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);

        if (start > end) {
            setError("A kezdő dátumnak kisebbnek kell lennie a befejező dátumnál!");
            return;
        }

        try {
            const data = await apiClient.createLeave(formData);

            setSuccess("Kérés sikeresen elküldve!");
            if (data.warning) {
                setWarning(data.warning);
            }
            setFormData({ employeeName: "", startDate: "", endDate: "", reason: "" });
            onLeaveCreated();
        } catch (error) {
            setError(error.message || "Sikertelen elküldés!");
            console.log("Szerver hiba", error);
        }
    }

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
                    <FileText size={20} className="text-blue-500" />
                    Szabadság igénylése
                </h2>

                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}
                {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">{success}</div>}
                {warning && <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm font-medium">{warning}</div>}

                <form onSubmit={handleChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1"> Csapattag</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.employeeName}
                            onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                        >
                            <option value="">Válassz tagot...</option>
                            {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kezdet</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={formData.startDate}
                                min={todayStr}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vége</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={formData.endDate}
                                min={formData.startDate || todayStr}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Indoklás</label>
                        <textarea
                            rows="3"
                            placeholder="Pl. Családi nyaralás..."
                            className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        ></textarea>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition shadow-sm">
                        Igénylés beküldése
                    </button>
                </form>

            </div>
        </>
    )
}