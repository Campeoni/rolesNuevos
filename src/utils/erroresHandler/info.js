export const generateUserErrorInfo = (user) => {
  return `One or more propierties were incomplete or not valid.
  List of requiered properties:
  * firstname : needs to be a String, received ${user.firstname}
  * lastname  : needs to be a String, received ${user.lastname}
  * email     : needs to be a String, received ${user.email}`
}
