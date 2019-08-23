const fs = require('fs')
const dropboxV2Api = require('dropbox-v2-api')

// const clientId = process.env.DROPBOX_CLIENT_ID || 'mhxel7oiccv3gyj'
// const ClientSecret = process.env.DROPBOX_CLIENT_SECRET || 'gj51g7zbhqm8hf9'
// const RedirectUri = process.env.DROPBOX_REDIRECT_URI || 'http://localhost:8080/api/dropbox'
const dropboxToken = process.env.DROPBOX_TOKEN || '58rNT9gEBlAAAAAAAAAAeq8Vo7iglUDHPiJO9RMeGw-QVVAGnSKrJSIREguZfyIP'
const dropboxUpload = async function () {
  //   const dropbox = dropboxV2Api.authenticate({
  //     client_id: clientId,
  //     client_secret: ClientSecret,
  //     redirect_uri: RedirectUri
  //   })
  //   // generate and visit authorization sevice
  //   const authUrl = dropbox.generateAuthUrl()
  //   console.log(authUrl)
  //   res.redirect(authUrl)

  // after redirection, you should receive code
  // dropbox.getToken(code, (err, result, response) => {
  // you are authorized now!
  const dropbox = dropboxV2Api.authenticate({
    token: dropboxToken
  })
  let ts = Date.now()
  let dateNow = new Date(ts)
  dropbox({
    resource: 'files/upload',
    parameters: {
      path: '/lowStocks_' + dateNow + '.js'
    },
    readStream: fs.createReadStream('/home/ayasser/Desktop/GitHub/supplements/static/low_stocks.csv')
  }, (err, result, response) => {
    console.log(err)
  })
}

const getCode = async (req, res) => {
  let code
  if (req.quary.code) {
    code = req.quary.code
  }
  const dropbox = dropboxV2Api
  dropbox.getToken(code, (err, result, response) => {
    // you are authorized now!
    if (err) {
      console.log(err)
    }
    console.log('result', result)
    console.log('res', response)
  })

  return code
}

module.exports = {
  dropboxUpload,
  getCode
}
