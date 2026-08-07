// components/PassengerModal.tsx
'use client';

import { useState } from 'react';

export interface PassengerFormData {
    title: 'mr' | 'ms' | 'mrs';
    givenName: string;
    familyName: string;
    gender: 'm' | 'f';
    bornOn: string;
    email: string;
    phoneNumber: string;
}

interface Props {
    isOpen: boolean;
    flightPrice: number;
    currency: string;
    onClose: () => void;
    onSubmit: (data: PassengerFormData) => void;
    isSubmitting: boolean;
}

export default function PassengerModal({
    isOpen,
    flightPrice,
    currency,
    onClose,
    onSubmit,
    isSubmitting,
}: Props) {
    const [formData, setFormData] = useState<PassengerFormData>({
        title: 'mr',
        givenName: '',
        familyName: '',
        gender: 'm',
        bornOn: '1995-05-15',
        email: '',
        phoneNumber: '+14155552671',
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-lg font-extrabold text-gray-900">Passenger Information</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-lg">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Title</label>
                            <select
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value as any })}
                                className="w-full border rounded-lg p-2.5 bg-white text-gray-900"
                            >
                                <option value="mr">Mr</option>
                                <option value="ms">Ms</option>
                                <option value="mrs">Mrs</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">First Name</label>
                            <input
                                type="text"
                                required
                                value={formData.givenName}
                                onChange={(e) => setFormData({ ...formData, givenName: e.target.value })}
                                className="w-full border rounded-lg p-2.5 text-gray-900"
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Last Name</label>
                            <input
                                type="text"
                                required
                                value={formData.familyName}
                                onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
                                className="w-full border rounded-lg p-2.5 text-gray-900"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                                className="w-full border rounded-lg p-2.5 bg-white text-gray-900"
                            >
                                <option value="m">Male</option>
                                <option value="f">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Date of Birth</label>
                            <input
                                type="date"
                                required
                                value={formData.bornOn}
                                onChange={(e) => setFormData({ ...formData, bornOn: e.target.value })}
                                className="w-full border rounded-lg p-2.5 text-gray-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border rounded-lg p-2.5 text-gray-900"
                            placeholder="john.doe@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number</label>
                        <input
                            type="tel"
                            required
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full border rounded-lg p-2.5 text-gray-900"
                            placeholder="+14155552671"
                        />
                    </div>

                    <div className="border-t pt-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400">Total Price</p>
                            <p className="text-xl font-black text-blue-600">${flightPrice} {currency}</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}