export default function TotalTicketsCard({ totalTickets }) {
    return (
        <div className="max-w-xs bg-white shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-lg uppercase font-semibold text-gray-600">
                Total Tickets Processed
            </h3>
            <p className="text-4xl font-bold text-blue-600 mt-4">
                {totalTickets}
            </p>
        </div>
    )
}
