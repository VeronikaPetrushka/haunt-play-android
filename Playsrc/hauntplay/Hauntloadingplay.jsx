import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import WebView from "react-native-webview";
import { useEffect } from "react";
import hauntloaderplay from "../hauntcnst/hauntloaderplay";

const Hauntloadingplay = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Hauntaboutplay');
        }, 4000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{width: 150, height: 150, backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 300}}>
                <WebView
                    source={{ html: hauntloaderplay }}
                    style={{ flex: 1, backgroundColor: 'transparent' }}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    originWhitelist={['*']}
                    mixedContentMode="always"
                    scrollEnabled={false}
                    injectedJavaScript={`
                        document.body.style.backgroundColor = 'transparent';
                        document.querySelector('html').style.backgroundColor = 'transparent';
                        document.querySelector('.loader-container').style.backgroundColor = 'transparent';
                        true;
                    `}
                />
            </View>
        </View>
    )
};

export default Hauntloadingplay;