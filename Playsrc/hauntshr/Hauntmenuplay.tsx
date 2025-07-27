import { useNavigation } from "@react-navigation/native";
import { buttons, global, menu } from "../hauntcnst/hauntstyles";
import { drakulaWhite } from "../hauntcnst/hauntplayers";
import { buttonDec, watermelon } from "../hauntcnst/hauntassets";
import { View, Text, Image, TouchableOpacity, Animated, Easing, Dimensions } from "react-native";
import { useEffect, useRef } from "react";
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Hauntghostcircleplay: undefined;
    Hauntdarecurseplay: undefined;
    Haunthauntedspyplay: undefined;
};

type MenuNavigationProp = StackNavigationProp<RootStackParamList>;

const { height } = Dimensions.get('window');

interface MenuButton {
    button: string;
    route: keyof RootStackParamList;
}

const Hauntmenuplay: React.FC = () => {
    const navigation = useNavigation<MenuNavigationProp>();
    
    const headerSlide = useRef(new Animated.Value(-100)).current;
    const headerFade = useRef(new Animated.Value(0)).current;
    const buttonAnimations = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0)
    ]).current;
    const watermelonScale = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(headerSlide, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.back(0.75)),
                useNativeDriver: true,
            }),
            Animated.timing(headerFade, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(watermelonScale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            })
        ]).start(() => {
            buttonAnimations.forEach((anim, index) => {
                Animated.sequence([
                    Animated.delay(index * 150),
                    Animated.parallel([
                        Animated.spring(anim, {
                            toValue: 1,
                            friction: 6,
                            tension: 50,
                            useNativeDriver: true,
                        }),
                    ])
                ]).start();
            });
        });
    }, []);

    const handleButtonPress = (index: number, route: keyof RootStackParamList) => {
        Animated.sequence([
            Animated.timing(buttonAnimations[index], {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(buttonAnimations[index], {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            })
        ]).start(() => navigation.navigate(route));
    };

    const menuButtons: MenuButton[] = [
        {
            button: 'GHOST CIRCLE',
            route: 'Hauntghostcircleplay'
        },
        {
            button: 'DARE OR CURSE',
            route: 'Hauntdarecurseplay'
        },
        {
            button: 'HAUNTED SPY',
            route: 'Haunthauntedspyplay'
        }
    ];

    return (
        <View style={[global.container, {paddingTop: 120}]}>
            <Animated.View style={[
                { 
                    opacity: headerFade,
                    transform: [
                        { translateY: headerSlide },
                    ],
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 70
                }
            ]}>
                <Image source={drakulaWhite} style={menu.drakula} />
                <View style={menu.textContainer}>
                    <Text style={menu.text}>Try it if you dare</Text>
                </View>
                <Animated.Image 
                    source={watermelon} 
                    style={[
                        menu.watermelon,
                        { 
                            transform: [
                                { scale: watermelonScale },
                                { rotate: watermelonScale.interpolate({
                                    inputRange: [0.5, 1],
                                    outputRange: ['-15deg', '0deg']
                                })}
                            ] 
                        }
                    ]} 
                />
            </Animated.View>

            {menuButtons.map((button, idx) => (
                <Animated.View
                    key={idx}
                    style={{
                        opacity: buttonAnimations[idx],
                        transform: [
                            { 
                                translateY: buttonAnimations[idx].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50, 0]
                                }) 
                            },
                            { 
                                scale: buttonAnimations[idx] 
                            }
                        ],
                        width: '100%',
                        alignSelf: 'center'
                    }}
                >
                    <TouchableOpacity
                        style={[buttons.button, {width: '90%', height: height * 0.15, alignSelf: 'center', marginBottom: 15}]}
                        onPress={() => handleButtonPress(idx, button.route)}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={buttonDec}
                            style={buttons.image}
                        />
                        <Text style={[buttons.buttonText, height < 700 && {fontSize: 25}]}>{button.button}</Text>
                    </TouchableOpacity>
                </Animated.View>
            ))}
        </View>
    );
};

export default Hauntmenuplay;