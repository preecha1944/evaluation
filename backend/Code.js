// Google Apps Script Code
// ID: 1pqWrK6MFMn8CHqov0nVW1rotvcn-ITfC8ynZnu3l798

function doGet(e) {
  // Handle JSONP
  // Fallback to 'callback' if parameter is missing to prevent "undefined(...)" error
  var callback = e.parameter.callback || 'callback'; 
  
  var result = saveToSheet(e.parameter);
  
  // Return JSONP response
  // Ensure output is stringified properly
  var output = callback + '(' + JSON.stringify(result) + ')';
  
  return ContentService.createTextOutput(output)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doPost(e) {
  var result = saveToSheet(e.parameter);
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function saveToSheet(data) {
  try {
    // ID Sheet ที่คุณต้องการบันทึก
    var ss = SpreadsheetApp.openById("1pqWrK6MFMn8CHqov0nVW1rotvcn-ITfC8ynZnu3l798");
    var sheet = ss.getSheetByName("Responses");
    
    // Create sheet if not exists
    if (!sheet) {
      sheet = ss.insertSheet("Responses");
      sheet.appendRow([
        "Timestamp", 
        "Round", 
        "Start Date", 
        "End Date", 
        "Prefix", 
        "Name", 
        "Position", 
        "Group", 
        "Department",
        "Part 1 Score (80)",
        "Part 2 Score (20)",
        "Total Score",
        "Level",
        "Details JSON"
      ]);
    }

    var rowData = [
      data.timestamp || new Date(),
      data.evaluationRound,
      data.periodStart,
      data.periodEnd,
      data.prefix,
      data.name,
      data.position,
      data.group,
      data.department,
      data.part1Score,
      data.part2Score,
      data.totalScore,
      data.level,
      data.details
    ];

    sheet.appendRow(rowData);
    return { status: "success", message: "Data saved successfully" };
    
  } catch (error) {
    return { status: "error", message: error.toString() };
  }
}