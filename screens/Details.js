import { View, Text, StyleSheet, Button, Linking, Alert } from "react-native";
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
  const [regNo, setRegNo] = useState("");
  const [fileName, setFileName] = useState("");

  const callContract = async (address) => {
    const abi = [
      "function name() public view returns (string)",
      "function regNo() public view returns (string)",
      "function fileName() public view returns (string)",
      "function ipfsHash() public view returns (string)",
    ];
    const goerli = {
      name: "goerli",
      chainId: 5,
      _defaultProvider: (providers) =>
        new providers.JsonRpcProvider(
          "https://eth-goerli.g.alchemy.com/v2/Z39fImiHi1RepVTGajZyaHWgGTdLtF4N"
        ),
    };
    const provider = new ethers.getDefaultProvider(goerli);
    try {
      const contract = new ethers.Contract(address, abi, provider);
      const hash = await contract.ipfsHash();
      const name = await contract.name();
      const reg_no = await contract.regNo();
      const file_name = await contract.fileName();
      setCid(hash);
      setName(name);
      setRegNo(reg_no);
      setFileName(file_name);
    } catch (error) {
      return (
        <View style={styles.container}>
          <Text style={styles.maintext}>Fake Certificate</Text>
        </View>
      );
    }
  };

  const openUrl = async (url) => {
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) {
      Linking.openURL(url);
    } else {
      Alert.alert("Don't know how to open this url");
    }
  };

  callContract(address);

  return (
    <View style={styles.container}>
      <Text>Certificate Verified ✅</Text>
      <Text>Name - {name}</Text>
      <Text>Registration No - {regNo}</Text>
      <Button
        title="View on IPFS"
        onPress={() => openUrl(`https://${cid}.ipfs.dweb.link/${fileName}`)}
      />
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
