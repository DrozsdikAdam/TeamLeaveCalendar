import { Clock, User, AlertTriangle } from 'lucide-react'

export default function OnCallSchedule({ onCall }) {
    return (
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-300'>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
                <Clock size={20} className="text-indigo-500" />
                On call beosztás
            </h2>

            <div className='space-y-3'>
                {onCall?.map((oc, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border transition-all ${oc.hasConflict
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : 'bg-gray-50 border-gray-100'
                        }`}>
                        <div className="flex flex-col gap-1 w-full">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 font-medium">{oc.week}. hét</span>
                                    <span className="flex items-center gap-1.5 text-base text-gray-800 font-semibold">
                                        <User size={16} className={oc.hasConflict ? 'text-red-500' : 'text-gray-500'} />
                                        {oc.employee}
                                    </span>
                                </div>
                                {oc.hasConflict && (
                                    <span className="flex items-center gap-1 bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                                        <AlertTriangle size={12} /> Ütközés!
                                    </span>
                                )}
                            </div>

                            {oc.hasConflict && oc.conflicts && oc.conflicts.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-red-200/60 text-xs text-red-700 space-y-1">
                                    {oc.conflicts.map((conflict, cIdx) => (
                                        <div key={cIdx} className="flex flex-col">
                                            <span className="font-semibold text-red-800">
                                                Szabadság: {new Date(conflict.startDate).toLocaleDateString('hu-HU')} - {new Date(conflict.endDate).toLocaleDateString('hu-HU')}
                                            </span>
                                            <span className="text-red-600/80 italic">Indok: {conflict.reason}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {(!onCall || onCall.length === 0) && (
                    <p className="text-sm text-gray-500 italic text-center py-4">Nincs beosztási adat.</p>
                )}
            </div>
        </div>
    )
}