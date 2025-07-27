import { Platform, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const FONT = {
    MONTSERRAT: Platform.select({
        ios: 'Montserrat-Regular',
        android: 'Montserrat-VariableFont_wght',
    }),
};



export const global = StyleSheet.create({

    container: {
        width: '100%',
        height: '100%',
        paddingTop: height * 0.08
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between'
    },

    backarrBtn: {
        position: 'absolute',
        top: height * 0.04,
        left: 0
    },

    backarr: {
        width: 29,
        height: 23,
        resizeMode: 'contain'
    }

});


export const about = StyleSheet.create({

    drakulaImage: {
        width: '100%',
        height: height * 0.45,
        resizeMode: 'contain'
    },

    text: {
        fontSize: 17,
        lineHeight: 22,
        fontWeight: '600',
        color: '#fff',
        fontFamily: FONT.MONTSERRAT,
        textAlign: 'center'
    },

    textContainer: {
        width: '100%',
        flexGrow: 1,
        backgroundColor: '#1C77D4',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        paddingVertical: 37,
        paddingHorizontal: 20
    }

});


export const menu = StyleSheet.create({

    drakula: {
        width: height > 700 ? 190 : 180,
        height: height > 700 ? 190 : 180,
        resizeMode: 'contain',
        zIndex: 12,
        position: 'absolute',
        left: -30,
        top: -60
    },

    textContainer: {
        paddingVertical: 44,
        paddingHorizontal: 39,
        paddingLeft: 85,
        backgroundColor: '#1C77D4',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center'
    },

    text: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        fontFamily: FONT.MONTSERRAT
    },

    watermelon: {
        width: 150,
        height: 100,
        resizeMode: 'contain',
        zIndex: 12,
        position: 'absolute',
        right: -20,
        top: -30
    }

});


export const buttons = StyleSheet.create({

    button: {
        width: 270,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },

    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        position: 'absolute'
    },


    buttonText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        fontFamily: FONT.MONTSERRAT,
        zIndex: 10
    },

    arrowImage: {
        width: height > 700 ? 84 : 64,
        height: height > 700 ? 84 : 64,
        resizeMode: 'contain'
    },

    chooseAvatar: {
        width: 80,
        height: 40,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        borderRadius: 100
    }

});


export const play = StyleSheet.create({

    playersContainer: {
        width: '100%',
        height: height * 0.52,
        borderRadius: 22,
        backgroundColor: '#1C77D4',
        borderWidth: 4,
        borderColor: '#0E4377',
        padding: 11,
        marginBottom: height * 0.03
    },

    smallAvatar: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },

    smalArrow: {
        width: 13,
        height: 9,
        resizeMode: 'contain'
    },

    selectedAvatar: {
        width: 36,
        height: 36,
        resizeMode: 'contain'
    },

    playerInput: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 13,
        paddingRight: 40,
        backgroundColor: '#fff',
        borderRadius: 100,
        fontSize: 16,
        lineHeight: 22,
        color: '#000',
        fontWeight: '700',
        fontFamily: FONT.MONTSERRAT
    },

    inputIcon: {
        width: 33,
        height: 33,
        resizeMode: 'contain',
        position: 'absolute',
        top: 3,
        right: 4
    },

    plusIcon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
        alignSelf: 'center'
    }

});