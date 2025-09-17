import { useState } from "react";
import { easeIn, motion } from "framer-motion";

function EditVideo({ video, onClose, onUpdate }) {
  const [newName, setNewName] = useState(video.title);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/video/${video._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: newName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      // ✅ Refresh folders in parent
      await onUpdate();
      // ✅ Close modal
      onClose();
    } catch (err) {
      alert(err.message || "Error updating folder");
    }
  };

  return (
    <div className="absolute inset-0 flex justify-center items-center z-10">
      <motion.div 
      initial={{opacity:0,y:0}}
      animate={{opacity:1,y:-120}}
      transition={{duration:0.3,ease:easeIn}}
      className="bg-[#123] p-3 rounded-2xl w-80 border border-[#2b8bec]">
        <h2 className="text-lg font-bold text-white mb-4">Edit title of the video</h2>

        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="p-2 rounded-md bg-gray-900 text-white outline-none"
          />
          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 px-4 py-2 rounded-md text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default EditVideo;
