import AsyncStorage from "@react-native-async-storage/async-storage";

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return JSON.parse(value);
  }
  catch (error) {
    return Promise.reject(error)
  }
  
};

export const storeData = async (key,value) => {
    try {
      // value must be string
      const response = await AsyncStorage.setItem(key, JSON.stringify(value));
     return true;
    } catch (error) {
      return Promise.reject(error)
    }
  };



  export const clearAllDevices=async()=>{
    try{
      const response=await AsyncStorage.removeItem('devices')
      return response
    }
    catch(error){
      return Promise.reject(error)
    }
  }