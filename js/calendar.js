/**
 * dynamically fill the table
 * check month, num of days, and starting month
 * 
 * functions 
 *      prev month
 *      next month
 * 
 * functions (month)
 *      set appointment
 *          change color
 *          fill data
 *      fill holidays
 *          same
 */

var prevMonth;
var nextMonth;
var year = 2018;
var nextStartDay;
var prevStartDay;
var monthsEnum = {1:"January", 2: "February", 3: "March", 4:"April", 5: "May", 6:"June",
                    7: "July", 8:"August", 9:"September", 10:"October",11:"November", 12:"December"};
var monthDays = {1: 31, 2: 28, 3: 31, 4:30, 5:31, 6:30, 7:31, 8:31, 9:30, 10:31, 11:30, 12:31}; 
var owner;

function pullOwner(){
    var searchArray = window.location.search.split('?');
    owner = searchArray[1];
    $('#owner').text(owner);
    $('#owner').hide();
}

 function buildCalendar(month, startDay){
    pullOwner();
    setMonths(month);
     //build a calendar 2d array, which then used to fill the table.
     var days = monthDays[month];
     var calendar = [];
     var i = 0;
     var daysLeft = true;
     var day = 1;
     var setStartDay = true;
     var started = false;
     while(daysLeft){ //each iter is its own row.
        calendar[i] = [];
        for(var j = 0; j < 7; j++){ //for each day in week
            if(i === 0){
                if(j === startDay - 1){
                    if(month - 1 != 0){
                        prevStartDay = 7 + ((startDay - monthDays[month - 1]) % 7);
                    }
                    else{
                        prevStartDay = 7 + ((startDay - monthDays[12]) % 7);
                    }
                    console.log('prevStart: ' + prevStartDay); //breaking dec 17, NaN            
                    calendar[i][j] = day++;
                    started =true;
                }
                else if(started){
                    calendar[i][j] = day++;
                }
                else{
                    calendar[i][j] = "";
                }
            }
            else if(day <= days){ //make sure day is in month still
                calendar[i][j] = day++;
            }
            else{
                calendar[i][j] =""; //empty
                if(setStartDay){
                    nextStartDay = j+1;
                    setStartDay = false;
                } 
                daysLeft = false;
            }
        }
        i++;
     }

     //console.log(calendar);
     //now take the calendar, and build it into the table. put nums in the top left corner
     var html = '';
     for(var i = 0; i < calendar.length; i++){ //row
        html += '<tr>';
         for(var j = 0; j < 7; j++){ //col
            html += pullDay(month, calendar[i][j]);
         }
         html += '</tr>';
     }
     $("#calendarTable tr").remove(); //clear out table first.
     $("#calendarTable").append(html);
    }


 
 function pullDay(month, day){
     var events = getEvents(month, day); // this doesnt really work
     var html = '';
     var dayHtml='';
     var validDay = false;
     if(day != ''){
         dayHtml = '<div class="numberBox">' + day + '</div>';
         validDay = true;
     }
     var newId = month + '_'+ day  + '_'+ year;
     html += '<td id=' + newId +' onclick= "sendToAdd(' + month + ','+ day  + ','+ year + ',' + validDay + ')">' + dayHtml
     + '<div class="events"><ul id='+newId+'_list' +'>';
     for(event in events){
         html += '<li>' + event['event'] + "\t" + event['time'] +'</li>';
     }
     html += '</ul></div></td>';
     
     return html; //html string for the td. //adds class if event, lists by time.
 }


 function setMonths(month){
    var monthName = monthsEnum[month];
    if(monthName === "January"){
       prevMonth = 12;
    }
    else{
       prevMonth = month -1; //indexing -1 for input month
    }

    if(monthName === "December"){ //if december, nextMonth is Jan
        nextMonth = 1;
    }
    else{
        nextMonth = month + 1;
    }   

    $("#month").text( monthName );
    $("#year").text( year);

 }

 function sendToAdd(month, day, year, valid){
     //element will be the div containing day n year/month
     //pass this in the url (weak but effective)
     if(!valid){
        console.log('clicked invalid day');
     }
     else{
        window.location.href = 'event.html?' + '+' + owner + '+' + month +'+' + day +'+' + year;
     }
 }

 function addEvent(){
     var searchArray = window.location.search.split('+');
     owner = searchArray[1];
     month = searchArray[2];
     day = searchArray[3];
     year = searchArray[4];
     //console.log('owner: ' + owner);
     $.ajax({
         type: "POST",
         url: "/calendar/php/addEvent.php",
         dataType: "json",
         data: {event: '"' + $("#event").val() + '"', month: "'" + monthsEnum[month] + "'",
            day: "'" + day+ "'", time: "'" + $("#time").val() + "'",
            holiday: "'" + $("#holiday").val() + "'", owner: "'" + owner + "'", year: "'" + year + "'"},

         success: function(data){
             if (!('error' in data)){
                 console.log("Added Holiday");
                 console.log(data['sql']);
                 window.location.href = "index.html?" + owner; //make sure return to same owner.
             }
             else{
                 console.log('error: ' + data.error);
             }
         }
     });
 }

 function getEvents(month, day){
     $.ajax({
         type:"POST",
         url: "/calendar/php/pullEvents.php",
         dataType: "json",
         data: {owner: "'"+owner+"'", month: "'" + monthsEnum[month] + "'", day: "'" + day+ "'", year: "'" + year+ "'"},

         success: function(data){
            if(('error' in data)){
                console.log('error: '+ data.error);
             }
             else{
                 console.log(data['sql']);
                 var events = data['events'];
                 for (event in events){
                     var myEvent = events[event];
                     if(myEvent['holiday']==="1"){
                         event = true;
                         $('#' + month + '_' + day + '_' + year).addClass("holiday");
                     }
                     else {
                        $('#' + month + '_' + day + '_' + year).addClass("randomEvent");
                     }
                     console.log(myEvent);
                     if(myEvent['time'] === "00:00:00"){
                         myEvent['time'] = '';
                     }
                     $('#' + month + '_' + day + '_' + year + '_list').append('<li>' + myEvent['event'] + " " + myEvent['time'] +'</li>');
                 }
             }
         }
     });
 }

 function prev(){
     if(prevMonth == "12"){
         year--;
     }
     buildCalendar(prevMonth, prevStartDay);
 }

 function next(){
     if(nextMonth == "1"){
         year++;
     }
     buildCalendar(nextMonth, nextStartDay);
 }