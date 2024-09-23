

import axiosInstance from "./axiosInstance";
import {  useQuery } from "@tanstack/react-query";


export const useGetCategory = () => {
    return useQuery({
        queryKey:[""],
        queryFn:async()=>{
            return (await axiosInstance.get("/category"))
        }
    })
};


