import { createModelSchema, list, object, primitive } from 'serializr'
import sha256 from 'sha256'
import { Transacao } from './transacao'

export class Bloco {
  index: number
  timestamp: number
  transacoes: Transacao[]
  hashAnterior: string
  hash: string
  nonce: number
  dificuldade: number

  constructor(transacoes: Transacao[] = [], blocoAnterior: Bloco | null = null, dificuldade: number = 1) {
    this.transacoes = transacoes
    this.index = (blocoAnterior?.index ?? -1) + 1
    this.hashAnterior = blocoAnterior?.hash || ''
    this.timestamp = Date.now()
    this.dificuldade = dificuldade

    const { hash, nonce } = this.minerarBloco(dificuldade)
    this.hash = hash
    this.nonce = nonce
  }

  calcularHash(nonce: number = this.nonce) {
    return sha256(
      this.index + this.hashAnterior + this.timestamp + JSON.stringify(this.transacoes) + nonce + this.dificuldade
    ).toString()
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

  validar(blocoAnterior: Bloco | null) {
    if (this.hash !== this.calcularHash()) return false
    if (blocoAnterior && this.hashAnterior !== blocoAnterior.hash) return false
    if (this.hash.substring(0, this.dificuldade) !== '0'.repeat(this.dificuldade)) return false
    if (!this.validarTransacoes()) return false
    return true
  }
}

createModelSchema(Bloco, {
  index: primitive(),
  timestamp: primitive(),
  transacoes: list(object(Transacao)),
  hashAnterior: primitive(),
  hash: primitive(),
  nonce: primitive(),
  dificuldade: primitive()
})
