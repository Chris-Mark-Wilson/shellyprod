import {View,Text,StyleSheet,Pressable,FlatList,Alert} from 'react-native';
import React, { useEffect,useState,useContext } from 'react';
import * as Notifications from 'expo-notifications';
import * as Geolib from 'geolib';
import * as BackgroundFetch from 'expo-background-fetch';
import { getData,getLocationPermissions,getLocation } from '../phoneApi';
import {PowerContext} from '../Contexts'

import * as Location from 'expo-location';

import * as TaskManager from 'expo-task-manager'

let myGeofence={
    
    latitude:0,
    longitude:0,
    radius:10,
    state:'inside'
    // 0 is unknown, 1 is inside fence, 2 is outside fence
}

//background task called when geofencing event is triggered
TaskManager.defineTask(
  "isGeofenceTriggered",
  async ({ data: { locations }, error }) => {
    ////////////////////////////////////////////////////////
    if (error) {
      console.log(error, "error in isGeoFenceTriggered");
      Alert.alert("Error", error);
    }
    //////////////////////////////////////////////////////
    if (locations) {
      console.log(locations[locations.length-1].coords.latitude,locations[locations.length-1].coords.longitude, "locations in taskmanager (devices)\n\n", myGeofence, "\n\n");
      const lastLocation = locations[locations.length-1].coords;
      if (lastLocation) {
        if (Geolib.getDistance(lastLocation, myGeofence) < myGeofence.radius && myGeofence.state == "outside") {
          console.log("inside geofence");
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Geofence Triggered",
              body: "You are inside the geofence",
            },
            trigger: null,
          });

          myGeofence.state = "inside";

        } else if(Geolib.getDistance(lastLocation,myGeofence)>myGeofence.radius && myGeofence.state=='inside'){
          console.log("outside geofence");
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Geofence Triggered",
              body: "You are outside the geofence",
            },
            trigger: null,
          });

          myGeofence.state = "outside";

        }
      }
    }
  }
);

//define a task to keep it going in the background or kill state
TaskManager.defineTask('background-locations',async()=>{
    Location.startLocationUpdatesAsync('isGeofenceTriggered',{
        accuracy:Location.Accuracy.BestForNavigation,
        timeInterval:2*60*1000, //2 minutes
        showsBackgroundLocationIndicator:true})
    })

    //register the task
const startBackgroundTask = async () => {
    await BackgroundFetch.registerTaskAsync('background-locations',{
        minumumInterval:60*15,
        stopOnTerminate:false,
        startOnBoot:true,
    })
}



export const Devices=({navigation})=>{
    const [devices,setDevices]=useState([])
    const [isLoading,setIsLoading]=useState(false)
    const {setPowerMeterId,
            setPowerMeterServer,
            setPowerMeterAuth,
        setPowerMeterStartDate}=useContext(PowerContext)
    
        // const geoFence=useContext(GeoLocationContext)

        useEffect(()=>{
            // setUp geofencing
            getData('geofence')
            .then(geofence=>{
                if(geofence){
                    myGeofence={...geofence}
                    console.log(myGeofence,'geofence in devices use effect')
                }
            
            })
            .then(()=>{
            getLocationPermissions()
            .then(response=>{
                console.log(response,'permissions in devices use effect')
                Location.startLocationUpdatesAsync('isGeofenceTriggered',{
                    accuracy:Location.Accuracy.BestForNavigation,
                    timeInterval:2*60*1000, //2 minutes
                    
                    showsBackgroundLocationIndicator:true})
                .then(()=>{
                   startBackgroundTask()
                })
            })
        })
            .catch(error=>{
                Alert.alert('Error',error)
                console.log(error,'error in devices use effect')    
            })
          },[])

    useEffect(()=>{
        setIsLoading(true)
        getData('devices')
        .then(response=>{
            if(response){
            // console.log(response,' \nresponse in Devices\n\n')
            const deviceNames=Object.keys(response)
            // console.log(deviceNames)
            let deviceArray=[]
            deviceNames.forEach(device=>{
                const deviceData=response[device]
                const name=device
             // console.log(deviceData,' \ndeviceData (devices)')
                deviceArray.push({name:name,info:deviceData})
            })
            setDevices(()=>deviceArray)
            setIsLoading(false)
        }
        // if response is null..
        setTimeout(()=>{setIsLoading(false)},2000)
        })
        .catch(error=>{
         Alert.alert('Device List Error',error)
            console.log(error,'error in Devices')
        })
        
    
    },[])

    const ListEmpty=()=>{
        return (
            <View style={styles.container}>
                <Text style={styles.listEmptyText}>
                    No Registered Devices
                </Text>
            </View>
        )
    }

    const LoadingComponent=()=>{
        return (
            <View style={styles.container}>
                <Text style={styles.listEmptyText}>
                    Loading Devices
                </Text>
            </View>
        )
    }

    const handlePress=(item)=>{
        console.log(`selected device ${item.name} (Devices)`)
      
        setPowerMeterId(()=>item.info.id)
        setPowerMeterAuth(()=>item.info.authKey)
        setPowerMeterServer(()=>item.info.serverUrl)
        setPowerMeterStartDate(()=>item.info.start_date)
        navigation.navigate('Power Meter')
    }
    return isLoading?<LoadingComponent/>:
        (
        <View style={styles.container}>
  
            
             <Text>Devices</Text>
            <FlatList
            contentContainerStyle={styles.list}
            data={devices}
            renderItem={({item})=>{
                return(
                    <Pressable 
                    style={styles.listItem}
                    onPress={()=>handlePress(item)}>
            <Text>{item.name}</Text>
            <Text>{item.info.device_type}</Text>
            </Pressable>
    )}}
            ListEmptyComponent={ListEmpty}
            keyExtractor={(item)=>item.name}
            />

        </View>
    
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
    },
    listEmptyText:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        fontSize:30,
        borderWidth:1,
        borderColor:'red'
    },
    list:{
        width:'80%',
        borderWidth:1,
        borderColor:'red',
        alignItems:'center',
    },
    listItem:{
        // flex:1,
        flexDirection:'row',
        width:'80%',
        borderWidth:1,
        borderColor:'green',
        margin:0,
        padding:0,
        justifyContent:'space-between',
        alignItems:'center'
    }
})