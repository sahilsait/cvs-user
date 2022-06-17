import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";

export default function Details({ route, navigation }) {
  const { address } = route.params;
  if (!ethers.utils.isAddress(address)) {
    return (
      <View style={styles.container}>
        <Text style={styles.maintext}>Fake Certificate</Text>
      </View>
    );
  }

  const [cid, setCid] = useState(null);
  const [name, setName] = useState("");

  const callContract = async (address) => {
    const abi = [
      "function ipfsHash() public view returns (string)",
      "function name() public view returns (string)",
    ];
    const matic = {
      name: "matic",
      chainId: 137,
      _defaultProvider: (providers) =>
        new providers.JsonRpcProvider(
          "https://polygon-mumbai.g.alchemy.com/v2/LrxEH5utefHYWKjgYUUY1AEibsE0zTFG"
        ),
    };
    const provider = new ethers.getDefaultProvider(matic);
    try {
      const contract = new ethers.Contract(address, abi, provider);
      const hash = await contract.ipfsHash();
      const name = await contract.name();
      setCid(hash);
      setName(name);
    } catch (error) {
      return (
        <View style={styles.container}>
          <Text style={styles.maintext}>Fake Certificate</Text>
        </View>
      );
    }
  };

  callContract(address);

  return (
    <View style={styles.container}>
      <Text>Certificate Verified ✅</Text>
      <Text>Name - {name}</Text>
      <Text>CID - {cid}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
});
