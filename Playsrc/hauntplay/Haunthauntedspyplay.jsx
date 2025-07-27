import { useNavigation } from "@react-navigation/native"
import { View, Text, Image, TouchableOpacity, TextInput, Modal, ScrollView, Animated, Easing } from "react-native";
import { useState, useEffect, useRef } from "react";
import { buttons, global, menu, play } from "../hauntcnst/hauntstyles";
import { apple, buttonDec, hauntBack, noavatar, plus, smallArr, watermelon, cherry, decrease, increase } from "../hauntcnst/hauntassets";
import { drakulaAngry, drakulaBlue, drakulaGrand, drakulaGreen, drakulaWhite, drakulaYellow } from "../hauntcnst/hauntplayers";
import hauntedSpy from "../hauntcnst/hauntedSpy";

const avatars = [
    drakulaAngry,
    drakulaGreen,
    drakulaBlue,
    drakulaYellow,
    drakulaWhite,
    drakulaGrand
];

const Haunthauntedspyplay = () => {
    const navigation = useNavigation();
    const [gameStep, setGameStep] = useState(0);
    const [chooseAvatar, setChooseAvatar] = useState(false);
    const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
    
    const [players, setPlayers] = useState([
        { name: '', avatar: noavatar },
        { name: '', avatar: noavatar }
    ]);

    const [ghostCount, setGhostCount] = useState(1);
    const [gameDuration, setGameDuration] = useState(600);

    const [showGhostSelection, setShowGhostSelection] = useState(false);
    const [showGameDurationSelection, setShowGameDurationSelection] = useState(false);

    const [countdown, setCountdown] = useState(3);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [rolesAssigned, setRolesAssigned] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState('');
    const [playerRoles, setPlayerRoles] = useState({});
    const [showRole, setShowRole] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(gameDuration);
    const [gameEnded, setGameEnded] = useState(false);
    const [ghostsRevealed, setGhostsRevealed] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const buttonPulse = useRef(new Animated.Value(1)).current;
    const entryAnimations = useRef([]);
    const avatarBounce = useRef(new Animated.Value(1)).current;
    const countdownAnim = useRef(new Animated.Value(1)).current;
    const cardFlipAnim = useRef(new Animated.Value(0)).current;
    const timerPulse = useRef(new Animated.Value(1)).current;

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

        entryAnimations.current = players.map(() => new Animated.Value(0));
        players.forEach((_, index) => {
            Animated.spring(entryAnimations.current[index], {
                toValue: 1,
                friction: 6,
                delay: index * 150,
                useNativeDriver: true,
            }).start();
        });
    }, []);

    const canStartGame = () => {
        return players.length >= 2 && 
               players.every(player => player.name.trim() !== '' && player.avatar !== noavatar);
    };

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

    // Countdown timer for game start
    useEffect(() => {
        if (gameStep === 2 && countdown > 0) {
            const timer = setTimeout(() => {
                Animated.sequence([
                    Animated.timing(countdownAnim, {
                        toValue: 1.5,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.spring(countdownAnim, {
                        toValue: 1,
                        friction: 3,
                        tension: 40,
                        useNativeDriver: true,
                    }),
                ]).start();
                
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (gameStep === 2 && countdown === 0) {
            initializeGameRoles();
        }
    }, [gameStep, countdown]);

    // Game timer
    useEffect(() => {
        let timer;
        if (gameStarted && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (gameStarted && timeLeft === 0) {
            endGame();
        }
        return () => clearInterval(timer);
    }, [gameStarted, timeLeft]);

    const initializeGameRoles = () => {
        const randomPlaceIndex = Math.floor(Math.random() * hauntedSpy.length);
        const place = hauntedSpy[randomPlaceIndex];
        setSelectedPlace(place);

        const ghostIndices = [];
        const playerCount = players.length;
        const actualGhostCount = Math.min(ghostCount, playerCount - 1);
        
        while (ghostIndices.length < actualGhostCount) {
            const randomIndex = Math.floor(Math.random() * playerCount);
            if (!ghostIndices.includes(randomIndex)) {
                ghostIndices.push(randomIndex);
            }
        }

        const rolesMap = {};
        players.forEach((player, index) => {
            rolesMap[index] = ghostIndices.includes(index) ? 'GHOST' : place;
        });

        setPlayerRoles(rolesMap);
        setRolesAssigned(true);
    };

    const handleCardPress = () => {
        if (!showRole) {
            Animated.timing(cardFlipAnim, {
                toValue: 180,
                duration: 500,
                useNativeDriver: true,
            }).start();
            setShowRole(true);
        } else {
            if (currentPlayerIndex < players.length - 1) {
                setCurrentPlayerIndex(currentPlayerIndex + 1);
                setShowRole(false);
                Animated.timing(cardFlipAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }).start();
            } else {
                setGameStarted(true);
                setTimeLeft(gameDuration);
                setGameStep(3);
            }
        }
    };

    const endGame = () => {
        setGameEnded(true);
        setGameStarted(false);
        Animated.loop(
            Animated.sequence([
                Animated.timing(timerPulse, {
                    toValue: 1.1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(timerPulse, {
                    toValue: 0.9,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const revealGhosts = () => {
        setGhostsRevealed(true);
    };

    const restartGame = () => {
        setGameStep(0);
        setCountdown(3);
        setCurrentPlayerIndex(0);
        setRolesAssigned(false);
        setSelectedPlace('');
        setPlayerRoles({});
        setShowRole(false);
        setGameStarted(false);
        setTimeLeft(gameDuration);
        setGameEnded(false);
        setGhostsRevealed(false);
        Animated.timing(cardFlipAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
        }).start();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

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

    const frontInterpolate = cardFlipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg']
    });

    const backInterpolate = cardFlipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg']
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }]
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }]
    };

    return (
        <Animated.View style={[global.container, { 
            paddingHorizontal: 20,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
        }]}>

            {/* Back button for all steps except countdown */}
            {
                (gameStep === 0 || gameStep === 1 || gameStep === 3) && (
                    <View style={{width: '100%'}}>
                        <TouchableOpacity
                            style={global.backarrBtn}
                            onPress={() => gameStep === 3 ? restartGame() : navigation.goBack()}
                        >
                            <Image source={hauntBack} style={global.backarr} />
                        </TouchableOpacity>
                    </View>
                )
            }

            {/* Game title for setup screens */}
            {
                (gameStep === 0 || gameStep === 1) && (
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
                        <Text style={[buttons.buttonText, {fontSize: 24}]}>HAUNTED SPY</Text>
                    </Animated.View>
                )
            }

            {/* Players setup */}
            {gameStep === 0 && (
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
            )}

            {/* Game settings */}
            {gameStep === 1 && (
                <View style={{flexGrow: 1, width: '100%'}}>
                    <View style={play.playersContainer}>
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
                            Game settings
                        </Animated.Text>

                        <TouchableOpacity
                            style={[buttons.chooseAvatar, {width: 200, marginBottom: 20}]}
                            onPress={() => setShowGhostSelection((prev) => !prev)}
                        >
                            <Animated.View style={[
                                global.row, 
                                {padding: 10},
                                { transform: [{ scale: avatarBounce }] }
                            ]}>
                                <Text>Ghosts</Text>
                                <Text>{ghostCount}</Text>
                                <Image
                                    source={smallArr}
                                    style={play.smalArrow}
                                />
                            </Animated.View>
                        </TouchableOpacity>

                        {showGhostSelection && (
                            <View style={[global.row, {marginBottom: 30}]}>
                                <TouchableOpacity
                                    onPress={() => setGhostCount((prev) => Math.max(1, prev - 1))}
                                    disabled={ghostCount <= 1}
                                    style={[ghostCount <= 1 && {opacity: 0.5}]}
                                >
                                    <Image source={decrease} style={play.plusIcon} />
                                </TouchableOpacity>
                                <Text style={buttons.buttonText}>{ghostCount}</Text>
                                <TouchableOpacity
                                    onPress={() => setGhostCount((prev) => Math.min(players.length - 1, prev + 1))}
                                    disabled={ghostCount >= players.length - 1}
                                    style={[ghostCount >= players.length - 1 && {opacity: 0.5}]}
                                >
                                    <Image source={increase} style={play.plusIcon} />
                                </TouchableOpacity>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[buttons.chooseAvatar, {width: 200}]}
                            onPress={() => setShowGameDurationSelection((prev) => !prev)}
                        >
                            <Animated.View style={[
                                global.row, 
                                {padding: 10},
                                { transform: [{ scale: avatarBounce }] }
                            ]}>
                                <Text>Timer</Text>
                                <Text>{gameDuration/60} min</Text>
                                <Image
                                    source={smallArr}
                                    style={play.smalArrow}
                                />
                            </Animated.View>
                        </TouchableOpacity>

                        {showGameDurationSelection && (
                            <View style={[global.row, {marginTop: 20}]}>
                                <TouchableOpacity
                                    onPress={() => setGameDuration((prev) => Math.max(60, prev - 60))}
                                    disabled={gameDuration <= 60}
                                    style={[gameDuration <= 60 && {opacity: 0.5}]}
                                >
                                    <Image source={decrease} style={play.plusIcon} />
                                </TouchableOpacity>
                                <Text style={buttons.buttonText}>{gameDuration/60}</Text>
                                <TouchableOpacity
                                    onPress={() => setGameDuration((prev) => Math.min(900, prev + 60))}
                                    disabled={gameDuration >= 900}
                                    style={[gameDuration >= 900 && {opacity: 0.5}]}
                                >
                                    <Image source={increase} style={play.plusIcon} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

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
                            onPress={() => setGameStep(2)}
                        >
                            <Image
                                source={buttonDec}
                                style={buttons.image}
                            />
                            <Text style={[buttons.buttonText, {fontSize: 24}]}>START</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            )}

            {/* Countdown screen */}
            {gameStep === 2 && (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    {countdown > 0 ? (
                        <Animated.View style={{ transform: [{ scale: countdownAnim }] }}>
                            <Text style={[menu.text, {fontSize: 120}]}>{countdown}</Text>
                        </Animated.View>
                    ) : (
                        <View style={{width: '100%', alignItems: 'center'}}>
                            <Animated.View style={[
                                {width: 300, height: 400, position: 'relative'},
                                frontAnimatedStyle,
                                {backfaceVisibility: 'hidden', position: 'absolute'}
                            ]}>
                                <View style={[
                                    buttons.button, 
                                    { 
                                        width: '100%', 
                                        height: '100%', 
                                        justifyContent: 'center',
                                        backgroundColor: '#1C77D4',
                                        borderRadius: 22
                                    }
                                ]}>
                                    <Image
                                        source={players[currentPlayerIndex]?.avatar}
                                        style={{width: 150, height: 150, marginBottom: 20}}
                                    />
                                    <Text style={[buttons.buttonText, {fontSize: 24, marginBottom: 20}]}>
                                        {players[currentPlayerIndex]?.name}
                                    </Text>
                                    <Text style={[buttons.buttonText, {fontSize: 18}]}>
                                        Tap to see your role
                                    </Text>
                                </View>
                            </Animated.View>

                            <Animated.View style={[
                                {width: 300, height: 400, position: 'relative'},
                                backAnimatedStyle,
                                {backfaceVisibility: 'hidden'}
                            ]}>
                                <View style={[
                                    buttons.button, 
                                    { 
                                        width: '100%', 
                                        height: '100%', 
                                        justifyContent: 'center',
                                        backgroundColor: playerRoles[currentPlayerIndex] === 'GHOST' ? '#FF0000' : '#1C77D4',
                                        borderRadius: 22
                                    }
                                ]}>
                                    <Text style={[buttons.buttonText, {fontSize: 24, marginBottom: 20}]}>
                                        {players[currentPlayerIndex]?.name}
                                    </Text>
                                    <Text style={[buttons.buttonText, {fontSize: 32, marginBottom: 20, textAlign: 'center'}]}>
                                        {playerRoles[currentPlayerIndex]}
                                    </Text>
                                    <Text style={[buttons.buttonText, {fontSize: 18}]}>
                                        {showRole ? 'Tap to continue' : ''}
                                    </Text>
                                </View>
                            </Animated.View>

                            <TouchableOpacity 
                                style={{marginTop: 30, width: 300, height: 400, position: 'absolute'}}
                                onPress={handleCardPress}
                                activeOpacity={0.9}
                            />
                        </View>
                    )}
                </View>
            )}

            {/* Game play screen */}
            {gameStep === 3 && (
                <View style={{flex: 1, width: '100%'}}>
                    {!gameEnded ? (
                        <>
                            <View style={{alignItems: 'center', marginTop: 20}}>
                                <Animated.View style={{ transform: [{ scale: timerPulse }] }}>
                                    <Text style={[menu.text, {fontSize: 48}]}>
                                        {formatTime(timeLeft)}
                                    </Text>
                                </Animated.View>
                            </View>

                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={[menu.text, {fontSize: 24, textAlign: 'center', marginBottom: 30}]}>
                                    Find the ghost{ghostCount > 1 ? 's' : ''} among you!
                                </Text>
                                
                                <TouchableOpacity
                                    style={[buttons.button, {width: 200, marginBottom: 20}]}
                                    onPress={endGame}
                                >
                                    <Image
                                        source={buttonDec}
                                        style={buttons.image}
                                    />
                                    <Text style={[buttons.buttonText, {fontSize: 20}]}>END GAME</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={[menu.text, {fontSize: 32, marginBottom: 100}]}>
                                {ghostsRevealed ? 'The Ghosts Were:' : 'Game Over!'}
                            </Text>

                            {ghostsRevealed ? (
                                <ScrollView style={{width: '100%', paddingHorizontal: 20}}>
                                    {Object.entries(playerRoles).map(([index, role]) => {
                                        if (role === 'GHOST') {
                                            return (
                                                <View key={index} style={[
                                                    global.row, 
                                                    {
                                                        marginBottom: 20,
                                                        justifyContent: 'center',
                                                        backgroundColor: '#1C77D4',
                                                        borderRadius: 22,
                                                    },
                                                ]}>
                                                    <Image
                                                        source={players[index].avatar}
                                                        style={{width: 60, height: 60, marginRight: 20}}
                                                    />
                                                    <Text style={[menu.text, {fontSize: 24}]}>
                                                        {players[index].name}
                                                    </Text>
                                                </View>
                                            );
                                        }
                                        return null;
                                    })}
                                </ScrollView>
                            ) : (
                                <Text style={[menu.text, {fontSize: 24, marginBottom: 30, textAlign: 'center'}]}>
                                    The location was: {selectedPlace}
                                </Text>
                            )}

                            <TouchableOpacity
                                style={[buttons.button, {width: 200, marginBottom: 20}]}
                                onPress={ghostsRevealed ? restartGame : revealGhosts}
                            >
                                <Image
                                    source={buttonDec}
                                    style={buttons.image}
                                />
                                <Text style={[buttons.buttonText, {fontSize: 20}]}>
                                    {ghostsRevealed ? 'PLAY AGAIN' : 'REVEAL GHOSTS'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
        </Animated.View>
    );
};

export default Haunthauntedspyplay;