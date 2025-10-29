export default function RecordsPage() {
    return (
        <div className="bg-white rounded-xl p-6">
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-medium mb-4">Text 1 Records</h2>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <span className="text-gray-600">url</span>
                        <span>https://www.ideacrestsolutions.com/</span>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-medium mb-4">Address 1 Records</h2>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <span className="text-gray-600">eth</span>
                        <span className="font-mono">0x5E4b3de5f3fbE1132dC4Ef129843271dAB1467bB</span>
                    </div>
                </div>

                <div className="text-gray-500">No Content Hash</div>
                <div className="text-gray-500">No ABI</div>

                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Edit Records
                </button>
            </div>
        </div>
    );
}
