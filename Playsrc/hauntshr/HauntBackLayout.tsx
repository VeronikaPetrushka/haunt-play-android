import { ImageBackground, View } from "react-native";
import { ReactNode } from "react";
import { hauntback } from "../hauntcnst/hauntassets";

interface HauntBackLayoutProps {
    hauntplay: ReactNode;
}

const HauntBackLayout: React.FC<HauntBackLayoutProps> = ({ hauntplay }) => {

    return (
        <View style={{flex: 1, backgroundColor: '#0A3158'}}>
            <ImageBackground 
                style={{ flex: 1 }}
                source={hauntback}
                resizeMode="cover"
            >
                <View style={{ flex: 1 }}>
                    {hauntplay}
                </View>
            </ImageBackground>
        </View>
    )
};

export default HauntBackLayout;