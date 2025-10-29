import React from 'react';
import { X, ArrowRight } from 'lucide-react';

interface EditRolesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const EditRolesModal = ({ isOpen, onClose, onSave }: EditRolesModalProps) => {
    if (!isOpen) return null;

    const RoleCard = ({ title, description, address, ensName }: {
        title: string;
        description: string;
        address: string;
        ensName: string;
    }) => (
        <div className="rounded-3xl bg-white border shadow-sm">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-500 mt-1">{description}</p>

                <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-300 to-pink-300" />
                        <div>
                            <div className="font-medium text-gray-900">{ensName}</div>
                            <div className="text-gray-500 text-sm">{address}</div>
                        </div>
                    </div>

                    <button className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 font-medium">
                        Change
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-50 w-full max-w-2xl rounded-3xl">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Edit roles</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Role Cards */}
                    <div className="space-y-4">
                        <RoleCard
                            title="Owner"
                            description="The address that owns this name."
                            ensName="karanabbhi.eth"
                            address="0x5E4...467bB"
                        />

                        <RoleCard
                            title="ETH record"
                            description="The address that this name points to."
                            ensName="karanabbhi.eth"
                            address="0x5E4...467bB"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-500 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="flex-1 py-3 rounded-xl bg-gray-200 text-gray-500 hover:bg-gray-300 font-medium transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditRolesModal;
