
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBacJySoBvyiEHcJVvHUurVmgz2iiH-P1E",
    authDomain: "traindb-52b55.firebaseapp.com",
    databaseURL: "https://traindb-52b55.firebaseio.com",
    projectId: "traindb-52b55",
    storageBucket: "",
    messagingSenderId: "1001251647731"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

// ADD Train BUTTON

  $("#addTrain").on("click", function(event) {
      event.preventDefault();

    // TAKE USER INPUT  
    console.log($("#trainNameInput").val());
    var trainName = $("#trainNameInput").val().trim();
    var trainDestination = $("#destinationInput").val().trim();
    var firstTrainTime = $("#firstTrainTimeInput").val().trim();
    var trainFrequency = $("#frequencyInput").val().trim();

    // LOCAL OBJECT HOLDING TRAIN DATA
    var trainInfo = {
        name: trainName,
        destination: trainDestination,
        time: firstTrainTime,
        frequency: trainFrequency
    };

    var trainRef = database.ref("/trains");
    // push temp object to database
    trainRef.push(trainInfo);

    // EMPTY INPUTS
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainTimeInput").val("");
    $("#frequencyInput").val("");

});

database.ref("/trains").on("child_added", function(snapshot, prevChildKey) {

    console.log(snapshot.val());
    console.log(snapshot.val().name);

    // store info in variables
    var locoName = snapshot.val().name;
    var locoDestination = snapshot.val().destination;
    var locoTime = snapshot.val().time;
    var locoFrequency = snapshot.val().frequency;

    // MOMENT STUFF

    var locoNextArrivalPretty = moment(locoNextArrival).format("HH:mm");


    // SET CURRENT TIME VARIABLE
    var currentTime = moment();
    console.log("current time " + moment(currentTime).format("hh:mm"));

    
    // DIFFERENCE BETWEEN THE 
    var diffTime = moment().diff(moment(locoTime,"hh:mm"), "minutes");
    //console.log("difference in time " + diffTime);

    // TIME APART
    var timeRemainder = Math.abs(diffTime) % locoFrequency;

    // MINUTES UNTIL TRAIN
    var minAway = locoFrequency - timeRemainder;
    console.log("minAway = " + minAway)
    console.log("locotime = " + locoTime)

    var minAwayPretty = moment(minAway).format("HH:mm");

    //-------------------------------------------------------------------

    // WHY CANT I ADD THE MINAWAY TO MY CURRENT TIME????
   // var locoNextArrival = moment(currentTime).format("hh:mm") + " " + minAway;


    //-------------------------------------------------------------------


    var locoNextArrival = moment(currentTime, "hh:mm").add(minAway, "minutes").format("hh:mm");
    
    console.log("next arrival is: " + moment(locoNextArrival).format("hh:mm"))
    

    var locoNextArrivalFormatted = moment(locoNextArrival).format("HH:mm");

    $("#importantTable").append("<tr><td>"+locoName+"</td><td>"+locoDestination+
    "</td><td>"+locoFrequency+"</td><td>"+locoNextArrival+"</td><td>"+minAway+"</td>");

})