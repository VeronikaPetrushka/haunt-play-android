import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, Animated, Easing } from "react-native";
import { useState, useEffect, useRef } from "react";
import hauntabout from "../hauntcnst/hauntabout";
import { buttonDec, leftArrow } from "../hauntcnst/hauntassets";
import { about, buttons, global } from "../hauntcnst/hauntstyles";
import { drakulaBlue, drakulaWhite } from "../hauntcnst/hauntplayers";

const Hauntaboutplay = () => {
    const navigation = useNavigation();
    const [currentAboutIndex, setCurrentAboutIndex] = useState(0);
    
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const textSlideAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const imageScale = useRef(new Animated.Value(1)).current;
    const drakulaFadeAnim = useRef(new Animated.Value(1)).current;
    const drakulaSlideAnim = useRef(new Animated.Value(0)).current;

    const prevIndexRef = useRef(0);

    useEffect(() => {
        if (currentAboutIndex === 0) {
            drakulaSlideAnim.setValue(100);
            Animated.spring(drakulaSlideAnim, {
                toValue: 0,
                friction: 6,
                useNativeDriver: true,
            }).start();
        }
    }, []);

    const handleContentChange = (direction) => {
        const newIndex = currentAboutIndex + (direction === 'next' ? 1 : -1);
        
        const isDrakulaTransition = 
            (currentAboutIndex === 2 && newIndex === 3) || 
            (currentAboutIndex === 3 && newIndex === 2);
        const isInitialTransition = newIndex === 0;
        
        const shouldFadeButtons = [0, 1, 5].includes(newIndex) || [0, 1, 5].includes(currentAboutIndex);

        fadeAnim.setValue(0);
        textSlideAnim.setValue(direction === 'next' ? 50 : -50);
        
        if (isDrakulaTransition || isInitialTransition) {
            drakulaFadeAnim.setValue(0);
            imageScale.setValue(0.9);
            if (isInitialTransition) {
                drakulaSlideAnim.setValue(direction === 'next' ? 100 : -100);
            }
        }

        if (shouldFadeButtons) {
            buttonScale.setValue(0.8);
        }

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(textSlideAnim, {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            
            ...(isDrakulaTransition || isInitialTransition ? [
                Animated.timing(drakulaFadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(imageScale, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: true,
                }),
                ...(isInitialTransition ? [
                    Animated.spring(drakulaSlideAnim, {
                        toValue: 0,
                        friction: 6,
                        useNativeDriver: true,
                    })
                ] : [])
            ] : []),
            
            ...(shouldFadeButtons ? [
                Animated.spring(buttonScale, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                })
            ] : [])
        ]).start(() => {
            setCurrentAboutIndex(newIndex);
            prevIndexRef.current = currentAboutIndex;
        });
    };

    const handleStartPress = () => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(buttonScale, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            })
        ]).start(() => navigation.navigate('Hauntmenuplay'));
    };

    return (
        <View style={global.container}>

            <Animated.View 
                style={{ 
                    opacity: drakulaFadeAnim,
                    transform: [
                        { scale: imageScale },
                        { translateY: drakulaSlideAnim }
                    ],
                    width: '100%'
                }}
            >
                <Image
                    source={currentAboutIndex < 3 ? drakulaWhite : drakulaBlue}
                    style={about.drakulaImage}
                />
            </Animated.View>

            <Animated.View
                style={[
                    about.textContainer,
                    { 
                        opacity: fadeAnim,
                        transform: [{ translateY: textSlideAnim }],
                        width: '100%'
                    }
                ]}
            >
                {hauntabout[currentAboutIndex].title && (
                    <Text style={[about.text, {marginBottom: 30}]}>
                        {hauntabout[currentAboutIndex].title}
                    </Text>
                )}
                
                {hauntabout[currentAboutIndex].text.map((t, idx) => (
                    <Text key={idx} style={about.text}>{t}</Text>
                ))}
            </Animated.View>

            <View style={[global.row, {position: 'absolute', alignSelf: 'center', bottom: 50, paddingHorizontal: 20}]}>
                {(currentAboutIndex > 0 && currentAboutIndex !== 5) && (
                    <Animated.View style={{ 
                        transform: [
                            { 
                                scale: [0, 1, 5].includes(currentAboutIndex) ? buttonScale : 1 
                            }
                        ] 
                    }}>
                        <TouchableOpacity
                            onPress={() => handleContentChange('prev')}
                            disabled={currentAboutIndex < 1}
                        >
                            <Image
                                source={leftArrow}
                                style={[buttons.arrowImage, {alignSelf: 'flex-start'}]}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                )}
                
                {currentAboutIndex !== 5 && (
                    <Animated.View style={{ 
                        transform: [
                            { 
                                scale: [0, 1, 5].includes(currentAboutIndex) ? buttonScale : 1 
                            }
                        ] 
                    }}>
                        <TouchableOpacity
                            onPress={() => handleContentChange('next')}
                            disabled={currentAboutIndex > 4}
                        >
                            <Image
                                source={leftArrow}
                                style={[
                                    buttons.arrowImage, 
                                    { 
                                        transform: [{ rotate: '180deg' }],
                                        alignSelf: 'flex-end'
                                    }
                                ]}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>

            {currentAboutIndex === 5 && (
                <Animated.View
                    style={{
                        transform: [{ scale: buttonScale }],
                        position: 'absolute',
                        alignSelf: 'center',
                        bottom: 50
                    }}
                >
                    <TouchableOpacity 
                        onPress={handleStartPress}
                        style={buttons.button}
                    >
                        <Image source={buttonDec} style={buttons.image} />
                        <Text style={buttons.buttonText}>Start</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

export default Hauntaboutplay;