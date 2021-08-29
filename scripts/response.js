function failResponse(msg, data){
  return {
    "status" : 0,
    "msg" : msg,
    "data" : data
  }
}

function successReponse(msg, data){
  return {
    "status" : 1,
    "msg" : msg,
    "data" : data
  }
}

module.exports = {failResponse, successReponse}
