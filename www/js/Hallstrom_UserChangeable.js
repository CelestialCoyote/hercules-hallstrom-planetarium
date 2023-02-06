// Updated 05June22.

/**************************************************************************************************
*
* RGB Cove Tab.
*
* Only change code within the double quotes ''.
* DO NOT change any of the constant name values as it will break things . . .
*
**************************************************************************************************/

// Constant values to set button fade On/ Off rates, [FadeValue, DeviceCode, ButtonText].
const RGB_COVE_FADES = [
    ['4N', 'REDCOVE', 'RED'],                   // REDCOVE fade on.
    ['4F', 'REDCOVE', 'RED'],                   // REDCOVE fade off.
    ['4N', 'GRNCOVE', 'GRN'],                   // GRNCOVE fade on.
    ['4F', 'GRNCOVE', 'GRN'],                   // GRNCOVE fade off.
    ['4N', 'BLUCOVE', 'BLU'],                   // BLUCOVE fade on.
    ['4F', 'BLUCOVE', 'BLU'],                   // BLUCOVE fade off.
    ['4N', 'RGBCOVE', 'Master'],                // RGBCOVE fade on.
    ['4F', 'RGBCOVE', 'Master'],                // RGBCOVE fade off.
    ['90N', 'RGBCOVE', 'Master'],               // RGBCOVE long fade on.
    ['90F', 'RGBCOVE', 'Master']                // RGBCOVE long fade off.
];

// Preset button values, [ButtonName, Red%, Green%, Blue%, FadeOnTime, FadeOffTime].
const PRESET_COVE_FADES = [
    ['House', '60', '60', '60', '3', '3'],
    ['Day', '0', '0', '50', '5', '5'],
    ['Lt Poll', '20', '15', '0', '3', '1']
];

// Constant values to set REDCOVE, GRNCOVE, BLUCOVE strobe button fade rates.
const RGB_STROBE_FADE_RATES = [
    '0.0',                                      // RGBCOVE strobe fade rate 01.
    '0.1',                                      // RGBCOVE strobe fade rate 02.
    '0.5',                                      // RGBCOVE strobe fade rate 03.
    '1.0',                                      // RGBCOVE strobe fade rate 04.
    '1.5',                                      // RGBCOVE strobe fade rate 05.
    '3.0',                                      // RGBCOVE strobe fade rate 06.
    '5.0',                                      // RGBCOVE strobe fade rate 07.
    '10.0'                                      // RGBCOVE strobe fade rate 08.
];


/**************************************************************************************************
*
* White Cove Tab.
*
* Only change code within the double quotes ''.
* DO NOT change any of the constant name values as it will break things . . .
*
**************************************************************************************************/

// Constant values to set button fade On/ Off rates.
const WHITE_COVE_FADES = [
    ['4N', ''],                                 // WHTCOVE 4N on.
    ['4F', ''],                                 // WHTCOVE 4F off.
    ['90N', ''],                                // WHTCOVE 90N on.
    ['90F', ''],                                // WHTCOVE 90F off.
    ['3N', '10'],                               // WHTCOVE fade 3N on to 10%.
    ['3N', '25'],                               // WHTCOVE fade 3N on to 25%.
    ['3N', '50'],                               // WHTCOVE fade 3N on to 50%.
    ['3N', '75']                                // WHTCOVE fade 3N on to 75%.
];

// Constant values to set WHTCOVE strobe button fade rates.
const WHT_STROBE_FADE_RATES = [
    '0.0',                                      // WHTCOVE strobe fade rate 01.
    '0.1',                                      // WHTCOVE strobe fade rate 02.
    '0.5',                                      // WHTCOVE strobe fade rate 03.
    '1.0',                                      // WHTCOVE strobe fade rate 04.
    '1.5',                                      // WHTCOVE strobe fade rate 05.
    '3.0',                                      // WHTCOVE strobe fade rate 06.
    '5.0',                                      // WHTCOVE strobe fade rate 07.
    '10.0'                                      // WHTCOVE strobe fade rate 08.
];


/**************************************************************************************************
*
* Quick Chase Tab.
*
* Only change code within the double quotes ''.
* DO NOT change any of the constant name values as it will break things . . .
*
**************************************************************************************************/

// FX1 chase pararmeters, (OnButtonText, OffButtonText, BPx, BPy, BD, CP, Level, DeviceCode).
const FX1_QUICK_CHASES = [
    ['CirL 3,3 RFX1', 'CirL 3,3 RFX1', '3', '3', '5', '1', '100', 'RFX1'],                      // FX1 Chase button 00.
    ['CirR 3,3 GFX1', 'CirR 3,3 GFX1', '3', '3', '5', '2', '100', 'GFX1'],                      // FX1 Chase button 01.
    ['CenO 4,4 BFX1', 'CenO 4,4 BFX1', '4', '4', '2', '3', '100', 'BFX1'],                      // FX1 Chase button 02.
    ['CenI 4,4 RFX1', 'CenI 4,4 RFX1', '4', '4', '2', '4', '100', 'RFX1'],                      // FX1 Chase button 03.
    ['Popcorn RGBFX1', 'Popcorn RGBFX1', '1', '1', '10', '6', '100', 'RGBFX1'],                 // FX1 Chase button 04.
    ['Popcorn RFX1', 'Popcorn RFX1', '1', '5', '9', '6', '75', 'RFX1'],                         // FX1 Chase button 05.
    ['CirL 99,0 GFX1', 'CirL 99,0 GFX1', '99', '0', '3', '1', '75', 'GFX1']                     // FX1 Chase button 06.
];

// FX2 chase pararmeters, (OnButtonText, OffButtonText, BPx, BPy, BD, CP, Level, DeviceCode).
const FX2_QUICK_CHASES = [
    ['CirL 3,3 RFX2', 'CirL 3,3 RFX2', '3', '3', '5', '1', '100', 'RFX2'],                      // FX2 Chase button 00.
    ['CirR 3,3 GFX2', 'CirR 3,3 GFX2', '3', '3', '5', '2', '100', 'GFX2'],                      // FX2 Chase button 01.
    ['CenO 4,4 BFX2', 'CenO 4,4 BFX2', '4', '4', '2', '3', '100', 'BFX2'],                      // FX2 Chase button 02.
    ['CenI 4,4 RFX2', 'CenI 4,4 RFX2', '4', '4', '2', '4', '100', 'RFX2'],                      // FX2 Chase button 03.
    ['Popcorn RGBFX2', 'Popcorn RGBFX2', '1', '1', '10', '6', '100', 'RGBFX2'],                 // FX2 Chase button 04.
    ['Popcorn RFX2', 'Popcorn RFX2', '1', '5', '9', '6', '75', 'RFX2'],                         // FX2 Chase button 05.
    ['CirL 99,0 GFX2', 'CirL 99,0 GFX2', '99', '0', '3', '1', '75', 'GFX2']                     // FX2 Chase button 06.
];

// FX3 chase pararmeters, (OnButtonText, OffButtonText, BPx, BPy, BD, CP, Level, DeviceCode).
const FX3_QUICK_CHASES = [
    ['CirL 3,3 RFX3', 'CirL 3,3 RFX3', '3', '3', '5', '1', '100', 'RFX3'],                      // FX3 Chase button 00.
    ['CirR 3,3 GFX3', 'CirR 3,3 GFX3', '3', '3', '5', '2', '100', 'GFX3'],                      // FX3 Chase button 01.
    ['CenO 4,4 BFX3', 'CenO 4,4 BFX3', '4', '4', '2', '3', '100', 'BFX3'],                      // FX3 Chase button 02.
    ['CenI 4,4 RFX3', 'CenI 4,4 RFX3', '4', '4', '2', '4', '100', 'RFX3'],                      // FX3 Chase button 03.
    ['Popcorn RGBFX3', 'Popcorn RGBFX3', '1', '1', '10', '6', '100', 'RGBFX3'],                 // FX3 Chase button 04.
    ['Popcorn RFX3', 'Popcorn RFX3', '1', '5', '9', '6', '75', 'RFX3'],                         // FX3 Chase button 05.
    ['CirL 99,0 GFX3', 'CirL 99,0 GFX3', '99', '0', '3', '1', '75', 'GFX3']                     // FX3 Chase button 06.
];


/**************************************************************************************************
*
* Star Machine Motion Tab.
*
* Only change code after the '=' sign.
* Should be 'true' if enabled at start, or 'false' for disabled at start.
* DO NOT change any of the constant name values as it will break things . . .
*
**************************************************************************************************/

const DAILY_ENABLED = true;
const LAT_ENABLED = true;
const ANN_ENABLED = false;
const HEAD_ENABLED = false;
const PREC_ENABLED = false;


/**************************************************************************************************
*
* Hercules Remote Control Tab.
*
* Only change code within the double quotes ''.
* DO NOT change any of the constant name values as it will break things . . .
*
**************************************************************************************************/

// Show list filenames.
const SHOW_FILENAME = [
    'KODACH~1',                                 // hercShow00 button.
    'GASIDEMO',                                 // hercShow01 button.
    'Prog0002',                                 // hercShow02 button.
    'Prog0003',                                 // hercShow03 button.
    'Prog0004',                                 // hercShow04 button.
    'Prog0005',                                 // hercShow05 button.
    'Prog0006',                                 // hercShow06 button.
    'Prog0007',                                 // hercShow07 button.
    'Prog0008',                                 // hercShow08 button.
    'Prog0009',                                 // hercShow09 button.
    'Prog0010',                                 // hercShow10 button.
    'Prog0011',                                 // hercShow11 button.
    'Prog0012',                                 // hercShow12 button.
    'Prog0013',                                 // hercShow13 button.
    'Prog0014',                                 // hercShow14 button.
    'Prog0015',                                 // hercShow15 button.
    'Prog0016',                                 // hercShow16 button.
    'Prog0017',                                 // hercShow17 button.
    'Prog0018',                                 // hercShow18 button.
    'Prog0019',                                 // hercShow19 button.
    'Prog0020',                                 // hercShow20 button.
    'Prog0021',                                 // hercShow21 button.
    'Prog0022',                                 // hercShow22 button.
    'Prog0023'                                  // hercShow23 button.
];
