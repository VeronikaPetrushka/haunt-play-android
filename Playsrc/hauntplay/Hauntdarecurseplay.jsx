import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, TextInput, Modal, ScrollView, Animated, Easing, Dimensions } from "react-native";
import { useState, useEffect, useRef } from "react";
import { buttons, global, menu, play } from "../hauntcnst/hauntstyles";
import { apple, buttonDec, hauntBack, noavatar, plus, smallArr, watermelon, cherry, regenerate, done, failed, awards } from "../hauntcnst/hauntassets";
import { drakulaAngry, drakulaBlue, drakulaGrand, drakulaGreen, drakulaWhite, drakulaYellow } from "../hauntcnst/hauntplayers";
import { hauntedTruth, hauntedDare } from "../hauntcnst/hauntedTruthDare";

const { height } = Dimensions.get('window');

const avatars = [
    drakulaAngry,
    drakulaGreen,
    drakulaBlue,
    drakulaYellow,
    drakulaWhite,
    drakulaGrand
];

const Hauntdarecurseplay = () => {
    const navigation = useNavigation();
    const [gameStep, setGameStep] = useState(0);
    const [chooseAvatar, setChooseAvatar] = useState(false);
    const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
    
    const [players, setPlayers] = useState([
        { name: '', avatar: noavatar },
        { name: '', avatar: noavatar }
    ]);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const buttonPulse = useRef(new Animated.Value(1)).current;
    const entryAnimations = useRef([]);
    const avatarBounce = useRef(new Animated.Value(1)).current;

    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [playerScores, setPlayerScores] = useState([]);
    const [roundsCompleted, setRoundsCompleted] = useState(0);

    useEffect(() => {
        entryAnimations.current = players.map(() => new Animated.Value(0));
    }, []);

    // Screen entry animation
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            })
        ]).start();

        // Player entry animations
        players.forEach((_, index) => {
            Animated.spring(entryAnimations.current[index], {
                toValue: 1,
                friction: 6,
                delay: index * 150,
                useNativeDriver: true,
            }).start();
        });
    }, []);

    useEffect(() => {
        if (gameStep === 1) {
            setPlayerScores(players.map(p => ({ ...p, score: 0 })));
            setCurrentPlayerIndex(0);
            setRoundsCompleted(0);
        }
    }, [gameStep]);

    const canStartGame = () => {
        return players.length >= 2 && 
               players.every(player => player.name.trim() !== '' && player.avatar !== noavatar);
    };

    // Button pulse animation when game is ready
    useEffect(() => {
        if (canStartGame()) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(buttonPulse, {
                        toValue: 1.05,
                        duration: 800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(buttonPulse, {
                        toValue: 0.95,
                        duration: 800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            buttonPulse.setValue(1);
        }
    }, [canStartGame()]);

    const handleAvatarSelection = (avatar) => {
        Animated.sequence([
            Animated.timing(avatarBounce, {
                toValue: 0.8,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(avatarBounce, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start(() => {
            const updatedPlayers = [...players];
            updatedPlayers[selectedPlayerIndex].avatar = avatar;
            setPlayers(updatedPlayers);
            setChooseAvatar(false);
        });
    };

    const handleNameChange = (index, text) => {
        const updatedPlayers = [...players];
        updatedPlayers[index].name = text;
        setPlayers(updatedPlayers);
    };

    const addPlayer = () => {
        const newAnim = new Animated.Value(0);
        entryAnimations.current = [...entryAnimations.current, newAnim];
        setPlayers([...players, { name: '', avatar: noavatar }]);
        
        Animated.spring(newAnim, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
        }).start();
    };

    const removePlayer = (index) => {
        if (players.length <= 2) return;
        
        Animated.timing(entryAnimations.current[index], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            const updatedPlayers = [...players];
            updatedPlayers.splice(index, 1);
            setPlayers(updatedPlayers);
            entryAnimations.current.splice(index, 1);
            
            if (selectedPlayerIndex >= updatedPlayers.length) {
                setSelectedPlayerIndex(0);
            }
        });
    };

    const openAvatarModal = (playerIndex) => {
        setSelectedPlayerIndex(playerIndex);
        setChooseAvatar(true);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        const challenges = category === 'TRUTH' ? hauntedTruth : hauntedDare;
        const randomIndex = Math.floor(Math.random() * challenges.length);
        setCurrentChallenge(challenges[randomIndex]);
    };

    const handleRegenerate = () => {
        const challenges = selectedCategory === 'TRUTH' ? hauntedTruth : hauntedDare;
        const randomIndex = Math.floor(Math.random() * challenges.length);
        setCurrentChallenge(challenges[randomIndex]);
    };

    const handleChallengeOutcome = (completed) => {
        const updatedScores = [...playerScores];
        if (completed) {
            updatedScores[currentPlayerIndex].score += 1;
        }

        setPlayerScores(updatedScores);
        setRoundsCompleted(prev => prev + 1);
        
        if (roundsCompleted >= players.length * 7 - 1) {
            setGameStep(3);
            return;
        }

        setCurrentPlayerIndex(prev => (prev + 1) % players.length);
        setSelectedCategory(null);
        setCurrentChallenge(null);
    };

    const CountdownTimer = ({ onComplete }) => {
        const [count, setCount] = useState(3);
        const scaleAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            const timer = setInterval(() => {
                setCount(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        onComplete();
                        return 0;
                    }
                    return prev - 1;
                });

                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.2,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        friction: 3,
                        useNativeDriver: true,
                    }),
                ]).start();
            }, 1000);

            return () => clearInterval(timer);
        }, []);

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <Text style={{ fontSize: 120, color: '#FFF', fontWeight: 'bold' }}>
                        {count}
                    </Text>
                </Animated.View>
                <Image 
                    source={players[currentPlayerIndex].avatar} 
                    style={{ width: 100, height: 100, marginTop: 30 }}
                />
                <Text style={{ color: '#FFF', fontSize: 24, marginTop: 10 }}>
                    {players[currentPlayerIndex].name}'s turn!
                </Text>
            </View>
        );
    };

    const GameOverScreen = () => {
        const sortedPlayers = [...playerScores].sort((a, b) => b.score - a.score);

        return (
            <View style={{ width: '100%', flexGrow: 1, justifyContent: 'center' }}>
                <Text style={[buttons.buttonText, { fontSize: 36, textAlign: 'center', marginBottom: 40 }]}>
                    Game Over!
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                    {/* Second place (left) */}
                    {sortedPlayers.length > 1 && (
                        <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
                            <View style={{ width: height >  700 ? 90 : 80, 
                                height: height > 700 ? 90 : 80, 
                                backgroundColor: '#fff', 
                                borderRadius: 300, 
                                alignItems: 'center', 
                                justifyContent: 'flex-end', 
                                overflow: 'hidden'
                            }}>
                                <Image 
                                    source={sortedPlayers[1].avatar} 
                                    style={{ 
                                        width: 80,
                                        height: 80,
                                    }} 
                                />
                            </View>
                            <Text style={{ color: '#FFF', fontSize: 18, textAlign: 'center', width: 90 }} ellipsizeMode="tail">{sortedPlayers[1].name}</Text>
                        </View>
                    )}

                    {/* First place (center) */}
                    {sortedPlayers.length > 0 && (
                        <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
                            <View style={{ width: height >  700 ? 120 : 110, 
                                height: height >  700 ? 120 : 110, 
                                backgroundColor: '#fff', 
                                borderRadius: 300, 
                                alignItems: 'center', 
                                justifyContent: 'flex-end', 
                                overflow: 'hidden'
                            }}>
                                <Image 
                                    source={sortedPlayers[0].avatar} 
                                    style={{ 
                                        width: 105,
                                        height: 105,
                                    }} 
                                />
                            </View>
                            <Text style={{ color: '#FFF', fontSize: 18, textAlign: 'center', width: 120 }} ellipsizeMode="tail">{sortedPlayers[0].name}</Text>
                        </View>
                    )}

                    {/* Third place (right) */}
                    {sortedPlayers.length > 2 && (
                        <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
                            <View style={{ width: height >  700 ? 80 : 70, 
                                height: height >  700 ? 80 : 70, 
                                backgroundColor: '#fff', 
                                borderRadius: 300, 
                                alignItems: 'center', 
                                justifyContent: 'flex-end', 
                                overflow: 'hidden'
                            }}>
                                <Image 
                                    source={sortedPlayers[2].avatar} 
                                    style={{ 
                                        width: 70,
                                        height: 70,
                                    }} 
                                />
                            </View>
                            <Text style={{ color: '#FFF', fontSize: 18, textAlign: 'center', width: 90 }} ellipsizeMode="tail">{sortedPlayers[2].name}</Text>
                        </View>
                    )}
                </View>
                <Image source={awards} style={{width: '100%', height: 110, resizeMode: 'contain', marginTop: 10}} />

                <ScrollView style={{ marginTop: 40, marginHorizontal: 20 }}>
                    {sortedPlayers.map((player, index) => (
                        <View key={index} style={{ 
                            flexDirection: 'row', 
                            justifyContent: 'space-between',
                            padding: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: '#1C77D4'
                        }}>
                            <Text style={{ color: '#FFF', fontSize: 18 }}>
                                #{index + 1} {player.name}
                            </Text>
                            <Text style={{ color: '#FFF', fontSize: 18 }}>
                                {player.score} points
                            </Text>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={[buttons.button, { 
                            width: 264, 
                            alignSelf: 'center',
                            marginTop: 50
                        }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={buttonDec} style={buttons.image} />
                        <Text style={[buttons.buttonText, { fontSize: 24 }]}>BACK TO MENU</Text>
                    </TouchableOpacity>
                    
                    <View style={{height: 100}} />
                </ScrollView>

            </View>
        );
    };

    return (
        <Animated.View style={[global.container, { 
            paddingHorizontal: 20,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
        }]}>

            {
                gameStep === 0 && (
                    <View style={{ width: '100%' }}>
                        <TouchableOpacity
                            style={global.backarrBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Image source={hauntBack} style={global.backarr} />
                        </TouchableOpacity>
                        
                        <Animated.View
                            style={[buttons.button, {
                                width: 264,
                                alignSelf: 'center',
                                marginBottom: 35,
                                transform: [{ scale: scaleAnim }]
                            }]}
                        >
                            <Image
                                source={buttonDec}
                                style={buttons.image}
                            />
                            <Text style={[buttons.buttonText, {fontSize: 24}]}>DARE OR CURSE</Text>
                        </Animated.View>
                    </View>
                )
            }

            {/* Players setup */}
            {
                gameStep === 0 && (
                    <View style={{width: '100%', flexGrow: 1}}>
                        <View style={play.playersContainer}>
                            <Animated.Image 
                                source={watermelon} 
                                style={[
                                    menu.watermelon, 
                                    {top: -40, right: -70},
                                    { transform: [{ rotate: avatarBounce.interpolate({
                                        inputRange: [0.8, 1],
                                        outputRange: ['-5deg', '0deg']
                                    })}] }
                                ]} 
                            />

                            <Animated.Text style={[
                                menu.text, 
                                { 
                                    marginBottom: 52, 
                                    alignSelf: 'center',
                                    opacity: fadeAnim,
                                    transform: [{ translateY: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [20, 0]
                                    })}]
                                }
                            ]}>
                                Enter name:
                            </Animated.Text>
                            
                            <ScrollView style={{ width: '100%', height: '80%' }}>
                                {players.map((player, index) => (
                                    <Animated.View 
                                        key={index} 
                                        style={[
                                            global.row, 
                                            { 
                                                marginBottom: 24,
                                                opacity: entryAnimations.current[index] || new Animated.Value(0),
                                                transform: [
                                                    { 
                                                        translateX: (entryAnimations.current[index] || new Animated.Value(0)).interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [-50, 0]
                                                        }) 
                                                    },
                                                    { scale: entryAnimations.current[index] || new Animated.Value(0) }
                                                ]
                                            }
                                        ]}
                                    >
                                        <TouchableOpacity
                                            style={buttons.chooseAvatar}
                                            onPress={() => openAvatarModal(index)}
                                        >
                                            {player.avatar === noavatar ? (
                                                <Animated.View style={[
                                                    global.row, 
                                                    {padding: 10},
                                                    { transform: [{ scale: avatarBounce }] }
                                                ]}>
                                                    <Image
                                                        source={player.avatar}
                                                        style={play.smallAvatar}
                                                    />
                                                    <Image
                                                        source={smallArr}
                                                        style={play.smalArrow}
                                                    />
                                                </Animated.View>
                                            ) : (
                                                <Animated.Image
                                                    source={player.avatar}
                                                    style={[
                                                        play.selectedAvatar,
                                                        { transform: [{ scale: avatarBounce }] }
                                                    ]}
                                                />
                                            )}
                                        </TouchableOpacity>

                                        <Animated.View style={{ 
                                            width: index > 1 ? 185 : 206,
                                            transform: [
                                                { 
                                                    translateY: (entryAnimations.current[index] || new Animated.Value(0)).interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [30, 0]
                                                    }) 
                                                }
                                            ]
                                        }}>
                                            <TextInput
                                                style={play.playerInput}
                                                value={player.name}
                                                onChangeText={(text) => handleNameChange(index, text)}
                                                placeholder="Name"
                                                placeholderTextColor='#818181'
                                            />
                                            <Image
                                                source={index % 2 === 0 ? apple : cherry}
                                                style={play.inputIcon}
                                            />
                                        </Animated.View>
                                        
                                        {index >= 2 && (
                                            <Animated.View style={{
                                                transform: [
                                                    { 
                                                        rotate: (entryAnimations.current[index] || new Animated.Value(0)).interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: ['90deg', '0deg']
                                                        }) 
                                                    }
                                                ]
                                            }}>
                                                <TouchableOpacity 
                                                    style={{ 
                                                        height: 27, 
                                                        width: 27, 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        borderRadius: 100, 
                                                        backgroundColor: '#fff' 
                                                    }}
                                                    onPress={() => removePlayer(index)}
                                                >
                                                    <Text style={{ color: 'red', fontSize: 20, fontWeight: '600' }}>×</Text>
                                                </TouchableOpacity>
                                            </Animated.View>
                                        )}
                                    </Animated.View>
                                ))}

                                <Animated.View style={{
                                    opacity: fadeAnim,
                                    transform: [
                                        { 
                                            scale: fadeAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.5, 1]
                                            }) 
                                        }
                                    ]
                                }}>
                                    <TouchableOpacity onPress={addPlayer}>
                                        <Image source={plus} style={play.plusIcon} />
                                    </TouchableOpacity>
                                </Animated.View>

                                <View style={{height: 30}} />
                            </ScrollView>
                        </View>

                        {/* Avatar Selection Modal */}
                        <Modal
                            visible={chooseAvatar}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setChooseAvatar(false)}
                        >
                            <View style={[global.container, { 
                                backgroundColor: 'rgba(0,0,0,0.3)', 
                                justifyContent: 'center', 
                                alignItems: 'center' 
                            }]}>
                                <Animated.View 
                                    style={{ 
                                        width: '90%',
                                        backgroundColor: '#1C77D4', 
                                        borderWidth: 4,
                                        borderColor: '#0E4377',
                                        padding: 20, 
                                        borderRadius: 22,
                                        transform: [{ scale: avatarBounce }],
                                        opacity: fadeAnim
                                    }}
                                >
                                    <Text style={[buttons.buttonText, {fontSize: 24, textAlign: 'center', marginBottom: 20}]}>
                                        {players[selectedPlayerIndex]?.name || 'Player'} choose your avatar
                                    </Text>
                                    <View style={{ 
                                        flexDirection: 'row', 
                                        flexWrap: 'wrap', 
                                        justifyContent: 'center',
                                        maxWidth: 300
                                    }}>
                                        {avatars.map((avatar, idx) => (
                                            <TouchableOpacity 
                                                key={idx}
                                                onPress={() => handleAvatarSelection(avatar)}
                                                style={{
                                                    margin: 10,
                                                    width: 73,
                                                    height: 75,
                                                    backgroundColor: '#fff',
                                                    borderRadius: 22,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderWidth: 2,
                                                    borderColor: players[selectedPlayerIndex]?.avatar === avatar ? '#000' : 'transparent',
                                                }}
                                            >
                                                <Animated.Image 
                                                    source={avatar} 
                                                    style={{ 
                                                        width: 57, 
                                                        height: 57,
                                                        transform: [{ scale: avatarBounce }],
                                                        resizeMode: 'contain'
                                                    }} 
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    <TouchableOpacity
                                        style={[
                                            buttons.button,
                                            { width: 150, height: 60, marginTop: 20, alignSelf: 'center' }
                                        ]}
                                        onPress={() => setChooseAvatar(false)}
                                    >
                                        <Image source={buttonDec} style={buttons.image} />
                                        <Text style={[buttons.buttonText, {fontSize: 22}]}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>
                        </Modal>

                        {canStartGame() && (
                            <Animated.View
                                style={{
                                    transform: [{ scale: buttonPulse }],
                                    marginBottom: 30
                                }}
                            >
                                <TouchableOpacity
                                    style={[buttons.button, { 
                                        width: 264, 
                                        alignSelf: 'center',
                                        shadowColor: "#FF0000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 0,
                                        },
                                        shadowOpacity: 0.5,
                                        shadowRadius: 10,
                                        elevation: 5
                                    }]}
                                    onPress={() => setGameStep(1)}
                                >
                                    <Image
                                        source={buttonDec}
                                        style={buttons.image}
                                    />
                                    <Text style={[buttons.buttonText, {fontSize: 24}]}>START</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </View>
                )
            }

            {/* Countdown screen */}
            {
                gameStep === 1 && (
                    <CountdownTimer 
                        onComplete={() => setGameStep(2)}
                    />
                )
            }

            {/* Game round screen */}
            {
                gameStep === 2 && (
                    <View style={{ width: '100%', flexGrow: 1 }}>
                        {!selectedCategory ? (
                            <>
                                <Animated.View
                                    style={[buttons.button, {
                                        width: 264,
                                        alignSelf: 'center',
                                        marginBottom: 100,
                                        transform: [{ scale: scaleAnim }]
                                    }]}
                                >
                                    <Image
                                        source={buttonDec}
                                        style={buttons.image}
                                    />
                                    <Text style={[buttons.buttonText, { fontSize: 24 }]}>
                                        {players[currentPlayerIndex].name}'s move
                                    </Text>
                                </Animated.View>

                                <Animated.View
                                    style={{
                                        width: 264,
                                        alignSelf: 'center',
                                        transform: [{ scale: scaleAnim }]
                                    }}
                                >
                                    <TouchableOpacity 
                                        style={[buttons.button, {marginBottom: 0}]}
                                        onPress={() => handleCategorySelect('TRUTH')}
                                    >
                                        <Image
                                            source={buttonDec}
                                            style={buttons.image}
                                        />
                                        <Text style={[buttons.buttonText, { fontSize: 24 }]}>TRUTH</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                                
                                <Text style={[buttons.buttonText, { marginVertical: 30, alignSelf: 'center' }]}>OR</Text>
                                
                                <Animated.View
                                    style={{
                                        width: 264,
                                        alignSelf: 'center',
                                        transform: [{ scale: scaleAnim }]
                                    }}
                                >
                                    <TouchableOpacity 
                                        style={buttons.button}
                                        onPress={() => handleCategorySelect('DARE')}
                                    >
                                        <Image
                                            source={buttonDec}
                                            style={buttons.image}
                                        />
                                        <Text style={[buttons.buttonText, { fontSize: 24 }]}>DARE</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            </>
                        ) : (
                            <>
                                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                                        <View style={{
                                            width: 130, 
                                            height: 130, 
                                            borderRadius: 300, 
                                            backgroundColor: '#fff', 
                                            alignItems: 'center', 
                                            justifyContent: 'flex-end', 
                                            overflow: 'hidden'
                                        }}>
                                            <Image 
                                                source={players[currentPlayerIndex].avatar} 
                                                style={{ width: 110, height: 110 }}
                                            />  
                                        </View>
                                    <Text style={[buttons.buttonText, { fontSize: 24, marginTop: 10 }]}>
                                        {players[currentPlayerIndex].name}'s {selectedCategory}
                                    </Text>
                                </View>

                                <View style={{ 
                                    backgroundColor: '#1C77D4',
                                    padding: 20,
                                    borderRadius: 15,
                                    marginHorizontal: 20,
                                    marginBottom: 30
                                }}>
                                    <Text style={{ color: '#FFF', fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 35 }}>
                                        {currentChallenge}
                                    </Text>
                                    
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <TouchableOpacity
                                            style={{marginHorizontal: 10 }}
                                            onPress={handleRegenerate}
                                        >
                                            <Image source={regenerate} style={play.plusIcon} />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ 
                                                marginHorizontal: 10,
                                            }}
                                            onPress={() => handleChallengeOutcome(true)}
                                        >
                                            <Image source={done} style={play.plusIcon} />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ 
                                                marginHorizontal: 10,
                                            }}
                                            onPress={() => handleChallengeOutcome(false)}
                                        >
                                            <Image source={failed} style={play.plusIcon} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </>
                        )}
                    </View>
                )
            }

            {/* Game over screen */}
            {
                gameStep === 3 && (
                    <GameOverScreen />
                )
            }
        </Animated.View>
    );
};

export default Hauntdarecurseplay;