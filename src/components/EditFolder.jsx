import { useState } from "react";
import { easeIn, motion } from "framer-motion";

function EditFolder({ folder, onClose, onUpdate }) {
  const [newName, setNewName] = useState(folder.foldername);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/folder/${folder._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ foldername: newName.trim() }),
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
    <div className=" flex justify-center items-center">
      <motion.div 
      initial={{opacity:0,y:50}}
      animate={{opacity:1,y:-230}}
      exit={{opacity:0,y:-50}}
      transition={{duration:0.3,ease:easeIn}}
      className="bg-[#123] p-3 rounded-2xl w-full border border-[#2b8bec]">
        <h2 className="text-lg font-bold text-white mb-4">Edit Folder</h2>

        <form onSubmit={handleUpdate} className="flex flex-col md:flex-row gap-3">
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

export default EditFolder;
