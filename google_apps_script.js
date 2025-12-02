function doPost(e) {
  try {
    // 1. Parse the incoming data
    // The React app sends data as text/plain to avoid CORS preflight issues
    var data = JSON.parse(e.postData.contents);
    
    // 2. Log to Google Sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.date,          // Booking Timestamp
      data.name,
      data.phone,
      data.tripType,
      data.pickup,
      data.drop,
      data.vehicle,
      data.passengers,
      data.distance,
      data.estimate,
      data.travelDate     // Travel Date string
    ]);
    
    // 3. Create Calendar Event
    if (data.travelDate) {
      var travelDate = new Date(data.travelDate);
      var title = "Trip: " + data.name + " (" + data.pickup + " to " + data.drop + ")";
      var description = "Phone: " + data.phone + "\n" +
                        "Vehicle: " + data.vehicle + "\n" +
                        "Estimate: " + data.estimate + "\n" +
                        "Distance: " + data.distance;
      
      // Create a 3-hour event (default duration)
      var endTime = new Date(travelDate.getTime() + (3 * 60 * 60 * 1000));
      
      CalendarApp.getDefaultCalendar().createEvent(title, travelDate, endTime, {
        description: description,
        location: data.pickup
      });
    }
    
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
    
  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}
