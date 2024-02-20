import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import React from 'react';
import { Button, View, Text } from 'react-native'; 
import { storeData } from '../phoneApi';

export const DatePicker = (props) => {


    const {date,setDate} = props;
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        storeData('date',currentDate.toString());
      };
    
      const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
          value: date,
          onChange,
          mode: currentMode,
          is24Hour: true,
        });
      };
    
      const showDatepicker = () => {
        showMode('date');
      };


    
   
    
      return (
      <>         
       <Text style={{fontSize:20, borderWidth:1}}> Start date: {date.toLocaleDateString()} </Text>
       <View style={{position:"absolute",bottom:0}}>
          <Button  style={{position:"absolute",bottom:70,left:"40"}}onPress={showDatepicker} title="Reset Start Date" />
         </View>
          </>

      );




}