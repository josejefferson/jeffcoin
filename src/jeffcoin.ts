import { createModelSchema, list, object, primitive } from 'serializr'
import { Bloco } from './bloco'
import { Transacao } from './transacao'

export class JeffCoin {
  blocos: Bloco[]
  transacoesPendentes: Transacao[]
  dificuldade: number
  recompensa = 100

  constructor() {
    this.blocos = []
    this.transacoesPendentes = []
    this.dificuldade = 1
  }

  getUltimoBloco() {
    return this.blocos[this.blocos.length - 1]
  }

  minerarTransacoesPendentes(enderecoMinerador: string) {
    const recompensa = new Transacao(this.recompensa, null, enderecoMinerador, 'recompensa')
    this.transacoesPendentes.push(recompensa)

    const block = new Bloco(this.transacoesPendentes, this.getUltimoBloco(), this.dificuldade)
    this.blocos.push(block)
    this.transacoesPendentes = []
    return block
  }

  saldoDaCarteira(endereco: string) {
    let saldo = 0

    for (let i = this.blocos.length - 1; i >= 0; i--) {
      const bloco = this.blocos[i]
      for (const transacao of bloco.transacoes) {
        if (transacao.enderecoOrigem === endereco) saldo -= transacao.valor
        if (transacao.enderecoDestino === endereco) saldo += transacao.valor
      }
    }

    for (const transacao of this.transacoesPendentes) {
      if (transacao.enderecoOrigem === endereco) saldo -= transacao.valor
      if (transacao.enderecoDestino === endereco) saldo += transacao.valor
    }

    return saldo
  }

  adicionarTransferencia(valor: number, enderecoOrigem: string, enderecoDestino: string, senha: string) {
    let saldoOrigem = this.saldoDaCarteira(enderecoOrigem)

    if (saldoOrigem < valor) {
      throw new Error('Saldo insuficiente, seu saldo é ' + saldoOrigem)
    }

    const transacao = new Transacao(valor, enderecoOrigem, enderecoDestino)
    this.transacoesPendentes.push(transacao)
    transacao.assinar(senha)
    return transacao
  }

  validarBlockchain() {
    for (let i = this.blocos.length - 1; i >= 0; i--) {
      let blocoAtual = this.blocos[i]
      let blocoAnterior = this.blocos[i - 1]

      if (blocoAtual.hash !== blocoAtual.calcularHash()) return false
      if (blocoAnterior && blocoAtual.hashAnterior !== blocoAnterior.hash) return false

      if (!blocoAtual.validarTransacoes()) return false
    }

    return true
  }
}

createModelSchema(JeffCoin, {
  blocos: list(object(Bloco)),
  transacoesPendentes: list(object(Transacao)),
  dificuldade: primitive(),
  recompensa: primitive()
})
