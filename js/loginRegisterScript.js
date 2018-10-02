function login(){
    $.ajax({
        type:"POST",
        url: "/calendar/php/login.php",
        dataType: "json",
        data: {user_name: "'" + $("#user_name").val() + "'", password: "'" + $("#password").val() + "'", login: 'true'},
        
        success: function (data){
            handleData(data);
        }
    });
    //check if login success, if not, then bail.
}

/**
 * check if registered already
 * if register is a success, take back to login.
 */
function register(){
  $.ajax({
      type: "POST",
      url: "/calendar/php/register.php",
      dataType: "json",
      data: {user_name: "'" + $("#user_name").val() + "'",
             password: "'" + $("#password").val() + "'",
             register: 'true'},

      success: function (data){
          handleData(data);
      }
  });
}

function handleData(data){
    if('register' in data){ //then  handle as register
        if('error' in data){
            alert('Register Failed: ' + data['error']);
            console.log('error: ' + data['error']);
        }
        else if( !('error' in data)){
            var result = data['result'];
            console.log(data['result']);
            //window.location.href = "login.html?" + result['username']; //passes along the user.
        }
    }
    else if (!('register' in data)){ //its a login call
        if('error' in data){
            console.log('error: ' + data['error']);
        }
        else if( !('error' in data)){
            var result = data['result'];
            window.location.href = "index.html?" + result['username']; //passes along the user.
        }
    }
}