const path = require('path');
const express = require('express');             // Bring in Express framework.
const bodyParser = require('body-parser');      // Use body-parser to parse incoming requests.


// Initialize Express framework save to constant 'app'.
const app = express();
// Define path for Express config.
const wwwDirectoryPath = path.join(__dirname, '../www');
// Serve the GUI from the www directory.
app.use(express.static(wwwDirectoryPath));

// Use body-parser to parse incoming string from GUI.
app.use(bodyParser.urlencoded({extended: true}));

// Route for Hercules commands.
app.post('/hercCommand', (req, res) => {
    console.log('Incoming Hercules command:', req.body);
    res.sendStatus(200);
});

// Route for Fulldome Video Projector commands.
app.post('/videoCommand', (req, res) => {
    console.log('Incoming VideoProjector command:', req.body);
    res.sendStatus(200);
});


// Check to see if PORT is already assigned, if not use 3000.
const PORT = process.env.PORT || 3000;
// Start Express web server, listen on assigned port.
app.listen(PORT, () => {
    console.log(`Express Server up and listening at http://localhost:${PORT}`);
});