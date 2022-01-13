import { registerAs } from "@nestjs/config";

export default registerAs('TokenConfig', () => ({
  tokenWebSocketInfura: process.env.WEB_SOCKET || "wss://ropsten.infura.io/ws/v3/ec12139d8eef47479c25a75f27226c4f",
  tokenHttps:process.env.HTTPS|| "https://ropsten.infura.io/ws/v3/672b38a3e2d746f5bd5f24396cb048e9",
  tokenGasLimit: parseInt(process.env.GAS_LIMIT) || 1000000,
  tokenPrivateKey: String(process.env.TOKEN_PRIVATE_KEY),
  tokenAddrSender: String(process.env.TOKEN_ADDRESS_SENDER),
  tokenAddrContract:String(process.env.TOKEN_ADDRESS_CONTRACT),
  tokenMultisenderAddrContract:String(process.env.TOKEN_MULTISEND_CONTRACT)
}));



