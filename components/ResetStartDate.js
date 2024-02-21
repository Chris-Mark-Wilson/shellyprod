import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import React from 'react';
import { Button, View, Text,Alert } from 'react-native'; 
import { getData,storeData } from '../phoneApi';

export const ResetStartDate = (props) => {
  //set start date depends on what component is sending it...
  // e.g. from power meter its setPowerMeterStartDate (context variable)
  //same with deviceId..
  const { startDate, setStartDate, deviceId } = props;
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    //getDeviceData
  getData("devices")
  .then((response) => {
      const devices = { ...response };
      console.log(devices, "getData devices in reset start date");
      // console.log(currentDate)
      const deviceNames = Object.keys(response);
      let foundDevice = "";
      console.log(deviceNames,'deviceNames')
      deviceNames.forEach(deviceName=> {
        console.log(deviceName)
        if (devices[deviceName].id === deviceId) {
          //found correct device
          //change start date
          // console.log(deviceName,'found device name')
          //adjust startDate
          devices[deviceName].start_date = currentDate;
          foundDevice = deviceName;
        }
      })
      //and store..
      storeData("devices", devices)
        .then(() => {
          Alert.alert("Start Date changed", `Device ${foundDevice} changed to ${currentDate.toLocaleDateString()}`);
          setStartDate(currentDate);
        })
        .catch((error) => {
          Alert.alert("Error changing start date", error);
        });
    });

    //adjust and store deviceData with new {...start_date:currentDate}

  
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: new Date(startDate),
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  return (
    <>
      <Text style={{ fontSize: 20, borderWidth: 1 }}>
        {" "}
        Start date: {new Date(startDate).toLocaleDateString()}{" "}
      </Text>
      <View style={{ position: "absolute", bottom: 0 }}>
        <Button
          style={{ position: "absolute", bottom: 70, left: "40" }}
          onPress={showDatepicker}
          title="Reset Start Date"
        />
      </View>
    </>
  );
};