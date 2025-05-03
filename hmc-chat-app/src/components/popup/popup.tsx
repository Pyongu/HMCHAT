import React from "react";
import { useState } from "react";

const CLIENT_ID = "484184324484-dnn5iloaabckg35bhb9igc32p8o0b7bg.apps.googleusercontent.com"
export default function PopupExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Button to open popup */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Click Me UWU
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
            <h2 className="text-xl font-semibold mb-4">Hello Popup!</h2>
            <p className="mb-4">XXXKIRBY</p>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}