// Updated 05June22.

/**************************************************************************************************
*
* NavBar and all Tabs.
*
**************************************************************************************************/


// Version Label.
const setVersionText = () => {
    document.getElementById('versionLabel').textContent = '05 June 2022';
};

// Create XMLHttpRequests to send command strings to Java server via http protocol.
const sendCommand = (deviceCommand, deviceCode, deviceParameter) => {
    let commandString = '';

    if(deviceCode === '' && deviceParameter === '') {
        commandString = deviceCommand;
    } else if(deviceCode !== '' && deviceParameter === '') {
        commandString = `${deviceCommand}//${deviceCode}`;
    } else {
        commandString = `${deviceCommand}//${deviceCode}//${deviceParameter}`;
    }

    const req = new XMLHttpRequest();
       
    req.open('POST', '/hercCommand', true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.send(`herc=${commandString}`);
    console.log(commandString);
};

const sendVideoCommand = (commandString) => {
    const req = new XMLHttpRequest();
       
    req.open('POST', '/videoCommand', true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.send(`video=${commandString}`);
    console.log(`videoCommand: ${commandString}`);
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
            sendCommand('AUTOSYS', '', '');
        } else if($this.prop('checked') == false) {
            sendCommand('MANSYS', '', '');
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
        //slide: function(e, ui) {
        slide: function (e, ui) {
            // Indentify slider selected.
            let color = this.id;

            // Get slider value.
            $(`#lbl${color}`).val(ui.value);

            // Identify the FX1 bank being used.
            let bankId = '';

            if(color.substr(-3) === 'FX1') {
                bankId = 'RGBFX1';
            } else if(color.substr(-3) === 'FX2') {
                bankId = 'RGBFX2';
            } else if(color.substr(-3) === 'FX3') {
                bankId = 'RGBFX3'
            } else {
                bankId = 'RGBCOVE';
            }
        
            rgbLevelUpdate(bankId, '0N', color, parseInt(ui.value));
        }
    });

    // Cove Bank Msster sliders.
    $('.masterSlider').slider({
        orientation: 'horizontal',
        range: 'min',
        min: 0,
        max: 100,
        step: 1,
        value: 100,
        slide: function (e, ui) {
            // Indentify slider selected.
            let master = this.id;

            // Get slider value.
            $(`#lbl${master}`).val(ui.value);

            // Get bank parameters for update function.
            let bank = [];
            if(master === 'RGBCOVE') {
                bank = ['RGBCOVE', 'REDCOVE', 'GRNCOVE', 'BLUCOVE'];
            } else if(master === 'RGBFX1')  {
                bank = ['RGBFX1', 'RFX1', 'GFX1', 'BFX1'];
            }  else if(master === 'RGBFX2')  {
                bank = ['RGBFX2', 'RFX2', 'GFX2', 'BFX2'];
            } else if(master === 'RGBFX3')  {
                bank = ['RGBFX3', 'RFX3', 'GFX3', 'BFX3'];
            }

            rgbMasterLevelUpdate(bank[0], bank[1], bank[2], bank[3]);
        }
    });

});

// Overall R, G, B levels set by RGB Master slider.
const rgbMasterLevelUpdate = (bank, redControl, grnControl, bluControl) => {
    // Get R, G, B slider values.
    let redLevel = $(`#lbl${redControl}`).val();
    let grnLevel = $(`#lbl${grnControl}`).val();
    let bluLevel = $(`#lbl${bluControl}`).val();

    rgbLevelUpdate(bank, '0N', redControl, redLevel);
    rgbLevelUpdate(bank, '0N', grnControl, grnLevel);
    rgbLevelUpdate(bank, '0N', bluControl, bluLevel);
};

// Determines the actual cove level based on value of RGB Master.
const getNewCoveLevel = (bank, coveLevel) => {
    let bankMaster = $(`#lbl${bank}`).val();
    let newCoveLevel = coveLevel * (bankMaster * 0.01);
    
    return Math.round(newCoveLevel);
};

// Sets R, G, B levels from individual sliders based on RGB Master level.
const rgbLevelUpdate = (bank, rate, devCode, level) => {
    let newCoveLevel = getNewCoveLevel(bank, level);

    if (rate === '')
        sendCommand('0N', devCode, newCoveLevel);
    else 
        sendCommand(rate, devCode, newCoveLevel);
};




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
        
        document.getElementById(id).textContent = `${RGB_COVE_FADES[i][0]} ${RGB_COVE_FADES[i][2]}`;
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
* RECDCOVE, GRNCOVE, BLUCOVE, RGBCOVE Buttons.
* Preset Buttons.
* RGB Strobe control.
******************/

$(() => {

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
            $(`#${RGB_COVE_FADES[index][1]}`).slider('value', 100);
            $(`#lbl${RGB_COVE_FADES[index][1]}`).val(100);

            rgbLevelUpdate('RGBCOVE', RGB_COVE_FADES[index][0], `${RGB_COVE_FADES[index][1]}`, 100);
        } else if(commandCode === 'F' && deviceCode !== 'RGB') {
            $(`#${RGB_COVE_FADES[index][1]}`).slider('value', 0);
            $(`#lbl${RGB_COVE_FADES[index][1]}`).val(0);

            sendCommand(RGB_COVE_FADES[index][0], `${RGB_COVE_FADES[index][1]}`, '');
        } else if( commandCode === 'N' && deviceCode === 'RGB') {
            $(`#${RGB_COVE_FADES[index][1]}`).slider('value', 100);
            $(`#lbl${RGB_COVE_FADES[index][1]}`).val(100);

            sendCommand(RGB_COVE_FADES[index][0], 'REDCOVE', redLevel);
            sendCommand(RGB_COVE_FADES[index][0], 'GRNCOVE', grnLevel);
            sendCommand(RGB_COVE_FADES[index][0], 'BLUCOVE', bluLevel);
        }else if( commandCode === 'F' && deviceCode === 'RGB') {
            $(`#${RGB_COVE_FADES[index][1]}`).slider('value', 0);
            $(`#lbl${RGB_COVE_FADES[index][1]}`).val(0);

            sendCommand(RGB_COVE_FADES[index][0], 'RGBCOVE', '');
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
        
            sendCommand(`${PRESET_COVE_FADES[preset][4]}N`, 'REDCOVE', getNewCoveLevel('RGBCOVE', PRESET_COVE_FADES[preset][1]));
            sendCommand(`${PRESET_COVE_FADES[preset][4]}N`, 'GRNCOVE', getNewCoveLevel('RGBCOVE', PRESET_COVE_FADES[preset][2]));
            sendCommand(`${PRESET_COVE_FADES[preset][4]}N`, 'BLUCOVE', getNewCoveLevel('RGBCOVE', PRESET_COVE_FADES[preset][3]));
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

            sendCommand(`${PRESET_COVE_FADES[preset][5]}F`, 'RGBCOVE', '');
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

        sendCommand('LN', deviceCode, '100');
        // Add slight delay so lamp on command always arrives first to server.
        setTimeout(() => {
            sendCommand(`${RGB_STROBE_FADE_RATES[index]}F`, deviceCode, '');
        }, 10);
    });

});




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
            sendCommand(`${WHITE_COVE_FADES[index][0]}`, `WHTCOVE`, `100`);
        } else if(commandCode === 'F' && WHITE_COVE_FADES[index][1] === '') {
            $('#WHTCOVE').slider('value', 0);
            $('#lblWHTCOVE').val(0);
            sendCommand(`${WHITE_COVE_FADES[index][0]}`, `WHTCOVE`, '');
        } else if(WHITE_COVE_FADES[index][1] !== '') {
            $('#WHTCOVE').slider('value', WHITE_COVE_FADES[index][1]);
            $('#lblWHTCOVE').val(WHITE_COVE_FADES[index][1]);
            sendCommand(`${WHITE_COVE_FADES[index][0]}`, `WHTCOVE`, `${WHITE_COVE_FADES[index][1]}`);
        }
    });

    // WHTCOVE Strobe.
    $('#strobeWhite').click(() => {
        // Determine if command is ON or OFF.
        let id = $("input:radio[name='selectWhiteStrobeFadeDuration']:checked").attr('id');

        // Get the array index value.
        let index = parseInt(id[id.length - 1]);
        
        sendCommand('LN', 'WHTCOVE', '100');
        // Add slight delay so lamp on command always arrives first to server.
        setTimeout(() => {
            sendCommand(`${WHT_STROBE_FADE_RATES[index]}F`, `WHTCOVE`, '');
        }, 10);
    });

    // WHTCOVE Zone Control, toggles zones on/ off.
    $('.checkboxWHTZone').on('click', (e) => {
        let id = $(e.currentTarget).attr('id');

        if($('#' + id).is(":checked")) {
            sendCommand(`SN`, `${id}`, '');
        } else {
            sendCommand(`SF`, `${id}`, '');
        }
    });

});




/**************************************************************************************************
*
* RGB FX1 Tab.
*
**************************************************************************************************/


// Sets RFX1, GFX1, BFX1 levels from individual sliders based on RGBFX1 Master level.
const rgbFX1LevelUpdate = (devCode, level) => {
    let newFX1Level = getNewFX1Level(level);

    sendCommand('0N', devCode, newFX1Level);
};


/******************
* FX1 parameter set functions.
******************/

$(() => {
    // FX1 Bulbs On slider
    $('.fxBulbsOnOffSlider').slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 99,
        step: 1,
        //value: 1,
        slide: function (e, ui) {
            // Indentify slider selected.
            let id = this.id;

            // Get slider value.
            $(`#lbl${id}Value`).val(ui.value);
        }
    });

    $("#FX1BulbsOn").slider({
        value: 1,
    });
    
    //// FX1 Bulbs Off slider
    $("#fX1BulbsOff").slider({
        value: 3,
    });
    
    // FX1 Bulb Pattern ('BPxx,yy') set.
    $("#fx1BulbPatternSet").click(() => {
        let bulbsOn = $("#lblFX1BulbsOnValue").val();
        let bulbsOff = $("#lblFX1BulbsOffValue").val();
        let deviceCode =$("input:radio[name='fx1DeviceSelect']:checked").val();
    
        sendCommand(`BP${bulbsOn},${bulbsOff}`, deviceCode, '');
    });
    
    // FX1 Speed Control slider.
    $("#fX1Speed").slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 120,
        step: 1,
        value: 5,
        slide: (event, ui) => {
            $("#lblFX1SpeedValue").val(ui.value);
        }
    });
    
    // FX1 Speed ('BD=xxx) set.
    $("#fx1SpeedSet").click(() => {
        let fx1Speed = $("#lblFX1SpeedValue").val();
        let deviceCode =$("input:radio[name='fx1DeviceSelect']:checked").val();
    
        sendCommand(`BD=${fx1Speed}`, deviceCode, '');            
    });
    
    // FX1 Bulb Enable Start slider
    $(".fxBulbEnableDisable").slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 64,
        step: 1,
        slide: function (e, ui) {
            // Indentify slider selected.
            let id = this.id;

            // Get slider value.
            $(`#lbl${id}Value`).val(ui.value);
        }
    });

    $("#fx1BulbEnableStart").slider({
        value: 1
    });
    
    // FX1 Bulb Enable End slider
    $("#fx1BulbEnableEnd").slider({
        value: 64
    });
    
    // FX1 Bulb Enable ('Exx,yy') set.
    $("#fx1BulbEnableSet").click(() => {
        let enableStart = $("#lblFX1BulbEnableStartValue").val();
        let enableEnd = $("#lblFX1BulbEnableEndValue").val();
        let deviceCode =$("input:radio[name='fx1DeviceSelect']:checked").val();
    
        sendCommand(`E${enableStart},${enableEnd}`, deviceCode, '');
    });
    
    // FX1 Bulb Disable Start slider
    $("#fx1BulbDisableStart").slider({
        value: 0
    });
    
    // FX1 Bulb Disable End slider
    $("#fx1BulbDisableEnd").slider({
        value: 0
    });
    
    // FX1 Bulb Disable ('Dxx,yy') set.
    $("#fx1BulbDisableSet").click(() => {
        let disableStart = $("#lblFX1BulbDisableStartValue").val();
        let disableEnd = $("#lblFX1BulbDisableEndValue").val();
        let deviceCode =$("input:radio[name='fx1DeviceSelect']:checked").val();
    
        sendCommand(`D${disableStart},${disableEnd}`, deviceCode, '');
    });
    
    // FX1 Chase Pattern select slider
    $("#fX1ChasePattern").slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 7,
        step: 1,
        value: 0,
        slide: (event, ui) => {
            $("#lblFX1ChasePattern").val(ui.value);
            
            if($("#lblFX1ChasePattern").val() === '0') {
                $("#lblFX1ChasePatternText").text("Stop Chase");
            } else if($("#lblFX1ChasePattern").val() === '1') {
                $("#lblFX1ChasePatternText").text("Circle from Left");
            } else if($("#lblFX1ChasePattern").val() === '2') {
                $("#lblFX1ChasePatternText").text("Circle from Right");
            } else if($("#lblFX1ChasePattern").val() === '3') {
                $("#lblFX1ChasePatternText").text("Center Out Chase");
            } else if($("#lblFX1ChasePattern").val() === '4') {
                $("#lblFX1ChasePatternText").text("Center In Chase");
            } else if($("#lblFX1ChasePattern").val() === '5') {
                $("#lblFX1ChasePatternText").text("8 Segment Chase");
            } else if($("#lblFX1ChasePattern").val() === '6') {
                $("#lblFX1ChasePatternText").text("Popcorn");
            } else if($("#lblFX1ChasePattern").val() === '7') {
                $("#lblFX1ChasePatternText").text("Sunrise / Sunset");
            }
        }
    });
    
    // FX1 Chase Patern set button.
    $("#fx1ChaseSet").click(() => {
        let chaseSelected = $('#fX1ChasePattern').slider("option", "value");
        let deviceCode = $("input:radio[name='fx1DeviceSelect']:checked").val();
    
        sendCommand(`CP${chaseSelected}`, deviceCode, '');
    });
    
    // FX1 Initialize button.
    $("#fx1Initialize").click(() => {
        let deviceCode = $("input:radio[name='fx1DeviceSelect']:checked").val();
    
        sendCommand('INIT', deviceCode, '');
    });
    
    // FX1 Projector Home button.
    $("#fx1ProjectorHome").click(() => {
        let deviceCode = $("input:radio[name='fx1DeviceSelect']:checked").val();
        
        //Reset to default values.
        // Set to default - BP1,3.
        $("#fX1BulbsOn").slider('value', 1);
        $("#lblFX1BulbsOnValue").text(1);
        $("#fX1BulbsOff").slider('value', 3);
        $("#lblFX1BulbsOffValue").text(3);
        // Set to default - BD=5.
        $("#fX1Speed").slider('value', 5);
        $("#lblFX1SpeedValue").text(5);
        // Set to default - E1,64.
        $("#fX1BulbEnableStart").slider('value', 1);
        $("#lblFX1BulbEnableStartValue").text(1);
        $("#fX1BulbEnableEnd").slider('value', 64);
        $("#lblFX1BulbEnableEndValue").text(64);
        // Set to default - D0,0.
        $("#fx1BulbDisableStart").slider('value', 0);
        $("#lblFX1BulbDisableStartValue").text(0);
        $("#fx1BulbDisableEnd").slider('value', 0);
        $("#lblFX1BulbDisableEndValue").text(0);
        // Set to default - CP0..
        $('#fX1ChasePattern').slider('value', 0);
        $("#lblFX1ChasePattern").text(0);
        $("#lblFX1ChasePatternText").text("Stop Chase");
    
        sendCommand('PH', deviceCode, '');
    });
});




/**************************************************************************************************
*
* FX Quick Chase Tab.
*
**************************************************************************************************/


/******************
* Called on page load to set Motion checkbox values.
******************/

const setFXQuickChaseButtonText = () => {

    for(let fxBank = 1; fxBank <= 3; fxBank++) {
        for(let i = 0; i < FX1_QUICK_CHASES.length; i++) {
            let num = zeroPad(i, 2);
            let id = `FX${fxBank}QuickChaseON_${num}`;
            
            if(fxBank == 1) {
                document.getElementById(id).textContent = `${FX1_QUICK_CHASES[i][0]}`;
            } else if(fxBank == 2) {
                document.getElementById(id).textContent = `${FX2_QUICK_CHASES[i][0]}`;
            } else if(fxBank == 3) {
                document.getElementById(id).textContent = `${FX3_QUICK_CHASES[i][0]}`;
            }
        }
    
        for(let i = 0; i < FX1_QUICK_CHASES.length; i++) {
            let num = zeroPad(i, 2);
            let id = `FX${fxBank}QuickChaseOF_${num}`;
            
            if(fxBank == 1) {
                document.getElementById(id).textContent = `${FX1_QUICK_CHASES[i][1]}`;
            } else if(fxBank == 2) {
                document.getElementById(id).textContent = `${FX2_QUICK_CHASES[i][1]}`;
            } else if(fxBank == 3) {
                document.getElementById(id).textContent = `${FX3_QUICK_CHASES[i][1]}`;
            }
        }
    }
};


/******************
* FX Quick Chase buttons.
******************/

$(() => {

    // FX Projector Home buttons.
    $('.phButton').on('click', (e) => {
        // Indentify button selected.
        let id = $(e.currentTarget).attr('id');
        // Get the FX bank from button id
        let fxBank = id.substring(0,3);

        sendCommand('PH', `RGB${fxBank}`, '');
    });

    // FX Quick Chase On/ Off buttons.
    $('.fxQuickChaseButton').on('click', (e) => {
        // Indentify button selected.
        let id = $(e.currentTarget).attr('id');

        // Get the array index value from button id.
        let index = parseInt(id[id.length - 1]);
        // Get the FX bank from button id
        let fxBank = id.substring(0,3);
        // Determine if command is ON or OFF.
        let fadeDirection = id.charAt(14);
        // Create holder for entire FX bank array.
        let FX = [,,];

        switch(fxBank) {
            case 'FX1':
                FX = FX1_QUICK_CHASES;
                break;
            case 'FX2':
                FX = FX2_QUICK_CHASES;
                break;
            case 'FX3':
                FX = FX3_QUICK_CHASES;
                break;
        }

        // Get FX values from array.
        let bp_x = FX[index][2];
        let bp_y = FX[index][3];
        let bd = FX[index][4];
        let cp = FX[index][5];
        let level = FX[index][6];
        let deviceCode = FX[index][7];
    
        if(fadeDirection === 'N') {
            sendCommand(`BP${bp_x},${bp_y}`, deviceCode, '');
            sendCommand(`BD=${bd}`, deviceCode, '');
            sendCommand(`CP${cp}`, deviceCode, '');
            sendCommand('LN', deviceCode, level);
        } else if(fadeDirection === 'F') {
            sendCommand('LF', deviceCode, '');
            sendCommand('PH', deviceCode, '');
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
            sendCommand(`${id}`, 'ELEV', '');
        } else {
            sendCommand('PS=90', 'LAT', '100');
        }
    });

    // Star Machine lamps ON/ OFF.
    $('.eccs3N').on('click', (e) => {
        // Indentify button selected.
        let $this = $(e.currentTarget);

        // Get Device Code from ID.
        let deviceCode = ($this.attr('id'));

        if($this.prop('checked') == true) {
            sendCommand('3N', deviceCode, '100');
        } else if($this.prop('checked') == false) {
            sendCommand('3F', deviceCode, '');
        }
    });

    // Star Machine switches ON/ OFF
    $('.eccsSwitch').on('click', (e) => {
        // Indentify button selected.
        let $this = $(e.currentTarget);

        // Get Device Code from ID.
        let deviceCode = ($this.attr('id'));

        if($this.prop('checked') == true) {
            sendCommand('SN', deviceCode, '');
        } else if($this.prop('checked') == false) {
            sendCommand('SF', deviceCode, '');
        }
    });

    // Moon Phase Control.
    $('.moonPhase').on('click', (e) => {
        // Indentify button selected.
        let deviceCode = $(e.currentTarget).attr('id');

        sendCommand(deviceCode, '', '');
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

        sendCommand('DP=', `${hours}:00:00.00`, '');
    });

    // Latitude Preset Degrees buttons.
    $('.latitudePreset').on('click', (e) => {
        // Indentify button selected.
        let id = $(e.currentTarget).attr('id');

        // Determine degrees preset value.
        let degrees = id.substring(8);

        sendCommand(`PS=${degrees}`, 'LAT', '100');
    });

    // Heading Preset Degrees buttons.
    $('.headingPreset').on('click', (e) => {
        // Indentify button selected.
        let id = $(e.currentTarget).attr('id');

        // Determine degrees preset value.
        let degrees = id.substring(7);

        sendCommand(`PS=${degrees}`, 'HEAD', '100');
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
            sendCommand(`RT=${parseInt(ui.value)}`, motion, '');
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

        sendCommand('RT=0', motion, '');
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
    [ '\~ME', 'Set (M)ode (E)dit Program' ],
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

        sendCommand(hercCommand, '', '');
    });

    // Load showfiles.
    $('.eccsLoadShow').on('click', (e) => {
        let $this = $(e.currentTarget);
        let id = $this.attr('id').slice(-2);
        let filename = SHOW_FILENAME[parseInt(id)];

        sendCommand(`\~FO${filename}`, '', '');
    });

});