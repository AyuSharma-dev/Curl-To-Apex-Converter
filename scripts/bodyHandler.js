function getRequestBody(){
    let reqBody;
    if( this.curlCommand.includes('-F ') || this.curlCommand.includes('--form ') ){
        let bodyDenote = this.curlCommand.includes('--form') ? '--form ' : '-F ';
        reqBody = "String body = '';\n";
        let cmdBody = this.curlCommand;
        cmdBody = cmdBody.replaceAll('"','').replaceAll("'",'');
        while( cmdBody.includes( bodyDenote ) ){
            cmdBody = substringAfter( cmdBody, bodyDenote);
            let q = cmdBody.startsWith('"') ? '" ' : "' ";
            let formPair = substringBefore( cmdBody, q);
            let formKey = formPair.split('=')[0].replaceAll('"','').replaceAll("'",'');
            let formVal = formPair.split('=')[1].replaceAll('"','').replaceAll("'",'');
            reqBody += '    body += HttpFormBuilder.WriteBoundary();\n';
            reqBody += `    body += HttpFormBuilder.WriteBodyParameter('${formKey}', '${formVal}');\n`;
        }
        if( reqBody != '' ){
            reqBody += '    HttpFormBuilder.WriteBoundary(HttpFormBuilder.EndingType.CrLf);\n';
            reqBody += '    Blob formBlob = EncodingUtil.base64Decode(body);\n'
            reqBody += "    req.setHeader('Content-Length', String.valueOf(formBlob.size()));\n";
            reqBody += "    req.setBodyAsBlob(formBlob);\n";
            hasFormBody = true;
        }
    }
    else{
        let bodyDenote = this.curlCommand.includes('--data-raw ') ? '--data-raw ' : '-d ';
        if( this.curlCommand.includes(bodyDenote) ){
            reqBody = substringAfter( this.curlCommand, bodyDenote);
            let q;
            if( reqBody.includes('{') ){
                q = reqBody.startsWith("'{") ? "}'" : '}"';
            }
            else if( reqBody.startsWith('@') ){
                return `    req.setBody('Please add the content here from file: ${substringBefore( reqBody, ' ')}');\n`;
            }
            else{
                q = reqBody.startsWith("'") ? "' " : '" ';
            }
            
            reqBody = substringBefore( reqBody, q );
            // if( reqBody.includes('{') ){
            //     getJsonGenerator( reqBody, false )
            //     .then((result) => {
            //         console.log('result--=',result);
            //         reqBody = result;
            //     }).catch((err) => {
            //         console.log('err2--=',err);
            //     });
                
            // }
            reqBody += q;
            reqBody = reqBody.startsWith( '"' ) ? "'"+reqBody.replace('"','').slice(0, -1)+"'" : reqBody;
            
            reqBody = ` req.setBody(${reqBody});\n`;
        }
    }
    
    if( reqBody ){
        return reqBody;
    }
    return '';
}

function getMethod(){
    let requestMethod;
    if( this.curlCommand.includes( ' --get ' ) ){
        requestMethod = 'GET';
    }
    else if( this.curlCommand.includes( '--request ' ) ){
        requestMethod = substringBefore( substringAfter( this.curlCommand, '--request '), ' ' );
    }
    else if( this.curlCommand.includes( '-X ' ) ){
        requestMethod = substringBefore( substringAfter( this.curlCommand, '-X '), ' ' );
    }
    else{
        requestMethod = 'GET';
    }
    return `req.setMethod('${requestMethod}')`;
}

function getEndpoint(){
    let endpoint;
    if( this.curlCommand.includes('https://') ){
        endpoint = 'https://'+substringBefore( substringAfter( this.curlCommand, 'https://'), ' ' );
    }
    else if( this.curlCommand.includes('http://') ){
        endpoint = 'http://'+substringBefore( substringAfter( this.curlCommand, 'http://'), ' ' );
    }
    else if( this.curlCommand.includes('ftp://') ){
        endpoint = 'ftp://'+substringBefore( substringAfter( this.curlCommand, 'ftp://'), ' ' );
    }
    else if( this.curlCommand.includes('ftps://') ){
        endpoint = 'ftps://'+substringBefore( substringAfter( this.curlCommand, 'ftps://'), ' ' );
    }

    if( endpoint && endpoint.includes('"') ){
        endpoint = endpoint.replaceAll('"', '');
    }
    if( endpoint && endpoint.includes("'") ){
        endpoint = endpoint.replaceAll("'", '');
    }
    
    return `req.setEndpoint('${endpoint}');`;
}

function getHeaders(){
    let cmd = this.curlCommand;
    headersBody = '';
    let headerDenote = cmd.includes('--header ') ? '--header ' : '-H ';
    while( cmd.includes(headerDenote) ){
        cmd = substringAfter( cmd, headerDenote);
        let q = cmd.startsWith('"') ? '" ' : "' ";
        console.log(q,'--'+cmd);
        let header = substringBefore( cmd, q );
        console.log('header',header);
        cmd = substringAfter( cmd, q);

        header = header.startsWith('"') ? header+'"' : header;
        header = header.startsWith("'") ? header+"'" : header;

        if( header.includes(':') ){
            let headKey = header.split(':')[0].trim().replaceAll('"', '').replaceAll("'", '');
            let headVal = header.split(':')[1].trim().replaceAll('"', '').replaceAll("'", '');
            headersBody += `req.setHeader('${headKey}','${headVal}');\n    `;
        }
        else{
            console.log('Invalid Headers');
        }
    }
    return headersBody
}