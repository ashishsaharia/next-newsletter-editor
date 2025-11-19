'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getUserDesigns, deleteDesign } from '@/services/design-service';
import DesignPreview from './design-preview.js';

function RecentDesigns() {
  const router = useRouter();
  const [userDesigns, setUserDesigns] = useState([]);
  const [refresh, setRefresh] = useState(0);

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Success toast state
  const [successMessage, setSuccessMessage] = useState("");

  async function fetchUserDesings() {
    const result = await getUserDesigns();
    if (result?.success) {
      setUserDesigns(result.data);
    }
  }

  useEffect(() => {
    fetchUserDesings();
  }, [refresh]);

  // Actual delete logic
  async function handleDeleteConfirm() {
    if (!selectedId) return;

    try {
      const res = await deleteDesign(selectedId);

      if (res.success) {
        setSuccessMessage("Design deleted successfully");
        setRefresh((prev) => prev + 1);
      } else {
        setSuccessMessage("Failed to delete design");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setSuccessMessage("Error deleting design");
    }

    setConfirmOpen(false);
    setSelectedId(null);

    // Auto hide toast after 3s
    setTimeout(() => setSuccessMessage(""), 3000);
  }

  return (
    <div className="mt-4">

      {/* SUCCESS TOAST */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fadeIn">
          {successMessage}
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <h3 className="text-lg font-bold mb-3">Delete Design?</h3>
            <p className="text-sm mb-5">
              Are you sure you want to delete this design? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4"> Recent Designs</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">

        {!userDesigns.length && <h1>No user designs found</h1>}

        {userDesigns.map((design) => (
          <div
            onClick={() => router.push(`/editor/${design._id}`)}
            key={design._id}
            className="group cursor-pointer"
          >
            <div className="w-[250px] h-[200px] rounded-lg mb-2 overflow-hidden transition-shadow group-hover:shadow-lg shadow-md relative">

              {/* DELETE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(design._id);
                  setConfirmOpen(true);
                }}
                className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition z-20"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>

              {/* PREVIEW */}
              {design?.canvasData && <DesignPreview design={design} />}

            </div>

            <p className="font-bold text-sm truncate">{design.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentDesigns;
