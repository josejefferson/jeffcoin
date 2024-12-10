import EC from 'elliptic'

const chave = new EC.ec('secp256k1').genKeyPair()
const chavePublica = chave.getPublic('hex')
const chavePrivada = chave.getPrivate('hex')

console.log('Este é o endereço da sua carteira:')
console.log(chavePublica)

console.log('\nEsta é a senha da sua carteira (guarde-a bem, se perder já era!):')
console.log(chavePrivada)
