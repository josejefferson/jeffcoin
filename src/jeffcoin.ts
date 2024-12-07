import { Bloco } from './bloco'
import { Transacao } from './transacao'

export class JeffCoin {
  ultimoBloco: Bloco
  transacoesPendentes: Transacao[]
  dificuldade: number
  recompensa = 1

  constructor() {
    this.ultimoBloco = new Bloco()
    this.transacoesPendentes = []
    this.dificuldade = 1
  }

  minerarTransacoesPendentes(enderecoMinerador: string) {
    const recompensa = new Transacao(this.recompensa, null, enderecoMinerador, 'recompensa')
    this.transacoesPendentes.push(recompensa)

    const block = new Bloco(this.transacoesPendentes, this.ultimoBloco, this.dificuldade)
    this.ultimoBloco = block
    this.transacoesPendentes = []
    return block
  }

  saldoDaCarteira(endereco: string) {
    let saldo = 0

    let blocoAtual: Bloco | null = this.ultimoBloco
    while (blocoAtual !== null) {
      for (const transacao of blocoAtual.transacoes) {
        if (transacao.enderecoOrigem === endereco) saldo -= transacao.valor
        if (transacao.enderecoDestino === endereco) saldo += transacao.valor
      }
      blocoAtual = blocoAtual.blocoAnterior
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
    let blocoAtual = this.ultimoBloco
    let blocoAnterior = this.ultimoBloco.blocoAnterior

    while (blocoAnterior) {
      if (blocoAtual.hash !== blocoAtual.calcularHash()) return false
      if (blocoAtual.hashAnterior !== blocoAnterior.hash) return false

      blocoAtual = blocoAnterior
      blocoAnterior = blocoAnterior.blocoAnterior
    }

    if (blocoAtual.calcularHash() !== blocoAtual.hash) {
      return false
    }

    return true
  }
}
