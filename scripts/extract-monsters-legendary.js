import fs from "fs";
import path from "path";

// Enhanced parsing functions
function parseAbilityScoresFromLines(line1, line2) {
  const abilities = {};

  // Parse individual abilities using unicode-aware regex (− vs -)
  const abilityRegex = /([+-−]?\d+)/g;

  // Parse STR from line1
  const strMatch = line1.match(/Str\s+(\d+)\s+([+-−]?\d+)\s+([+-−]?\d+)/);
  if (strMatch) {
    abilities.strength = {
      score: parseInt(strMatch[1]),
      modifier: parseInt(strMatch[2].replace("−", "-")),
      save: parseInt(strMatch[3].replace("−", "-")),
    };
  }

  // Parse DEX from line1
  const dexMatch = line1.match(/Dex\s+(\d+)\s+([+-−]?\d+)\s+([+-−]?\d+)/);
  if (dexMatch) {
    abilities.dexterity = {
      score: parseInt(dexMatch[1]),
      modifier: parseInt(dexMatch[2].replace("−", "-")),
      save: parseInt(dexMatch[3].replace("−", "-")),
    };
  }

  // Parse CON from line1
  const conMatch = line1.match(/Con\s+(\d+)\s+([+-−]?\d+)\s+([+-−]?\d+)/);
  if (conMatch) {
    abilities.constitution = {
      score: parseInt(conMatch[1]),
      modifier: parseInt(conMatch[2].replace("−", "-")),
      save: parseInt(conMatch[3].replace("−", "-")),
    };
  }

  // Parse INT from line2
  const intMatch = line2.match(/Int\s+(\d+)\s+([+-−]?\d+)\s+([+-−]?\d+)/);
  if (intMatch) {
    abilities.intelligence = {
      score: parseInt(intMatch[1]),
      modifier: parseInt(intMatch[2].replace("−", "-")),
      save: parseInt(intMatch[3].replace("−", "-")),
    };
  }

  // Parse WIS from line2
  const wisMatch = line2.match(/WIS\s+(\d+)\s+([+-−]?\d+)\s+([+-−]?\d+)/);
  if (wisMatch) {
    abilities.wisdom = {
      score: parseInt(wisMatch[1]),
      modifier: parseInt(wisMatch[2].replace("−", "-")),
      save: parseInt(wisMatch[3].replace("−", "-")),
    };
  }

  // Parse CHA from line2
  const chaMatch = line2.match(/Cha\s+(\d+)\s+([+-−]?\d+)\s+([+-−]?\d+)/);
  if (chaMatch) {
    abilities.charisma = {
      score: parseInt(chaMatch[1]),
      modifier: parseInt(chaMatch[2].replace("−", "-")),
      save: parseInt(chaMatch[3].replace("−", "-")),
    };
  }

  return abilities;
}

function parseHitPoints(str) {
  const match = str.match(/HP\s+(\d+)\s*\(([^)]+)\)/);
  if (!match) return null;
  return {
    average: parseInt(match[1]),
    formula: match[2].trim(),
  };
}

function parseSpeed(str) {
  // Convert to simple string array
  const speedStrings = [];

  const walkMatch = str.match(/Speed\s+(\d+)\s*ft/);
  if (walkMatch) speedStrings.push(`${walkMatch[1]} ft.`);

  const swimMatch = str.match(/Swim\s+(\d+)\s*ft/);
  if (swimMatch) speedStrings.push(`swim ${swimMatch[1]} ft.`);

  const flyMatch = str.match(/Fly\s+(\d+)\s*ft/);
  if (flyMatch) {
    let flyString = `fly ${flyMatch[1]} ft.`;
    if (str.includes("hover")) flyString += " (hover)";
    speedStrings.push(flyString);
  }

  const burrowMatch = str.match(/Burrow\s+(\d+)\s*ft/);
  if (burrowMatch) speedStrings.push(`burrow ${burrowMatch[1]} ft.`);

  const climbMatch = str.match(/Climb\s+(\d+)\s*ft/);
  if (climbMatch) speedStrings.push(`climb ${climbMatch[1]} ft.`);

  return speedStrings;
}

function parseInitiative(str) {
  const match = str.match(/Initiative\s*([+-]\d+)\s*\((\d+)\)/);
  if (!match) return null;
  return {
    modifier: parseInt(match[1]),
    total: parseInt(match[2]),
  };
}

function parseChallengeRating(str) {
  const match = str.match(/CR\s+([\d/]+)\s*\(XP\s+([\d,]+)(?:,\s*or\s+[\d,]+\s+in\s+lair)?;\s*PB\s*([+-]\d+)\)/);
  if (!match) return null;
  return {
    rating: match[1],
    experiencePoints: parseInt(match[2].replace(/,/g, "")),
    proficiencyBonus: parseInt(match[3]),
  };
}

function parseSenses(str) {
  // Convert to simple string array
  const sensesStrings = [];

  const darkvisionMatch = str.match(/Darkvision\s+(\d+)\s*ft/);
  if (darkvisionMatch) sensesStrings.push(`Darkvision ${darkvisionMatch[1]} ft.`);

  const blindsightMatch = str.match(/Blindsight\s+(\d+)\s*ft/);
  if (blindsightMatch) sensesStrings.push(`Blindsight ${blindsightMatch[1]} ft.`);

  const truesightMatch = str.match(/Truesight\s+(\d+)\s*ft/);
  if (truesightMatch) sensesStrings.push(`Truesight ${truesightMatch[1]} ft.`);

  const tremorsenseMatch = str.match(/Tremorsense\s+(\d+)\s*ft/);
  if (tremorsenseMatch) sensesStrings.push(`Tremorsense ${tremorsenseMatch[1]} ft.`);

  const passiveMatch = str.match(/Passive\s+Perception\s+(\d+)/);
  if (passiveMatch) sensesStrings.push(`Passive Perception ${passiveMatch[1]}`);

  return sensesStrings;
}

function parseSkills(str) {
  // Convert to simple string array
  if (!str.includes("Skills")) return [];

  const skillsSection = str.split("Skills")[1].split(/Senses|Resistances|Immunities|Vulnerabilities|Gear/)[0];
  const skillStrings = [];

  // Match patterns like "History +12, Perception +10"
  const skillMatches = skillsSection.match(/([A-Za-z\s]+)\s*([+-]\d+)/g) || [];
  skillMatches.forEach((skill) => {
    const [, name, bonus] = skill.match(/([A-Za-z\s]+)\s*([+-]\d+)/);
    skillStrings.push(`${name.trim()} ${bonus}`);
  });

  return skillStrings;
}

function parseLanguagesAndTelepathy(str) {
  if (!str.includes("Languages")) return [];

  const languages = [];

  // Find the languages section (stop at CR, semicolon, or end of string)
  const langMatch = str.match(/Languages\s+([^;]+?)(?:\s+CR\s|\s*;|$)/);
  if (langMatch) {
    const languagesPart = langMatch[1].trim();

    // Split by commas and clean up
    const langList = languagesPart
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l && l !== "None");
    languages.push(...langList);
  }

  // Check for telepathy in the same line and add it as a language entry
  const telepathyMatch = str.match(/telepathy\s+(\d+)\s*ft/i);
  if (telepathyMatch) {
    languages.push(`telepathy ${telepathyMatch[1]} ft.`);
  }

  return languages;
}

function parseActionsWithDice(actionText) {
  const actions = [];
  if (!actionText) return actions;

  // Split the text into lines and process sequentially for actions
  const lines = actionText.split("\n");
  let currentAction = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if this line starts a new action
    // Action format: "ActionName. Description..."
    const actionStartMatch = line.match(/^([A-Z][a-zA-Z\s()\/,\d-]+?)\.\s*(.*)$/);

    if (actionStartMatch) {
      // Save previous action if exists
      if (currentAction) {
        actions.push(parseActionDiceData(currentAction));
      }

      // Start new action
      const actionName = actionStartMatch[1].trim();
      const actionDescription = actionStartMatch[2].trim();

      // Skip if it looks like ability scores or other non-action content
      if (actionName.match(/^(Str|Dex|Con|Int|WIS|Cha)\s+\d+/) || actionName.length < 2) {
        continue;
      }

      currentAction = {
        name: actionName,
        description: actionDescription,
      };
    } else if (currentAction) {
      // Continue description of current action
      if (currentAction.description) {
        currentAction.description += " " + line;
      } else {
        currentAction.description = line;
      }
    }
  }

  // Add last action
  if (currentAction) {
    actions.push(parseActionDiceData(currentAction));
  }

  return actions;
}

function parseActionDiceData(action) {
  const result = {
    name: action.name,
    description: action.description,
    type: "special",
  };

  const description = action.description;

  // Parse Attack Roll
  const attackMatch = description.match(/(Melee|Ranged)\s+Attack\s+Roll:\s*([+-]\d+)/);
  if (attackMatch) {
    result.attackRoll = {
      type: attackMatch[1].toLowerCase(),
      bonus: parseInt(attackMatch[2]),
    };
    result.type = attackMatch[1].toLowerCase();
  }

  // Parse Saving Throw
  const saveMatch = description.match(/([A-Za-z]+)\s+Saving\s+Throw:\s*DC\s*(\d+)/);
  if (saveMatch) {
    result.savingThrow = {
      ability: saveMatch[1],
      dc: parseInt(saveMatch[2]),
    };
  }

  // Parse Damage
  const damageMatches = description.match(/(\d+)\s*\(([^)]+)\)\s*([A-Za-z]+)\s*damage/g);
  if (damageMatches) {
    result.damage = damageMatches.map((dmg) => {
      const [, average, formula, type] = dmg.match(/(\d+)\s*\(([^)]+)\)\s*([A-Za-z]+)\s*damage/);
      return {
        average: parseInt(average),
        formula: formula.trim(),
        type: type.trim(),
      };
    });
  }

  // Parse Healing
  const healingMatch = description.match(/regains?\s+(\d+)\s*\(([^)]+)\)\s*Hit\s+Points/i);
  if (healingMatch) {
    result.healing = {
      average: parseInt(healingMatch[1]),
      formula: healingMatch[2].trim(),
    };
  }

  // Parse Conditions with DCs
  const conditions = [];

  // Grappled condition
  const grappledMatch = description.match(/Grappled\s+condition\s*\(escape\s+DC\s+(\d+)\)/i);
  if (grappledMatch) {
    conditions.push({
      name: "Grappled",
      dc: parseInt(grappledMatch[1]),
    });
  }

  // Other conditions with DCs (generic pattern)
  const conditionMatches = description.match(/([A-Za-z]+)\s+condition[^(]*\([^)]*DC\s+(\d+)[^)]*\)/gi);
  if (conditionMatches) {
    conditionMatches.forEach((condMatch) => {
      const [, condName, dc] = condMatch.match(/([A-Za-z]+)\s+condition[^(]*\([^)]*DC\s+(\d+)[^)]*\)/i);
      if (condName && condName.toLowerCase() !== "grappled") {
        // Avoid duplicates
        conditions.push({
          name: condName,
          dc: parseInt(dc),
        });
      }
    });
  }

  // Simple conditions without DCs
  const simpleConditions = [
    "Poisoned",
    "Charmed",
    "Frightened",
    "Prone",
    "Blinded",
    "Restrained",
    "Stunned",
    "Paralyzed",
    "Petrified",
  ];
  simpleConditions.forEach((condName) => {
    const condRegex = new RegExp(`\\b${condName}\\s+condition\\b`, "i");
    if (condRegex.test(description) && !conditions.some((c) => c.name === condName)) {
      conditions.push({
        name: condName,
      });
    }
  });

  if (conditions.length > 0) {
    result.conditions = conditions;
  }

  // Parse Recharge
  const rechargeMatch = description.match(/\(Recharge\s+([\d-]+)\)/);
  if (rechargeMatch) result.recharge = rechargeMatch[1];

  // Parse Uses per Day
  const usesMatch = description.match(/\((\d+)\/Day\)/);
  if (usesMatch) result.usesPerDay = parseInt(usesMatch[1]);

  // Check for spellcasting
  if (action.name.toLowerCase().includes("spellcasting")) {
    result.spells = parseSpells(description);
    result.spellcasting = parseSpellcasting(description);
  }

  // Determine action type
  if (action.name === "Multiattack") result.type = "multiattack";

  return result;
}

function parseSpells(spellcastingText) {
  const spells = [];

  // Look for spell level sections like "Cantrips (at will):" or "1st level (4 slots):"
  const spellLevelMatches = spellcastingText.match(
    /(Cantrips?\s*\([^)]+\)|(\d+)(?:st|nd|rd|th)\s+level\s*\([^)]+\)):\s*([^\.]+)/g
  );

  if (spellLevelMatches) {
    spellLevelMatches.forEach((levelMatch) => {
      const [, levelInfo, spellList] = levelMatch.match(/^([^:]+):\s*(.+)$/);

      if (levelInfo && spellList) {
        spells.push({
          level: levelInfo.trim(),
          spells: spellList
            .split(",")
            .map((spell) => spell.trim())
            .filter((spell) => spell),
        });
      }
    });
  }

  return spells;
}

function parseSpellcasting(spellcastingText) {
  const result = {};

  // Extract the description part (everything before "At Will:" or similar)
  const descriptionMatch = spellcastingText.match(/^(.+?)(?:\s+At\s+Will:|$)/i);
  if (descriptionMatch) {
    result.description = descriptionMatch[1].trim();
  } else {
    result.description = spellcastingText;
  }

  // Parse "At Will" spells
  const atWillMatch = spellcastingText.match(/At\s+Will:\s*([^]+?)(?:\s+\d+\/Day|$)/i);
  if (atWillMatch) {
    const spellList = atWillMatch[1].trim();
    result.atWill = spellList
      .split(",")
      .map((spell) => spell.trim())
      .filter((spell) => spell);
  }

  // Parse "X/Day" spells with various patterns
  const perDayMatches = spellcastingText.match(/(\d+)\/Day\s+Each:\s*([^$]+)/i);
  if (perDayMatches) {
    result.perDay = {
      uses: parseInt(perDayMatches[1]),
      spells: perDayMatches[2]
        .split(",")
        .map((spell) => spell.trim())
        .filter((spell) => spell),
    };
  } else {
    // Try simpler pattern without "Each:"
    const simplePerDayMatch = spellcastingText.match(/(\d+)\/Day:\s*([^$]+)/i);
    if (simplePerDayMatch) {
      result.perDay = {
        uses: parseInt(simplePerDayMatch[1]),
        spells: simplePerDayMatch[2]
          .split(",")
          .map((spell) => spell.trim())
          .filter((spell) => spell),
      };
    }
  }

  return result;
}

function parseTraitsFixed(traitText) {
  if (!traitText) return [];

  const traits = [];

  // Split the text into lines and process sequentially
  const lines = traitText.split("\n");
  let currentTrait = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if this line starts a new trait
    // Trait format: "TraitName. Description..."
    // Look for a pattern that starts with capital letter, contains words/spaces/parens, then period
    const traitStartMatch = line.match(/^([A-Z][a-zA-Z\s()\/,\d-]+?)\.\s*(.*)$/);

    if (traitStartMatch) {
      // Save previous trait if exists with dice data parsing
      if (currentTrait) {
        traits.push(parseActionDiceData(currentTrait));
      }

      // Start new trait
      const traitName = traitStartMatch[1].trim();
      const traitDescription = traitStartMatch[2].trim();

      // Skip if it looks like ability scores or other non-trait content
      if (traitName.match(/^(Str|Dex|Con|Int|WIS|Cha)\s+\d+/) || traitName.length < 2) {
        continue;
      }

      currentTrait = {
        name: traitName,
        description: traitDescription,
      };
    } else if (currentTrait) {
      // Continue description of current trait
      if (currentTrait.description) {
        currentTrait.description += " " + line;
      } else {
        currentTrait.description = line;
      }
    }
  }

  // Add last trait with dice data parsing
  if (currentTrait) {
    traits.push(parseActionDiceData(currentTrait));
  }

  return traits;
}

function parseLegendaryActions(legendaryText) {
  if (!legendaryText) return null;

  const result = {};

  // Parse the usage description and uses
  const usageMatch = legendaryText.match(
    /Legendary\s+Action\s+Uses:\s*(\d+)(?:\s*\((\d+)\s+in\s+Lair\))?\.\s*([^]+?)(?=\n[A-Z]|\n\n|$)/
  );

  if (usageMatch) {
    result.uses = parseInt(usageMatch[1]);
    if (usageMatch[2]) {
      result.usesInLair = parseInt(usageMatch[2]);
    }

    // Extract the full usage description
    result.usageDescription = `Legendary Action Uses: ${usageMatch[1]}${usageMatch[2] ? ` (${usageMatch[2]} in Lair)` : ""}. ${usageMatch[3].trim()}`;
  } else {
    // Fallback: extract the entire first line as usage description
    const lines = legendaryText.split("\n");
    if (lines.length > 0) {
      result.usageDescription = lines[0].trim();

      // Try to extract uses from the first line
      const fallbackUsesMatch = result.usageDescription.match(/(\d+)(?:\s*\((\d+)\s+in\s+Lair\))?/);
      if (fallbackUsesMatch) {
        result.uses = parseInt(fallbackUsesMatch[1]);
        if (fallbackUsesMatch[2]) {
          result.usesInLair = parseInt(fallbackUsesMatch[2]);
        }
      }
    }
  }

  // Parse individual legendary actions
  // Remove the usage description to get the actions part
  const actionsText = legendaryText.replace(/^[^]*?(?=\n[A-Z][a-z]+\.|$)/, "").trim();

  if (actionsText) {
    result.actions = parseActionsWithDice(actionsText);
  } else {
    result.actions = [];
  }

  return result;
}

function parseMonsterEntry(text) {
  const lines = text.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return null;

  // First line contains name, size, type, and alignment all together
  const firstLine = lines[0].trim();

  // Parse the combined line: "Name Size Type, Alignment"
  // Size can be complex like "Medium or Small", so we need to capture everything before the creature type
  const combinedLineMatch = firstLine.match(
    /^(.+?)\s+([A-Z][a-z]+(?:\s+or\s+[A-Z][a-z]+)?)\s+([A-Za-z]+(?:\s*\([^)]+\))?),\s*(.+)$/
  );
  if (!combinedLineMatch) return null;

  const [, name, size, creatureType, alignment] = combinedLineMatch;

  // Skip if name looks like an ability score or action
  if (
    name.match(/^(Str|Dex|Con|Int|WIS|Cha)\s+\d+/) ||
    name.includes("Attack Roll") ||
    name.includes("damage") ||
    name.includes("+") ||
    name.match(/^\d/) ||
    name.length < 3
  ) {
    return null;
  }

  const monster = {
    name,
    size,
    type: creatureType.includes("(") ? creatureType.split("(")[0].trim() : creatureType,
    category: "",
    alignment,
    senses: [],
    languages: [],
    abilityScores: {
      strength: { score: 10, modifier: 0, save: 0 },
      dexterity: { score: 10, modifier: 0, save: 0 },
      constitution: { score: 10, modifier: 0, save: 0 },
      intelligence: { score: 10, modifier: 0, save: 0 },
      wisdom: { score: 10, modifier: 0, save: 0 },
      charisma: { score: 10, modifier: 0, save: 0 },
    },
    speed: [],
    hitPoints: { average: 1, formula: "1d4" },
    armorClass: 10,
    challengeRating: { rating: "0", experiencePoints: 0, proficiencyBonus: 2 },
    skills: [],
    damageVulnerabilities: [],
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    gear: [],
    traits: [],
    actions: [],
    bonusActions: [],
    reactions: [],
  };

  // Parse subtype
  if (creatureType.includes("(")) {
    const subtypeMatch = creatureType.match(/\(([^)]+)\)/);
    if (subtypeMatch) monster.subtype = subtypeMatch[1];
  }

  const fullText = text;

  // Parse AC/HP/Speed line
  const acLine = lines.find((line) => line.includes("AC") && line.includes("HP"));
  if (acLine) {
    const acMatch = acLine.match(/AC\s+(\d+)/);
    if (acMatch) monster.armorClass = parseInt(acMatch[1]);

    const initiative = parseInitiative(acLine);
    if (initiative) monster.initiative = initiative;

    const hitPoints = parseHitPoints(acLine);
    if (hitPoints) monster.hitPoints = hitPoints;

    const speed = parseSpeed(acLine);
    if (speed && speed.length > 0) monster.speed = speed;
  }

  // Parse ability scores - find the two lines that contain ability scores
  const abilityLine1 = lines.find((line) => line.includes("Str") && line.includes("Dex") && line.includes("Con"));
  const abilityLine2 = lines.find((line) => line.includes("Int") && line.includes("WIS") && line.includes("Cha"));

  if (abilityLine1 && abilityLine2) {
    const parsedAbilities = parseAbilityScoresFromLines(abilityLine1, abilityLine2);
    if (Object.keys(parsedAbilities).length > 0) {
      monster.abilityScores = parsedAbilities;
    }
  }

  // Parse skills as string array
  monster.skills = parseSkills(fullText);

  // Parse senses as string array
  const sensesLine = lines.find((line) => line.includes("Senses"));
  if (sensesLine) monster.senses = parseSenses(sensesLine);

  // Parse languages and telepathy together
  const languagesLine = lines.find((line) => line.includes("Languages"));
  if (languagesLine) {
    monster.languages = parseLanguagesAndTelepathy(languagesLine);
  }

  const crLine = lines.find((line) => line.includes("CR"));
  if (crLine) {
    const challengeRating = parseChallengeRating(crLine);
    if (challengeRating) monster.challengeRating = challengeRating;
  }

  // Parse traits with improved parsing
  const traitsMatch = fullText.match(/Traits\s+([^]*?)(?=Actions|Bonus Actions|Legendary Actions|$)/);
  if (traitsMatch) {
    monster.traits = parseTraitsFixed(traitsMatch[1]);
  }

  // Parse actions with dice roll data
  const actionsMatch = fullText.match(/Actions\s+([^]*?)(?=Bonus Actions|Legendary Actions|$)/);
  if (actionsMatch) {
    monster.actions = parseActionsWithDice(actionsMatch[1]);
  }

  const bonusActionsMatch = fullText.match(/Bonus Actions\s+([^]*?)(?=Legendary Actions|$)/);
  if (bonusActionsMatch) {
    monster.bonusActions = parseActionsWithDice(bonusActionsMatch[1]);
  }

  const reactionsMatch = fullText.match(/Reactions\s+([^]*?)(?=Legendary Actions|$)/);
  if (reactionsMatch) {
    monster.reactions = parseActionsWithDice(reactionsMatch[1]);
  }

  // Parse legendary actions with improved parsing
  const legendaryMatch = fullText.match(/Legendary Actions\s+([^]*?)(?=\n[A-Z][a-z]+\s*\n|$)/);
  if (legendaryMatch) {
    const legendaryActions = parseLegendaryActions(legendaryMatch[1]);
    if (legendaryActions && (legendaryActions.usageDescription || legendaryActions.actions?.length > 0)) {
      monster.legendaryActions = legendaryActions;
    }
  }

  return monster;
}

function extractMonstersWithLegendaryActions() {
  try {
    console.log("Starting monster extraction with category and ### markers...");

    const monstersPath = path.join(process.cwd(), "data", "monsters.txt");
    const monstersText = fs.readFileSync(monstersPath, "utf-8");

    const lines = monstersText.split("\n");
    const monsterEntries = [];
    let currentMonster = [];
    let currentCategory = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if this is a category marker
      if (line.startsWith("!") && line.endsWith("!")) {
        currentCategory = line.slice(1, -1); // Remove the ! markers
        continue;
      }

      // Check if this line starts a new monster (marked with ###)
      if (line.startsWith("###")) {
        // Save previous monster if we found one
        if (currentMonster.length > 0) {
          const monsterText = currentMonster.join("\n");
          monsterEntries.push({ text: monsterText, category: currentCategory });
        }

        // Start new monster (remove the ### marker)
        const monsterLine = line.substring(3); // Remove ###
        currentMonster = [monsterLine];
      } else if (currentMonster.length > 0) {
        // Add line to current monster (skip empty lines)
        if (line) {
          currentMonster.push(line);
        }
      }
    }

    // Add last monster
    if (currentMonster.length > 0) {
      const monsterText = currentMonster.join("\n");
      monsterEntries.push({ text: monsterText, category: currentCategory });
    }

    console.log(`Found ${monsterEntries.length} monster entries`);

    // Parse monsters
    const monsters = [];
    const errors = [];

    monsterEntries.forEach((entry, index) => {
      try {
        const monster = parseMonsterEntry(entry.text);
        if (monster && monster.name && monster.name.length > 2) {
          monster.category = entry.category;
          monsters.push(monster);
        } else {
          console.log(`Failed to parse monster ${index}: ${entry.text.split("\n")[0]}`);
        }
      } catch (error) {
        console.log(`Error parsing monster ${index}: ${error.message}`);
        console.log(`Text: ${entry.text.substring(0, 100)}...`);
        errors.push({
          index,
          name: entry.text.split("\n")[0] || "Unknown",
          error: error.message,
        });
      }
    });

    // Save results
    const outputPath = path.join(process.cwd(), "data", "monsters-legendary.json");
    fs.writeFileSync(outputPath, JSON.stringify(monsters, null, 2));

    console.log(`Successfully extracted ${monsters.length} monsters`);
    console.log(`Saved to: ${outputPath}`);

    if (errors.length > 0) {
      console.log(`Errors: ${errors.length}`);
    }

    // Show legendary actions validation
    console.log("\nLegendary Actions Validation:");
    const monstersWithLegendary = monsters.filter((m) => m.legendaryActions);
    console.log(`Monsters with legendary actions: ${monstersWithLegendary.length}`);

    monstersWithLegendary.slice(0, 3).forEach((m, i) => {
      console.log(`${i + 1}. ${m.name}:`);
      console.log(`   Usage: "${m.legendaryActions.usageDescription?.substring(0, 80)}..."`);
      console.log(
        `   Uses: ${m.legendaryActions.uses}${m.legendaryActions.usesInLair ? ` (${m.legendaryActions.usesInLair} in lair)` : ""}`
      );
      console.log(`   Actions: ${m.legendaryActions.actions?.length || 0}`);
      if (m.legendaryActions.actions) {
        m.legendaryActions.actions.forEach((action, j) => {
          console.log(`     ${j + 1}: "${action.name}"`);
          if (action.healing) console.log(`        Healing: ${action.healing.average} (${action.healing.formula})`);
        });
      }
      console.log("");
    });

    return { monsters, errors };
  } catch (error) {
    console.error("Error extracting monsters:", error);
    throw error;
  }
}

extractMonstersWithLegendaryActions();
