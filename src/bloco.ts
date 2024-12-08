import sha256 from 'sha256'
import { Transacao } from './transacao'
import { createModelSchema, identifier, list, object, primitive } from 'serializr'

export class Bloco {
  index: number
  timestamp: number
  transacoes: Transacao[]
  hashAnterior: string
  hash: string
  nonce: number

  constructor(transacoes: Transacao[] = [], blocoAnterior: Bloco | null = null, dificuldade: number = 1) {
    this.transacoes = transacoes
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

  validarTransacoes() {
    for (const transacao of this.transacoes) {
      if (!transacao.validar()) {
        return false
      }
    }
    return true
  }
}

createModelSchema(Bloco, {
  index: primitive(),
  timestamp: primitive(),
  transacoes: list(object(Transacao)),
  hashAnterior: primitive(),
  hash: primitive(),
  nonce: primitive()
})
