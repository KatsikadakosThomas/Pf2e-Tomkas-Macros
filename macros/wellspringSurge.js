async function main() {



    //if the user is the gm then we take the tokens actor else we take current users character sheet


    let mainToken = game.userId == "bppLTv2w6q0hpowE" ? token : canvas.tokens.ownedTokens[0]


    let tokenActor = mainToken.actor




   await new Sequence()
        .sound("sounds/magic/wellspring.mp3")
        .volume(0.3)
        .effect(" jb2a.token_border.circle.spinning.orange.005")
        .scale(0.5)
        .fadeOut(200)
        .atLocation(token)
        .effect("jb2a.static_electricity.01.orange")
        .duration(4400)
        .fadeOut(200)
        .scale(0.4)
        .atLocation(token)
        .effect("jb2a.static_electricity.03.orange").delay(800)
        .scale(0.4)
        .atLocation(token)

        //.file("modules/JB2A_DnD5e/Library/Generic/Impact/Impact_12_Regular_Blue_400x400.webm")
        .effect("modules/animated-spell-effects/spell-effects/magic/explosion_CIRCLE_01.webm")
        .delay(4400)
        .atLocation(token)
        .play()

    //const roll = await game.pf2e.Check.roll(new game.pf2e.StatisticModifier(`<p>Flat Check</p>`, []), {options:["flat-check"],type: 'flat-check', dc: { value: 6 }});

    const roll = await new Roll("1d20");
    //we roll
    await roll.evaluate()

    let degree = degreeOfSuccess(roll.total, 0, 6)

    console.log(roll.total)

    if (degree == 3) {
        let messageContent = `<h3 style="color:green;font-weight:700;">Wellspring Magic Critical success</h3><p>You temporarily recover an expended spell slot of any level of your choice. The temporary spell slot lasts for 1 minute, and if you don't use it by then, you experience an immediate wellspring surge.</p>`
        ChatMessage.create({ content: messageContent });

        new Sequence()
            .sound("sounds/wellspring%20magic%20success.mp3").delay(1000).volume(0.1)
            .effect()
            .file("modules/JB2A_DnD5e/Library/Generic/Particles/ParticleBurstCircle01_01_Regular_BluePurple_600x600.webm").delay(1000)
            .atLocation(token)
            .play()
    }

    if (degree == 2) {
        const roll = await new Roll("1d3");
        //we roll
        await roll.evaluate()

        let messageContent = `<h3 style="color:green;">Wellspring Magic success</h3>
    <p>You temporarily recover an expended spell slot. Randomly determine the level of spell slot from among your top three spell levels (or all your levels of spell slots if you have fewer than three). The slot lasts 3 rounds, and if you don't use it by then, you experience an immediate wellspring surge.</p>
    <h3>You get a rank <span style="color:blue">${roll.total}</span> spell slot</h3><p>its free real estate</p>
    `
        ChatMessage.create({ content: messageContent });

        new Sequence()
            .sound("sounds/wellspring%20magic%20success.mp3").delay(1000).volume(0.1)
            .effect()
            .file("modules/JB2A_DnD5e/Library/Generic/Marker/MarkerLightOutro_01_Regular_Blue_400x400.webm").delay(1000)
            .atLocation(token)
            .play()
    }


    if (degree <= 1) {
        const roll = await new Roll("1d3");
        //we roll
        await roll.evaluate()

        let messageContent = `
    <h2 style="color:red;text-align:center;">Wellspring Magic Fail!</h2>
    <p>You generate a wellspring surge, with a spell level chosen randomly among your top three levels of spell slots (or all your levels if you have fewer than three).</p>
    <h3>You get a rank <span style="color:blue">${roll.total}</span> spell slot</h3>
    <p>its free real estate</p>
    <h3 style="text-align:center;">PREPARE URANUS</h3>
    `

        ChatMessage.create({ content: messageContent });
        const table = await fromUuid("RollTable.Dw6YKDSIjHCIHNj4");
        await table.draw({ roll: true, displayChat: true });
        await table.draw({ roll: true, displayChat: true });

        new Sequence()
            .sound("sounds/wellspring%20fail.mp3").delay(1000).volume(0.1)
            .effect()
            .file("modules/JB2A_DnD5e/Library/Generic/Impact/Impact_04_Regular_Blue_400x400.webm").delay(1000)
            .atLocation(token)
            .play()

    }





}



function degreeOfSuccess(d20Roll, modifier, DC) {

    const natural20 = Number(d20Roll) === 20;
    const natural1 = Number(d20Roll) === 1;

    const totalRoll = Number(d20Roll) + Number(modifier)

    const difference = totalRoll - Number(DC);


    let result;
    if (difference >= 10) {
        result = 3;
    } else if (difference >= 0) {
        result = 2;
    } else if (difference <= -10) {
        result = 0;
    } else {
        result = 1;
    }

    if (natural20) return result == 3 ? result : result + 1
    if (natural1) return result == 0 ? result : result - 1
    return result

}

main()