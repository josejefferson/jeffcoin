import sha256 from 'sha256'
import EC from 'elliptic'
import { createModelSchema, primitive } from 'serializr'

const ec = new EC.ec('secp256k1')

export class Transacao {
  valor: number
  tipo: 'transferencia' | 'recompensa'
  enderecoOrigem: string | null
  enderecoDestino: string
  timestamp: number
  assinatura!: string

  constructor(
    valor: number,
    enderecoOrigem: string | null,
    enderecoDestino: string,
    tipo: 'transferencia' | 'recompensa' = 'transferencia'
  ) {
    this.valor = valor
    this.tipo = tipo
    this.enderecoOrigem = enderecoOrigem
    this.enderecoDestino = enderecoDestino
    this.timestamp = Date.now()
  }

  calcularHash() {
    return sha256(this.valor + this.tipo + this.enderecoOrigem + this.enderecoDestino + this.timestamp).toString()
  }

  assinar(senha: string) {
    const chave = ec.keyFromPrivate(senha)

    if (chave.getPublic('hex') !== this.enderecoOrigem) {
      throw new Error('Você não pode assinar transações de outras carteiras')
    }

    const assinatura = chave.sign(this.calcularHash(), 'base64').toDER('hex')
    this.assinatura = assinatura
  }

  validar() {
    if (this.tipo === 'recompensa') {
      return true
    }

    if (!this.enderecoOrigem || !this.assinatura) {
      return false
    }

    const publicKey = ec.keyFromPublic(this.enderecoOrigem, 'hex')
    return publicKey.verify(this.calcularHash(), this.assinatura)
  }
}

createModelSchema(Transacao, {
  valor: primitive(),
  tipo: primitive(),
  enderecoOrigem: primitive(),
  enderecoDestino: primitive(),
  timestamp: primitive(),
  assinatura: primitive()
})
