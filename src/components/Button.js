import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default function Button({ title, textStyle, style, children, ...props }) {
    return (
        <TouchableOpacity style={[{
            width: 200,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#3369e8',
            borderRadius: 10,
            marginVertical: 10
        }, style]} {...props}>
            <Text style={[{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'white'
            },textStyle]}>{title || children}</Text>
        </TouchableOpacity>
    )
}
