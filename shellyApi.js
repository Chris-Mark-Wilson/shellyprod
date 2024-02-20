
import axios from 'axios';


export const getStatus = async(device_id,server,auth_key) => {
try{
const response = await axios.post(`${server}/device/status/?id=${device_id}&auth_key=${auth_key}`)


    return response.data;
}
catch(error){
    if (error.response) console.log(error.response ,'error.response')
    if (error.status) console.log(error.status,'error.status')
    console.log(error,'error in api.js');
    return Promise.reject(error);
}
}

export const testUrl=async(url)=>{
    try{
        const response= await axios.get(url)
        console.log (response.data,'data in testUrl (shellyApi)')
        return response.data

    }
    catch(error){
       
        return Promise.reject(error.response)
    }
}