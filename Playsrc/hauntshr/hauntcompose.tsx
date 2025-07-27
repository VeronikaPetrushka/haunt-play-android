import React from "react";
import HauntBackLayout from "./HauntBackLayout";

import Hauntaboutplay from "../hauntplay/Hauntaboutplay";
import Hauntloadingplay from "../hauntplay/Hauntloadingplay";
import Hauntmenuplay from "./Hauntmenuplay";
import Hauntghostcircleplay from "../hauntplay/Hauntghostcircleplay";
import Hauntdarecurseplay from "../hauntplay/Hauntdarecurseplay";
import Haunthauntedspyplay from "../hauntplay/Haunthauntedspyplay";

export const HauntaboutPlay: React.FC = () => {
    return (
        <HauntBackLayout hauntplay={<Hauntaboutplay />} />
    );
};

export const HauntloadingPlay: React.FC = () => {
    return (
        <HauntBackLayout hauntplay={<Hauntloadingplay />} />
    );
};

export const HauntmenuPlay: React.FC = () => {
    return (
        <HauntBackLayout hauntplay={<Hauntmenuplay />} />
    );
};

export const HauntghostcirclePlay: React.FC = () => {
    return (
        <HauntBackLayout hauntplay={<Hauntghostcircleplay />} />
    );
};

export const HauntdarecursePlay: React.FC = () => {
    return (
        <HauntBackLayout hauntplay={<Hauntdarecurseplay />} />
    );
};

export const HaunthauntedspyPlay: React.FC = () => {
    return (
        <HauntBackLayout hauntplay={<Haunthauntedspyplay />} />
    );
};