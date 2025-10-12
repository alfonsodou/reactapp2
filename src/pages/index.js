import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider"
import crowfundingManifest from "../contracts/Crowfunding.json"
import { ethers, Contract } from "ethers"

export default function Home() {
  const myContract = useRef(null);
  const [goal, setGoal] = useState("");

  useEffect( () => {
    let init = async () => {
      await configurarBlockchain();
      await cargarDatos();
    }
    init();
  }, [])

  const cargarDatos = async() => {
    let goalTemporal = await myContract.current.goal();
    setGoal(goalTemporal.toString());
  }

  const configurarBlockchain = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      await provider.request({method: "eth_requestAccounts"});
      let providerEthers = new ethers.providers.Web3Provider(provider);
      let signer = providerEthers.getSigner();
      myContract.current = new Contract(
        "0x67f14fb73805bd5cf12c0cb42113603d346f9a62",
        crowfundingManifest.abi,
        signer
      );

    } else {
      console.log("No se puede conectar con el provider")
    }
  }

  return (
    <>
      <h1>Crowfunding</h1>
      <h2>Goal: {goal}</h2>
    </>
  );
}
