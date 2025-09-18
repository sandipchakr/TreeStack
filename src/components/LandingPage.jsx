import { React, useState, useEffect } from 'react'
import { easeInOut, motion } from "framer-motion";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { useForm } from "react-hook-form"
import { Trash2, SquarePen, BookMarked } from "lucide-react";
import { Link } from 'react-router-dom';
import EditFolder from './EditFolder';
import EditVideo from './EditVideo';
import { useAuth } from '../context/AuthProvider';

function LandingPage() {
  const [Folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, serverMsg] = useState(false);
  const [pastemsg, setpastemsg] = useState(false);
  const [SelectedFolder, setSelectedFolder] = useState(null); // selected folder
  const [Videos, setVideos] = useState([]);
  const [deleteVideoLinkMsg, setDeleteVideoLinkMsg] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [showEditVideo, setShowEditVideo] = useState(null);

  const { showleft, setLeftSide } = useAuth();
  // const [folderForVideo,setFolderForVideo] = useState(null)

  //error handling:-
  const [error, setError] = useState("");  //fetchfolder
  const [searchError, setSearchError] = useState("");
  const [folderError, setfolderError] = useState("");
  const [videoError, setvideoError] = useState("");
  const [pasteError, setpasteError] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const [errorVideoDelete, setErrorVideoDelete] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  //for create folder form
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate, isSubmitting: isSubmittingCreate },

  } = useForm();

  // for search folder form
  const {
    register: registerSearch,
    handleSubmit: handleSubmitSearch,
    formState: { errors: errorsSearch, isSubmitting: isSubmittingSearch },
    // reset: resetSearch,
    // clearErrors: clearErrorsSearch,
  } = useForm();


  // for paste video links:-
  const {
    register: registerpaste,
    handleSubmit: handleSubmitpaste,
    formState: { errors: errorspaste, isSubmitting: isSubmittingpaste }
  } = useForm();

  //fetch folders:-
  const fetchFolders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${BACKEND_URL}/api/folder`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        // readable error for debugging
        const text = await res.json();
        throw new Error(text.error);
      }

      const data = await res.json();
      if (data.success) {

        setFolders(data.folders || []);
      }
    } catch (err) {
      console.error("fetchFolders error:", err.error);
      setError(err.error || "Failed to fetch folders");
      setTimeout(() => setError(""), 2000);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchFolders();
  }, [])

  //create folder:-
  const createFolder = async (data) => {
    const folderName = data.newfolder.trim();
    if (!folderName) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ foldername: folderName }),
      });
      if (!res.ok) {
        const errorText = await res.json();
        // console.log("here the error",errorText.error)
        throw new Error(errorText.error);
      }
      const created = await res.json();
      if (created.success) {
        serverMsg(true);
        // reset();   // ✅ reset field
        await fetchFolders(); // Refresh the folder list
        setTimeout(() => serverMsg(false), 2000);
      } else {
        throw new Error(created.message || "Failed to create folder");
      }
      return created;
    } catch (err) {
      setfolderError(err.message || "Failed to create folder");
      setTimeout(() => setfolderError(""), 2000);
      return;
    }
  };

  //search folder:-
  const searchFolder = async (data) => {
    const folderName = data.searchfolder.trim();
    if (!folderName) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/folder/search?foldername=${encodeURIComponent(folderName)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      if (data.success) {
        setFolders(data.folder || []);
      } else {
        throw new Error(created.message || "Failed to create folder");
      }
      return data;

    } catch (err) {
      setSearchError(err.message || "Failed to create folder");
      setTimeout(() => setSearchError(""), 2000);
      return;
    }
  }

  //fetch video:-
  // if(folderForVideo){
  const fetchVideos = async (folder) => {
    try {
      setSelectedFolder(folder);
      const res = await fetch(`${BACKEND_URL}/api/video/${folder._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status} - ${errorText}`);
      }
      if (data.success) {
        setVideos(data.videos || []);
      }
    } catch (err) {
      setvideoError(err.message || "Failed to fetch videos");
      setTimeout(() => setvideoError(""), 2000);
      setVideos([]);
    }
    // };
  }

  //paste video links:-
  const pasteVideoLinks = async (Link) => {
    const link = (Link.pasteLinks || "").trim();
    if (!link) return; // stop if empty
    if (!link.startsWith("http")) {
      setpasteError("Invalid link format");
      setTimeout(() => setpasteError(""), 2000);
      return;
    }
    const folderId = SelectedFolder._id;
    try {
      const res = await fetch(`${BACKEND_URL}/api/video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ folderId: folderId, link: link }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(res.message)
      }
      const data = await res.json()
      if (data.success) {
        setpastemsg(true);
        await fetchVideos(SelectedFolder);
        setTimeout(() => {
          setpastemsg(false)
        }, 2000);

      }
    } catch (error) {
      setpasteError(error.message || "Failed upload video link");
      setTimeout(() => setpasteError(""), 2000);
    }

  }

  //delete folder:-

  const deleteFolder = async (folderdata) => {
    // First warning
    const firstConfirm = window.confirm(`Are you sure you want to delete the folder "${folderdata.foldername}"?`);
    if (!firstConfirm) return;

    // Second warning
    const secondConfirm = window.confirm(`This will permanently delete the folder "${folderdata.foldername}" and all its videos. Continue?`);
    if (!secondConfirm) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/folder/${folderdata._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      if (data.success) {
        //  console.log(data.message); // success message
        setDeleteMsg(data.message);
        setTimeout(() => { setDeleteMsg("") }, 4000);
        await fetchFolders(); // refresh after delete
      }
    } catch (error) {
      console.error("Delete error:", error.message);
      setError(error.message || "Failed to delete folder");
      setTimeout(() => setError(""), 2000);
    }
  }

  // delete video link from folder:-
  const deleteVideoLink = async (videodata) => {
    const firstConfirm = window.confirm(`Are you sure you want to delete the videoLink "${videodata.title}"?`);
    if (!firstConfirm) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/video/${videodata._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      if (data.success) {
        setDeleteVideoLinkMsg(data.message);
        setTimeout(() => { setDeleteVideoLinkMsg("") }, 4000);
        await fetchVideos(SelectedFolder);
      }
    } catch (err) {
      //  console.error("Delete error:", error.message);
      setErrorVideoDelete(error.message || "Failed to delete folder");
      setTimeout(() => setError(""), 4000);
    }
  }

  //make as read:-
  const toggleRead = async (video) => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/video/${video._id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      await fetchVideos(SelectedFolder); // refresh parent
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <div>
      <motion.div
        className='bg-gradient-to-bl from-[#090909] to-[#4e0139c0] h-screen flex justify-center items-center'
      >

        {/* leftside */}
       {showleft && (<motion.div className='lg:static absolute top-20 left-0 z-10 h-screen  bg-[#263a4f7d] backdrop-blur-sm flex flex-col w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/5 '
          // key="sidebar"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}

        >
          <motion.div className='bg-[#263a4f52] backdrop-blur-sm p-3 m-1 border border-[#78ccc5e5] flex flex-col justify-center items-center h-2/5'
            variants={childVariants}
          >
            {/* createform */}
            <form onSubmit={handleSubmitCreate(createFolder)}
              className='flex flex-col justify-center items-center gap-1.5 h-full'
            >
              {folderError && <p className='text-red-500'>{folderError}</p>}
              <span className='text-[#d9b2fd]'
              >Create a Folder:-</span>
              <motion.input type="text" placeholder='Enter folder name'
                variants={childVariants}
                whileFocus={{ scale: 1.05 }}
                {...registerCreate("newfolder", {
                  required: { value: true, message: "This fild is required.." }
                })}
                className='outline-none bg-[#123] rounded-xl text-center p-2.5 w-full'
              />
              {errorsCreate.newfolder && <p className='text-red-500'>{errorsCreate.newfolder.message}</p>}
              <motion.button
                type="submit"
                disabled={isSubmittingCreate}
                className="bg-[#09f41cd6] backdrop-blur-2xl border border-[#49a3fdf2] 
               rounded-xl px-8 py-2 text-lg text-white font-bold 
               hover:cursor-pointer"
                variants={childVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmittingCreate ? "Submitting..." : "Submit"}
              </motion.button>
              {msg && (<span className='text-green-400'>Folder Created Successfully</span>)}
            </form>

            {/* searchform */}
            <form onSubmit={handleSubmitSearch(searchFolder)}
              className='flex flex-col justify-center items-center gap-1.5 h-full'
            >
              {searchError && <p className='text-red-500'>{searchError}</p>}
              <span className='text-[#d9b2fd]'>Search Folder:-</span>
              <motion.input type="text" placeholder='Enter folder name..'
                variants={childVariants}
                whileFocus={{ scale: 1.05 }}
                {...registerSearch("searchfolder", {
                  required: { value: true, message: "This fild is required.." }
                })}
                className='outline-none bg-[#123] rounded-xl text-center p-2.5 w-full'
              />
              {errorsSearch.searchfolder && <p className='text-red-500'>{errorsSearch.searchfolder.message}</p>}
              <motion.button
                type="submit"
                disabled={isSubmittingSearch}
                className="bg-[#8baf8e89] backdrop-blur-2xl border border-[#a6c8eb91] 
               rounded-xl px-8 py-2 text-lg text-white font-bold 
               hover:cursor-pointer"
                variants={childVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmittingSearch ? "Searching..." : "Search"}
              </motion.button>
            </form>

          </motion.div>

          <motion.div className="flex-1 gap-0.5 overflow-y-auto p-2 space-y-2"
            variants={childVariants}
          >
            {error && (<span className='text-red-500'>{error}</span>)}
            {deleteMsg && (<span>{deleteMsg}</span>)}
            {Folders.length === 0 ? (
              <p className="text-gray-200">No folders yet...</p>
            ) : (
              Folders.map((f) => (
                <motion.div
                  key={f._id}
                  className="p-1.5 bg-[#011223] rounded-xl cursor-pointer hover:bg-[#02203f] 
                  flex justify-evenly items-center flex-wrap"
                  variants={childVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span
                    onClick={() => fetchVideos(f)}
                    className='grow h-full rounded-xl break-words whitespace-normal min-w-0'>{f.foldername}</span>
                  <span className='h-full rounded-xl p-1'
                    onClick={() => deleteFolder(f)}
                  >
                    <Trash2
                      className="text-red-500 cursor-pointer hover:text-red-700 "
                      size={20}
                    />
                  </span>
                </motion.div>
              ))
            )}
          </motion.div>

        </motion.div>)}
        {/* rightside */}
        <div className=" flex-1  p-4 overflow-y-auto h-screen relative">
           
        
          {SelectedFolder ? (
            // <div className='relative'>
            <div className=' bg-gray700 flex flex-col justify-center items-center gap-4 '>
              {/* <div className='relative'> */}
              <div className="text-3xl font-bold mb-2 ml-1.5 text-white self-start flex items-center gap-6  w-full flex-wrap">
                <span className='break-words whitespace-normal min-w-0'>{SelectedFolder.foldername}</span>
                <div className='text-sm p-2 cursor-pointer'
                  onClick={() => setShowEdit(true)}
                >
                  <SquarePen />
                </div>
                
              </div>
              {showEdit && (
                  <div className='absolute inset-0 z-10 text-sm flex justify-center items-center '>
                    <EditFolder
                      folder={SelectedFolder}
                      onClose={() => setShowEdit(false)}
                      onUpdate={fetchFolders}
                    />
                  </div>
                )}

              {/* paste form */}
              <form onSubmit={handleSubmitpaste(pasteVideoLinks)}
                className='flex flex-col justify-center items-center gap-2 h-full w-full md:w-2/3 p-2'
              >
                <motion.input type="text" placeholder='Paste your Video Link'
                  variants={childVariants}
                  whileFocus={{ scale: 1.05 }}
                  {...registerpaste("pasteLinks", {
                    required: { value: true, message: "This fild is required.." }
                  })}
                  className='outline-none bg-[#123] rounded-xl text-center p-2.5 w-full'
                />
                {errorspaste.pasteLinks && <p className='text-red-500'>{errorspaste.pasteLinks.message}</p>}
                <motion.button
                  type="submit"
                  disabled={isSubmittingpaste}
                  className="bg-[#8baf8e89] backdrop-blur-2xl border border-[#a6c8eb91] 
               rounded-xl px-8 py-2 text-lg text-white font-bold 
               hover:cursor-pointer"
                  variants={childVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmittingpaste ? "Submitting.." : "Submit"}
                </motion.button>
                {pastemsg && (<span>Link added successfully</span>)}
                {pasteError && <span>{pasteError}</span>}
              </form>

              <div className='w-full bg-gray-700 h-0.5'></div>
              {/* </div> */}
              {deleteVideoLinkMsg && (<span>{deleteVideoLinkMsg}</span>)}
              {errorVideoDelete && (<span>{errorVideoDelete}</span>)}
              {Videos.length === 0 ? (
                <p className="text-white">No videos in this folder yet...</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                  {Videos.map((v) => (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                      key={v._id}
                      className="relative bg-gray-800 rounded-xl p-2 flex flex-col items-center min-w-[2/3] sm:min-w-[3/4] lg:min-w-[4/5]"
                    >
                      <button
                        onClick={() => toggleRead(v)}
                        disabled={loading}
                        className='mb-1.5 self-end p-1 hover:cursor-pointer'
                      >
                        {v.isRead ? (<BookMarked
                          className='text-red-700 hover:text-red-900'
                        />) : (<BookMarked
                          className='text-gray-400 hover:text-gray-600'
                        />)}
                      </button>
                      {v.thumbnail ? (
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          className="w-full h-40 object-cover rounded-md mb-2"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-600 flex items-center justify-center mb-2 text-gray-400">
                          No Image
                        </div>
                      )}
                      <p className="text-white text-center">{v.title}</p>
                      <a
                        href={v.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 mt-2 underline"
                      >
                        Open Link
                      </a>
                      <div className='w-full flex justify-evenly items-center mt-2'>
                        <span className='h-full rounded-r-xl p-1'
                          onClick={() => deleteVideoLink(v)}
                        >
                          <Trash2
                            className="text-red-500 cursor-pointer hover:text-red-700 "
                            size={20}
                          />
                        </span>
                        <span
                          className=" p-1 rounded-xl cursor-pointer"
                          onClick={() => setShowEditVideo(v)}
                        >
                          <SquarePen className="text-green-400 hover:text-green-600" size={20} />
                        </span>
                      </div>
                      {showEditVideo && showEditVideo._id === v._id && (
                        <EditVideo
                          video={showEditVideo}
                          onClose={() => setShowEditVideo(null)}
                          onUpdate={() => fetchVideos(SelectedFolder)}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            // </div>
          ) : (
            <p className="text-white">Select a folder to view videos</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default LandingPage