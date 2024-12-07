import sha256 from 'sha256'
import { Transacao } from './transacao'

export class Bloco {
  index: number
  timestamp: number
  transacoes: Transacao[]
  hashAnterior: string
  hash: string
  blocoAnterior: Bloco | null
  nonce: number

  constructor(transacoes: Transacao[] = [], blocoAnterior: Bloco | null = null, dificuldade: number = 1) {
    this.transacoes = transacoes
    this.blocoAnterior = blocoAnterior
    this.index = (blocoAnterior?.index ?? -1) + 1
    this.hashAnterior = blocoAnterior?.hash || ''
    this.timestamp = Date.now()

    const { hash, nonce } = this.minerarBloco(dificuldade)
    this.hash = hash
    this.nonce = nonce
  }

  calcularHash(nonce: number = this.nonce) {
    return sha256(this.index + this.hashAnterior + this.timestamp + JSON.stringify(this.transacoes) + nonce).toString()
  }

  minerarBloco(dificuldade: number) {
    let hash = ''
    let nonce = 0

    while (hash.substring(0, dificuldade) !== '0'.repeat(dificuldade)) {
      nonce++
      hash = this.calcularHash(nonce)
    }

    return { hash, nonce }
  }
}
