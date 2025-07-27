import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, TextInput, Modal, ScrollView, Animated, Easing, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import { buttons, global, menu, play } from "../hauntcnst/hauntstyles";
import { apple, buttonDec, hauntBack, noavatar, plus, smallArr, watermelon, cherry, awards } from "../hauntcnst/hauntassets";
import { drakulaAngry, drakulaBlue, drakulaGrand, drakulaGreen, drakulaWhite, drakulaYellow } from "../hauntcnst/hauntplayers";

const { height } = Dimensions.get('window');

const avatars = [
    drakulaAngry,
    drakulaGreen,
    drakulaBlue,
    drakulaYellow,
    drakulaWhite,
    drakulaGrand
];

const Hauntghostcircleplay = () => {
    const navigation = useNavigation();
    const [gameStep, setGameStep] = useState(0);
    const [chooseAvatar, setChooseAvatar] = useState(false);
    const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
    
    const [players, setPlayers] = useState([
        { name: '', avatar: noavatar },
        { name: '', avatar: noavatar }
    ]);

    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [timeLeft, setTimeLeft] = useState(120);
    const [votingPlayerIndex, setVotingPlayerIndex] = useState(0);
    const [votes, setVotes] = useState({});
    const [playerScores, setPlayerScores] = useState([]);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const buttonPulse = useRef(new Animated.Value(1)).current;
    const entryAnimations = useRef([]);
    const avatarBounce = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        let timer;
        if (gameStep === 2) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleAnswerSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameStep]);

    useEffect(() => {
        entryAnimations.current = players.map(() => new Animated.Value(0));
    }, []);

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

    const handleAnswerSubmit = () => {
        if (gameStep === 2 && !currentAnswer.trim()) return;
        
        if (gameStep === 2) {
            const newAnswers = [...answers, {
                playerIndex: currentPlayerIndex,
                text: currentAnswer,
                playerName: players[currentPlayerIndex].name
            }];
            setAnswers(newAnswers);
        }
        
        setCurrentAnswer('');
        setTimeLeft(120);
        
        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(currentPlayerIndex + 1);
            setGameStep(1);
        } else {
            setGameStep(3);
            setVotingPlayerIndex(0);
            initializeVotes();
        }
    };

    const initializeVotes = () => {
        const initialVotes = {};
        players.forEach((_, index) => {
            initialVotes[index] = 0;
        });
        setVotes(initialVotes);
    };

    const handleVote = (answerIndex) => {
        const votedPlayerIndex = answers[answerIndex].playerIndex;
        const newVotes = { ...votes, [votedPlayerIndex]: votes[votedPlayerIndex] + 1 };
        setVotes(newVotes);
        
        if (votingPlayerIndex < players.length - 1) {
            setVotingPlayerIndex(votingPlayerIndex + 1);
        } else {
            calculateScores(newVotes);
            setGameStep(4);
        }
    };

    const calculateScores = (finalVotes) => {
        const scores = players.map((player, index) => ({
            ...player,
            score: finalVotes[index] || 0
        }));
        setPlayerScores(scores);
    };

    const CountdownTimer = () => {
        const [count, setCount] = useState(3);
        const scaleAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            const timer = setInterval(() => {
                setCount(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setGameStep(2);
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

    const AnswerScreen = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1, padding: 20 }}
                    keyboardShouldPersistTaps="handled"
                >
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
                    <Text style={{ color: '#FFF', fontSize: 24, marginTop: 10 }}>
                        {players[currentPlayerIndex].name}'s answer
                    </Text>
                </View>

                <View style={{width: '100%'}}>
                    <Text style={{ color: '#FFF', fontSize: 19, fontWeight: '600', position: 'absolute', top: 10, right: 15, zIndex: 10 }}>
                        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </Text>

                    <TextInput
                        style={{
                            backgroundColor: '#1C77D4',
                            borderRadius: 22,
                            padding: 15,
                            paddingTop: 50,
                            textAlignVertical: 'top',
                            marginBottom: 20,
                            fontSize: 16,
                            height: height > 700 ? height * 0.47 : height * 0.35,
                            color: '#fff',
                        }}
                        multiline
                        placeholder="Type your answer here..."
                        value={currentAnswer}
                        onChangeText={setCurrentAnswer}
                        autoFocus
                    />
                </View>

                <TouchableOpacity
                    style={[buttons.button, { alignSelf: 'center' }]}
                    onPress={handleAnswerSubmit}
                >
                    <Image source={buttonDec} style={buttons.image} />
                    <Text style={buttons.buttonText}>
                        {currentPlayerIndex < players.length - 1 ? 'Next Player' : 'Finish'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
        );
    };

    const VotingScreen = () => {
        return (
            <View style={{ width: '100%', flexGrow: 1, padding: 20 }}>
                <Text style={[buttons.buttonText, { fontSize: 24, textAlign: 'center', marginBottom: 20 }]}>
                    {players[votingPlayerIndex].name}'s Vote
                </Text>
                
                <ScrollView style={{ marginBottom: 20 }}>
                    {answers.map((answer, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                backgroundColor: '#1C77D4',
                                padding: 15,
                                borderRadius: 10,
                                marginBottom: 10
                            }}
                            onPress={() => handleVote(index)}
                        >
                            <Text style={{ color: '#FFF', fontSize: 16 }}>{answer.text}</Text>
                            <Text style={{ color: '#FFF', fontSize: 12, marginTop: 5 }}>
                                - {answer.playerName}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
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

                {/* Podium */}
                <View style={{ flexDirection: 'row', justifyContent: sortedPlayers.length === 1 ? 'center' : sortedPlayers.length === 2 ? 'flex-start' : 'space-between', alignItems: 'flex-end' }}>
                    {/* Second place (left) */}
                    {sortedPlayers.length > 1 && (
                        <View style={{ marginHorizontal: 10, alignItems: 'center',  marginRight: height >  700 ? 15 : 5 }}>
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
                            <Text style={{ color: '#FFF', fontSize: 18, width: 90, textAlign: 'center' }} ellipsizeMode="tail">{sortedPlayers[1].name}</Text>
                        </View>
                    )}

                    {/* First place (center) */}
                    {sortedPlayers.length > 0 && (
                        <View style={{ marginHorizontal: 10, alignItems: 'center', marginRight: height >  700 ? 15 : 5 }}>
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
                            <Text style={{ color: '#FFF', fontSize: 18, width: 120, textAlign: 'center' }} ellipsizeMode="tail">{sortedPlayers[0].name}</Text>
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
                            <Text style={{ color: '#FFF', fontSize: 18, width: 90, textAlign: 'center' }} ellipsizeMode="tail">{sortedPlayers[2].name}</Text>
                        </View>
                    )}
                </View>
                <Image source={awards} style={{width: '100%', height: 110, resizeMode: 'contain', marginTop: 10}} />

                {/* Full results */}
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
                                {player.score} votes
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

            {/* Player setup screen */}
            {gameStep === 0 && (
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
                        <Text style={[buttons.buttonText, {fontSize: 24}]}>GHOST CIRCLE</Text>
                    </Animated.View>

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
                </View>
            )}

            {/* Countdown screen */}
            {gameStep === 1 && <CountdownTimer />}

            {/* Answer input screen */}
            {gameStep === 2 && <AnswerScreen />}

            {/* Voting screen */}
            {gameStep === 3 && <VotingScreen />}

            {/* Game over screen */}
            {gameStep === 4 && <GameOverScreen />}
        </Animated.View>
    );
};

export default Hauntghostcircleplay;