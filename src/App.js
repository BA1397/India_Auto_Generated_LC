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
const [selectedLoadCombinationIndex, setSelectedLoadCombinationIndex] = useState(-1);
const [typeDropdownIndex, setTypeDropdownIndex] = useState(-1); 
const [showDialog, setDialogShowState] = React.useState(false);
const [inputValue, setInputValue] = useState('');
const fileInputRef = useRef(null); 
const [loadCaseDropdownIndex, setLoadCaseDropdownIndex] = useState(-1);
const [signDropdownIndex, setSignDropdownIndex] = useState(null);
const [editingFactor, setEditingFactor] = useState({ index: null, factor: null });
let loadNames = [];


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
  const loadCaseToUpdate = updatedLoadCombinations[combinationIndex].loadCases[caseIndex];
  loadCaseToUpdate[factor] = e;
  setLoadCombinations(updatedLoadCombinations);
  };

  const handleFactorBlur = () => {
    setEditingFactor({ index: null, factor: null });
  };
  loadNames = [
    "Dead Load",
    "Tendon Primary",
    "Creep Primary",
    "Shrinkage Primary",
    "Tendon Secondary",
    "Creep Secondary",
    "Shrinkage Secondary",
  ];
  
 async function Import_Load_Cases() {
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
  

// Import_Load_Cases();
// const [excelData, setExcelData] = useState([]);


function importLoadCombinationInput(data) {
  setLoadCombinations(data);
    // setShowExcelReader(false); 
}


  const handleLoadCombinationClick = (index) => {
    setSelectedLoadCombinationIndex(index);
  };

function Export_Load_Combination_Input() {
 
}
function getLoadCaseFactors(loadCaseName, combinations) {
  for (const combo of combinations) {
    const cleanedLoadCaseName = loadCaseName.replace(/\s*\(CB\)$/, '');

    // Check if cleanedLoadCaseName matches combo.loadCombinations
    if (cleanedLoadCaseName === combo.loadCombination) {
      return combo;
    }
  }
  return null;
}
// function createCombinations(loadCombination, combinations, loadNames, factor = 1) {
//   if (!Array.isArray(loadCombination.loadCases)) {
//     console.error('loadCases is not an array.');
//     return [];
//   }

//   const result = [];
//   console.log(loadCombination.loadCases);

//   if (loadCombination.type === "Add") {
//     // Collect results into different arrays based on factors
//     const factorArrays = Array.from({ length: 5 }, () => []);

//     for (const loadCase of loadCombination.loadCases) {
//       if (loadNames.includes(loadCase.loadCaseName)) {
//         for (let i = 1; i <= 5; i++) {
//           const factorKey = `factor${i}`;
//           if (loadCase[factorKey] !== undefined) {
//             const newFactor = factor * loadCase[factorKey];
//             factorArrays[i - 1].push({ name: loadCase.loadCaseName, sign: loadCase.sign, factor: newFactor });
//             // factorArrays[i - 1].push({ name: loadCase.loadCaseName, sign: loadCase.sign === "+" ? "-" : "+", factor: newFactor });
//           }
//         }
//       } else {
//         const nestedLoadCase = getLoadCaseFactors(loadCase.loadCaseName, combinations);
//         if (nestedLoadCase && Array.isArray(nestedLoadCase.loadCases)) {
//           const nestedResults = createCombinations(nestedLoadCase, combinations, loadNames, factor);
//           for (let i = 0; i < factorArrays.length; i++) {
//             factorArrays[i].push(...nestedResults);
//           }
//         } else {
//           console.error(`Load case ${loadCase.loadCaseName} not found in combinations.`);
//         }
//       }
//     }
//     result.push(...factorArrays.filter(array => array.length > 0));

//   } else if (loadCombination.type === "Either") {
//     for (const loadCase of loadCombination.loadCases) {
//       if (loadNames.includes(loadCase.loadCaseName)) {
//         for (let i = 1; i <= 5; i++) {
//           const factorKey = `factor${i}`;
//           if (loadCase[factorKey] !== undefined) {
//             const newFactor = factor * loadCase[factorKey];
//             const eitherResult = [{ name: loadCase.loadCaseName, sign: loadCase.sign, factor: newFactor }];
//             // eitherResult.push({ name: loadCase.loadCaseName, sign: loadCase.sign === "+" ? "-" : "+", factor: newFactor });
//             result.push(eitherResult);
//           }
//         }
//       } else {
//         const nestedLoadCase = getLoadCaseFactors(loadCase.loadCaseName, combinations);
//         if (nestedLoadCase && Array.isArray(nestedLoadCase.loadCases)) {
//           const nestedResults = createCombinations(nestedLoadCase, combinations, loadNames, factor);
//           result.push(...nestedResults);
//         } else {
//           console.error(`Load case ${loadCase.loadCaseName} not found in combinations.`);
//         }
//       }
//     }
//   }

//   return result;
// }

// function createCombinations(loadCombination, combinations, loadNames, factor = 1) {
//   if (!Array.isArray(loadCombination.loadCases)) {
//     console.error('loadCases is not an array.');
//     return [];
//   }

//   const result = [];
//   console.log(loadCombination.loadCases);

//   if (loadCombination.type === "Add") {
//     for (const loadCase of loadCombination.loadCases) {
//       if (loadNames.includes(loadCase.loadCaseName)) {
//         for (let i = 1; ; i++) {
//           const factorKey = `factor${i}`;
//           if (loadCase[factorKey] === undefined) break;
//           const newFactor = factor * loadCase[factorKey];
//           if (!result[i - 1]) result[i - 1] = [];
//           result[i - 1].push({ name: loadCase.loadCaseName, sign: loadCase.sign, factor: newFactor });
//         }
//       } else {
//         const nestedLoadCase = getLoadCaseFactors(loadCase.loadCaseName, combinations);
//         if (nestedLoadCase && Array.isArray(nestedLoadCase.loadCases)) {
//           const nestedResults = createCombinations(nestedLoadCase, combinations, loadNames, factor);
//           for (let i = 0; i < nestedResults.length; i++) {
//             if (!result[i]) result[i] = [];
//             result[i].push(...nestedResults[i]);
//           }
//         } else {
//           console.error(`Load case ${loadCase.loadCaseName} not found in combinations.`);
//         }
//       }
//     }

//   } else if (loadCombination.type === "Either") {
//     for (const loadCase of loadCombination.loadCases) {
//       if (loadNames.includes(loadCase.loadCaseName)) {
//         for (let i = 1; ; i++) {
//           const factorKey = `factor${i}`;
//           if (loadCase[factorKey] === undefined) break;
//           const newFactor = factor * loadCase[factorKey];
//           result.push([{ name: loadCase.loadCaseName, sign: loadCase.sign, factor: newFactor }]);
//         }
//       } else {
//         const nestedLoadCase = getLoadCaseFactors(loadCase.loadCaseName, combinations);
//         if (nestedLoadCase && Array.isArray(nestedLoadCase.loadCases)) {
//           const nestedResults = createCombinations(nestedLoadCase, combinations, loadNames, factor);
//           result.push(...nestedResults);
//         } else {
//           console.error(`Load case ${loadCase.loadCaseName} not found in combinations.`);
//         }
//       }
//     }
//   }

//   return result;
// }

// function createCombinations(loadCombination, combinations, loadNames, factor = 1) {
//   if (!Array.isArray(loadCombination.loadCases)) {
//     console.error('loadCases is not an array.');
//     return [];
//   }

//   const result = [];

//   for (const loadCase of loadCombination.loadCases) {
//     if (loadNames.includes(loadCase.loadCaseName)) {
//       // Case 1: LoadCase is present in loadNames
//       const caseResult = [];
//       for (let i = 1; ; i++) {
//         const factorKey = `factor${i}`;
//         if (loadCase[factorKey] === undefined) break;
//         const newFactor = factor * loadCase[factorKey];
//         caseResult.push({ name: loadCase.loadCaseName, sign: loadCase.sign, factor: newFactor });
//       }
//       result.push(caseResult);

//     } else {
//       // Case 2: LoadCase not in loadNames, search in combinations
//       const nestedLoadCase = getLoadCaseFactors(loadCase.loadCaseName, combinations);
//       if (nestedLoadCase && Array.isArray(nestedLoadCase.loadCases)) {
//         const nestedResults = createCombinations(nestedLoadCase, combinations, loadNames, factor);
//         if (loadCombination.type === "Add") {
//           for (let i = 0; i < nestedResults.length; i++) {
//             if (!result[i]) result[i] = [];
//             result[i].push(...nestedResults[i]);
//           }
//         } else if (loadCombination.type === "Either") {
//           result.push(...nestedResults);
//         }
//       } else {
//         console.error(`Load case ${loadCase.loadCaseName} not found in combinations.`);
//       }
//     }
//   }

//   return result;
// }
// function createCombinations(loadCombination, combinations, loadNames, factor = 1) {
//   if (!Array.isArray(loadCombination.loadCases)) {
//     console.error('loadCases is not an array.');
//     return [];
//   }

//   const result = [];

//   for (const loadCase of loadCombination.loadCases) {
//     if (loadNames.includes(loadCase.loadCaseName)) {
//       // Case 1: LoadCase is present in loadNames
//       const caseResult = [];

//       // Create subarrays for each factor defined
//       for (let i = 1; ; i++) {
//         const factorKey = `factor${i}`;
//         if (loadCase[factorKey] === undefined) break;
//         caseResult.push({ name: loadCase.loadCaseName, sign: loadCase.sign, factor: loadCase[factorKey] });
//       }

//       // If 'Add' type, nest arrays for each factor
//       if (loadCombination.type === "Add") {
//         const nestedResult = [];
//         for (const factorObj of caseResult) {
//           const nestedArray = [];
//           nestedArray.push(factorObj);
//           nestedResult.push(nestedArray);
//         }
//         result.push(nestedResult);

//       } else if (loadCombination.type === "Either") {
//         // If 'Either' type, push each factor as a separate array
//         for (const factorObj of caseResult) {
//           result.push([[factorObj]]);
//         }
//       }

//     } else {
//       // Case 2: LoadCase not in loadNames, search in combinations
//       const nestedLoadCase = getLoadCaseFactors(loadCase.loadCaseName, combinations);
//       if (nestedLoadCase && Array.isArray(nestedLoadCase.loadCases)) {
//         const nestedResults = createCombinations(nestedLoadCase, combinations, loadNames, factor);
//         result.push(nestedResults);
//       } else {
//         console.error(`Load case ${loadCase.loadCaseName} not found in combinations.`);
//       }
//     }
//   }

//   return result;
// }
// function createCombinations(loadCombination, combinations, loadNames, factor = 1) {
//   if (!Array.isArray(loadCombination.loadCases)) {
//     console.error('loadCases is not an array.');
//     return [];
//   }

//   const result = [];

//   for (const loadCase of loadCombination.loadCases) {
//     if (loadNames.includes(loadCase.loadCaseName)) {
//       // Case 1: LoadCase is present in loadNames
//       const caseResults = [];

//       // Create subarrays for each factor defined
//       for (let i = 1; ; i++) {
//         const factorKey = `factor${i}`;
//         if (loadCase[factorKey] === undefined) break;
//         caseResults.push({ name: loadCase.loadCaseName, sign: loadCase.sign, factor: loadCase[factorKey] });
//       }

//       if (loadCombination.type === "Add") {
//         // If 'Add' type, each factor gets its own nested array
//         for (const caseResult of caseResults) {
//           result.push([caseResult]);
//         }
//       } else if (loadCombination.type === "Either") {
//         // If 'Either' type, each factor is a separate option
//         result.push(caseResults.map(cr => [cr]));
//       }

//     } else {
//       // Case 2: LoadCase not in loadNames, search in combinations
//       const nestedLoadCase = getLoadCaseFactors(loadCase.loadCaseName, combinations);
//       if (nestedLoadCase && Array.isArray(nestedLoadCase.loadCases)) {
//         const nestedResults = createCombinations(nestedLoadCase, combinations, loadNames, factor);
//         result.push(...nestedResults);
//       } else {
//         console.error(`Load case ${loadCase.loadCaseName} not found in combinations.`);
//       }
//     }
//   }

//   return result;
// }

// Function to generate permutations and combinations of load combinations
// function combi_pc(loadCombinations) {
//   // Function to generate combinations of two arrays
//   function combineArrays(arr1, arr2) {
//     const result = [];
//     for (let item1 of arr1) {
//       for (let item2 of arr2) {
//         result.push([...item1, ...item2]);
//       }
//     }
//     return result;
//   }

//   // Function to generate permutations of an array
//   function permuteArray(arr) {
//     if (arr.length === 1) {
//       return [arr];
//     }
//     const result = [];
//     const firstElement = arr[0];
//     const remainingElements = arr.slice(1);
//     const recursivePermutations = permuteArray(remainingElements);
//     for (let perm of recursivePermutations) {
//       for (let i = 0; i <= perm.length; i++) {
//         const permutation = [...perm.slice(0, i), firstElement, ...perm.slice(i)];
//         result.push(permutation);
//       }
//     }
//     return result;
    
//   }

//   // Initialize combinations with the first set of load combinations
//   let combinations = loadCombinations[0];

//   // Iterate over the rest of the load combinations
//   for (let i = 1; i < loadCombinations.length; i++) {
//     const currentLoadComb = loadCombinations[i];
//     const newCombinations = [];

//     // Combine current combinations with currentLoadComb
//     for (let comb of combinations) {
//       for (let current of currentLoadComb) {
//         newCombinations.push(combineArrays(comb, current));
//       }
//     }

//     // Update combinations to include newCombinations
//     combinations = newCombinations;
//   }

//   // Return all generated combinations
//   return combinations;
// }
function combineArrays(arrays) {
  // Base case: if there's only one array, return it as is
  if (arrays.length === 1) {
    return arrays[0];
  }

  // Recursive case: combine the first array with the result of combining the rest of the arrays
  const result = [];
  const [firstArray, ...restArrays] = arrays;

  // Get combinations of the rest of the arrays
  const restCombinations = combineArrays(restArrays);

  // Combine each element of the first array with each element of the rest combinations
  for (const element of firstArray) {
    for (const restCombination of restCombinations) {
      result.push([element, ...restCombination]);
    }
  }

  return result;
}

function generatePermutationsOfCombinations(basicCombinations) {
  const allPermutations = combineArrays(basicCombinations);
  return allPermutations;
}
function createCombinations(loadCombination, combinations, loadNames, factor = 1) {
  if (!Array.isArray(loadCombination.loadCases)) {
    console.error('loadCases is not an array.');
    return [];
  }
// hello everyone
  const result = [];

  for (const loadCase of loadCombination.loadCases) {
    if (loadNames.includes(loadCase.loadCaseName)) {
      // Case 1: LoadCase is present in loadNames
      const caseResults = [];

      // Create subarrays for each factor defined
      for (let i = 1; ; i++) {
        const factorKey = `factor${i}`;
        if (loadCase[factorKey] === undefined) break;
        caseResults.push([{ name: loadCase.loadCaseName, sign: loadCase.sign, factor: loadCase[factorKey] }]);
      }

      // Push each caseResult as a separate nested array
      result.push(...caseResults);

    } else {
      // Case 2: LoadCase not in loadNames, search in combinations
      const nestedLoadCase = getLoadCaseFactors(loadCase.loadCaseName, combinations);
      if (nestedLoadCase && Array.isArray(nestedLoadCase.loadCases)) {
        const nestedResults = createCombinations(nestedLoadCase, combinations, loadNames, factor);
        result.push(nestedResults);
      } else {
        console.error(`Load case ${loadCase.loadCaseName} not found in combinations.`);
      }
    }
  }

  return result;
}


  function findStrengthCombinations(combinations) {
    return combinations.filter(combo => combo.active === "Strength");
  }

  function generateBasicCombinations(loadCombinations) {
    const strengthCombinations = findStrengthCombinations(loadCombinations);
    if (strengthCombinations.length === 0) {
      console.error("No combinations with active set to 'Strength' found.");
      return [];
    }

    const result = [];
    for (const strengthCombination of strengthCombinations) {
      result.push(...createCombinations(strengthCombination, loadCombinations, loadNames));
    }
    return result;
  }

  function Generate_Load_Combination() {
    const basicCombinations = generateBasicCombinations(loadCombinations);
    console.log(basicCombinations);
    // const combi=combi_pc(basicCombinations)
    // console.log(combi);
    const permutations = generatePermutationsOfCombinations(basicCombinations);
    console.log("All Possible Permutations of Combinations:", permutations);
  }
const toggleExcelReader = () => {
  fileInputRef.current.click(); // Trigger the file input click
};
const [loadCombinations, setLoadCombinations] = useState([{ loadCombination: '', active: '', type: '', loadCases: [] }]);
  useEffect(() => {
    // Ensure there is always an additional empty row at the end
    const lastCombination = loadCombinations[loadCombinations.length - 1];
    if (lastCombination && (lastCombination.loadCombination !== '' || lastCombination.active !== '' || lastCombination.type !== '')) {
      setLoadCombinations([...loadCombinations, { loadCombination: '', active: '', type: '', loadCases: [] }]);
      setInputValue(''); 
    }
  }, [loadCombinations]);
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
  // const addNewLoadCombination = () => {
  //   setLoadCombinations([...loadCombinations, { loadCombination: '', active: '', type: '', loadCases: [] }]);
  // };
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