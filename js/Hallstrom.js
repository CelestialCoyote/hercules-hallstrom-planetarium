// Updated 24Jan22.

/**************************************************************************************************
*
* NavBar and all Tabs.
*
**************************************************************************************************/


// Create XMLHttpRequests to send command strings to Java server via http protocol.
const sendCommand = (commandString) => {
    let req = new XMLHttpRequest();

    console.log(`herc=${commandString}`);
       
    req.open('POST', '/hercCommand', true);
    
    // For Java server.
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // For Node.js Express server.
    //req.setRequestHeader('Content-Type', 'text/plain');

	req.send(`herc=${commandString}`);
};

const sendVideoCommand = (commandString) => {
    let req = new XMLHttpRequest();

    console.log(`video=${commandString}`);
       
    req.open('POST', '/videoCommand', true);
    
    // For Java server.
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // For Node.js Express server.
    //req.setRequestHeader('Content-Type', 'text/plain');

	req.send(`video=${commandString}`);
};

// Used for setting button text with loop function.
const zeroPad = (num, places) => String(num).padStart(places, '0');



/******************
* AutoSys and ManSys buttons.
* R, G, B, W vertical sliders.
******************/

$(() => {

    // AUTO / MAN Toggle.
    $('#AutoMan').on('click', (e) => {
        // Indentify button selected.
        let $this = $(e.currentTarget);

        if($this.prop('checked') == true) {
            sendCommand('AUTO');
        } else if($this.prop('checked') == false) {
            sendCommand('MAN');
        }
    });

    // Video Projector Shutter Toggle.
    $('#VIDEO').on('click', (e) => {
        // Indentify button selected.
        let $this = $(e.currentTarget);

        if($this.prop('checked') == true) {
            sendVideoCommand(':SHUTTER1');
        } else if($this.prop('checked') == false) {
            sendVideoCommand(':SHUTTER0');
        }
    });

    // R, G, B (& W if neeced) vertical sliders.
    $('.coveSlider').slider({
        orientation: 'vertical',
        range: 'min',
        min: 0,
        max: 100,
        step: 1,
        value: 0,
        slide: function(e, ui) {
            // Indentify slider selected.
            let color = this.id;

            $(`#lbl${color}`).val(ui.value);
            sendCommand(`0N//${color}//${parseInt(ui.value)}`);
        }
    });

});




/**************************************************************************************************
*
* RGB Cove Tab.
*
**************************************************************************************************/


/******************
* Called on page load to set button text.
******************/

// Set RGB cove button fade rates.
const setRGBCoveFadesButtonText = () => {
    for(let i = 0; i < RGB_COVE_FADES.length; i++) {
        let num = zeroPad(i, 2);
        let id = 'rgbFade_' + num;
        
        document.getElementById(id).textContent = `${RGB_COVE_FADES[i][0]} ${RGB_COVE_FADES[i][1]}`;
    }
};

// Set RGB cove preset button text.
const setPresetCoveFadesButtonText = () => {
    for(let i = 0; i < PRESET_COVE_FADES.length; i++) {
        let num = zeroPad(i, 2);
        let id = 'presetON_' + num;
        
        document.getElementById(id).textContent = `${PRESET_COVE_FADES[i][4]}N ${PRESET_COVE_FADES[i][0]}`;
    }

    for(let i = 0; i < PRESET_COVE_FADES.length; i++) {
        let num = zeroPad(i, 2);
        let id = 'presetOF_' + num;
        
        document.getElementById(id).textContent = `${PRESET_COVE_FADES[i][5]}F ${PRESET_COVE_FADES[i][0]}`;
    }
};

// Set RGB cove strobe button fade rates.
const setRGBStrobeFadeValues = () => {
    for(let i = 0; i < RGB_STROBE_FADE_RATES.length; i++) {
        let num = zeroPad(i, 2);
        let id = 'rgbStrobeFadeLabel_' + num;
        
        document.getElementById(id).textContent = `${RGB_STROBE_FADE_RATES[i]} Sec`;
    }
};


/******************
* RGBCOVE Slider
* RECDCOVE, GRNCOVE, BLUCOVE, RGBCOVE Buttons.
* Preset Buttons.
* RGB Strobe control.
******************/

$(() => {

    // RGBCOVE slider.
    $('#RGBCOVE').slider({
        orientation: 'horizontal',
        range: 'min',
        min: 0,
        max: 100,
        step: 1,
        value: 100,
        slide: (e, ui) => {
            $('#lblRGBCOVE').val(ui.value);
            rgbMasterLevelUpdate();
        }
    });

    // REDCOVE, GRNCOVE, BLUCOVE, & RGBCOVE Buttons.
    $('.rgbCoveFade').on('click', (e) => {
        // Indentify button selected.
        let id = $(e.currentTarget).attr('id');

        // Get the array index value.
        let index = parseInt(id[id.length - 1]);
        let herculesCommand = RGB_COVE_FADES[index][0];

        // Determine if command is ON or OFF. 
        let commandCode = herculesCommand[herculesCommand.length - 1];

        // Get DeviceCode from array.
        let deviceCode = RGB_COVE_FADES[index][1];

        // Get current values for REDCOVE, GRNCOVE, BLUCOVE.
        let redLevel = $('#lblREDCOVE').val();
        let grnLevel = $('#lblGRNCOVE').val();
        let bluLevel = $('#lblBLUCOVE').val();
        
        if( commandCode === 'N' && deviceCode !== 'RGB') {
            $(`#${RGB_COVE_FADES[index][1]}COVE`).slider('value', 100);
            $(`#lbl${RGB_COVE_FADES[index][1]}COVE`).val(100);

            rgbLevelUpdate(RGB_COVE_FADES[index][0], `${RGB_COVE_FADES[index][1]}COVE`, 100);
        } else if(commandCode === 'F' && deviceCode !== 'RGB') {
            $(`#${RGB_COVE_FADES[index][1]}COVE`).slider('value', 0);
            $(`#lbl${RGB_COVE_FADES[index][1]}COVE`).val(0);

            sendCommand(`${RGB_COVE_FADES[index][0]}//${RGB_COVE_FADES[index][1]}COVE`);
        } else if( commandCode === 'N' && deviceCode === 'RGB') {
            $(`#${RGB_COVE_FADES[index][1]}COVE`).slider('value', 100);
            $(`#lbl${RGB_COVE_FADES[index][1]}COVE`).val(100);

            sendCommand(`${RGB_COVE_FADES[index][0]}//REDCOVE//${redLevel}`);
            sendCommand(`${RGB_COVE_FADES[index][0]}//GRNCOVE//${grnLevel}`);
            sendCommand(`${RGB_COVE_FADES[index][0]}//BLUCOVE//${bluLevel}`);
        }else if( commandCode === 'F' && deviceCode === 'RGB') {
            $(`#${RGB_COVE_FADES[index][1]}COVE`).slider('value', 0);
            $(`#lbl${RGB_COVE_FADES[index][1]}COVE`).val(0);

            sendCommand(`${RGB_COVE_FADES[index][0]}//RGBCOVE`);
        }
    });

    // Preset Cove ON/ OFF Buttons.
    $('.presetCove').on('click', (e) => {
        // Indentify button selected.
        let id = $(e.currentTarget).attr('id');

        // Get the array index value.
        let preset = parseInt(id[id.length - 1]);

        // Determine if command is ON or OFF.
        let commandCode = id.substring(6, 8);

        if (commandCode === 'ON') {
            // Set Red label and slider.
            $('#lblREDCOVE').val(PRESET_COVE_FADES[preset][1]);
            $('#REDCOVE').slider('value', PRESET_COVE_FADES[preset][1]);
            // Set Green label and slider.
            $('#lblGRNCOVE').val(PRESET_COVE_FADES[preset][2]);
            $('#GRNCOVE').slider('value', PRESET_COVE_FADES[preset][2]);
            // Set Blue label and slider.
            $('#lblBLUCOVE').val(PRESET_COVE_FADES[preset][3]);
            $('#BLUCOVE').slider('value', PRESET_COVE_FADES[preset][3]);
        
            sendCommand(`${PRESET_COVE_FADES[preset][4]}N//REDCOVE//${getNewCoveLevel(PRESET_COVE_FADES[preset][1])}`);
            sendCommand(`${PRESET_COVE_FADES[preset][4]}N//GRNCOVE//${getNewCoveLevel(PRESET_COVE_FADES[preset][2])}`);
            sendCommand(`${PRESET_COVE_FADES[preset][4]}N//BLUCOVE//${getNewCoveLevel(PRESET_COVE_FADES[preset][3])}`);
        } else if (commandCode === 'OF') {
            // Set Red label and slider.
            $('#lblREDCOVE').val(0);
            $('#REDCOVE').slider('value', 0);
            // Set Green label and slider.
            $('#lblGRNCOVE').val(0);
            $('#GRNCOVE').slider('value', 0);
            // Set Blue label and slider.
            $('#lblBLUCOVE').val(0);
            $('#BLUCOVE').slider('value', 0);

            sendCommand(`${PRESET_COVE_FADES[preset][5]}F//RGBCOVE`);
        }
    });

    // RGB Strobe Buttons.
    $('.strobeRGB').on('click', (e) => {
        // Determine which radio button was selected.
        let id = $("input:radio[name='selectRGBStrobeFadeDuration']:checked").attr('id');

        // Get the array index value.
        let index = parseInt(id[id.length - 1]);

        // Identify which strobe fire button was selected.
        let fireButton = $(e.currentTarget).attr('id');

        // Get DeviceCode from FireButton ID.
        let deviceCode = `${fireButton.substring(fireButton.length - 3)}COVE`;

        sendCommand(`LN//${deviceCode}//100`);
        // Add slight delay so lamp on command always arrives first to server.
        setTimeout(() => {
            sendCommand(`${RGB_STROBE_FADE_RATES[index]}F//${deviceCode}`);
        }, 10);
    });

});


/******************
* Get RGBCOVE levels.
******************/

// Sets R, G, B levels from individual sliders based on RGB Master level.
const rgbLevelUpdate = (rate, devCode, level) => {
    let newCoveLevel = getNewCoveLevel(level);

    if (rate === '')
        sendCommand(`0N//${devCode}//${newCoveLevel}`);
    else 
        sendCommand(`${rate}//${devCode}//${newCoveLevel}`);
};

// Overall R, G, B levels set by RGB Master slider.
const rgbMasterLevelUpdate = () => {
    // Get R, G, B slider values.
    let redLevel = $('#lblREDCOVE').val();
    let grnLevel = $('#lblGRNCOVE').val();
    let bluLevel = $('#lblBLUCOVE').val();
    
    sendCommand(`0N//REDCOVE//${getNewCoveLevel(redLevel)}`);
    sendCommand(`0N//GRNCOVE//${getNewCoveLevel(grnLevel)}`);
    sendCommand(`0N//BLUCOVE//${getNewCoveLevel(bluLevel)}`);
};

// Determines the actual cove level based on value of RGB Master.
const getNewCoveLevel = (coveLevel) => {
    let rgbMaster = $('#lblRGBCOVE').val();
    let newCoveLevel = coveLevel * (rgbMaster * 0.01);
    
    return Math.round(newCoveLevel);
};




/**************************************************************************************************
*
* White Cove Tab.
*
**************************************************************************************************/


/******************
* Called on page load to set button text.
******************/

// Set White cove button fade rates.
const setWhiteCoveFadesButtonText = () => {
    for(let i = 0; i < WHITE_COVE_FADES.length; i++) {
        let num = zeroPad(i, 2);
        let id = 'whiteFade_' + num;
        
        if(WHITE_COVE_FADES[i][1] === '')
            document.getElementById(id).textContent = `${WHITE_COVE_FADES[i][0]} WHT`;
        else
            document.getElementById(id).textContent = `${WHITE_COVE_FADES[i][0]} WHT ${WHITE_COVE_FADES[i][1]}%`;
    }
};

// Set White cove strobe button fade rates.
const setWhiteStrobeFadeValues = () => {
    for(let i = 0; i < WHT_STROBE_FADE_RATES.length; i++) {
        let num = zeroPad(i, 2);
        let id = 'whiteStrobeFadeLabel_' + num;
        
        document.getElementById(id).textContent = `${WHT_STROBE_FADE_RATES[i]} Sec`;
    }
};


/******************
* WHTCOVE Slider and buttons.
* WHITE Strobe Control.
* WHTZONE toggles.
******************/

$(() => {
    
    // WHTCOVE Buttons.
    $('.whiteCoveFade').on('click', (e) => {
        // Indentify button selected.
        let id = $(e.currentTarget).attr('id');

        // Get the array index value.
        let index = parseInt(id[id.length - 1]);
        let herculesCommand = WHITE_COVE_FADES[index][0];

        // Determine if command is ON or OFF.
        let commandCode = herculesCommand[herculesCommand.length - 1];
        
        if( commandCode === 'N' && WHITE_COVE_FADES[index][1] === '') {
            $('#WHTCOVE').slider('value', 100);
            $('#lblWHTCOVE').val(100);
            sendCommand(`${WHITE_COVE_FADES[index][0]}//WHTCOVE//100`);
        } else if(commandCode === 'F' && WHITE_COVE_FADES[index][1] === '') {
            $('#WHTCOVE').slider('value', 0);
            $('#lblWHTCOVE').val(0);
            sendCommand(`${WHITE_COVE_FADES[index][0]}//WHTCOVE`);
        } else if(WHITE_COVE_FADES[index][1] !== '') {
            $('#WHTCOVE').slider('value', WHITE_COVE_FADES[index][1]);
            $('#lblWHTCOVE').val(WHITE_COVE_FADES[index][1]);
            sendCommand(`${WHITE_COVE_FADES[index][0]}//WHTCOVE//${WHITE_COVE_FADES[index][1]}`);
        }
    });

    // WHTCOVE Strobe.
    $('#strobeWhite').click(() => {
        // Determine if command is ON or OFF.
        let id = $("input:radio[name='selectWhiteStrobeFadeDuration']:checked").attr('id');

        // Get the array index value.
        let index = parseInt(id[id.length - 1]);
        
        sendCommand('LN//WHTCOVE//100');
        // Add slight delay so lamp on command always arrives first to server.
        setTimeout(() => {
            sendCommand(`${WHT_STROBE_FADE_RATES[index]}F//WHTCOVE`);
        }, 10);
    });

    // WHTCOVE Zone Control, toggles zones on/ off.
    $('.checkboxWHTZone').on('click', (e) => {
        let id = $(e.currentTarget).attr('id');

        if($('#' + id).is(":checked")) {
            sendCommand(`SN//${id}`);
        } else {
            sendCommand(`SF//${id}`);
        }
    });

});




/**************************************************************************************************
*
* Spitz Star Machine Elevator Control & Lamps/ Switches Tab.
*
**************************************************************************************************/


/******************
* Elevator control.
* Star Machine Lamp toggles with 3N fade on/ 3F fade off.
* Star Machine Switch toggles with SN switch on/ SF switch off.
* Moon Phase Control.
******************/

$(() => {

    // Spitz Elevator Control.
    $('.elevatorControl').on('click', (e) => {
        // Indentify button selected.
        let id = $(e.currentTarget).attr('id');
        
        if( id !== 'LAT90') {
            sendCommand(`${id}//ELEV`);
        } else {
            sendCommand('PS=90//LAT//100');
        }
    });

    // Star Machine lamps ON/ OFF.
    $('.eccs3N').on('click', (e) => {
        // Indentify button selected.
        let $this = $(e.currentTarget);

        // Get Device Code from ID.
        let deviceCode = ($this.attr('id'));

        if($this.prop('checked') == true) {
            sendCommand(`3N//${deviceCode}//100`);
        } else if($this.prop('checked') == false) {
            sendCommand(`3F//${deviceCode}`);
        }
    });

    // Star Machine switches ON/ OFF
    $('.eccsSwitch').on('click', (e) => {
        // Indentify button selected.
        let $this = $(e.currentTarget);

        // Get Device Code from ID.
        let deviceCode = ($this.attr('id'));

        if($this.prop('checked') == true) {
            sendCommand(`SN//${deviceCode}`);
        } else if($this.prop('checked') == false) {
            sendCommand(`SF//${deviceCode}`);
        }
    });

    // Moon Phase Control.
    $('.moonPhase').on('click', (e) => {
        // Indentify button selected.
        let deviceCode = $(e.currentTarget).attr('id');

        sendCommand(`${deviceCode}`);
    });

});




/**************************************************************************************************
*
* Star Machine Motions Tab.
*
**************************************************************************************************/


/******************
* Called on page load to set Motion checkbox values.
******************/

const setMotionCheckboxValues = () => {

    // Create array with Star Machine axis motions used along with
    // user set values for enable/ disable at start. 
    const motions = [
        ['DAILY', DAILY_ENABLED],
        ['LAT', LAT_ENABLED],
        ['ANN', ANN_ENABLED],
        ['HEAD', HEAD_ENABLED],
        ['PREC', PREC_ENABLED]
    ];

    for(let i = 0; i < motions.length; i++) {
        let axis = motions[i][0];

        if(motions[i][1]) {
            $(`#checkbox${motions[i][0]}`).prop('checked', true);
        } else {
            $(`#checkbox${motions[i][0]}`).prop('checked', false);
            $(`#stop${motions[i][0]}`).prop('disabled', true);
        }
    }

}


/******************
* Daily Motion preset position buttons.
* Star Motion Control - Slider, Enable/ Disable checkbox, and Stop buttons.
******************/

$(() => {

    //  Motion slider creation and initial enable/ disable setting.
    $('#DAILY').slider({ disabled: !DAILY_ENABLED });
    $('#LAT').slider({ disabled: !LAT_ENABLED });
    $('#ANN').slider({ disabled: !ANN_ENABLED });
    $('#HEAD').slider({ disabled: !HEAD_ENABLED });
    $('#PREC').slider({ disabled: !PREC_ENABLED });

    // Daily Preset Hours buttons.
    $('.dailyPreset').on('click', (e) => {
        // Indentify button selected.
        let id = $(e.currentTarget).attr('id');

        // Determine hour preset value.
        let hours = id.substring(5, 7);

        sendCommand(`DP=//${hours}:00:00.00`);
    });

    // Star Machine Motion checkbox to toggle slider enable/ disable.
    $('.checkboxMotion').on('change', (e) => {
        // Indentify button selected.
        let $this = $(e.currentTarget);
        
        // Get ID of checkbox selected.
        let id = $this.attr('id');
        // Get Star Machine motion from checkbox ID.
        let motion = id.slice(8);

        if($this.prop('checked')) {
            $(`#${motion}`).slider('enable');
            $(`#stop${motion}`).prop('disabled', false);
        } else {
            $(`#${motion}`).slider('disable');
            $(`#stop${motion}`).prop('disabled', true);
        }
    });

    // Motion vertical slider common code.
    $('.motion-slider').slider({
        orientation: 'vertical',
        range: 'min',
        min: -100,
        max: 100,
        step: 5,
        value: 0,
        slide: function(e, ui) {
            let motion = this.id;

            $(`#lbl${motion}`).val(ui.value);
            sendCommand(`RT=${parseInt(ui.value)}//${motion}`);
        }
    });

    $('.motionSTOP').on('click', (e) => {
        // Indentify button selected.
        let id = $(e.currentTarget).attr('id');

        // Get Star Machine motion selected.
        let motion = id.slice(4);
        // Set motion slider and label to '0'.
        $(`#lbl${motion}`).val(0);
        $(`#${motion}`).slider('value', 0);

        sendCommand(`RT=0//${motion}`);
    });

});




/**************************************************************************************************
*
* Hercules Remote Tab.
*
**************************************************************************************************/


/******************
* Called on page load to set Hercules Command button and Hercules Show button text.
******************/

// Hercules Command string and button text.
const HERC_REMOTE_COMMANDS = [
    [ '\~FN', '(F)ile (N)ew' ],
    [ '\~MR', 'Set (M)ode (R)ealtime' ],
    [ '\~ME', 'Set (M)ode (E)didt Program' ],
    [ '\~MF', 'Set (M)ode (F)ollow' ],
    [ '\~MC', 'Set (M)ode (C)lock Drive' ],
    [ '\~MS', 'Set (M)ode (S)tandby' ],
    [ '\~Q#', 'Execute Next Cue Block' ],
    [ '\~Q-', 'Reverse to Previous Cue Block' ]
];

// Set Hercules Command button text.
const setHercCommandButtonText = () => {

    for(let i = 0; i < HERC_REMOTE_COMMANDS.length; i++) {
        let num = zeroPad(i, 2);
        let id = 'hercRemote' + num;
        
        document.getElementById(id).textContent = HERC_REMOTE_COMMANDS[i][1];
    }

};

// Set Preset button text.
const setHercShowButtonText = () => {
    for(let i = 0; i < SHOW_FILENAME.length; i++) {
        let num = zeroPad(i, 2);
        let id = 'hercShow' + num;

        document.getElementById(id).textContent = SHOW_FILENAME[i];
    }
};


/******************
* Hercules remote control commands.
* Load showfile buttons.
******************/

$(() => {

    // Hercules Remote Command buttons.
    $('.eccsRemote').on('click', (e) => {
        let $this = $(e.currentTarget);
        let id = $this.attr('id').slice(-2);
        let hercCommand = HERC_REMOTE_COMMANDS[parseInt(id)][0];

        sendCommand(hercCommand);
    });

    // Load showfiles.
    $('.eccsLoadShow').on('click', (e) => {
        let $this = $(e.currentTarget);
        let id = $this.attr('id').slice(-2);
        let filename = SHOW_FILENAME[parseInt(id)];

        sendCommand('\~FO' + filename);
    });

});
