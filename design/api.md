auth
login
{{url}}:3000/user/login
request : {
email : string@gmail.com
password: string
}
response : {
user:UserInfo
jwt : stirng
}
singup
{{url}}:3000/user/singup
request : {
email : "string@gmail.com" //must be unique
gender: "male"|| "female"
password: string
}
request : {
user:UserInfo
jwt : stirng
}
forgot password
{{url}}:3000/user/forgot-password
request : {
email : "string@gmail.com"
}
request : {
message  
 }
<!-- and sending email with resetCode -->
reset passowrd
{{url}}:3000/user/reset-password
request : {
email : "string@gmail.com" //-- must be unique --\\
newPassword: string
resetCode : 1325 <!--from the email-->
}
request : {
jwt : stirng
}
