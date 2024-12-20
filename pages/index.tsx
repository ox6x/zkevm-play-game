import React, { useEffect, useState } from "react";
import { useAddress, useOwnedNFTs, useContract } from "@thirdweb-dev/react";
import { Login } from "./Login";
import { Farmer } from "./Farmer";
import { Home } from "./Home";
import { FARMER_ADDRESS } from "../const/addresses";

const Index: React.FC = () => {
  const [hasPass, setHasPass] = useState(false);
  const address = useAddress(); // 检查用户是否连接了钱包
  const { contract } = useContract(FARMER_ADDRESS); // 获取通行证合约
  const { data: ownedNFTs, isLoading } = useOwnedNFTs(contract, address); // 查询用户持有的通行证

  // 检查用户是否拥有通行证
  useEffect(() => {
    if (ownedNFTs?.length > 0) {
      setHasPass(true);
    } else {
      setHasPass(false);
    }
  }, [ownedNFTs]);

  // 如果未连接钱包，渲染 Login 组件
  if (!address) {
    return <Login />;
  }

  // 如果正在加载用户持有的 NFT 数据，显示加载状态
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 如果没有通行证，渲染 Farmer 组件
  if (!hasPass) {
    return <Farmer />;
  }

  // 如果用户已连接钱包并持有通行证，渲染 Home 组件
  return <Home />;
};

export default Index;