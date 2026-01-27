const axios = require("axios")

import { useEffect, useState } from "react";

const useFetch =(url, method = "GET", options = {})=>{
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshIndex, setRefeshIndex] = useState(0);

    useEffect(()=>{
        const apiCall = async()=>{
            setLoading(true);
            setError(null);
            try{
                const opts = {...options};
                if(method === 'POST' && !opts.data){
                    opts.data = {}
                }
                const {data: response} = await axios({
                    url,
                    method,
                    ...opts
                })
                if(!response.success){
                    throw new Error(response.message)
                }
                setData(response);
            }catch(error){
                setError(error.message)
            }finally{
                setLoading(false)
            }
        }

    apiCall()
    },[url, refreshIndex, method, options])


    const refetch = () => {
        setRefeshIndex(prev => prev+1)
    }
    return {data, loading, error, refetch}
}

export default useFetch;