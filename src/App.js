import './App.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GuideBox } from '@midasit-dev/moaui';
import * as Buttons from './Components/Buttons';
import { CheckGroup,Check } from '@midasit-dev/moaui';
import Sep from "@midasit-dev/moaui/Components/Separator";
import ExcelReader from './Components/ExcelReader';
import * as XLSX from 'xlsx';
import { Panel } from '@midasit-dev/moaui'
import { Typography } from '@midasit-dev/moaui'
import ComponentsPanelTypographyDropList from './Components/ComponentsPanelTypographyDropList';
import { Scrollbars } from '@midasit-dev/moaui'
import ComponentsDialogHelpIconButton from './Components/ComponentsDialogHelpIconButton'
import { midasAPI } from "./Function/Common";
import { VerifyUtil, VerifyDialog } from "@midasit-dev/moaui";


function App() {
// const [loadCombinations, setLoadCombinations] = useState([]);
const [selectedLoadCombinationIndex, setSelectedLoadCombinationIndex] = useState(-1);
const [typeDropdownIndex, setTypeDropdownIndex] = useState(-1); 
const [showDialog, setDialogShowState] = React.useState(false);
const [inputValue, setInputValue] = useState('');
const fileInputRef = useRef(null); 
const [loadCaseDropdownIndex, setLoadCaseDropdownIndex] = useState(-1);
const [signDropdownIndex, setSignDropdownIndex] = useState(null);
const [editingFactor, setEditingFactor] = useState({ index: null, factor: null });

  const toggleLoadCaseDropdown = (index) => {
    setLoadCaseDropdownIndex(loadCaseDropdownIndex === index ? -1 : index);
  };
  const toggleSignDropdown = (index) => {
    setSignDropdownIndex(signDropdownIndex === index ? null : index);
  };

  const handleLoadCaseOptionSelect = (loadCombinationIndex, loadCaseIndex, selectedLoadCase) => {
    const updatedLoadCombinations = [...loadCombinations];
    updatedLoadCombinations[loadCombinationIndex].loadCases[loadCaseIndex].loadCaseName = selectedLoadCase;
    setLoadCombinations(updatedLoadCombinations);
    setLoadCaseDropdownIndex(-1);
  };
  const handleSignOptionSelect = (combinationIndex, caseIndex, sign) => {
    const updatedLoadCombinations = [...loadCombinations];
    updatedLoadCombinations[combinationIndex].loadCases[caseIndex].sign = sign;
    setLoadCombinations(updatedLoadCombinations);
    setSignDropdownIndex(null);
  };
  const handleFactorClick = (index, factor) => {
    setEditingFactor({ index, factor });
  };

  const handleFactorChange = (combinationIndex, caseIndex, factor,e) => {
    const updatedLoadCombinations = [...loadCombinations];

  // Access the specific loadCase within loadCombinations
  const loadCaseToUpdate = updatedLoadCombinations[combinationIndex].loadCases[caseIndex];

  // Update the factor value based on factorKey
  loadCaseToUpdate[factor] = e;

  // Update state with the modified loadCombinations
  setLoadCombinations(updatedLoadCombinations);
  };

  const handleFactorBlur = () => {
    setEditingFactor({ index: null, factor: null });
  };
  const loadNames = [
    "Dead Load",
    "Tendon Primary",
    "Creep Primary",
    "Shrinkage Primary",
    "Tendon Secondary",
    "Creep Secondary",
    "Shrinkage Secondary",
  ];
  
  const Import_Load_Cases = async () => {
    const stct = await midasAPI("GET", "/db/stct");
    const stldData = await midasAPI("GET", "/db/stld");
    const smlc = await midasAPI("GET", "/db/smlc");
    const mvldid = await midasAPI("GET", "/db/mvldid");
    const mvld = await midasAPI("GET", "/db/mvld");
    const mvldch = await midasAPI("GET", "/db/mvldch");
    const mvldeu = await midasAPI("GET", "/db/mvldeu");
    const mvldbs = await midasAPI("GET", "/db/mvldbs");
    const mvldpl = await midasAPI("GET", "/db/mvldpl");
    const splc = await midasAPI("GET", "/db/splc");
  
    if (stct && stct.STCT) {
      for (const key in stct.STCT) {
        const item = stct.STCT[key];
        if (item.vEREC) {
          item.vEREC.forEach((erec) => {
            if (erec.LTYPECC) {
              loadNames.push(erec.LTYPECC);
            }
          });
        }
      }
    }
  
    if (stldData && Object.keys(stldData)[0].length > 0) {
      const stldKeys = Object.keys(stldData)[0];
      if (stldKeys && stldKeys.length > 0) {
        for (const key in stldData[stldKeys]) {
          if (stldData[stldKeys].hasOwnProperty(key)) {
            const name = stldData[stldKeys][key].NAME;
            loadNames.push(name);
          }
        }
      }
    }
  
    if (smlc && smlc.SMLC) {
      for (const key in smlc.SMLC) {
        const item = smlc.SMLC[key];
        if (item.NAME) {
          const smlcName = item.NAME;
          loadNames.push(smlcName);
        }
      }
    }
  
    if (mvldid && mvldid.MVLDID) {
      for (const key in mvldid.MVLDID) {
        if (mvldid.MVLDID.hasOwnProperty(key)) {
          const item = mvldid.MVLDID[key];
          if (item && item.LCNAME) {
            loadNames.push(item.LCNAME);
          }
        }
      }
    }
  
    if (mvld && mvld.MVLD) {
      for (const key in mvld.MVLD) {
        if (mvld.MVLD.hasOwnProperty(key)) {
          const item = mvld.MVLD[key];
          if (item && item.LCNAME) {
            loadNames.push(item.LCNAME);
          }
        }
      }
    }
  
    if (mvldch && mvldch.MVLDCH) {
      for (const key in mvldch.MVLDCH) {
        if (mvldch.MVLDCH.hasOwnProperty(key)) {
          const item = mvldch.MVLDCH[key];
          if (item && item.LCNAME) {
            loadNames.push(item.LCNAME);
          }
        }
      }
    }
  
    if (mvldeu && mvldeu.MVLDEU) {
      for (const key in mvldeu.MVLDEU) {
        if (mvldeu.MVLDEU.hasOwnProperty(key)) {
          const item = mvldeu.MVLDEU[key];
          if (item && item.LCNAME) {
            loadNames.push(item.LCNAME);
          }
        }
      }
    }
  
    if (mvldbs && mvldbs.MVLDBS) {
      for (const key in mvldbs.MVLDBS) {
        if (mvldbs.MVLDBS.hasOwnProperty(key)) {
          const item = mvldbs.MVLDBS[key];
          if (item && item.LCNAME) {
            loadNames.push(item.LCNAME);
          }
        }
      }
    }
  
    if (mvldpl && mvldpl.MVLDPL) {
      for (const key in mvldpl.MVLDPL) {
        if (mvldpl.MVLDPL.hasOwnProperty(key)) {
          const item = mvldpl.MVLDPL[key];
          if (item && item.LCNAME) {
            loadNames.push(item.LCNAME);
          }
        }
      }
    }
  
    if (splc && splc.SPLC) {
      for (const key in splc.SPLC) {
        const item = splc.SPLC[key];
        if (item.NAME) {
          const spName = item.NAME;
          loadNames.push(spName);
        }
      }
    }
  
    console.log(loadNames);
  };
  

Import_Load_Cases();
// const [excelData, setExcelData] = useState([]);


function importLoadCombinationInput(data) {
  setLoadCombinations(data);
    // setShowExcelReader(false); 
}

function getLoadCaseFactors(loadCaseName, combinations,loadNames) {
  for (const combo of combinations) {
      for (const loadCase of combo.loadCases) {
        if (loadNames.includes(loadCase.loadCaseName)) {
          return loadCase;
        }
      }
  }
  return null;
}
function generateAddCombinations(loadCases, loadCombinations) {
  const result = [];
  for (const loadCaseName of loadCases) {
    result.push(...createCombinations(loadCaseName, loadCombinations));
  }
  return result;
}

// Function to generate combinations for "Either" type
function generateEitherCombinations(loadCases, loadCombinations) {
  const result = [];
  for (const loadCaseName of loadCases) {
    result.push(...createCombinations(loadCaseName, loadCombinations));
  }
  return result;
}
// Function to create combinations

const [loadCombinations, setLoadCombinations] = useState([{ loadCombination: '', active: '', type: '', loadCases: [] }]);
  useEffect(() => {
    // Ensure there is always an additional empty row at the end
    const lastCombination = loadCombinations[loadCombinations.length - 1];
    if (lastCombination && (lastCombination.loadCombination !== '' || lastCombination.active !== '' || lastCombination.type !== '')) {
      setLoadCombinations([...loadCombinations, { loadCombination: '', active: '', type: '', loadCases: [] }]);
      setInputValue(''); 
    }
  }, [loadCombinations]);

  // const handleLoadCombinationChange = (index, field, value) => {
  //   const updatedLoadCombinations = [...loadCombinations];
  //   updatedLoadCombinations[index][field] = value;
  //   setLoadCombinations(updatedLoadCombinations);
  // };

  const handleLoadCombinationClick = (index) => {
    setSelectedLoadCombinationIndex(index);
  };

// let loadNames = [];
// async function Import_Load_Cases() {
//    const stct = await midasAPI("GET", "/db/stct");
//     const stldData = await midasAPI("GET", "/db/stld");
//     const smlc = await midasAPI("GET", "/db/smlc");
//     const mvldid = await midasAPI("GET", "/db/mvldid");
//     const mvld = await midasAPI("GET", "/db/mvld");
//     const mvldch = await midasAPI("GET", "/db/mvldch");
//     const mvldeu = await midasAPI("GET", "/db/mvldeu");
//     const mvldbs = await midasAPI("GET", "/db/mvldbs");
//     const mvldpl = await midasAPI("GET", "/db/mvldpl");
//     const splc = await midasAPI("GET", "/db/splc");
//     loadNames = [
//       "Dead Load",
//       "Tendon Primary",
//       "Creep Primary",
//       "Shrinkage Primary",
//       "Tendon Secondary",
//       "Creep Secondary",
//       "Shrinkage Secondary",
//     ];
//     if (stct && stct.STCT) {
//       for (const key in stct.STCT) {
//         const item = stct.STCT[key];
//         if (item.vEREC) {
//           item.vEREC.forEach((erec) => {
//             if (erec.LTYPECC) {
//               loadNames.push(erec.LTYPECC);
//               // loadCombinationNames_max.push(`${erec.LTYPECC}(CS)`);
//               // loadCombinationNames_min.push(`${erec.LTYPECC}(CS)`);
//               // cs_forces.Argument.LOAD_CASE_NAMES.push(`${erec.LTYPECC}(CS)`);
//             }
//           });
//         }
//       }
//     }
//     if (stldData && Object.keys(stldData)[0].length > 0) {
//       const stldKeys = Object.keys(stldData)[0];
//       if (stldKeys && stldKeys.length > 0) {
//         for (const key in stldData[stldKeys]) {
//           if (stldData[stldKeys].hasOwnProperty(key)) {
//             const name = stldData[stldKeys][key].NAME;
//             loadNames.push(name);
//             // loadCombinationNames_max.push(`${name}(ST)`);
//             // loadCombinationNames_min.push(`${name}(ST)`);
//             // inputObject.Argument.LOAD_CASE_NAMES.push(`${name}(ST)`);
//           }
//         }
//       }
//     }
//     if (smlc && smlc.SMLC) {
//       for (const key in smlc.SMLC) {
//         const item = smlc.SMLC[key];
//         if (item.NAME) {
//           const smlcName = item.NAME;
//           loadNames.push(smlcName);
//           // loadCombinationNames_max.push(`${smlcName}(SM:max)`);
//           // loadCombinationNames_min.push(`${smlcName}(SM:min)`);
//           // inputObject.Argument.LOAD_CASE_NAMES.push(`${smlcName}(SM:max)`);
//           // inputObject.Argument.LOAD_CASE_NAMES.push(`${smlcName}(SM:min)`);
//           // loadNames_getAdjusted.push(smlcName);
//         }
//       }
//     }

//     if (mvldid && mvldid.MVLDID) {
//       for (const key in mvldid.MVLDID) {
//         if (mvldid.MVLDID.hasOwnProperty(key)) {
//           const item = mvldid.MVLDID[key];

//           if (item && item.LCNAME) {
//             loadNames.push(item.LCNAME);
//             // loadCombinationNames_max.push(`${item.LCNAME}(MV:max)`);
//             // loadCombinationNames_min.push(`${item.LCNAME}(MV:min)`);
//             // inputObject.Argument.LOAD_CASE_NAMES.push(`${item.LCNAME}(MV:max)`);
//             // inputObject.Argument.LOAD_CASE_NAMES.push(`${item.LCNAME}(MV:min)`);
//             // loadNames_getAdjusted.push(item.LCNAME);
//           }
//         }
//       }
//     }
//     console.log(mvldid);
//     if (mvld && mvld.MVLD) {
//       for (const key in mvld.MVLD) {
//         if (mvld.MVLD.hasOwnProperty(key)) {
//           const item = mvld.MVLD[key];

//           if (item && item.LCNAME) {
//             loadNames.push(item.LCNAME);
//             // loadCombinationNames_max.push(`${item.LCNAME}(MV:max)`);
//             // loadCombinationNames_min.push(`${item.LCNAME}(MV:min)`);
//             // inputObject.Argument.LOAD_CASE_NAMES.push(`${item.LCNAME}(MV:max)`);
//             // inputObject.Argument.LOAD_CASE_NAMES.push(`${item.LCNAME}(MV:min)`);
//             // loadNames_getAdjusted.push(item.LCNAME);
//           }
//         }
//       }
//     }
//     if (mvldch && mvldch.MVLDCH) {
//       for (const key in mvldch.MVLDCH) {
//         if (mvldch.MVLDCH.hasOwnProperty(key)) {
//           const item = mvldch.MVLDCH[key];

//           if (item && item.LCNAME) {
//             loadNames.push(item.LCNAME);
//             // loadCombinationNames_max.push(`${item.LCNAME}(MV:max)`);
//             // loadCombinationNames_min.push(`${item.LCNAME}(MV:min)`);
//             // inputObject.Argument.LOAD_CASE_NAMES.push(`${item.LCNAME}(MV:max)`);
//             // inputObject.Argument.LOAD_CASE_NAMES.push(`${item.LCNAME}(MV:min)`);
//             // loadNames_getAdjusted.push(item.LCNAME);
//           }
//         }
//       }
//     }
//     if (mvldeu && mvldeu.MVLDEU) {
//       for (const key in mvldeu.MVLDEU) {
//         if (mvldeu.MVLDEU.hasOwnProperty(key)) {
//           const item = mvldeu.MVLDEU[key];

//           if (item && item.LCNAME) {
//             loadNames.push(item.LCNAME);
//             // loadCombinationNames_max.push(`${item.LCNAME}(MV:max)`);
//             // loadCombinationNames_min.push(`${item.LCNAME}(MV:min)`);
//             // inputObject.Argument.LOAD_CASE_NAMES.push(`${item.LCNAME}(MV:max)`);
//             // inputObject.Argument.LOAD_CASE_NAMES.push(`${item.LCNAME}(MV:min)`);
//             // loadNames_getAdjusted.push(item.LCNAME);
//           }
//         }
//       }
//     }
//     if (mvldbs && mvldbs.MVLDBS) {
//       for (const key in mvldbs.MVLDBS) {
//         if (mvldbs.MVLDBS.hasOwnProperty(key)) {
//           const item = mvldbs.MVLDBS[key];

//           if (item && item.LCNAME) {
//             loadNames.push(item.LCNAME);
//             // loadCombinationNames_max.push(`${item.LCNAME}(MV:max)`);
//             // loadCombinationNames_min.push(`${item.LCNAME}(MV:min)`);
//             // inputObject.Argument.LOAD_CASE_NAMES.push(`${item.LCNAME}(MV:max)`);
//             // inputObject.Argument.LOAD_CASE_NAMES.push(`${item.LCNAME}(MV:min)`);
//             // loadNames_getAdjusted.push(item.LCNAME);
//           }
//         }
//       }
//     }
//     if (mvldpl && mvldpl.MVLDPL) {
//       for (const key in mvldpl.MVLDPL) {
//         if (mvldpl.MVLDPL.hasOwnProperty(key)) {
//           const item = mvldpl.MVLDPL[key];

//           if (item && item.LCNAME) {
//             loadNames.push(item.LCNAME);
//             // loadCombinationNames_max.push(`${item.LCNAME}(MV:max)`);
//             // loadCombinationNames_min.push(`${item.LCNAME}(MV:min)`);
//             // inputObject.Argument.LOAD_CASE_NAMES.push(`${item.LCNAME}(MV:max)`);
//             // inputObject.Argument.LOAD_CASE_NAMES.push(`${item.LCNAME}(MV:min)`);
//             // loadNames_getAdjusted.push(item.LCNAME);
//           }
//         }
//       }
//     }
//     if (splc && splc.SPLC) {
//       for (const key in splc.SPLC) {
//         const item = splc.SPLC[key];
//         if (item.NAME) {
//           const spName = item.NAME;
//           loadNames.push(spName);
//           // loadCombinationNames_max.push(`${spName}(RS)`);
//           // loadCombinationNames_min.push(`${spName}(RS)`);
//           // inputObject.Argument.LOAD_CASE_NAMES.push(`${spName}(RS)`);
//         }
//       }
//     }
//     console.log(loadNames);

   
// }
function Export_Load_Combination_Input() {
 
}
// function createCombinations(loadCaseName, combinations, factor = 1) {
//   const loadCase = getLoadCaseFactors(loadCaseName, combinations);
//   if (loadCase) {
//       const result = [];
//       for (let i = 1; i <= 5; i++) {
//           const factorKey = `factor${i}`;
//           if (loadCase[factorKey] !== undefined) {
//               const newFactor = factor * loadCase[factorKey];
//               result.push({ loadCaseName, sign: loadCase.sign, factor: newFactor });
//           }
//       }
//       return result;
//   } else {
//       for (const combo of combinations) {
//           if (combo.loadCombination === loadCaseName) {
//               const nestedResults = [];
//               for (const nestedLoadCase of combo.loadCases) {
//                   nestedResults.push(...createCombinations(nestedLoadCase.loadCaseName, combinations, factor));
//               }
//               return nestedResults;
//           }
//       }
//   }
//   return [];
// }

// Function to find the first combination with active set to "Strength"
function findStrengthCombination(combinations) {
  for (const combo of combinations) {
      if (combo.active === "Strength") {
          return combo;
      }
  }
  return null;
}

// Function to generate basic combinations


// Generate basic combinations using the updated method
// const basicCombinations = generateBasicCombinations(loadCombinations);
// 
let  basicCombinations = null;
function createCombinations(loadCaseName, loadCombinations,loadNames ,factor = 1) {
  const loadCase = getLoadCaseFactors(loadCaseName, loadCombinations,loadNames);
  if (loadCase) {
      const result = [];
      for (let i = 1; i <= 5; i++) {
          const factorKey = `factor${i}`;
          if (loadCase[factorKey] !== undefined) {
              const newFactor = factor * loadCase[factorKey];
              result.push({ loadNames, sign: loadCase.sign, factor: newFactor });
          }
      }
      return result;
  } else {
      for (const combo of loadCombinations) {
          if (combo.loadCombination === loadNames) {
              const nestedResults = [];
              for (const nestedLoadCase of combo.loadCases) {
                  nestedResults.push(...createCombinations(nestedLoadCase.loadCaseName, loadCombinations, factor));
              }
              return nestedResults;
          }
      }
  }
  return [];
}
function generateBasicCombinations(loadCombinations) {
  const strengthCombination = findStrengthCombination(loadCombinations);
  if (!strengthCombination) {
      console.error("No combination with active set to 'Strength' found.");
      return [];
  }

  const result = [];
  // for (const loadCaseName of strengthCombination.loadCases) {
  //     result.push(...createCombinations(loadCaseName, loadCombinations,loadNames));
  // }
  for (const loadCaseName of strengthCombination.loadCases) {
    if (strengthCombination.type === 'Add') {
      result.push(...generateAddCombinations(strengthCombination.loadCases, loadCombinations));
    } else if (strengthCombination.type === 'Either') {
      result.push(...generateEitherCombinations(strengthCombination.loadCases, loadCombinations));
    }
  }
  return result;
}
function Generate_Load_Combination() {
  basicCombinations = generateBasicCombinations(loadCombinations);
  console.log(basicCombinations);
  
}
console.log(basicCombinations);
const toggleExcelReader = () => {
  fileInputRef.current.click(); // Trigger the file input click
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const binaryStr = e.target.result;
    const workbook = XLSX.read(binaryStr, { type: 'binary' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log('Raw JSON Data:', jsonData); // Log raw JSON data

    // Convert each row to an object and store in loadCombinations
    const formattedData = [];
    let currentLoadCombination = null;

    jsonData.slice(1).forEach(row => {
      const loadCombination = row[0] || currentLoadCombination.loadCombination;
      const active = row[1] || currentLoadCombination.active;
      const type = row[2] || currentLoadCombination.type;
      const loadCaseName = row[3];
      const sign = row[4];
      const factor1 = row[5];
      const factor2 = row[6];
      const factor3 = row[7];
      const factor4 = row[8];
      const factor5 = row[9];

      if (loadCombination) {
        if (!currentLoadCombination || currentLoadCombination.loadCombination !== loadCombination) {
          // Create a new loadCombination object
          currentLoadCombination = {
            loadCombination,
            active,
            type,
            loadCases: []
          };
          formattedData.push(currentLoadCombination);
        }

        // Add the load case to loadCombination's loadCases array
        currentLoadCombination.loadCases.push({
          loadCaseName,
          sign,
          factor1,
          factor2,
          factor3,
          factor4,
          factor5
        });
      }
    });

    console.log('Formatted Data:', formattedData); // Log formatted data
    setLoadCombinations(formattedData);
  };

  reader.readAsBinaryString(file);
};
console.log(loadCombinations);
const [activeDropdownIndex, setActiveDropdownIndex] = useState(-1); // Track which dropdown is open

  const toggleDropdown = (index) => {
    setActiveDropdownIndex(index === activeDropdownIndex ? null : index);
  };
  const toggleTypeDropdown = (index) => {
    setTypeDropdownIndex(index === typeDropdownIndex ? null : index);
  };

  const handleOptionSelect = (index, option) => {
    // Handle option selection logic here
    // const updatedLoadCombinations = [...loadCombinations];
    // updatedLoadCombinations[index].active = option; // Update the active value based on option selected
    // setLoadCombinations(updatedLoadCombinations);
    // setActiveDropdownIndex(-1); // Close the dropdown after selection
    handleLoadCombinationChange(index, 'active', option);
    setActiveDropdownIndex(null);
  };

  const handleTypeOptionSelect = (index, option) => {
    // Handle type option selection logic here
    // const updatedLoadCombinations = [...loadCombinations];
    // updatedLoadCombinations[index].type = option; // Update the type value based on option selected
    // setLoadCombinations(updatedLoadCombinations);
    // setTypeDropdownIndex(-1); // Close the dropdown after selection
    handleLoadCombinationChange(index, 'type', option);
    setTypeDropdownIndex(null);
  };

  const handleLoadCombinationChange = (index, field, value) => {
    setLoadCombinations((prevLoadCombinations) => {
      const updatedLoadCombinations = [...prevLoadCombinations];
      updatedLoadCombinations[index][field] = value;
      return updatedLoadCombinations;
    });
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };
  const debouncedHandleLoadCombinationChange = useCallback(
    debounce((index, field, value) => {
      handleLoadCombinationChange(index, field, value);
    }, 1000),
    []
  );
  const handleInputChange = (index, field, value) => {
    setInputValue(value);
    debouncedHandleLoadCombinationChange(index, field, value);
    
  };
  React.useEffect(() => {
    if (
      !VerifyUtil.isExistQueryStrings("redirectTo") &&
      !VerifyUtil.isExistQueryStrings("mapiKey")
    ) {
      setDialogShowState(true);
    }
  }, []);
  const addNewLoadCombination = () => {
    setLoadCombinations([...loadCombinations, { loadCombination: '', active: '', type: '', loadCases: [] }]);
  };
  
  console.log(loadNames);
  console.log(loadCombinations);
  //Main UI
  return (
	<div className="App" >
		{/* {showDialog && <MKeyDialog />}
		{showDialog && <VerifyDialog />} */}
    {showDialog && <VerifyDialog />}

		<GuideBox
			padding={2}
			center
		>
      {/* <div style={{ backgroundColor: '#d3d3d3', width: '830px', height: '500px', display: 'flex'}}> */}
      <Panel width="800px" height="540px" flexItem>
        {/* <div style={{ width: '300px', height: '500px', display: 'flex', flexDirection: 'column',margin:'10px'}}> */}
        <Panel width="300px" height="540px" variant="shadow2" marginLeft='20px'>
         <div style={{width: '130px', height: '20px', color: 'black',paddingTop:'2.5px'}}><Typography variant="h1" color="primary" size="small">
         Load Combination List
</Typography></div>
         <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'white', color: 'black',fontSize:'12px',width:'280px', height: '20px',borderTopLeftRadius: '10px', borderTopRightRadius: '10px'}}>
         {/* <Panel width="280px" height="20px" variant="shadow2"> */}
         <div style={{ flex: '0 0 160px', paddingLeft:'2px' }}>Load Combination</div>
          <Sep direction='vertical' margin='2px'/>
         <div style={{ flex: '1 1 auto' }}>Active</div>
        <Sep direction='vertical' margin='2px'/>
        <div style={{ flex: '1 1 auto' }}>Type</div>
        </div>
      <div style={{
      width: '280px',
      height: '370px',
      backgroundColor: 'white',
      marginBottom: '20px',
      marginTop:'2px',
      borderTop: '2px solid #ccc', // Adds a greyish line to the top border
      boxShadow: '0px -4px 5px -4px grey' // Adds a shadow effect to the top border
    }}> 
    <Scrollbars height={360} width={280}>
               {loadCombinations.map((combo, index) => (
      <div key={index} style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid #ccc', cursor: 'pointer', backgroundColor: selectedLoadCombinationIndex === index ? '#f0f0f0' : 'white' }} onClick={() => handleLoadCombinationClick(index)}>
        <div style={{ flex: '0 0 140px', padding: '5px', borderRight: '1px solid #ccc', color: 'black' }}>
          {/* <Typography>{combo.loadCombination}</Typography> */}
        {/* <input
                        type="text"
                        value={combo.loadCombination}
                        onChange={(e) => handleLoadCombinationChange(index, 'loadCombination', e.target.value)}
                        placeholder=" " 
                        style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent' }}
                      /> */}
                      {index === loadCombinations.length - 1 ? (
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) =>
                            handleInputChange(index, 'loadCombination', e.target.value)
                          }
                          onBlur={() =>
                            handleLoadCombinationChange(index, 'loadCombination', inputValue)
                          }
                          placeholder=" "
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            backgroundColor: 'transparent',
                          }}
                        />
                      ) : (
                        <Typography>{combo.loadCombination}</Typography>
                      )}
             </div>
        {/* <div style={{ flex: '1 1 65px', padding: '5px', borderRight: '1px solid #ccc', color: 'black' }}><Typography>{combo.active}</Typography></div> */}
        <div
              style={{
                flex: '1 1 65px',
                padding: '5px',
                borderRight: '1px solid #ccc',
                color: 'black',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(index);
              }}
            >
              <Typography>{combo.active}</Typography>
              {activeDropdownIndex === index && (
                <div
                  style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    zIndex: 1,
                    top: '100%',
                    left: 0,
                    minWidth: '100%',
                  }}
                >
                  <div onClick={() => handleOptionSelect(index, 'Active')}><Typography>Active</Typography></div>
                  <div onClick={() => handleOptionSelect(index, 'Inactive')}><Typography>Inactive</Typography></div>
                  <div onClick={() => handleOptionSelect(index, 'Local')}><Typography>Local</Typography></div>
                  <div onClick={() => handleOptionSelect(index, 'Strength')}><Typography>Strength</Typography></div>
                  <div onClick={() => handleOptionSelect(index, 'Service')}><Typography>Service</Typography></div>
                </div>
                 )}
            </div>
        {/* <div style={{ flex: '1 1 40px', padding: '5px', color: 'black' }}><Typography>{combo.type}</Typography></div> */}
        <div
                      style={{
                        flex: '1 1 50px',
                        padding: '5px',
                        color: 'black',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTypeDropdown(index);
                      }}
                    >
                      <Typography>{combo.type}</Typography>
                      {typeDropdownIndex === index && (
                        <div
                          style={{
                            position: 'absolute',
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            zIndex: 1,
                            top: '100%',
                            left: 0,
                            right: 0
                          }}
                        >
                          {['Add', 'Either', 'Envelope'].map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              onClick={() => handleTypeOptionSelect(index, option)}
                              style={{
                                padding: '5px',
                                cursor: 'pointer',
                                backgroundColor: option === <Typography>combo.type</Typography> ? '#f0f0f0' : 'white'
                              }}
                            >
                              <Typography>{option}</Typography>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    </div>
                ))}
              </Scrollbars>
      </div>
      
    <CheckGroup>
  <Check name="Generate envelop load combinations in midas" />
  <Check name="Generate inactive load combinations in midas" />
</CheckGroup>
<ComponentsPanelTypographyDropList />
</Panel>

<Panel width={7500000} height={540} marginRight="20px">
 <div style={{display: 'flex',flexDirection:'row' ,justifyContent: 'space-between',width: '450px', height: '20px', color: 'black', fontSize: '12px',paddingTop:'2px',paddingBottom:'0px',marginBottom:'0px'}}>
  <Typography variant="h1" color="primary" size="small" textalign="centre">Load Cases & Factors</Typography> 
  <div style={{
  display: 'flex',
  alignItems: 'flex-end',
  marginTop: '3px', // Adjust margin-bottom as per your requirement
}}><ComponentsDialogHelpIconButton /></div>
  </div>
      <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'white', color: 'black',fontSize:'12px', height: '20px',borderTopLeftRadius: '10px', borderTopRightRadius: '10px'}}>
      <div style={{ flex: '0 0 150px'}}>Load Case</div>
      <Sep direction='vertical' margin='2px'/>
      <div style={{ flex: '1 1 auto' }}>Sign</div>
      <Sep direction='vertical' margin='2px'/>
      <div style={{ flex: '1 1 auto' }}>Factor1</div>
      <Sep direction='vertical' margin='2px'/>
      <div style={{ flex: '1 1 auto' }}>Factor2</div>
      <Sep direction='vertical' margin='2px'/>
      <div style={{ flex: '1 1 auto' }}>Factor3</div>
      <Sep direction='vertical' margin='2px'/>
      <div style={{ flex: '1 1 auto' }}>Factor4</div>
      <Sep direction='vertical' margin='2px'/>
      <div style={{ flex: '1 1 auto' }}>Factor5</div>
      </div>
      <div style={{
      width: '450px',
      height: '450px',
      backgroundColor: 'white',
      marginBottom: '20px',
      marginTop:'2px',
      borderTop: '2px solid #ccc', // Adds a greyish line to the top border
      boxShadow: '0px -4px 5px -4px grey'
    }}>
       {/* <Scrollbars height={450} width={460}>
                {selectedLoadCombinationIndex >= 0 && loadCombinations[selectedLoadCombinationIndex].loadCases.map((loadCase, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid #ccc' }}>
                    <div style={{ flex: '0 0 132px', padding: '5px', borderRight: '1px solid #ccc', color: 'black' }}>
                      <Typography onClick={(e) => { e.stopPropagation(); toggleLoadCaseDropdown(loadCaseIndex); }}>
                        {loadCase.loadCaseName}
                    </Typography>
                    {loadCaseDropdownIndex === loadCaseIndex && (
                        <div style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc', zIndex: 1, top: '100%', left: 0, right: 0 }}>
                          {loadNames.map((name, nameIndex) => (
                            <div key={nameIndex} onClick={() => handleLoadCaseOptionSelect(loadCombinationIndex, loadCaseIndex, name)} style={{ padding: '5px', cursor: 'pointer', backgroundColor: name === loadCase.loadCaseName ? '#f0f0f0' : 'white' }}>
                              <Typography>{name}</Typography>
                            </div>
                          ))}
                        </div>
                      )}
                    <div style={{ flex: '1 1 25px', padding: '5px', borderRight: '1px solid #ccc', color: 'black' }}><Typography>{loadCase.sign}</Typography></div>
                    <div style={{ flex: '1 1 30px', padding: '5px', borderRight: '1px solid #ccc', color: 'black' }}><Typography>{loadCase.factor1}</Typography></div>
                    <div style={{ flex: '1 1 30px', padding: '5px', borderRight: '1px solid #ccc', color: 'black' }}><Typography>{loadCase.factor2}</Typography></div>
                    <div style={{ flex: '1 1 30px', padding: '5px', borderRight: '1px solid #ccc', color: 'black' }}><Typography>{loadCase.factor3}</Typography></div>
                    <div style={{ flex: '1 1 30px', padding: '5px', borderRight: '1px solid #ccc', color: 'black' }}><Typography>{loadCase.factor4}</Typography></div>
                    <div style={{ flex: '1 1 30px', padding: '5px', color: 'black' }}><Typography>{loadCase.factor5}</Typography></div>
                  </div>
                ))}
              </Scrollbars> */}
              <Scrollbars height={450} width={460}>
  {selectedLoadCombinationIndex >= 0 && loadCombinations[selectedLoadCombinationIndex].loadCases.map((loadCase, loadCaseIndex) => (
    <div key={loadCaseIndex} style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid #ccc' }}>
      <div style={{ flex: '0 0 132px', padding: '5px', borderRight: '1px solid #ccc', color: 'black', position: 'relative' }} onClick={(e) => { e.stopPropagation(); toggleLoadCaseDropdown(loadCaseIndex); }}>
        <Typography >
          {loadCase.loadCaseName}
        </Typography>
        {loadCaseDropdownIndex === loadCaseIndex && (
          <div style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc', zIndex: 1, top: '100%', left: 0, right: 0 }}>
            {loadNames.map((name, nameIndex) => (
              <div key={nameIndex} onClick={() => handleLoadCaseOptionSelect(selectedLoadCombinationIndex, loadCaseIndex, name)} style={{ padding: '5px', cursor: 'pointer', backgroundColor: name === loadCase.loadCaseName ? '#f0f0f0' : 'white' }}>
                <Typography>{name}</Typography>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <div style={{ flex: '1 1 25px', padding: '5px', borderRight: '1px solid #ccc', color: 'black' }}><Typography>{loadCase.sign}</Typography></div> */}
      <div style={{ flex: '1 1 25px', padding: '5px', borderRight: '1px solid #ccc', color: 'black', position: 'relative' }} onClick={(e) => { e.stopPropagation(); toggleSignDropdown(loadCaseIndex); }}> 
        <Typography >
          {loadCase.sign}
        </Typography>
        {signDropdownIndex === loadCaseIndex && (
          <div style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc', zIndex: 1, top: '100%', left: 0, right: 0 }}>
            {['+', '-', '+,-', '±'].map((signOption, signIndex) => (
              <div key={signIndex} onClick={() => handleSignOptionSelect(selectedLoadCombinationIndex, loadCaseIndex, signOption)} style={{ padding: '5px', cursor: 'pointer', backgroundColor: signOption === loadCase.sign ? '#f0f0f0' : 'white' }}>
                <Typography>{signOption}</Typography>
              </div>
            ))}
          </div>
        )}
      </div>
       <div style={{ flex: '1 1 30px', padding: '5px', borderRight: '1px solid #ccc', color: 'black', cursor: 'text' }} onClick={() => handleFactorClick(loadCaseIndex, 'factor1')} onBlur={(e) => handleFactorBlur(loadCaseIndex, 'factor1', e.currentTarget.textContent)}
  contentEditable
  suppressContentEditableWarning>
        <Typography>{loadCase.factor1}</Typography>
        </div>
        <div style={{ flex: '1 1 30px', padding: '5px', borderRight: '1px solid #ccc', color: 'black', cursor: 'text' }} onClick={() => handleFactorClick(loadCaseIndex, 'factor2')} onBlur={(e) => handleFactorBlur(loadCaseIndex, 'factor2', e.currentTarget.textContent)}
  contentEditable
  suppressContentEditableWarning>
        <Typography>{loadCase.factor2}</Typography>
        </div>
        <div style={{ flex: '1 1 30px', padding: '5px', borderRight: '1px solid #ccc', color: 'black', cursor: 'text' }} onClick={() => handleFactorClick(loadCaseIndex, 'factor3')} onBlur={(e) => handleFactorBlur(loadCaseIndex, 'factor3', e.currentTarget.textContent)}
  contentEditable
  suppressContentEditableWarning>
        <Typography>{loadCase.factor3}</Typography>
        </div>
        <div style={{ flex: '1 1 30px', padding: '5px', borderRight: '1px solid #ccc', color: 'black', cursor: 'text' }} onClick={() => handleFactorClick(loadCaseIndex, 'factor4')} onBlur={(e) => handleFactorBlur(loadCaseIndex, 'factor4', e.currentTarget.textContent)}
  contentEditable
  suppressContentEditableWarning>
        <Typography>{loadCase.factor4}</Typography>
        </div>
        <div style={{ flex: '1 1 30px', padding: '5px', borderRight: '1px solid #ccc', color: 'black', cursor: 'text' }} onClick={() => handleFactorClick(loadCaseIndex, 'factor5')} onBlur={(e) => handleFactorBlur(loadCaseIndex, 'factor5', e.currentTarget.textContent)}
  contentEditable
  suppressContentEditableWarning>
        <Typography>{loadCase.factor5}</Typography>
        </div>
      {/* <div style={{ flex: '1 1 30px', padding: '5px', borderRight: '1px solid #ccc', color: 'black' }}><Typography>{loadCase.factor2}</Typography></div>
      <div style={{ flex: '1 1 30px', padding: '5px', borderRight: '1px solid #ccc', color: 'black' }}><Typography>{loadCase.factor3}</Typography></div>
      <div style={{ flex: '1 1 30px', padding: '5px', borderRight: '1px solid #ccc', color: 'black' }}><Typography>{loadCase.factor4}</Typography></div>
      <div style={{ flex: '1 1 30px', padding: '5px', color: 'black' }}><Typography>{loadCase.factor5}</Typography></div> */}
    {/* </div>
  ))}  */}
    {/* {['factor1', 'factor2', 'factor3', 'factor4', 'factor5'].map((factor, factorIndex) => (
            <div
              key={factorIndex}
              style={{ flex: '1 1 30px', padding: '5px', borderRight: '1px solid #ccc', color: 'black', cursor: 'pointer' }}
              onClick={() => handleFactorClick(loadCaseIndex, factor)}
              onBlur={(e) => handleFactorChange(selectedLoadCombinationIndex, loadCaseIndex, factor,e)}
              contentEditable
              suppressContentEditableWarning
            >
              {editingFactor.index === loadCaseIndex && editingFactor.factor === factor ? (
                loadCase[factor]
              ) : (
                <Typography>{loadCase[factor]}</Typography>
              )}
            </div>
          ))} */}
        </div>
      ))}
</Scrollbars>

        </div>
  </Panel>
  </Panel>
      <div style={{  width: '780px', height: '40px', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: 'white', padding: '10px'}}>
      {Buttons.SubButton("contained", "Import Load Cases", Import_Load_Cases)}
      {Buttons.SubButton("contained", "Export Load Combination",Export_Load_Combination_Input)}
      {Buttons.SubButton("contained", "Import Load Combination",toggleExcelReader)}
      {Buttons.SubButton("contained", "Generate Load Combination",Generate_Load_Combination)}
      </div>
      <ExcelReader onImport={importLoadCombinationInput} handleFileChange={handleFileChange} />
      <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        /> 
      {/* </Panel> */}

		</GuideBox>
	</div>
  );
}

export default App;