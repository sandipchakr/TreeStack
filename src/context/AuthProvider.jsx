import {createContext,useContext,useEffect,useState} from "react"
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const AuthContext = createContext();

export const useAuth = ()=> useContext(AuthContext);

export const AuthProvider = ({children})=>{
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(false);
    const [showleft, setLeftSide] = useState(true);

    //auto-fetch current user on loead:-
    useEffect(()=>{
        setLoading(true)
        const fetchuser = async ()=>{
            try{
                const res = await axios.get(`${BACKEND_URL}/api/user/me`,{
                    withCredentials: true,
                });
                setUser(res.data.user);
            }catch(err){
                setUser(null);
            }finally{
                setLoading(false);
            }
        }
        fetchuser();
    },[]);
    return(
        <AuthContext.Provider value={{user,setUser,loading,showleft,setLeftSide}}>
            {children}
        </AuthContext.Provider>
    );
};