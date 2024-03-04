import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';

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

  export const getLocationPermissions = async () => {
    try {
      let statusFore = await Location.requestForegroundPermissionsAsync();
      let statusBack = await Location.requestBackgroundPermissionsAsync();
  
      if (statusFore.status !== 'granted' && statusBack.status !== 'granted') {
        console.log('Permission to access both foreground and background location was denied');
        return Promise.reject("Both permissions denied");
      } else if (statusFore.status !== 'granted') {
        console.log('Permission to access foreground location was denied');
        return Promise.reject("Foreground permission denied");
      } else if (statusBack.status !== 'granted') {
        console.log('Permission to access background location was denied');
        return Promise.reject("Background permission denied");
      }
  
      return "granted";
    } catch (error) {
      console.log(error, "error cannot get location");
      return Promise.reject(error);
    }
  }

  export const getLocation= async()=>{
    try{
      const location=await Location.getCurrentPositionAsync()
      return location
    }
    catch(error){
      return Promise.reject(error)
    }
  }