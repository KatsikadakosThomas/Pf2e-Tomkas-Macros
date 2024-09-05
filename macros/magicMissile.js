
async function main() {

    //we get the current user id
    let userId = game.userId
    // and we get the user object based on the id
    let user = game.users.get(userId)
    let mainToken = game.userId == "bppLTv2w6q0hpowE" ? token: canvas.tokens.ownedTokens[0]
    let mainActor =mainToken.actor

    //CHECK IF THERE IS SPELL AND GET IT
    let collection = mainActor?.spellcasting.collections.find(collection => {
      return collection.entry.name === "Arcane Spontaneous Spells"||collection.entry.name === "Arcane Prepared Spells"
  })

  if (!collection) {
      ui.notifications.error("It seems you dont have arcane spellcasting")
      return
  }

  let spells = collection.filter(spell => {
      return spell.name === "Force Barrage"

  })

console.log(spells);
let signatureCheck=spells[0].system.location.signature
let highestLvl=spells[0].system.location.heightenedLevel

let spellNames = [];

if(signatureCheck){

    for (let i = 1; i <= highestLvl; i++) {
        
        spellNames.push(spells[0].name+" "+i+" level")
    }

}else{

    spells.forEach((spell) => spellNames.push(spell?.name+" "+spell.rank+" level"))
    // console.log(actionNames)
}



const objectWithButtons = createButtonsObject(spellNames);
//console.log(objectWithButtons)

const spellChoice = await Dialog.wait({
  title: "Select level",
  buttons: objectWithButtons.buttons,
  close: () => { return "close" }
});
console.log(spellChoice)

  if (spells.length<=0) {
      ui.notifications.error("You dont know the spell")
      return
  }

//ACTION CHOICE

const actions=["1 action","2 actions","3 actions"]
const actionButtons = createButtonsObject(actions);
//console.log(objectWithButtons)

const actionsChoice = await Dialog.wait({
  title: "How many actions?",
  buttons: actionButtons.buttons,
  close: () => { return "close" }
});

console.log(spellChoice+1);
if(signatureCheck){

    await collection.entry.cast(spells[0],{rank:spellChoice+1})

}else{

  //CAST SPELL
  await collection.entry.cast(spells[spellChoice])
}




const rank=signatureCheck? Math.ceil((spellChoice+1) /2): Math.ceil(spells[spellChoice].rank/2)
const dmgFomula=`${rank}d4+${rank}`
const DamageRoll = CONFIG.Dice.rolls.find((r) => r.name === "DamageRoll");
console.log(actionsChoice)

for(i=0;i<=actionsChoice;i++){

const roll = new DamageRoll(`(${dmgFomula})[force]`);
await roll.toMessage();


let primaryTarget = Array.from(game.user.targets)[0];

new Sequence()
.sound("magic%20missile%20leaving.mp3").delay(i*200)
.effect().delay(i*200)
        .atLocation(token)
        .stretchTo(primaryTarget)
        .file("jb2a.magic_missile")
        .randomizeMirrorY()

.waitUntilFinished(-800)

.sound("magic%20missile%20hit.mp3")

    .play();

//if(i==5){break}
}

}



function indexToOrdinal(index) {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = index % 100;
  return index + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function createButtonsObject(buttonLabels) {
  const buttons = {};
  buttonLabels.forEach((label, index) => {
    const key = indexToOrdinal(index + 1); // Convert 1, 2, 3, ... to first, second, third, ...
    buttons[key] = {
      label: label,
      callback: () => { return index; },
    };
  });
  return { buttons };
}

main()