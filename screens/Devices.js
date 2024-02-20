import {View,Text,StyleSheet,Pressable,FlatList} from 'react-native';
import React, { useEffect,useState,useContext } from 'react';

import { getData } from '../phoneApi';
import {PowerContext} from '../Contexts'

export const Devices=({navigation})=>{
    const [devices,setDevices]=useState([])
    const [isLoading,setIsLoading]=useState(false)
    const {setPowerMeterId,
            setPowerMeterServer,
            setPowerMeterAuth}=useContext(PowerContext)

    useEffect(()=>{
        setIsLoading(true)
        getData('devices')
        .then(response=>{
            if(response){
            console.log(response,'response in Devices')
            const deviceNames=Object.keys(response)
            console.log(deviceNames)
            let deviceArray=[]
            deviceNames.forEach(device=>{
                const deviceData=response[device]
                const name=device
                console.log(deviceData,'deviceData (devices)')
                deviceArray.push({name:name,info:deviceData})
            })
            setDevices(()=>deviceArray)
            setIsLoading(false)
        }
        console.log('no response from api (Devices)')
        setTimeout(()=>{setIsLoading(false)},2000)
        })
        .catch(error=>console.log(error,'error in Devices'))
    
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
        console.log(item.name)
        console.log(item.info)
        setPowerMeterId(()=>item.info.id)
        setPowerMeterAuth(()=>item.info.authKey)
        setPowerMeterServer(()=>item.info.serverUrl)
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