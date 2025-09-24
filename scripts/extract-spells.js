import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to parse damage formulas
function parseDamageFormula(text) {
  // Match patterns like "4d4 Acid damage", "2d6 + 3 Fire damage"
  const damagePattern = /(\d+d\d+(?:\s*[+\-]\s*\d+)?)\s+(\w+)\s+damage/gi;
  const damages = [];
  let match;

  while ((match = damagePattern.exec(text)) !== null) {
    const formula = match[1].replace(/\s/g, "");
    const damageType = match[2];

    // Calculate average damage
    const diceMatch = formula.match(/(\d+)d(\d+)(?:([+\-])(\d+))?/);
    if (diceMatch) {
      const diceCount = parseInt(diceMatch[1]);
      const diceSize = parseInt(diceMatch[2]);
      const bonus = diceMatch[3] ? (diceMatch[3] === "+" ? parseInt(diceMatch[4]) : -parseInt(diceMatch[4])) : 0;
      const average = (diceCount * (diceSize + 1)) / 2 + bonus;

      damages.push({
        formula,
        damageType: damageType.charAt(0).toUpperCase() + damageType.slice(1).toLowerCase(),
        average,
      });
    }
  }

  return damages;
}

// Helper function to parse spell header
function parseSpellHeader(headerLine) {
  // Remove the ### marker
  const cleanHeader = headerLine.replace(/^###\s*/, "");

  // Parse patterns like "Acid Arrow Level 2 Evocation (Wizard)"
  // or "Acid Splash Evocation Cantrip (Sorcerer, Wizard)"

  const patterns = [
    // Pattern 1: Name Level X School (Classes)
    /^(.+?)\s+Level\s+(\d+)\s+(\w+)\s*\(([^)]+)\)/,
    // Pattern 2: Name School Cantrip (Classes)
    /^(.+?)\s+(\w+)\s+Cantrip\s*\(([^)]+)\)/,
    // Pattern 3: Name School Level X (Classes) - alternative order
    /^(.+?)\s+(\w+)\s+Level\s+(\d+)\s*\(([^)]+)\)/,
  ];

  for (const pattern of patterns) {
    const match = cleanHeader.match(pattern);
    if (match) {
      if (pattern === patterns[1]) {
        // Cantrip pattern
        return {
          name: match[1].trim(),
          level: 0,
          school: match[2],
          isCantrip: true,
          classes: match[3].split(",").map((c) => c.trim()),
        };
      } else if (pattern === patterns[0]) {
        // Level X pattern
        return {
          name: match[1].trim(),
          level: parseInt(match[2]),
          school: match[3],
          isCantrip: false,
          classes: match[4].split(",").map((c) => c.trim()),
        };
      } else if (pattern === patterns[2]) {
        // Alternative pattern
        return {
          name: match[1].trim(),
          level: parseInt(match[3]),
          school: match[2],
          isCantrip: false,
          classes: match[4].split(",").map((c) => c.trim()),
        };
      }
    }
  }

  // Fallback - try to extract just the name
  return {
    name: cleanHeader.trim(),
    level: null,
    school: null,
    isCantrip: false,
    classes: [],
  };
}

// Helper function to parse spell details line
function parseSpellDetails(detailsLine) {
  const result = {
    castingTime: { time: null, isRitual: false },
    range: null,
    components: { verbal: false, somatic: false, material: false, materialDescription: null },
    duration: { durationType: null, concentration: false },
  };

  // Extract casting time
  const castingTimeMatch = detailsLine.match(/Casting Time:\s*([^R]+?)(?:\s+or\s+Ritual)?\s+Range:/);
  if (castingTimeMatch) {
    result.castingTime.time = castingTimeMatch[1].trim();
    result.castingTime.isRitual = detailsLine.includes("or Ritual");
  }

  // Extract range
  const rangeMatch = detailsLine.match(/Range:\s*([^C]+?)\s+Components:/);
  if (rangeMatch) {
    result.range = rangeMatch[1].trim();
  }

  // Extract components
  const componentsMatch = detailsLine.match(/Components:\s*([^D]+?)\s+Duration:/);
  if (componentsMatch) {
    const components = componentsMatch[1].trim();
    result.components.verbal = components.includes("V");
    result.components.somatic = components.includes("S");
    result.components.material = components.includes("M");

    // Extract material description if present
    const materialMatch = components.match(/M\s*\(([^)]+)\)/);
    if (materialMatch) {
      result.components.materialDescription = materialMatch[1].trim();
    }
  }

  // Extract duration
  const durationMatch = detailsLine.match(/Duration:\s*(.+)$/);
  if (durationMatch) {
    const duration = durationMatch[1].trim();
    result.duration.concentration = duration.includes("Concentration");

    if (duration.includes("Instantaneous")) {
      result.duration.durationType = "Instantaneous";
    } else if (duration.includes("Concentration")) {
      result.duration.durationType = "Concentration";
      result.duration.duration = duration.replace("Concentration, ", "");
    } else if (duration.includes("Until Dispelled")) {
      result.duration.durationType = "Until Dispelled";
    } else {
      result.duration.durationType = "Timed";
      result.duration.duration = duration;
    }
  }

  return result;
}

// Helper function to parse summoned creature and clean description
function parseSummonedCreature(text) {
  // Match patterns like "$$$Creature Name"
  const creaturePattern = /\$\$\$([^$\n\r]+)/;
  const match = text.match(creaturePattern);

  let summonedCreature = null;
  let cleanedText = text;

  if (match) {
    summonedCreature = match[1].trim();
    // Remove all $$$ markers from the text
    cleanedText = text.replace(/\$\$\$[^$\n\r]+/g, '').replace(/\s+/g, ' ').trim();
  }

  return {
    summonedCreature,
    cleanedDescription: cleanedText
  };
}

// Helper function to determine attack type and saving throw
function determineAttackInfo(description) {
  const result = {
    attackType: "none",
    savingThrow: null,
  };

  if (description.includes("spell attack")) {
    result.attackType = "spell_attack";
  } else if (description.includes("saving throw")) {
    result.attackType = "saving_throw";

    // Try to extract saving throw ability
    const saveMatch = description.match(/(\w+)\s+saving\s+throw/i);
    if (saveMatch) {
      const ability = saveMatch[1];
      result.savingThrow = {
        ability: ability.charAt(0).toUpperCase() + ability.slice(1).toLowerCase(),
        success: "negates", // Default, could be improved with more parsing
      };
    }
  }

  return result;
}

// Helper function to finalize spell
function finalizeSpell(currentSpell, descriptionLines) {
  if (!currentSpell || descriptionLines.length === 0) {
    return null;
  }

  const fullDescription = descriptionLines.join(" ").trim();

  // Parse summoned creature and clean description
  const { summonedCreature, cleanedDescription } = parseSummonedCreature(fullDescription);
  currentSpell.description = cleanedDescription;

  if (summonedCreature) {
    currentSpell.summonedCreature = summonedCreature;
  }

  // Extract higher levels info
  const higherLevelsMatch = currentSpell.description.match(/Using a Higher-Level Spell Slot\.(.*?)(?:\.|$)/s);
  if (higherLevelsMatch) {
    currentSpell.higherLevels = higherLevelsMatch[1].trim();
    currentSpell.description = currentSpell.description.replace(/Using a Higher-Level Spell Slot\..*/, "").trim();
  }

  // Extract cantrip upgrade info
  const cantripMatch = currentSpell.description.match(/Cantrip Upgrade\.(.*?)(?:\.|$)/s);
  if (cantripMatch) {
    currentSpell.cantripUpgrade = cantripMatch[1].trim();
    currentSpell.description = currentSpell.description.replace(/Cantrip Upgrade\..*/, "").trim();
  }

  // Parse damage (use cleaned description)
  const damages = parseDamageFormula(currentSpell.description);
  if (damages.length > 0) {
    currentSpell.damage = damages;
  }

  // Determine attack type
  const attackInfo = determineAttackInfo(fullDescription);
  currentSpell.attackType = attackInfo.attackType;
  if (attackInfo.savingThrow) {
    currentSpell.savingThrow = attackInfo.savingThrow;
  }

  return currentSpell;
}

// Main extraction function
function extractSpells() {
  const inputFile = path.join(__dirname, "../data", "spells.txt");
  const outputFile = path.join(__dirname, "../data", "spells.json");

  try {
    const content = fs.readFileSync(inputFile, "utf8");
    const lines = content.split("\n");

    const spells = [];
    let currentSpell = null;
    let collectingDescription = false;
    let descriptionLines = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // Remove line numbers if they exist (format: "number→")
      line = line.replace(/^\d+→/, "");

      // Skip empty lines
      if (!line) {
        continue;
      }

      // Check if this is a spell header (marked with ###)
      if (line.startsWith("###")) {
        // Save previous spell if exists
        const finishedSpell = finalizeSpell(currentSpell, descriptionLines);
        if (finishedSpell) {
          spells.push(finishedSpell);
        }

        // Check if this line contains casting time (start of spell details)
        const hasCastingTime = line.includes("Casting Time:");

        if (hasCastingTime) {
          // Extract the header part (before "Casting Time:")
          const headerPart = line.split("Casting Time:")[0].trim();
          const spellInfo = parseSpellHeader(headerPart);

          // Create new spell
          currentSpell = {
            ...spellInfo,
            castingTime: { time: null, isRitual: false },
            range: null,
            components: { verbal: false, somatic: false, material: false },
            duration: { durationType: null, concentration: false },
            description: "",
            attackType: "none",
            ritual: false,
            tags: [],
          };

          // Start collecting spell details (may continue on next lines)
          let spellDetailsLine = "Casting Time:" + line.split("Casting Time:")[1];

          // Check if we need to collect more lines for complete spell details
          let j = i + 1;
          while (j < lines.length && !spellDetailsLine.includes("Duration:")) {
            let nextLine = lines[j].trim().replace(/^\d+→/, "");
            if (nextLine && !nextLine.startsWith("###")) {
              spellDetailsLine += " " + nextLine;
              j++;
            } else {
              break;
            }
          }

          // Parse the complete spell details
          if (spellDetailsLine.includes("Duration:")) {
            const details = parseSpellDetails(spellDetailsLine);
            Object.assign(currentSpell, details);
            currentSpell.ritual = details.castingTime.isRitual;
          }

          // Skip the lines we consumed
          i = j - 1;
          collectingDescription = true;
          descriptionLines = [];
        } else {
          // Separate-line format: "###SpellName" followed by details on next line
          const spellInfo = parseSpellHeader(line);
          currentSpell = {
            ...spellInfo,
            castingTime: { time: null, isRitual: false },
            range: null,
            components: { verbal: false, somatic: false, material: false },
            duration: { durationType: null, concentration: false },
            description: "",
            attackType: "none",
            ritual: false,
            tags: [],
          };
          collectingDescription = false;
          descriptionLines = [];
        }
        continue;
      }

      // Check if this line contains spell details (for separate-line format)
      if (
        line.includes("Casting Time:") &&
        line.includes("Range:") &&
        line.includes("Components:") &&
        line.includes("Duration:")
      ) {
        if (currentSpell) {
          const details = parseSpellDetails(line);
          Object.assign(currentSpell, details);
          currentSpell.ritual = details.castingTime.isRitual;
        }
        collectingDescription = true;
        continue;
      }

      // Collect description lines
      if (collectingDescription && currentSpell) {
        // Skip lines that are likely stat blocks or other non-description content
        if (!line.match(/^(AC|HP|Speed|STR|DEX|CON|INT|WIS|CHA|\d+→)/)) {
          descriptionLines.push(line);
        }
      }
    }

    // Don't forget the last spell
    const finishedSpell = finalizeSpell(currentSpell, descriptionLines);
    if (finishedSpell) {
      spells.push(finishedSpell);
    }

    // Write to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(spells, null, 2), "utf8");

    console.log(`Successfully extracted ${spells.length} spells to ${outputFile}`);

    // Show some statistics
    const cantrips = spells.filter((s) => s.isCantrip).length;
    const leveledSpells = spells.length - cantrips;
    const spellsWithSummons = spells.filter((s) => s.summonedCreature).length;
    const schoolCounts = {};

    spells.forEach((spell) => {
      if (spell.school) {
        schoolCounts[spell.school] = (schoolCounts[spell.school] || 0) + 1;
      }
    });

    console.log(`\nStatistics:`);
    console.log(`- Cantrips: ${cantrips}`);
    console.log(`- Leveled spells: ${leveledSpells}`);
    console.log(`- Spells with summoned creatures: ${spellsWithSummons}`);
    console.log(`- Schools:`);
    Object.entries(schoolCounts)
      .sort()
      .forEach(([school, count]) => {
        console.log(`  - ${school}: ${count}`);
      });

    // Show first few spell names for verification
    console.log(`\nFirst 10 spells extracted:`);
    spells.slice(0, 10).forEach((spell, idx) => {
      console.log(`${idx + 1}. ${spell.name} (${spell.isCantrip ? "Cantrip" : `Level ${spell.level}`})`);
    });
  } catch (error) {
    console.error("Error extracting spells:", error);
  }
}

// Run the extraction
extractSpells();
