import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider"
import crowfundingManifest from "../contracts/Crowfunding.json"
import { ethers, Contract} from "ethers"

export default function Home() {
  const myContract = useRef(null);

  useEffect( () => {
    let init = async () => {
      await configurarBlockchain();
    }
    init();
  }, [])

  const configurarBlockchain = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      await provider.request({method: "eth_requestAccounts"});
      let providerEthers = new ethers.providers.Web3Provider(provider);
      let signer = providerEthers.signer;
      myContract.current = new Contract(
        "0xf9cfae1a05a9bc170d3b8e4a9d20dd4d511396c9",
        crowfundingManifest.abi,
        signer
      )
    } else {
      console.log("No se puede conectar con el provider")
    }
  }

  return (
    <>
      <h1>Hola!</h1>
    </>
  );
}
