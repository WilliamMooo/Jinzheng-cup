module.exports = (msg, status) => {
  let err = new Error()
  err.msg = msg
  err.status = status
  return err
}