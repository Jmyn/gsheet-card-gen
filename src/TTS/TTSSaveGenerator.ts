import fs from "fs";
import path from "path";
import _ from "lodash";

const TABLETOP_SIMULATOR_SAVE_TEMPLATE = {
  "SaveName": "Test",
  "GameMode": "None",
  "Gravity": 0.5,
  "PlayArea": 0.5,
  "Date": "3/1/2020 8:26:33 PM",
  "Table": "Table_RPG",
  "Sky": "Sky_Field",
  "Note": "",
  "Rules": "",
  "XmlUI": "",
  "LuaScript": "",
  "LuaScriptState": "",
  "Grid": {
    "Type": 0,
    "Lines": false,
    "Color": {
      "r": 0.0,
      "g": 0.0,
      "b": 0.0
    },
    "Opacity": 0.75,
    "ThickLines": false,
    "Snapping": false,
    "Offset": false,
    "BothSnapping": false,
    "xSize": 2.0,
    "ySize": 2.0,
    "PosOffset": {
      "x": 0.0,
      "y": 1.0,
      "z": 0.0
    }
  },
  "Lighting": {
    "LightIntensity": 0.5880015,
    "LightColor": {
      "r": 1.0,
      "g": 0.9804,
      "b": 0.8902
    },
    "AmbientIntensity": 1.26799989,
    "AmbientType": 0,
    "AmbientSkyColor": {
      "r": 0.5,
      "g": 0.5,
      "b": 0.5
    },
    "AmbientEquatorColor": {
      "r": 0.5,
      "g": 0.5,
      "b": 0.5
    },
    "AmbientGroundColor": {
      "r": 0.5,
      "g": 0.5,
      "b": 0.5
    },
    "ReflectionIntensity": 1.0,
    "LutIndex": 0,
    "LutContribution": 1.0,
    "LutURL": ""
  },
  "Hands": {
    "Enable": true,
    "DisableUnused": false,
    "Hiding": 0,
    "HandTransforms": [
      {
        "Color": "Red",
        "Transform": {
          "posX": -15.1107779,
          "posY": 4.81034231,
          "posZ": -20.1076221,
          "rotX": 0.0,
          "rotY": 0.0,
          "rotZ": 0.0,
          "scaleX": 11.7719889,
          "scaleY": 9.174497,
          "scaleZ": 4.87123871
        }
      },
      {
        "Color": "Yellow",
        "Transform": {
          "posX": -30.2150211,
          "posY": 4.81034231,
          "posZ": 10.17524,
          "rotX": 0.0,
          "rotY": 90.0,
          "rotZ": 0.0,
          "scaleX": 11.6554575,
          "scaleY": 9.174497,
          "scaleZ": 4.9199667
        }
      },
      {
        "Color": "Purple",
        "Transform": {
          "posX": 30.25118,
          "posY": 4.81034231,
          "posZ": 9.59069252,
          "rotX": 0.0,
          "rotY": 270.0,
          "rotZ": 0.0,
          "scaleX": 11.65545,
          "scaleY": 9.174497,
          "scaleZ": 4.9199667
        }
      },
      {
        "Color": "Blue",
        "Transform": {
          "posX": 15.4749184,
          "posY": 4.81034231,
          "posZ": 19.8365288,
          "rotX": 0.0,
          "rotY": 179.8,
          "rotZ": 0.0,
          "scaleX": 11.7720051,
          "scaleY": 9.174497,
          "scaleZ": 4.871257
        }
      },
      {
        "Color": "White",
        "Transform": {
          "posX": 15.196126,
          "posY": 4.81034231,
          "posZ": -20.1400986,
          "rotX": 0.0,
          "rotY": 0.0,
          "rotZ": 0.0,
          "scaleX": 11.7719755,
          "scaleY": 9.17449951,
          "scaleZ": 4.87123871
        }
      },
      {
        "Color": "Green",
        "Transform": {
          "posX": -15.1927767,
          "posY": 4.81034231,
          "posZ": 19.787817,
          "rotX": 0.0,
          "rotY": 180.0,
          "rotZ": 0.0,
          "scaleX": 11.7719755,
          "scaleY": 9.174497,
          "scaleZ": 4.87123871
        }
      },
      {
        "Color": "Pink",
        "Transform": {
          "posX": 30.10358,
          "posY": 4.81034231,
          "posZ": -8.449126,
          "rotX": 0.0,
          "rotY": 270.0,
          "rotZ": 0.0,
          "scaleX": 11.6554461,
          "scaleY": 9.174497,
          "scaleZ": 4.9199667
        }
      },
      {
        "Color": "Orange",
        "Transform": {
          "posX": -30.247818,
          "posY": 4.81034231,
          "posZ": -8.822588,
          "rotX": 0.0,
          "rotY": 90.0,
          "rotZ": 0.0,
          "scaleX": 11.6554613,
          "scaleY": 9.174497,
          "scaleZ": 4.9199667
        }
      }
    ]
  },
  "Turns": {
    "Enable": false,
    "Type": 0,
    "TurnOrder": [],
    "Reverse": false,
    "SkipEmpty": false,
    "DisableInteractions": false,
    "PassTurns": true
  },
  "ObjectStates": [

  ],
  "DecalPallet": [],
  "TabStates": {
    "0": {
      "title": "Rules",
      "body": "",
      "color": "Grey",
      "visibleColor": {
        "r": 0.5,
        "g": 0.5,
        "b": 0.5
      },
      "id": 0
    },
    "1": {
      "title": "White",
      "body": "",
      "color": "White",
      "visibleColor": {
        "r": 1.0,
        "g": 1.0,
        "b": 1.0
      },
      "id": 1
    },
    "2": {
      "title": "Brown",
      "body": "",
      "color": "Brown",
      "visibleColor": {
        "r": 0.443,
        "g": 0.231,
        "b": 0.09
      },
      "id": 2
    },
    "3": {
      "title": "Red",
      "body": "",
      "color": "Red",
      "visibleColor": {
        "r": 0.856,
        "g": 0.1,
        "b": 0.094
      },
      "id": 3
    },
    "4": {
      "title": "Orange",
      "body": "",
      "color": "Orange",
      "visibleColor": {
        "r": 0.956,
        "g": 0.392,
        "b": 0.113
      },
      "id": 4
    },
    "5": {
      "title": "Yellow",
      "body": "",
      "color": "Yellow",
      "visibleColor": {
        "r": 0.905,
        "g": 0.898,
        "b": 0.172
      },
      "id": 5
    },
    "6": {
      "title": "Green",
      "body": "",
      "color": "Green",
      "visibleColor": {
        "r": 0.192,
        "g": 0.701,
        "b": 0.168
      },
      "id": 6
    },
    "7": {
      "title": "Blue",
      "body": "",
      "color": "Blue",
      "visibleColor": {
        "r": 0.118,
        "g": 0.53,
        "b": 1.0
      },
      "id": 7
    },
    "8": {
      "title": "Teal",
      "body": "",
      "color": "Teal",
      "visibleColor": {
        "r": 0.129,
        "g": 0.694,
        "b": 0.607
      },
      "id": 8
    },
    "9": {
      "title": "Purple",
      "body": "",
      "color": "Purple",
      "visibleColor": {
        "r": 0.627,
        "g": 0.125,
        "b": 0.941
      },
      "id": 9
    },
    "10": {
      "title": "Pink",
      "body": "",
      "color": "Pink",
      "visibleColor": {
        "r": 0.96,
        "g": 0.439,
        "b": 0.807
      },
      "id": 10
    },
    "11": {
      "title": "Black",
      "body": "",
      "color": "Black",
      "visibleColor": {
        "r": 0.25,
        "g": 0.25,
        "b": 0.25
      },
      "id": 11
    }
  },
  "VersionNumber": "v12.2.2"
};

const DECK_TEMPLATE = {
  "Name": "DeckCustom",
  "Transform": {
    "posX": 2.11731276E-05,
    "posY": 1.26030266,
    "posZ": -0.0002485558,
    "rotX": 2.867992E-07,
    "rotY": 179.9995,
    "rotZ": 180.0,
    "scaleX": 1.0,
    "scaleY": 1.0,
    "scaleZ": 1.0
  },
  "Nickname": "",
  "Description": "",
  "GMNotes": "",
  "ColorDiffuse": {
    "r": 0.713235259,
    "g": 0.713235259,
    "b": 0.713235259
  },
  "Locked": false,
  "Grid": true,
  "Snap": true,
  "IgnoreFoW": false,
  "Autoraise": true,
  "Sticky": true,
  "Tooltip": true,
  "GridProjection": false,
  "HideWhenFaceDown": false,
  "Hands": false,
  "SidewaysCard": false,
  "DeckIDs": [],
  "CustomDeck": {
    "1": {
      "FaceURL": "",
      "BackURL": "",
      "NumWidth": 10,
      "NumHeight": 6,
      "BackIsHidden": true,
      "UniqueBack": true
    }
  },
  "XmlUI": "",
  "LuaScript": "",
  "LuaScriptState": "",
  "ContainedObjects": [],
  "GUID": "ea3e5a"
};

const CARD_TEMPLATE = {
  "Name": "Card",
  "Transform": {
    "posX": 0.000508636236,
    "posY": 1.35078228,
    "posZ": 0.000467502454,
    "rotX": 359.759277,
    "rotY": 179.999878,
    "rotZ": 180.265335,
    "scaleX": 1.0,
    "scaleY": 1.0,
    "scaleZ": 1.0
  },
  "Nickname": "",
  "Description": "",
  "GMNotes": "",
  "ColorDiffuse": {
    "r": 0.713235259,
    "g": 0.713235259,
    "b": 0.713235259
  },
  "Locked": false,
  "Grid": true,
  "Snap": true,
  "IgnoreFoW": false,
  "Autoraise": true,
  "Sticky": true,
  "Tooltip": true,
  "GridProjection": false,
  "Hands": true,
  "CardID": 100,
  "SidewaysCard": false,
  "XmlUI": "",
  "LuaScript": "",
  "LuaScriptState": "",
  "ContainedObjects": [],
  "GUID": "3026be"
};

export class TTSSaveGenerator {

  static generateGUID(): string {
    const charList = 'abcdef0123456789';
    let guid = '';
    for (let i=0; i<6; i++) {
      guid += charList[Math.floor(Math.random() * charList.length)];
    }
    return guid;
  }

  static generateSave(saveName: string, saveFolder: string) {
    const saveObject: any | typeof TABLETOP_SIMULATOR_SAVE_TEMPLATE = Object.assign({}, _.cloneDeep(TABLETOP_SIMULATOR_SAVE_TEMPLATE));
    saveObject.SaveName = saveName;

    const fileNames = fs.readdirSync(saveFolder);
    const cardSheets = fileNames.filter((fileName) => fileName.endsWith('.png') && fileName.indexOf('-front-') >= 0).sort();
    console.log(`[DeckSheet] Card sheets `, cardSheets);
    saveObject.ObjectStates = cardSheets.map((cardSheet, deckIndex) => {
      const deckObject: any | typeof DECK_TEMPLATE = Object.assign({}, _.cloneDeep(DECK_TEMPLATE));
      const deckCardCount = parseInt(cardSheet.split('.')[0].split('-').slice(-1)[0]);
      deckObject.Name = 'DeckCustom';
      deckObject.Transform.posX += deckIndex * 2.5;
      deckObject.DeckIDs = Array.from(Array(deckCardCount), (e, i) => 100 + i);
      deckObject.CustomDeck["1"].FaceURL = `file:///${path.join(saveFolder, cardSheet)}`;
      deckObject.CustomDeck["1"].BackURL = `file:///${path.join(saveFolder, cardSheet).replace('-front-', '-back-')}`;
      deckObject.CustomDeck["1"].NumWidth = Math.min(10, deckCardCount);
      deckObject.CustomDeck["1"].NumHeight = Math.ceil(deckCardCount / 10);
      deckObject.GUID = this.generateGUID();
      const cardGUID = this.generateGUID();
      deckObject.ContainedObjects = deckObject.DeckIDs.map((cardId: number) => {
        const cardObject = Object.assign({}, _.cloneDeep(CARD_TEMPLATE));
        cardObject.CardID = cardId;
        cardObject.GUID = cardGUID;
        return cardObject;
      });
      return deckObject;
    });
    const saveJSON = JSON.stringify(saveObject);
    fs.writeFileSync(path.join(saveFolder, `TS_Save_${saveName}.json`), saveJSON, 'utf8');
    return;
  }
}