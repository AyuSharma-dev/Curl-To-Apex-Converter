var curlCommand;
var curlValueDefault = "curl --location --request GET 'https://ssa.shellpointmtg.com/rest/folders/top?apiVersion=23' \ --header 'Authorization: Bearer 255f9b14bd781081ef04a98dd45e6cf68a916237' \ --header 'Access-Control-Allow-Origin: self' \ --form 'body=@\"/C:/Users/user 3/Downloads/instagram-5-48.png\"' \ --form 'clientCreated=\"test\"'"; //For Testing

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('curlCommand').value = curlValueDefault;
    document.getElementById("resultBlock").style.display = 'none';
 }, false);

function handleSubmit() {
    this.curlCommand = document.getElementById("curlCommand").value;
    console.log( this.curlCommand );
    document.getElementById("preBlock").style.display = 'block';
    document.getElementById("result").innerHTML = getHttpReq();
    document.getElementById("resultBlock").style.display = 'block';
}

function handleCopy(){
    var r = document.createRange();
    r.selectNode(document.getElementById('result'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    document.getElementById("copyButton").innerHTML = 'Copied!';
}

let hasFormBody = false;

function getHttpReq() {

    let bodyVar =  `
    ${getHttpConstants()}
    ${getMethod()}
    ${getEndpoint()}
    ${getHeaders()}
    ${getRequestBody()}
    ${getResponseHandlingConstants()}
`;
    
    if( hasFormBody ){
        bodyVar += getHttpBuilderClass();
        hasFormBody = false;
    }
    return bodyVar;
}