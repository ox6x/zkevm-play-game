import React, { useState, useEffect } from "react";
import { Login } from "./Login"; // 导入 Login 组件
import { Farmer } from "./Farmer"; // 导入 Farmer 组件
import { Home } from "./Home"; // 导入 Home 组件
import { useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { FARMER_ADDRESS } from "../const/addresses";

const Index: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasPass, setHasPass] = useState(false);
    const address = useAddress(); // 检查是否连接了钱包
    const { contract } = useContract(FARMER_ADDRESS);
    const { data: ownedNFTs } = useOwnedNFTs(contract, address);

    // 检查是否已连接钱包
    useEffect(() => {
        if (address) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [address]);

    // 检查用户是否拥有通行证
    useEffect(() => {
        if (ownedNFTs && ownedNFTs.length > 0) {
            setHasPass(true);
        } else {
            setHasPass(false);
        }
    }, [ownedNFTs]);

    if (!isLoggedIn) {
        return <Login />;
    }

    if (!hasPass) {
        return <Farmer />;
    }

    return <Home />;
};

export default Index;