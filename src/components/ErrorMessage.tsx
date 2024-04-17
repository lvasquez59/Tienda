import React from 'react';
import {View, Text} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const ErrorMessage = (
  errors: {[key: string]: string},
  name: string,
  label?: string,
) => {
  if (errors[name])
    return (
      <View style={{marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
        <AntDesign name="exclamationcircleo" size={16} color="red" />
        <Text style={{marginLeft: 5, color: 'red', fontSize: 11}}>
          {errors[name].replaceAll(
            name.split('_').join(' '),
            label?.replace(':', '') ?? name,
          )}
        </Text>
      </View>
    );
};
