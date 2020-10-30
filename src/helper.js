import React, { useEffect, useRef } from 'react'
import { Dimensions, Platform, Text, View } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import RNFS from 'react-native-fs'
export const chooseVideo = (onChange) => {
  const options = {
    title: 'Video Picker',
    takePhotoButtonTitle: 'Take Video...',
    mediaType: 'video',
    // videoQuality: 'medium',
  };
  ImagePicker.showImagePicker(options, response => {
    if (response.didCancel) {
      // console.log('User cancelled video picker');
    } else if (response.error) {
      // console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      // console.log('User tapped custom button: ', response.customButton);
    } else {
      onChange(isIphone() ? response.uri : response.path)
    }
  });
}
export const checkFiles = async () => {
  try {
    let path = RNFS.CachesDirectoryPath
    console.log('RNFS.CachesDirectoryPath: ', path)
    let files = await RNFS.readDir(path)
    files.forEach((file, index) => console.log(!file.isFile() ? "Dir " : "file ", index, " : ", file.name))

    // path = RNFS.ExternalCachesDirectoryPath
    // console.log('RNFS.ExternalCachesDirectoryPath: ', path)
    // files  = await RNFS.readDir(path)
    // files.forEach((file, index) => console.log(!file.isFile() ? "Dir " : "file ", index, " : ", file.name))

      // path = RNFS.ExternalDirectoryPath
      // console.log('RNFS.ExternalDirectoryPath: ', path)
      // files = await RNFS.readDir(path)
      // files.forEach((file, index) => console.log(!file.isFile() ? "Dir " : "file ", index, " : ", file.name))

      // path = RNFS.ExternalStorageDirectoryPath
      // console.log('RNFS.ExternalStorageDirectoryPath: ', path)
      // files = await RNFS.readDir(path)
      // files.forEach((file, index) => console.log(!file.isFile() ? "Dir " : "file ", index, " : ", file.name))
  } catch(err) {
    console.error("Check files error: ", err)
  }
}
const TIMELINE_HEIGHT = 100;
const { width, height } = Dimensions.get('window')
export class TimelineSlider extends React.Component {
  state = {
    nonCollidingMultiSliderValue: [0, this.props.max]
  }
  getValues = () => { return { start: this.state.nonCollidingMultiSliderValue[0], end: this.state.nonCollidingMultiSliderValue[1] } }
  render() {
    return (
      <MultiSlider
      values={[
        this.state.nonCollidingMultiSliderValue[0],
          this.state.nonCollidingMultiSliderValue[1]
        ]}
        containerStyle={{ position: 'absolute', top: -25 }}
        unselectedStyle={{ opacity: 0.8, height: TIMELINE_HEIGHT }}
        selectedStyle={{ opacity: 0.1, height: TIMELINE_HEIGHT }}
        sliderLength={width - 40}
        onValuesChange={val => this.setState({ nonCollidingMultiSliderValue: val })}

        height={80}
        min={0}
        step={1}
        allowOverlap={false}
        snapped
        enableLabel
        customLabel={e => (
          <View style={{ width: width - 40, justifyContent: 'space-between', flexDirection: 'row', zIndex: 200, elevation: 200 }}>
            <Text>{e.oneMarkerValue}</Text>
            <Text>{e.twoMarkerValue}</Text>
          </View>
        )}
        minMarkerOverlapDistance={10}
        customMarker={e => (
          <View
            style={{
              height: 100,
              width: 5,
              backgroundColor: 'red',
              borderRadius: 10
            }}
          />
        )
        }
        {...this.props}
      />
    )
  }
}
export const isIphone = () => Platform.OS === "ios";