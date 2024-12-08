import { writeFileSync, readFileSync } from 'fs'
import { deserialize, serialize } from 'serializr'
import { JeffCoin } from './jeffcoin'

// const jeffcoin = new JeffCoin()

const importedData = readFileSync('data.json', { encoding: 'utf-8' })
const jeffcoin = deserialize(JeffCoin, JSON.parse(importedData))

console.log(jeffcoin.validarBlockchain())

const JEFF =
  '043b6f79fb45bd0cfb2d0260cdc02136aca3071254c45f95db1614ecc2fbf2840d0d786389bb4564c09f3bf90166b9f26911b96412f3aff0ba99a69126505d8410'
const SENHA_JEFF = 'e08533e9e220daee20d5a247724333c5c47ffe244211e2cd1820e06ce859e460'

const KAYO =
  '04f30881bd9e9f9656bcb2bce0269ddf6f9aec40024c86838a1b8cf91eea10f505cf755af9b3847c9a263db347a56c3d3517ec6e28135c107f7a473d8130e7c7f0'
const SENHA_KAYO = 'bc88506468951db19d321edc03cc50ca10b4d7d3787e0c4224f8588af14566ac'

// console.log('Jeff:', jeffcoin.saldoDaCarteira(JEFF))
// console.log('Kayo:', jeffcoin.saldoDaCarteira(KAYO))

// for (let i = 0; i < 100; i++) {
  // jeffcoin.minerarTransacoesPendentes(JEFF)
// }

// console.log('Jeff:', jeffcoin.saldoDaCarteira(JEFF))
// console.log('Kayo:', jeffcoin.saldoDaCarteira(KAYO))

// jeffcoin.adicionarTransferencia(13, JEFF, KAYO, SENHA_JEFF)

// console.log('Jeff:', jeffcoin.saldoDaCarteira(JEFF))
// console.log('Kayo:', jeffcoin.saldoDaCarteira(KAYO))

// jeffcoin.minerarTransacoesPendentes(KAYO)

// console.log('Jeff:', jeffcoin.saldoDaCarteira(JEFF))
// console.log('Kayo:', jeffcoin.saldoDaCarteira(KAYO))

// const exportedData = JSON.stringify(serialize(jeffcoin), null, 2)
// writeFileSync('data.json', exportedData)
