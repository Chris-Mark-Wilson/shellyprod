import React ,{useContext,useState}from 'react';
import { View,Text,StyleSheet,TextInput,Alert, Button} from 'react-native';
import {getLocationPermissions,getLocation} from '../phoneApi'
import { DateContext,GeoLocationContext } from '../Contexts';
import { clearAllDevices,storeData } from '../phoneApi';

export const Settings=({navigagtion})=>{
    const {date,setDate} = useContext(DateContext);
    const {geofence,setGeoFence}=useContext(GeoLocationContext)
    const [inputValue,setInputValue]=useState('')

    const clear=()=>{
        clearAllDevices()
        .then(()=>{
            Alert.alert('Memory cleared','All shelly devices have been removed from this device')
        })
        .catch(error=>Alert.alert('Error',error))
    }

    const setGeofence=()=>{
         getLocationPermissions()
        .then(response=>{
            if(response=='granted'){
                getLocation()
                .then(response=>{
                    console.log(response,'location response in setGeofence (settings)')
                    const currentLocation={latitude:response.coords.latitude,longitude:response.coords.longitude}
                    const newGeofence={longitude:currentLocation.longitude,
                    latitude:currentLocation.latitude,    
                    radius:100,
                    state:'inside'
                  }
                    storeData('geofence',newGeofence)
                    .then(response=>{
                        if (response){
                            Alert.alert('Success','Geofence set to current location')
                        }
                    })
                    
                })
            }
        })
        .catch(error=>{
            Alert.alert('Error',`cannot set Geofence ${error}`)
        })

    }

    return(
        <View style={styles.container}>
            <Text>Settings</Text>
            <Button 
            title='Clear memory'
            onPress={clear}/>
            <Button
            title='Set Geofence'
            onPress={setGeofence}
            />
            {/* <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => setInputValue(text)}
                value={inputValue}
            /> */}
   
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})