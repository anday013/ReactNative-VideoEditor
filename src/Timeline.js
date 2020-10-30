import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Platform, TextInput, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image, ActivityIndicator } from 'react-native';
import RNFS from 'react-native-fs'
import { LogLevel, RNFFmpegConfig, RNFFmpeg, RNFFprobe } from 'react-native-ffmpeg'
import Video from 'react-native-video'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import ImagePicker from 'react-native-image-picker'
import { TimelineSlider, checkFiles, isIphone } from './helper'
import Button from './components/Button'

const NUM_OF_FRAMES = 10
const { width, height } = Dimensions.get('window')
const TIMELINE_WIDTH = width - 40;
const TIMELINE_HEIGHT = 100;

const getFrames = (input, output, videoLength, onLoadStart, callback) => {
    onLoadStart && onLoadStart();
    const thumbGenerationCommand = `-i ${input} -vf fps=${NUM_OF_FRAMES / videoLength} ${output}_thumb_%01d.jpg -y`;
    RNFFmpeg.execute(thumbGenerationCommand).then(_ => {
        callback && callback(`${output}_thumb_`)
    })
}

const getVideoLength = async (uri) => {
    const { rc } = await RNFFprobe.execute(`-v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${uri}`)
    const { lastCommandOutput } = await RNFFmpegConfig.getLastCommandOutput();
    return Math.floor(parseInt(lastCommandOutput))
}



export default function Timeline({ navigation, route }) {
    // const [videoUri, setVideoUri] = useState('')
    const { videoUri } = route.params
    const [videoThumbPath, setVideoThumbPath] = useState('')
    const [loading, setLoading] = useState(true)
    const [videoLength, setVideoLength] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [isTrimmed, setIsTrimmed] = useState(false)
    const timelineRef = useRef(null);

    const cacheDir = `${RNFS.CachesDirectoryPath}/`;
    const output = `${RNFS.CachesDirectoryPath}/output:trimmed.mp4`

    useEffect(() => {
        startActions();
    }, [])

    const startActions = async () => {
        try {
            const vl = await getVideoLength(videoUri)
            getFrames(
                videoUri,
                cacheDir,
                vl,
                () => setLoading(true),
                (res) => {
                    setVideoThumbPath(res);
                    setLoading(false);
                }
            )
            setVideoLength(vl)
        }
        catch (err) {
            console.error("startActions: ", err)
        }
    }
    // const chooseVideo = () => {
    //     const options = {
    //         title: 'Video Picker',
    //         takePhotoButtonTitle: 'Take Video...',
    //         mediaType: 'video',
    //         // videoQuality: 'medium',
    //     };
    //     ImagePicker.showImagePicker(options, async (response) => {
    //         if (response.didCancel) {
    //         } else if (response.error) {
    //         } else if (response.customButton) {
    //         } else {
    //             const { uri, path } = response
    //             const uriToSave = Platform.OS === "ios" ? uri : path;
    //             const vl = await getVideoLength(uriToSave)
    //             getFrames(
    //                 videoUri,
    //                 cacheDir,
    //                 vl,
    //                 () => setLoading(true),
    //                 (res) => {
    //                     setVideoThumbPath(res);
    //                     setLoading(false);
    //                 }
    //             )
    //             setVideoUri(uriToSave)
    //             setVideoLength(vl)
    //         }
    //     });
    // }


    const renderThumbnails = useCallback(() => {
        const thumbs = [];
        for (let idx = 1; idx <= NUM_OF_FRAMES; idx++) {
            thumbs.push(
                <View key={`video-thumb-${idx}`}>
                    <Image
                        source={{ uri: `${isIphone() ? "" : "file://"}${videoThumbPath}${idx}.jpg` }}
                        style={{
                            width: TIMELINE_WIDTH / 10,
                            height: TIMELINE_HEIGHT
                        }}
                        resizeMode="cover"
                    />
                </View>
            )
        }
        return thumbs;
    }, [videoThumbPath])

    const trimVideo = useCallback(async () => {
        if (videoUri) {
            const { start, end } = timelineRef.current.getValues();
            setIsTrimmed(false);
            setProcessing(true)
            const command = `-i ${videoUri} -ss ${start} -to ${end} -c copy ${output} -y`
            try {
                const { rc } = await RNFFmpeg.execute(command)
                setProcessing(false);
                setIsTrimmed(true)
                const { lastCommandOutput } = await RNFFmpegConfig.getLastCommandOutput();
                console.log("Last command output: ", lastCommandOutput);
                console.log('\n--------------------------------\n')

            } catch (error) {
                console.error("FFMPEG ERROR: ", error)
            }
        }
    }, [videoUri])
    if (loading)
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <ActivityIndicator size="large" color="black" />
                {/* <Text style={{fontSize: 20}}>Loading...</Text> */}
            </SafeAreaView>
        )
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', }}>
            {videoUri ?
                (
                    <>
                        <Video
                            source={{ uri: videoUri }}
                            style={{ width: 300, height: 200 }}
                            resizeMode='cover'
                            muted
                        />
                    </>
                )
                : <View style={{ width: 300, height: 200, backgroundColor: '#f48c06', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Video Player placeholder</Text>
                </View>}
            {/* <Button title="Choose Video" onPress={chooseVideo} /> */}
            {videoThumbPath ? (
                <>
                    <View style={{ marginTop: 50 }}>
                        <View style={{ flexDirection: 'row' }}>
                            {renderThumbnails()}
                        </View>
                        <TimelineSlider
                            max={videoLength}
                            ref={timelineRef}
                        />
                    </View>
                    <Button title="Trim" onPress={trimVideo} />
                </>
            ) : null}
            {isTrimmed ? (
                <Video
                    source={{ uri: output }}
                    style={{ width: 300, height: 200 }}
                    resizeMode='cover'
                />
            ) : <View style={{ width: 300, height: 200, backgroundColor: '#f48c06', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Trimmed Video placeholder</Text>
                </View>}
            <Button title="Check files" onPress={checkFiles} />
        </SafeAreaView>
    )
}
