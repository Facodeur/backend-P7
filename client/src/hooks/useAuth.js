import { useState, useEffect } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUser } from '../actions/user.actions';


const useAuth = () => {
  const [authUser, setAuth] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/api/user/jwtid`,
        withCredentials: true,
      }).then((res) => {
        if(res)
          setAuth(res.data);
      }).catch(err => console.log(err.message))
    };
    fetchToken();
    if(authUser) dispatch(getUser());
    
    return () => setLoadingUser(false);

  }, [loadingUser, authUser, dispatch])

  return { authUser, setLoadingUser};
}

export default useAuth
