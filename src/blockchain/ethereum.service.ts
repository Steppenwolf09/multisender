import { Injectable } from '@nestjs/common'
const Web3 = require ('web3')
import {ConfigService} from '@nestjs/config'
const Contract = require ('web3-eth-contract')
import *  as abi from '@/assets/abiEth.json'
import {Account, Send} from "src/blockchain/blockchainService.interface";
import BigNumber from "bignumber.js";




@Injectable()
export class EthereumService {
  private gasPrice
  private gasLimit
  private chainId
  private privateKey
  private addrSender
  private ethContract
  private ws
  private web3
  private https
  constructor(
    private ethConfig:ConfigService
  ) {
    this.gasPrice = ethConfig.get<number>('EthereumConfig.gasPrice')
    this.gasLimit = ethConfig.get<number>('EthereumConfig.gasLimit')
    this.addrSender = ethConfig.get<string>('EthereumConfig.addrSender')
    this.chainId = ethConfig.get<number>('EthereumConfig.chainId')
    this.privateKey = ethConfig.get<string>('EthereumConfig.privateKey')
    this.ethContract = ethConfig.get<string>('EthereumConfig.ethContract')
    this.https = ethConfig.get<string>('EthereumConfig.https')
    this.ws = ethConfig.get<string>('TokenConfig.tokenWebSocketInfura')
    this.web3 = new Web3(this.ws)
  }

  async getBalance(address:string):Promise<string>{
    if (!this.isAddress(address)){
      throw new Error(`${address} is wrong address!`)
    }
    return this.web3.utils.fromWei(this.web3.utils.toBN(await this.web3.eth.getBalance(address)))
  }
  isAddress(address:string):boolean{
    return this.web3.utils.isAddress(address)
  }
  getFee():number{
    const fee = this.web3.utils.fromWei(this.web3.utils.toBN(this.gasLimit * this.gasPrice))
    return fee
  }
  async createNewAccount():Promise<Account>{
    const ac = await this.web3.eth.accounts.create()
    let account: Account
    account = {address:ac.address,privateKey:ac.privateKey.toString('hex')}
    return account
  }
  async getTokenBalance(address:string):Promise<string>{
    return '0'
  }

  async sendTx(address:string,key:string, send:Array<Send>):Promise<string>{
    const receivers = []
    const amounts = []
    const ten = new BigNumber(10)
    for (let i = 0; i < send.length; i++) {
      receivers.push(send[i].to)
      amounts.push((new BigNumber(send[i].value).multipliedBy(ten.exponentiatedBy(18))).toString())
    }
    const contract = new Contract(abi['default'], this.ethContract)
    const newAcBal = new BigNumber(await this.web3.eth.getBalance(address))
    const val = newAcBal.minus(new BigNumber(this.gasLimit * this.gasPrice))
    const rawTr = {
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      to: this.ethContract,
      from: address,
      value: val,
      chainId: this.chainId,
      data: contract.methods.send(receivers, amounts).encodeABI()
    }
    const signedTr=await this.web3.eth.accounts.signTransaction(rawTr, key)

    const result = await this.web3.eth.sendSignedTransaction(signedTr.rawTransaction)
    return result.transactionHash
  }

  async checkTx(hash:string):Promise<boolean> {
    const transRes = await this.web3.eth.getTransactionReceipt(hash)
    if (await this.web3.eth.getBlockNumber() - transRes.blockNumber >= 3) {
      return true
    }
    return false
  }
}





