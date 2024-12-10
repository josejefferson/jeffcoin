import { writeFileSync, readFileSync } from 'fs'
import { deserialize, serialize } from 'serializr'
import { JeffCoin } from './jeffcoin'

const CARTEIRA_JEFF = process.env.CARTEIRA_JEFF!
const CARTEIRA_KAYO = process.env.CARTEIRA_KAYO!
const SENHA_JEFF = process.env.SENHA_JEFF!

const importar = false

if (importar) {
  const importedData = readFileSync('data.json', { encoding: 'utf-8' })
  const jeffcoin = deserialize(JeffCoin, JSON.parse(importedData))
  console.log(jeffcoin.validarBlockchain())
} else {
  const jeffcoin = new JeffCoin()

  console.log('Jeff:', jeffcoin.saldoDaCarteira(CARTEIRA_JEFF))
  console.log('Kayo:', jeffcoin.saldoDaCarteira(CARTEIRA_KAYO))

  for (let i = 0; i < 10; i++) {
    console.log('\nJefferson está minerando...')
    let inicio = Date.now()
    jeffcoin.minerarTransacoesPendentes(CARTEIRA_JEFF)
    let fim = Date.now() - inicio
    console.log('Tempo:', fim / 1000, 'segundos')
  }

  console.log('\nJeff:', jeffcoin.saldoDaCarteira(CARTEIRA_JEFF))
  console.log('Kayo:', jeffcoin.saldoDaCarteira(CARTEIRA_KAYO))

  console.log('\nJefferson transferiu 13 JeffCoins para Kayo')
  jeffcoin.adicionarTransferencia(13, CARTEIRA_JEFF, CARTEIRA_KAYO, SENHA_JEFF)

  console.log('\nJeff:', jeffcoin.saldoDaCarteira(CARTEIRA_JEFF))
  console.log('Kayo:', jeffcoin.saldoDaCarteira(CARTEIRA_KAYO))

  {
    console.log('\nKayo está minerando...')
    let inicio = Date.now()
    jeffcoin.minerarTransacoesPendentes(CARTEIRA_KAYO)
    let fim = Date.now() - inicio
    console.log('Tempo:', fim / 1000, 'segundos')
    jeffcoin.minerarTransacoesPendentes(CARTEIRA_KAYO)
  }

  console.log('\nJeff:', jeffcoin.saldoDaCarteira(CARTEIRA_JEFF))
  console.log('Kayo:', jeffcoin.saldoDaCarteira(CARTEIRA_KAYO))

  console.log('\nBlockchain válida:', jeffcoin.validarBlockchain())

  const exportedData = JSON.stringify(serialize(jeffcoin), null, 2)
  writeFileSync('data.json', exportedData)
}
