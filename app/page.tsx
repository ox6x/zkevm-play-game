"use client";

import { useAddress, useOwnedNFTs } from "@thirdweb-dev/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FARMER_ADDRESS } from "../const/addresses";

export default function MainPage() {
  const address = useAddress(); // 检查用户是否连接钱包
  const router = useRouter();

  const { data: ownedFarmers, isLoading } = useOwnedNFTs(
    FARMER_ADDRESS,
    address
  );

  useEffect(() => {
    // 如果钱包未连接，跳转到登录页面
    if (!address) {
      router.push("/login");
      return;
    }

    // 如果数据加载中，暂不跳转
    if (isLoading) {
      return;
    }

    // 如果用户没有农夫 NFT，跳转到农夫领取页面
    if (!ownedFarmers || ownedFarmers.length === 0) {
      router.push("/farmer");
      return;
    }

    // 如果用户已登录且拥有农夫 NFT，跳转到主页面
    router.push("/home");
  }, [address, ownedFarmers, isLoading]);

  return <div>Loading...</div>; // 加载状态占位
}
