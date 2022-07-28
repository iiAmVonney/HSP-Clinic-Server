
function validatePass(){
    let pass = document.getElementById("password").value;
    let confirmPass = document.getElementById("passwordconfirm").value;

    if(pass != confirmPass)
    {
        return false;
    }
    
    return true;
}

async function toJSON(fd){
    const obj = {};
    
    try{

    for (key of fd.keys()){
        
        obj[key] = fd.get(key);
        
    }
    
    }catch{

    }

    

    // console.log('2JSON',JSON.stringify(obj));

    return JSON.stringify(obj);

}

// function postAsForm(fd, url){

//     var form = $('<form></form>');

//     form.attr("method", "post");
//     form.attr("action", url);

//     fd.keys().forEach(key => {
//         if(fd[key]=='password')
//         {

//         }else{
//             var field = $('<input></input>');

//             field.attr("type", "hidden");
//             field.attr("name", key);
//             field.attr("value", fd[key]);

//             form.append(field);
//         }
//     });


// }


async function handleSignUp (ev){

    // ev.preventDefault();
    return;
    let myForm = ev.target;
    let fd = new FormData(myForm);

    let url = 'http://localhost:3000/SignUp';
    // let req = new Request;
    // console.log('index.js ',req.body);


    postAsForm(fd, url);


};



$(document).ready(function(){

    //let json = JSON.parse(document.cookie.message);


   
    console.log('COOKIES!: ',document.cookie);

    var cookies = document.cookie.split('; ');

    
    cookies.forEach(cookie => {
        let pairs = cookie.split('=');
        if(pairs[0]=='message'){
            if(pairs[1]=='user-found')
            {
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
            

                toastr.error('User matching student number/email already exists!');
            }

        }
    });

    
    
    
    // if(json.status === 403){
    //     
    // }else{
    //     toastr.success(json.message);
    // }



    // jQuery methods go here...

    // document.addEventListener("DOMContentLoaded", function(){
    
        // document.getElementById("LogIn")
        // .addEventListener("submit", handleSignIn);
        console.log('in creatAccount.js');
        //document.getElementById("signup").addEventListener("submit", handleSignUp);
    
       
    
    // });


  
  });