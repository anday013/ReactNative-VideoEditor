import React, { useState } from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import Button from './components/Button'
import Video from 'react-native-video'
import { chooseVideo } from './helper'
export default function Home({ navigation }) {
    const [uri, setUri] = useState('')
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
            {uri ?
                (
                    <>
                        <Video
                            source={{ uri: uri }}
                            style={{ width: 350, height: 250}}
                            resizeMode='cover'
                            repeat
                            muted
                        />
                    </>
                )
                : <View style={{ width: 300, height: 200, backgroundColor: '#e36414', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Video</Text>
                </View>}
            <Button title="Pick Video" style={{ backgroundColor: 'green' }} onPress={() => chooseVideo(uri => setUri(uri))} />
            {uri ? (
                <View style={{ marginTop: 100 }}>
                    <Button title="Filter" onPress={() => navigation.navigate("FilterScreen", { videoUri: uri })} />
                    <Button title="Trim" onPress={() => navigation.navigate("TrimScreen", { videoUri: uri })} />
                </View>
            ) : null
            }
        </SafeAreaView>
    )
}
