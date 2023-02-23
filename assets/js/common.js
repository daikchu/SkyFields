/**
 * Created by Admin on 12/21/2017.
 */
var skyApp = angular.module('skyFields', []);

//Bat ky tu
var digitsOnly = /[1234567890]/g;
var digitsAndSemicolon = /[1234567890;]/g;
var digitsAndAsterisk = /[1234567890\\*]/g;
var digitsAndSlash =/[1234567890/]/g;

function restrictCharacters(myfield, e, restrictionType) {
    if (!e) var e = window.event;
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;
    var character = String.fromCharCode(code);

    // if they pressed esc... remove focus from field...
    if (code==27) { this.blur(); return false; }

    // ignore if they are press other keys
    // strange because code: 39 is the down key AND ' key...
    // and DEL also equals .
    if (!e.ctrlKey && code!=9 && code!=8 && code!=36 && code!=37 && code!=38 && (code!=39 || (code==39 && character=="'")) && code!=40) {
        if (character.match(restrictionType)) {
            return true;
        } else {
            return false;
        }

    }
}
function stringToDateTime(_date) {
    var dateTimeParts = _date.split(' '),
        timeParts = dateTimeParts[1].split(':'),
        dateParts = dateTimeParts[0].split('-'),
        date;
    date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
    return date;
}

/*ap dung voi dinh dang 1,000,000 con neu muon 1.000.000 thi duoi'*/
skyApp.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });

            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                plainNumber=plainNumber.replace(",",".");
                elem.val($filter(attrs.format)(plainNumber));
                return plainNumber;
            });
        }
    };
}]);

/*KHU VỰC PHÂN TRANG JAVASCRIPT*/
var page={items:"",rowCount:0,numberPerPage:'10',pageNumber:1,pageList:[],pageCount:0};
/*load tong trang va danh sach trang*/
function getPageCount(pageResult) {
    var pageCount=Math.ceil(pageResult.rowCount/Number(pageResult.numberPerPage));
    return pageCount;
}
function isNullString(str) {
    if (str === '' || str === null || typeof (str) === 'undefined')
        return true;
    else
        return false;
}
/*TRợ giúp tính toán số trang hiển thị khi hiện page*/
function getPageList(pagingResult) {
    var pages=[];
    var from = pagingResult.pageNumber  - 3;
    var to = pagingResult.pageNumber + 5;
    if (from < 0) {
        to -= from;
        from = 1;
    }

    if (from < 1) {
        from = 1;
    }

    if (to > pagingResult.pageCount) {
        to = pagingResult.pageCount;
    }

    for (var i=from; i<=to; i++ ) {
        pages.push(i);
    }
    return pages;
}

function compareTwoDate(a,b) {
    // Compare two dates (could be of any type supported by the convert
    // function above) and returns:
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    // NaN : if a or b is an illegal date
    // NOTE: The code inside isFinite does an assignment (=).
    return (
        isFinite(a=this.convert(a).valueOf()) &&
        isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
    );
}

//convert date dd/mm/yyyy sang date cua he thong.
function formatDate(strDate) {
    if(strDate==null || strDate.length!=10) return null;
    var dateArray = strDate.split("/");
    var date = dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0];
    // alert(moment(moment(date).format("YYYY/MM/DD"),"YYYY/MM/DD",true).isValid());
    if(moment(date,"YYYY-MM-DD",true).isValid()){
        return new Date(date);
    }else{
        return null;
    }

}

/*When click my-enter*/
skyApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNo;
}

function utf8ConvertJavascript(obj)
{
    var str = obj;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
    str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-
    str = str.replace(/^\-+|\-+$/g, "");

    return str;
}

function stringToDate(_date, _format, _delimiter) {
    if(typeof _date == "undefined"|| _date == "" || _date == null) return "";
    var timenow = new Date();
    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    //var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex], timenow.getHours(), timenow.getMinutes(), timenow.getSeconds(), '00');
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex], '00', '00', '00', '00');
    return formatedDate;
}

function isUndefined(value){
    if(typeof value == "undefined" || value == null || value == ""){
        return true;
    }
    return false;
}

function isNotUndefined(value){
    if(typeof value == "undefined" || value == null || value == ""){
        return false;
    }
    return true;
}

function getLastDayOfNowDDMMYYYY() {
    var today = new Date();
    today.setDate(today.getDate() - 1);//trước hôm nay 1 ngày
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return today;
}

function getDateNowDDMMYYYY() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return today;
}

function addtitionTwoArray(arraySource, arrayTarget) {
    for (var i = 0; i < arraySource.length; i++) {
        arrayTarget.push(arraySource[i]);
    }
    return arrayTarget;
}

//parame is date format: 'MM/DD/YYYY hh:mm:ss'
function dateToTimestamp(date) {
    date = date.split("/");
    var newDate = date[0] + "/" + date[1] + "/" + date[2];
    var result = new Date(date).getTime();
    console.log('result newDate: ' + date + ' = ' + newDate);
    console.log('result time lte from date: ' + date + ' = ' + result);
    var result1 = new Date(newDate).getTime();
    console.log('result1 time lte from date: ' + newDate + ' = ' + result1);
    /*alert(new Date(date).getTime());*/
    return result1;
}

//parame is date format: 'DD/MM/YYYY hh:mm:ss'
function dateToTimestampDDMMYYYY(date) {
    /*date=date.split("-");
    var newDate=date[1]+"/"+date[0]+"/"+date[2];
    var result = new Date(date).getTime();*/
    date = date.split("/");
    var newDate = date[1] + "/" + date[0] + "/" + date[2];
    /*var result = new Date(newDate).getTime();*/
    /*var test = Date.parse('02/13/2009 23:31:30')/1000;*/
    var result = new Date(date).getTime();
    console.log('time lte from date: ' + date + ' = ' + result);
    /*alert(new Date(date).getTime());*/
    return result;
}

//parame is date format: '12313213215'
function timeNumberToDate(timeNum) {
    var result = new Date(timeNum);
    return result;
}

//convert time number to date format DD/MM/YYYY
function timeNumberToDateDDMMYYYY(timeNum) {
    var date = new Date(timeNum);
    var result;
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    result = dd + '/' + mm + '/' + yyyy;
    return result;
}

//convert Date() to format DD/MM/YYYY
//format = "/", _delimiter = dd/mm/yyyy
function dateObjectToString(date, _format, _delimiter) {
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();

    let formatLowerCase = _format.toLowerCase();
    let formatItems = formatLowerCase.split(_delimiter);
    let monthIndex = formatItems.indexOf("mm");
    let dayIndex = formatItems.indexOf("dd");
    let yearIndex = formatItems.indexOf("yyyy");

    formatItems[monthIndex] = mm;
    formatItems[dayIndex] = dd;
    formatItems[yearIndex] = yyyy;
    return formatItems[0] + _format + formatItems[1] + _format + formatItems[2];
}

//functio check date type is Date object
function isDateObject(date){
    try {
        let dateObj = new Date(date).toUTCString();
        return dateObj && Object.prototype.toString.call(dateObj) === "[object Date]";
    }catch (e) {
        console.log(e);
        return false;
    }
   // return date && Object.prototype.toString.call(date) === "[object Date]";
}

function ictTimeToString(){

}


//convert Date() to format DD/MM/YYYY
function dateFormatToDDMMYYYY(date) {
    var result;
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    result = dd + '/' + mm + '/' + yyyy;
    return result;
}

//convert yyyy-mm-dd to MM/dd/yyyy
function dateFormatStrToStr(date) {
    var result;
    var arr_date = date.split('-');
    result = arr_date[1] + '/' + arr_date[2] + '/' + arr_date[0] ;
    return result;
}


//tính toán số ngày từ ngày A đến ngày B
countNumberDayBetween2Date=function(dateFrom, dateTo){
    var timeDiff = Math.abs(dateFrom.getTime() - dateTo.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;

};

//check exist an element of an array with key-value parameters
function checkExistElementInArrayObject(element, array, keyName){
    for(var i=0;i<array.length;i++){
        if(array[i][keyName]===element) return true;
    }
    return false;

}

//check valid url
function isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null)
        return false;
    else
        return true;
}

//hàm xóa 1 phần tử trong mảng
function removeElementInArray(array, elem) {
    var index = array.indexOf(elem);
    while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(elem);
    }
}

function findElementIndexInArray(array, elem){
    for(var i=0;i<array.length;i++){
        if(array[i]==elem) return i;
    }
    return -1;
}

function findElementIndexInArrayByElName(array, elName, elValue){
    for(var i=0;i<array.length;i++){
        if(array[i][elName]==elValue) return i;
    }
    return -1;
}

function isEmailAddress(str) {
    var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(str);  // returns a boolean
}

function isNotEmpty (str) {
    var pattern =/\S+/;
    return pattern.test(str);  // returns a boolean
}

function isNumber(str) {
    var pattern = /^\d+$/;
    return pattern.test(str);  // returns a boolean
}
function isSame(str1,str2){
    return str1 === str2;
}
function haveSpaceChar(str){
    if (/\s/.test(str)) {
        // It has any kind of whitespace
        return true;
    }
    else return false;
}
function randomChars(lenString){
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    let randomstring = "";
    for (let i=0; i<lenString; i++) {
        let rnum = Math.floor(Math.random() * characters.length);
        randomstring += characters.substring(rnum, rnum+1);
    }
    return randomstring;
}

function generateUUID(){
    let d = new Date().getTime();
    if(typeof performance !== "undefined" &&
        typeof performance.now === "function"){
        d += performance.now();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c){
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c==="x" ? r : (r & 0x3) | 0x8).toString(16);
        }
    )
}