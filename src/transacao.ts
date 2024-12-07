import sha256 from 'sha256'
import EC from 'elliptic'

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
    if (tipo === 'transferencia' && !enderecoOrigem) {
      throw new Error('Endereço de origem é obrigatório para transações de transferência')
    }

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
}
