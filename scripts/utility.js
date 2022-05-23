function substringAfter( str, char ){
    return str.substring( str.indexOf(char) + (char.length) );
}

function substringBefore( str, char ){
    console.log('str',str);
    let beforeBody = str.substring( 0, str.indexOf(char) );
    
    if( !beforeBody || beforeBody == '' || beforeBody == ' ' ){
        if( str.endsWith('"') ){
            beforeBody = str.substring( 0, str.indexOf('"') );
        }
        else if( this.curlCommand.endsWith( str ) ){
            beforeBody = str;
        }
        else if( str.endsWith("'") ){
            beforeBody = str.substring( 0, str.indexOf("'") );
            console.log('str3',beforeBody, str.indexOf("'"));
        }
        else{
            beforeBody = str;
        }
    }
    else{
        beforeBody = beforeBody.trim();
    }
    console.log('str2',beforeBody);
    return beforeBody;
}

function getJsonGenerator( jsonBody, quoted ){

    const reqBody = `{ "Body": ${jsonBody}, "quoted": ${quoted} }`;
    return new Promise(function(myResolve, myReject){
        fetch('https://jaspex.herokuapp.com/api/generateApexAPI', {
            method: 'POST',
            body: reqBody,
            headers: {
                'Content-Type': 'application/json',
                "cache-control": "no-cache"
            }
        })
        .then((result) => {
            const myJson = result.json(); 
            console.log( 'json--',myJson );
            return myResolve(myJson);
        }).catch((err) => {
            console.log( 'err--',err );
            return myReject(err);
        });
        
    });
    
}