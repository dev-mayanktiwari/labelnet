import { Connection } from "@solana/web3.js";
import { AppConfig } from "../config";

const connection = new Connection(String(AppConfig.get("SOLANA_RPC_URL")));

export default connection;
