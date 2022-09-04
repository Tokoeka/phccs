import {
    availableAmount,
    buy,
    cliExecute,
    create,
    eat,
    equip,
    getCounters,
    haveEffect,
    knollAvailable,
    mpCost,
    myClass,
    myMp,
    numericModifier,
    runChoice,
    runCombat,
    toEffect,
    totalFreeRests,
    use,
    useFamiliar,
    useSkill,
    visitUrl,
} from "kolmafia";
import {
    $class,
    $effect,
    $familiar,
    $item,
    $items,
    $location,
    $monster,
    $skill,
    $skills,
    $slot,
    BeachComb,
    DaylightShavings,
    get,
    have,
    TunnelOfLove,
    Witchess,
    withProperties,
} from "libram";
import Macro from "./combat";
import {
    advMacro,
    advMacroAA,
    burnLibrams,
    ensureEffect,
    ensureInnerElf,
    ensureMp,
    heal,
    juneCleave,
    mapMacro,
    multiFightAutoAttack,
    questStep,
    setChoice,
    synthExp,
    synthMyst,
    useDefaultFamiliar,
} from "./lib";
import uniform from "./outfits";

function initialExp() {
    if (!have($effect`That's Just Cloud-Talk, Man`)) {
        visitUrl("place.php?whichplace=campaway&action=campaway_sky");
    }

    ensureEffect($effect`Inscrutable Gaze`);
    ensureEffect($effect`Thaumodynamic`);

    if (!have($effect`Synthesis: Learning`)) synthExp();

    uniform($item`familiar scrapbook`);

    if (availableAmount($item`a ten-percent bonus`)) {
        use(1, $item`a ten-percent bonus`);
    }
    cliExecute("bastille myst brutalist");
}

function buffMyst() {
    const lovePotion = $item`Love Potion #0`;
    const loveEffect = $effect`Tainted Love Potion`;
    if (!have(loveEffect)) {
        if (!have(lovePotion)) {
            useSkill(1, $skill`Love Mixology`);
        }
        visitUrl(`desc_effect.php?whicheffect=${loveEffect.descid}`);
        if (
            numericModifier(loveEffect, "mysticality") > 10 &&
            numericModifier(loveEffect, "muscle") > -30 &&
            numericModifier(loveEffect, "moxie") > -30 &&
            numericModifier(loveEffect, "maximum hp percent") > -0.001
        ) {
            use(1, lovePotion);
        }
    }

    if (
        get("yourFavoriteBirdMods")
            .split(",")
            .some((mod) => mod.includes("Mysticality Percent: +"))
    ) {
        useSkill($skill`Visit your Favorite Bird`);
    }

    if (get("spacegateVaccine2") && get("spacegateAlways") && !get("_spacegateVaccine")) {
        cliExecute("spacegate vaccine 2");
    }

    ensureEffect($effect`Uncucumbered`);
    if (!have($effect`Synthesis: Smart`)) synthMyst();

    BeachComb.tryHead($effect`You Learned Something Maybe!`);
    BeachComb.tryHead($effect`We're All Made of Starfish`);

    if (!get("_lyleFavored")) ensureEffect($effect`Favored by Lyle`);
    if (!get("telescopeLookedHigh")) ensureEffect($effect`Starry-Eyed`);

    ensureEffect($effect`Glittering Eyelashes`);

    if (!get("_streamsCrossed")) {
        cliExecute("crossstreams");
    }

    equip($slot`acc3`, $item`Powerful Glove`);
    ensureEffect($effect`Triple-Sized`);
    ensureEffect($effect`Feeling Excited`);

    if (have($item`votive of confidence`)) use($item`votive of confidence`);
    if (have($item`natural magick candle`)) use($item`natural magick candle`);
    if (have($item`MayDay™ supply package`)) use($item`MayDay™ supply package`);
}

function castBuffs() {
    uniform($item`Abracandalabra`);
    if (get("_sausagesEaten") === 0) {
        cliExecute("eat 1 magic sausage");
        useSkill(1, $skill`Advanced Saucecrafting`);
        useSkill(1, $skill`Advanced Cocktailcrafting`);
        useSkill(1, $skill`Acquire Rhinestones`);
        useSkill(1, $skill`Prevent Scurvy and Sobriety`);
    }

    if (!have($item`blue rocket`) && !have($effect`Glowing Blue`)) {
        visitUrl("clan_viplounge.php?action=fwshop&whichfloor=2");
        buy(1, $item`blue rocket`);
    }

    if (!have($item`turtle totem`)) cliExecute("acquire turtle totem");
    if (!have($item`saucepan`)) cliExecute("acquire saucepan");

    $skills`The Magical Mojomuscular Melody, Stevedave's Shanty of Superiority, Fat Leon's Phat Loot Lyric, The Polka of Plenty, Leash of Linguini, Empathy of the Newt, Blood Bond, Blood Bubble, Song of Bravado, Get Big`.forEach(
        (buff) => {
            if (!have(toEffect(buff))) {
                if (myMp() < mpCost(buff)) {
                    if (totalFreeRests() > get("timesRested")) {
                        visitUrl("place.php?whichplace=chateau&action=chateau_restbox");
                    } else if (availableAmount($item`psychokinetic energy blob`) >= 1) {
                        use(2, $item`psychokinetic energy blob`);
                    } else {
                        eat(1, $item`magical sausage`);
                    }
                }
                useSkill(1, buff);
            }
        }
    );
}

function getYoked() {
    uniform();
    useFamiliar($familiar`Ghost of Crimbo Carols`);
    if (get("snojoSetting") === null) {
        visitUrl("place.php?whichplace=snojo&action=snojo_controller");
        runChoice(2);
    }
    heal();
    advMacroAA(
        $location`The X-32-F Combat Training Snowman`,
        Macro.externalIf(
            !have($effect`Cosmic Ball in the Air`),
            Macro.skill($skill`Bowl Straight Up`)
        )
            .delevel()
            .tryItem($item`blue rocket`)
            .defaultKill(),
        () => {
            return !have($effect`Holiday Yoked`);
        },
        () => ensureMp(30)
    );
}

function witchGhostAgent() {
    if (questStep("questM25Armorer") === -1) {
        visitUrl("shop.php?whichshop=armory&action=talk");
        runChoice(1);
    }
    cliExecute("fold makeshift garbage shirt");
    uniform(
        ...$items`protonic accelerator pack, makeshift garbage shirt, familiar scrapbook, Fourth of May Cosplay Saber`
    );
    heal();
    useDefaultFamiliar();
    ensureMp(100);
    Macro.trySkill($skill`Curse of Weaksauce`)
        .trySkill($skill`Micrometeorite`)
        .defaultKill()
        .repeat()
        .setAutoAttack();
    if (!have($item`battle broom`)) {
        Witchess.fightPiece($monster`Witchess Witch`);
    }
    equip($slot`acc3`, $item`battle broom`);

    const ghostLocation = get("ghostLocation");
    if (ghostLocation) {
        equip($slot`off-hand`, $item`latte lovers member's mug`);
        useDefaultFamiliar();
        advMacro(
            ghostLocation,
            Macro.delevel()
                .easyFight()
                .trySkill($skill`Portscan`)
                .trySkill($skill`Shoot Ghost`)
                .trySkill($skill`Shoot Ghost`)
                .trySkill($skill`Shoot Ghost`)
                .trySkill($skill`Trap Ghost`)
        );
    }
    if (!have($item`government`) && !have($item`government cheese`)) {
        useDefaultFamiliar();
        uniform(...$items`vampyric cloake, latte lovers member's mug`);
        cliExecute("parka dilophosaur");
        advMacroAA(
            $location`Noob Cave`,
            Macro.delevel()
                .trySkill($skill`Become a Bat`)
                .trySkill($skill`Spit jurassic acid`),
            () => {
                return getCounters("Portscan", 0, 0) !== "";
            },
            () => () => ensureMp(30)
        );
        const desertAccessItem = knollAvailable()
            ? $item`bitchin' meatcar`
            : $item`Desert Bus pass`;
        if (!have(desertAccessItem)) {
            cliExecute(`acquire ${desertAccessItem.name}`);
        }
        visitUrl("place.php?whichplace=desertbeach&action=db_nukehouse");
    }
    juneCleave();
}

function lov() {
    cliExecute("fold makeshift garbage shirt");
    uniform(
        ...$items`protonic accelerator pack, makeshift garbage shirt, Fourth of May Cosplay Saber`
    );
    heal();
    useDefaultFamiliar();
    Macro.if_("monstername LOV enforcer", Macro.attack().repeat())
        .if_(
            "monstername LOV Engineer",
            Macro.candyblast().trySkillRepeat($skill`Weapon of the Pastalord`)
        )
        .if_("monstername LOV equivocator", Macro.delevel().easyFight().candyblast().defaultKill())
        .setAutoAttack();
    if (!get("_loveTunnelUsed")) {
        TunnelOfLove.fightAll(
            "LOV Epaulettes",
            "Open Heart Surgery",
            "LOV Extraterrestrial Chocolate"
        );
        use(1, $item`LOV Extraterrestrial Chocolate`);
    }
    burnLibrams();
}

function tomatoJuiceAndNinjaCostume() {
    cliExecute("backupcamera ml");

    if (have($item`magical sausage casing`) || have($item`magical sausage`)) {
        cliExecute("eat magic sausage");
    }
    uniform();
    if (
        get("_monstersMapped") < 2 &&
        availableAmount($item`tomato`) +
            availableAmount($item`tomato juice of powerful power`) +
            haveEffect($effect`Tomato Power`) ===
            0
    ) {
        equip($slot`acc3`, $item`Lil' Doctor™ bag`);
        useDefaultFamiliar();
        mapMacro(
            $location`The Haunted Pantry`,
            $monster`possessed can of tomatoes`,
            Macro.if_(
                `monsterid ${$monster`possessed can of tomatoes`.id}`,
                Macro.skill($skill`Reflex Hammer`)
            )
        );
        useDefaultFamiliar(false);
        uniform(
            ...(myClass() === $class`Sauceror` && !DaylightShavings.hasBuff()
                ? $items`Daylight Shavings Helmet`
                : [])
        );
        ensureMp(31);
        mapMacro(
            $location`The Haiku Dungeon`,
            $monster`amateur ninja`,
            Macro.if_(
                `monsterid ${$monster`amateur ninja`.id}`,
                Macro.skill($skill`Feel Nostalgic`).skill($skill`Gingerbread Mob Hit`)
            ).step("abort")
        );
    }

    if (!get("hasRange")) {
        if (!have($item`Dramatic™ range`)) {
            buy(1, $item`Dramatic™ range`);
        }
        use(1, $item`Dramatic™ range`);
    }
    useSkill($skill`Advanced Saucecrafting`);
    useSkill($skill`Prevent Scurvy and Sobriety`);
    if (!have($effect`Tomato Power`)) {
        if (!have($item`tomato juice of powerful power`) && have($item`tomato`)) {
            create(1, $item`tomato juice of powerful power`);
        }
        if (have($item`tomato juice of powerful power`)) {
            use(1, $item`tomato juice of powerful power`);
        }
    }
    if (!have($effect`Mystically Oiled`)) {
        if (!have($item`ointment of the occult`)) {
            create(1, $item`ointment of the occult`);
        }
        if (have($item`ointment of the occult`)) {
            use(1, $item`ointment of the occult`);
        }
    }
}

function godLob() {
    setChoice(1310, 1);
    while (get("_godLobsterFights") < 2) {
        Macro.delevel().easyFight().defaultKill().setAutoAttack();
        uniform($item`familiar scrapbook`);
        heal();
        useFamiliar($familiar`God Lobster`);
        const gear =
            $items`God Lobster's Crown, God Lobster's Robe, God Lobster's Rod, God Lobster's Ring, God Lobster's Scepter`.find(
                (it) => have(it)
            );
        if (gear) equip(gear);
        visitUrl("main.php?fightgodlobster=1");
        runCombat(Macro.delevel().easyFight().defaultKill().toString());
        multiFightAutoAttack();
        runChoice(-1);
    }
}

function snojo() {
    uniform();
    useDefaultFamiliar();
    advMacroAA(
        $location`The X-32-F Combat Training Snowman`,
        Macro.delevel().easyFight().attack().repeat(),
        () => {
            return get("_snojoFreeFights") < 10;
        },
        () => {
            heal();
            useDefaultFamiliar();
            ensureMp(30);
            juneCleave();
        }
    );
    cliExecute("hottub");
}

function tentacle(): void {
    if (!have($skill`Evoke Eldritch Horror`)) return;
    withProperties({ autoAbortThreshold: -0.05, hpAutoRecoveryTarget: -0.05 }, () => {
        uniform();
        useDefaultFamiliar();
        const macro = Macro.delevel().candyblast().defaultKill();
        macro.setAutoAttack();
        try {
            useSkill($skill`Evoke Eldritch Horror`);
            runCombat(macro.toString());
        } catch {
            if (have($effect`Beaten Up`)) cliExecute("hottub");
        }
        if (have($effect`Beaten Up`)) cliExecute("hottub");
    });
}

function NEP() {
    if (get("_questPartyFair") === "unstarted") {
        setChoice(1322, "");
        visitUrl("adventure.php?snarfblat=528");
        if (get("_questPartyFairQuest") === "food") {
            runChoice(1);
            setChoice(1324, 2);
            setChoice(1326, 3);
        } else if (get("_questPartyFairQuest") === "booze") {
            runChoice(1);
            setChoice(1324, 3);
            setChoice(1327, 3);
        } else {
            runChoice(2);
            setChoice(1324, 5);
        }
    }

    uniform(...$items`makeshift garbage shirt, Kramco Sausage-o-Matic™`);

    useDefaultFamiliar();
    advMacroAA(
        $location`The Neverending Party`,
        Macro.delevel()
            .if_($effect`Inner Elf`, Macro.trySkill($skill`Feel Pride`))
            .trySkill($skill`Bowl Sideways`)
            .defaultKill(),
        () => {
            return get("_neverendingPartyFreeTurns") < 10;
        },
        () => {
            useDefaultFamiliar();
            heal();
            const changes =
                get("_sausageFights") > 4
                    ? $items`makeshift garbage shirt`
                    : $items`makeshift garbage shirt, Kramco Sausage-o-Matic™`;
            uniform(...changes);
            if (get("choiceAdventure1324") !== 5 && questStep("_questPartyFair") > 0) {
                setChoice(1324, 5);
            }
            ensureInnerElf();
            ensureMp(30);
        }
    );
    advMacroAA(
        $location`The Neverending Party`,
        Macro.if_(
            "!monstername sausage goblin",
            Macro.if_($effect`Inner Elf`, Macro.trySkill($skill`Feel Pride`))
                .trySkill($skill`Bowl Sideways`)
                .trySkill($skill`Shattering Punch`)
                .trySkill($skill`Gingerbread Mob Hit`)
                .trySkill($skill`Chest X-Ray`)
        ).if_("monstername sausage goblin", Macro.delevel().candyblast().defaultKill()),
        () => {
            return get("_shatteringPunchUsed") < 3 && !get("_gingerbreadMobHitUsed");
        },
        () => {
            heal();
            useDefaultFamiliar();
            const changes =
                get("_sausageFights") > 4
                    ? $items`makeshift garbage shirt`
                    : $items`makeshift garbage shirt, Kramco Sausage-o-Matic™`;
            uniform(...changes);
            if (get("choiceAdventure1324") !== 5 && questStep("_questPartyFair") > 0) {
                setChoice(1324, 5);
            }
            ensureInnerElf();
            ensureMp(30);
        }
    );
    advMacroAA(
        $location`The Neverending Party`,
        Macro.if_(
            "!monstername sausage goblin",
            Macro.if_($effect`Inner Elf`, Macro.trySkill($skill`Feel Pride`))
                .trySkill($skill`Bowl Sideways`)
                .trySkill($skill`Shattering Punch`)
                .trySkill($skill`Gingerbread Mob Hit`)
                .trySkill($skill`Chest X-Ray`)
        ).if_("monstername sausage goblin", Macro.delevel().candyblast().defaultKill()),
        () => {
            return get("_shatteringPunchUsed") < 3;
        },
        () => {
            heal();
            useDefaultFamiliar();
            const changes =
                get("_sausageFights") > 4
                    ? $items`makeshift garbage shirt`
                    : $items`makeshift garbage shirt, Kramco Sausage-o-Matic™`;
            uniform(...changes);
            if (get("choiceAdventure1324") !== 5 && questStep("_questPartyFair") > 0) {
                setChoice(1324, 5);
            }
            ensureInnerElf();
            ensureMp(30);
        }
    );

    equip($slot`acc3`, $item`Lil' Doctor™ bag`);
    advMacroAA(
        $location`The Neverending Party`,
        Macro.if_(
            "!monstername sausage goblin",
            Macro.if_($effect`Inner Elf`, Macro.trySkill($skill`Feel Pride`))
                .trySkill($skill`Bowl Sideways`)
                .trySkill($skill`Shattering Punch`)
                .trySkill($skill`Gingerbread Mob Hit`)
                .trySkill($skill`Chest X-Ray`)
        ).if_("monstername sausage goblin", Macro.delevel().candyblast().defaultKill()),
        () => {
            return get("_chestXRayUsed") < 3;
        },
        () => {
            heal();
            useDefaultFamiliar();
            const changes =
                get("_sausageFights") > 4
                    ? $items`makeshift garbage shirt`
                    : $items`makeshift garbage shirt, Kramco Sausage-o-Matic™`;
            uniform(...changes, [$item`Lil' Doctor™ bag`, $slot`acc3`]);
            if (get("choiceAdventure1324") !== 5 && questStep("_questPartyFair") > 0) {
                setChoice(1324, 5);
            }
            ensureInnerElf();
            ensureMp(30);
        }
    );
}

function mElfLeveling() {
    cliExecute("fold garbage shirt");
    uniform($item`makeshift garbage shirt`);
    useFamiliar($familiar`Machine Elf`);
    advMacroAA(
        $location`The Deep Machine Tunnels`,
        Macro.defaultKill(),
        () => {
            return get("_machineTunnelsAdv") < 5;
        },
        () => {
            heal();
            ensureInnerElf();
            ensureMp(30);
        }
    );
}

function royalty() {
    if (!have($item`very pointy crown`)) {
        Macro.tryItem($item`jam band bootleg`)
            .tryItem($item`gas can`)
            .tryItem($item`Time-Spinner`)
            .attack()
            .repeat()
            .setAutoAttack();
        cliExecute("fold makeshift garbage shirt");
        uniform(...$items`makeshift garbage shirt, familiar scrapbook`);
        useDefaultFamiliar();
        heal();
        Witchess.fightPiece($monster`Witchess Queen`);
    }
    if (!have($item`dented scepter`)) {
        Macro.delevel().attack().repeat().setAutoAttack();
        cliExecute("fold makeshift garbage shirt");
        uniform(...$items`makeshift garbage shirt, familiar scrapbook`);
        useDefaultFamiliar();
        heal();
        Witchess.fightPiece($monster`Witchess King`);
    }
}

function restAndBuff(restMax = totalFreeRests()) {
    uniform($item`familiar scrapbook`);
    const cap = Math.min(restMax, totalFreeRests());
    while (get("timesRested") < cap) {
        burnLibrams();
        visitUrl("place.php?whichplace=chateau&action=chateau_restbox");
    }
}

export default function levelUp(): void {
    initialExp();
    buffMyst();
    castBuffs();
    tomatoJuiceAndNinjaCostume();
    getYoked();
    restAndBuff(11);
    witchGhostAgent();
    lov();
    snojo();
    tentacle();
    godLob();
    restAndBuff();
    mElfLeveling();
    royalty();
    NEP();
}
