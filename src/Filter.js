import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Platform, TextInput, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import RNFS from 'react-native-fs'
import Button from './components/Button'
import { LogLevel, RNFFmpegConfig, RNFFmpeg } from 'react-native-ffmpeg'
import ImagePicker from 'react-native-image-picker'
// import ImagePicker from 'react-native-image-crop-picker'
import Video from 'react-native-video';
import { checkFiles, chooseVideo } from './helper'
const { width, height } = Dimensions.get("window");
export default function FfmpegTest({ route }) {
  // const [videoUri, setUri] = useState('')
  const { videoUri } = route.params;
  const [processed, setProcessed] = useState(false)
  const [loading, setLoading] = useState(false)
  const pathToSave = RNFS.CachesDirectoryPath;
  const output = `${pathToSave}/output:filtered.mp4`;



  const filterHandler = async (type) => {
    if (videoUri) {
      setProcessed(false);
      setLoading(true)
      let command = "";
      switch (type) {
        case "blur":
          //-i sample.mp4 -vf "unsharp=lx=7:ly=7:la=-1" blur2.mp4 -y
          command = `-i ${videoUri} -vf "unsharp=lx=7:ly=7:la=-1"  ${output} -y`
          break;

        case "contrast":
          //-i sample.mp4 -vf "eq=contrast=1.3" contrasted.mp4 -y
          command = `-i ${videoUri} -vf "eq=contrast=1.3" ${output} -y`
          break;
        case "brightness":
          // ffmpeg -i sample.mp4 -vf "curves=all='0/0 0.5/1 1/1'" brighter.mp4 -y
          command = `-i ${videoUri} -vf "curves=all='0/0 0.5/1 1/1'" ${output} -y`
          break;
        case "red":
          //-vf colorbalance=rs=0.5
          command = `-i ${videoUri} -vf "colorbalance=rs=0.5" ${output} -y`
          break;
        case "vintage":
          command = `-i ${videoUri} -vf "curves=vintage" ${output} -y`;
          break;
        default:
          return;
      }
      try {
        const { rc } = await RNFFmpeg.execute(command)
        const { lastCommandOutput } = await RNFFmpegConfig.getLastCommandOutput();
        console.log("Last command output: ", lastCommandOutput);
        console.log('\n--------------------------------\n')

      } catch (error) {
        console.error("FFMPEG ERROR: ", error)
      }
      finally {
        setProcessed(true);
        setLoading(false);
      }

    }
  }

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    )

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <SafeAreaView style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
        {videoUri ? (
          <Video
            source={{ uri: videoUri }}
            style={{ width: 300, height: 200 }}
            muted
            resizeMode="cover"
          />
        ) :
          <View style={{ width: 300, height: 200, backgroundColor: '#f48c06', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 20, color: 'white' }}>Video Player placeholder</Text>
          </View>
        }
        {videoUri ? (<>
          <Button onPress={() => filterHandler('blur')}>
            Blur
        </Button>
          <Button onPress={() => filterHandler('contrast')}>
            Contrast
        </Button>
          <Button onPress={() => filterHandler('brightness')}>
            Brightness
        </Button>

          <Button onPress={() => filterHandler('red')}>
            Red
        </Button>
          <Button onPress={() => filterHandler('vintage')}>
            Vintage
        </Button>
          {processed ? <Video
            source={{ uri: output }}
            style={{ width: 300, height: 200 }}
            repeat
            resizeMode='cover'
          /> : <View style={{ width: 300, height: 200, backgroundColor: '#f48c06', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Filtered Video placeholder</Text>
            </View>}
        </>) : null}
        <Button onPress={checkFiles}>
          Check Files
      </Button>
        {/* <TouchableOpacity style={styles.button} onPress={filterHandler}>
        <Text>Extract audio</Text>
      </TouchableOpacity> */}

      </SafeAreaView>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#40916c',
    borderRadius: 10,
    marginVertical: 10
  },
  input: {
    margin: 15,
    height: 40,
    width: width - 50,
    borderColor: '#7a42f4',
    borderWidth: 1,
    textAlign: "center"
  },
})