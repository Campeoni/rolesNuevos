const firstName = document.getElementById("firstName")
const lastName  = document.getElementById("lastName")
const username      = document.getElementById("user")
const email     = document.getElementById("email")
const password  = document.getElementById("password")

document.addEventListener("keydown", (event)=>{    
  if (event.key === "Enter" ) {
    registerUser()
  } 
})

const registerUser = () => {
  alert('procesando');    

  const User = {}

  User.firstname  = firstName.value
  User.lastname   = lastName.value
  User.username   = username.value
  User.email      = email.value
  User.password   = password.value

  console.log(User);

  const request = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(User).toString()
  }

  fetch('/api/user', request)
    .then(response => {
      if (response.ok) {
        window.location.href = '/';
      } else {
        alert("Datos incorrectos")
      }
    })
}