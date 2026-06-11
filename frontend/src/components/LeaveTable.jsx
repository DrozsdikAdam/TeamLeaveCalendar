import { Check, X } from "lucide-react";

export default function LeaveTable({ leaves, onStatusChange }) {
    const sortedLeaves = [...leaves].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300 h-full">
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
                                                    onClick={() => onStatusChange(leave.id, 'Approved')}
                                                    className="text-green-600 hover:bg-green-50 p-2 rounded-full transition-colors"
                                                    title="Elfogad"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => onStatusChange(leave.id, 'Rejected')}
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
        </div>
    )
}