// import CryptoJS from 'crypto-js'

// const Encrypt = (word:string)=> {
//   var key = CryptoJS.enc.Utf8.parse('abcdefgabcdefg12')
//   var srcs = CryptoJS.enc.Utf8.parse(word)
//   var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
//   return encrypted.toString()
// }

// const Decrypt = (word:string)=> {
//   var key = CryptoJS.enc.Utf8.parse('abcdefgabcdefg12')
//   var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
//   return CryptoJS.enc.Utf8.stringify(decrypt).toString()
// }
// export default {
//   Encrypt,
//   Decrypt
// }
