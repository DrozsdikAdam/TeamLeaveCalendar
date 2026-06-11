import { useState } from "react";
import { Check, X } from "lucide-react";

export default function LeaveTable({ leaves, onStatusChange }) {
    const sortedLeaves = [...leaves].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    const [actionModal, setActionModal] = useState(null); // { id, status }
    const [comment, setComment] = useState("");

    const handleOpenModal = (id, status) => {
        setActionModal({ id, status });
        setComment("");
    };

    const handleConfirm = () => {
        if (actionModal) {
            onStatusChange(actionModal.id, actionModal.status, comment);
            setActionModal(null);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300 h-full relative">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Szabadság Igények Kezelése</h2>

            {leaves.length === 0 ? (
                <p className="text-gray-400 text-center py-12">Nincsenek rügzített kérelmek</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-300 text-gray-400 text-sm uppercase bg-gray-50">
                                <th className="py-3.5 px-4 font-semibold">Név</th>
                                <th className="py-3.5 px-4 font-semibold">Kezdés</th>
                                <th className="py-3.5 px-4 font-semibold">Vége</th>
                                <th className="py-3.5 px-4 font-semibold">Indok</th>
                                <th className="py-3.5 px-4 font-semibold">Visszajelzés</th>
                                <th className="py-3.5 px-4 font-semibold">Állapot</th>
                                <th className="py-3.5 px-4 font-semibold">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {sortedLeaves.map((leave) => (
                                <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-gray-900">{leave.employeeName}</td>
                                    <td className="py-4 px-4 text-gray-600">{new Date(leave.startDate).toLocaleDateString('hu-HU')}</td>
                                    <td className="py-4 px-4 text-gray-600">{new Date(leave.endDate).toLocaleDateString('hu-HU')}</td>
                                    <td className="py-4 px-4 text-gray-600">{leave.reason}</td>
                                    <td className="py-4 px-4 text-gray-500 italic">{leave.comment || "-"}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                            leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {leave.status === 'Pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(leave.id, 'Approved')}
                                                    className="text-green-600 hover:bg-green-50 p-2 rounded-full transition-colors"
                                                    title="Elfogad"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(leave.id, 'Rejected')}
                                                    className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                                                    title="Elutasít"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>
            )}

            {/* Custom Modal for comment submission */}
            {actionModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-md w-full mx-4 transform transition-all animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Döntés megerősítése
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Szeretnél visszajelzést vagy megjegyzést fűzni a kérés {actionModal.status === 'Approved' ? 'jóváhagyásához' : 'elutasításához'}?
                        </p>
                        <textarea
                            className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm mb-4"
                            rows="3"
                            placeholder="Pl. Jóváhagyva, érezd jól magad! (Opcionális)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="flex justify-end gap-3 text-sm font-medium">
                            <button
                                onClick={() => setActionModal(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Mégse
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`px-4 py-2 text-white rounded-xl transition-colors ${actionModal.status === 'Approved'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                Megerősítés
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}