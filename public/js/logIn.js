//const { Console } = require("console");

function validatePass(){
    let pass = document.getElementById("password").value;
    let confirmPass = document.getElementById("passwordconfirm").value;

    if(pass != confirmPass)
    {
        return false;
    }
    
    return true;
}





document.addEventListener("DOMContentLoaded", function(){
    
    // document.getElementById("LogIn")
    // .addEventListener("submit", handleSignIn);

    // document.getElementById("LogIn")
    // .addEventListener("submit", handleSignIn);

    var cookies = document.cookie.split('; ');

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "100",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "show",
        "hideMethod": "hide"
    };

    
    cookies.forEach(cookie => {
        let pairs = cookie.split('=');
        
        if(pairs[0]=='message'){
            if(pairs[1]=='no-user'){
               
                toastr.error('No user found matching provided email!');
            
            }else
            if(pairs[1]=='not-verified'){
                
                toastr.error('Please verify your account first before login in!');
            
            }else
            if(pairs[1]=='incorrect'){
                
                toastr.error('Incorrect Login Credentials');
            
            }
                
        }
    });

    document.cookie = "message="
});