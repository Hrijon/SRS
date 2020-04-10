// var exec = require("child_process").exec;
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

/**
 * reqStart sends status report to server and display html form on client 
 * generate form with 3 options to choose where to go
 * it will send client to requested page
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {object} postData 
 */
function reqStart(request, response, postData){
    console.log("Request handler 'start' was called.");

    fs.readFile('../index.html', function (err, html) {
        if (err) {
            throw err; 
        }       
   
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/student" enctype="multipart/form-data" method="POST">' +
        'Input Student Details: <input type="radio" name="degree" ><br>'+
        'View Details: <input type="radio" name="degree" ><br>'+
        'Upload Image: <input type="radio" name="degree" ><br>'+
        '<input type="submit" name="submit" value="Submit">'+
        '<input type="reset" name="reset" value="Reset">'+          
        '</form>'+
        '</body>'+
        '</html>';
    // var start = document.getElementById('start')
    // var student = document.getElementById('student')

    response.writeHead( 200, {"Content-Type": "text/plain"} );
    response.write(body);
    response.end();
});
}


/**
 * sends status report to server and display html for on client side
 * generate a form to enter student details
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {object} postData 
 */
function reqStudent(request, response, postData){
    console.log("Request handler 'student' was called.");

    var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
        '<form action="/start" enctype="multipart/form-data" method="POST">' +
            'Student ID: <input type="Number" id="stdID" name="stdID" min="30000000" max="55000000" required><br>'+
            'First Name: <input type="text" name="fName" required><br>'+
            'Last Name: <input type="text" name="lName" required><br>'+
            'Age: <input type="number" name="age" min="10" max="99" required><br>'+
            'Gender: <input type="radio" name="gender" required>Male <input type="radio" name="gender" required>Female<br>'+
            'Degree: <input type="text" name="degree" required><br>' +
            '<input type="submit" name="submit" value="Submit">'+
            '<input type="reset" name="reset" value="Reset">'+          
        '</form>'+
    '</body>'+
    '</html>';

response.writeHead( 200, {"Content-Type": "text/plain"} );
response.write(body);
response.end();
}

/**
 * sends status report to server and display html for on client side
 * ask user to enter degree to view details about it
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {object} postData 
 */
function reqView(request, response, postData){
    console.log("Request handler 'View' was called.");

    var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
        '<form action="/start" enctype="multipart/form-data" method="POST">' +
            'Degree: <input type="text" name="degree" required><br>' +
            '<input type="submit" name="submit" value="Submit">'+
            '<input type="reset" name="reset" value="Reset">'+          
        '</form>'+
    '</body>'+
    '</html>';

response.writeHead( 200, {"Content-Type": "text/plain"} );
response.write(body);
response.end();
}

/**
 * reqUpload sends a status report as a response to the client and server
 * formidable is use to parse form data (file uploads)
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {object} postData 
 */
function reqUpload(request, response) {
    console.log("Request handler 'upload' was called.");
    console.log("... about to parse ...");
   
    var form = new formidable.IncomingForm();
   
    form.uploadDir = './tmp'; // must include this line    
    

    form.parse(request, function(err, field, file) {
        console.log("parsing done");
        console.log('fields:', field);
        console.log('files:', file);

        // tried to rename to an already existing file
        fs.rename(file.upload.path, "./test.png",function(err){
            if (err)
            {
                fs.unlink("./test.png");
                fs.rename(file.upload.path,"./test.png");
            }

            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("Received image:<br/>");
            response.write("<img src='/show' />");
            response.end();
        });
    });
}

/**
 * Stream the image data on behalf of reqUpload
 * 
 * @param {object} request
 * @param {object} response 
 * @param {object} postData 
 */
function reqShow(request, response, postData) 
{
    console.log("Request handler 'show' was called.");
    response.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("./test.png").pipe(response);
}

/**
// alternative code for the show function
function reqShow(response, postData) {
    console.log("Request handler 'show' was called.");
    response.writeHead(200, {"Content-Type": "image/png"});
    // open file for a readable stream
    var readStream = fs.createReadStream("./test.png");
    // wait until we know the readable stream is valid
    readStream.on('open', function() {
    // pipe read stream to response object (goes to client)
    readStream.pipe(response);
    });
    // catches errors (if any)
    readStream.on('error', function(err) {
    readStream.end(err);
    });
}
*/

//allow access on reqStart & reqUpload to other files
exports.reqStart = reqStart;
exports.reqStudent = reqStudent;
exports.reqOption = reqOption;

exports.reqView = reqView;
exports.reqUpload = reqUpload;
exports.reqShow = reqShow;