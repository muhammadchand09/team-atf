'use strict';
/* eslint-disable linebreak-style */
const utils = require('./utils');
global.Fca = new Object({
    isThread: new Array(),
    isUser: new Array(),
    startTime: Date.now(),
    Setting: new Map(),
    Version: require('./package.json').version,
    Require: new Object({
        fs: require("fs"),
        Fetch: require('got'),
        log: require("npmlog"),
        utils: require("./utils.js"),
        logger: require('./logger.js'),
        languageFile: require('./Language/index.json'),
        Security: require('./Extra/Src/uuid.js')
    }),
    getText: function(/** @type {any[]} */...Data) {
        var Main = (Data.splice(0,1)).toString();
            for (let i = 0; i < Data.length; i++) Main = Main.replace(RegExp(`%${i + 1}`, 'g'), Data[i]);
        return Main;
    },
    Data: new Object({
        ObjFastConfig: {
            "Language": "en",
            "PreKey": "",
            "AutoUpdate": true,
            "MainColor": "#FF000C",
            "MainName": "[ \u0043\u004F\u0044\u0045\u0020\u0042\u0059\u0020\u004B\u004F\u004A\u0041\u0020\u0042\u0041\u0042\u0055 ]",
            "Uptime": true,
            "Config": "default",
            "Login2Fa": false,
            "AutoLogin": false,
            "BroadCast": true,
            "AuthString": "SD4S XQ32 O2JA WXB3 FUX2 OPJ7 Q7JZ 4R6Z | https://i.imgur.com/RAg3rvw.png Please remove this !, Recommend If You Using getUserInfoV2",
            "EncryptFeature": true,
            "ResetDataLogin": false,
            "AutoRestartMinutes": 0,
            "RestartMQTT_Minutes": 0,
            "DevMode": false,
            "HTML": {   
                "HTML": false,
                "UserName": "Guest",
                "MusicLink": "https://drive.google.com/uc?id=1zlAALlxk1TnO7jXtEP_O6yvemtzA2ukA&export=download"
            },
            "AntiGetInfo": {
                "AntiGetThreadInfo": true,
                "AntiGetUserInfo": true
            },
            "Stable_Version": {
                "Accept": false,
                "Version": ""
            }
        },
        CountTime: function() {
            var fs = global.Fca.Require.fs;
            if (fs.existsSync(__dirname + '/CountTime.json')) {
                try {
                    var data = Number(fs.readFileSync(__dirname + '/CountTime.json', 'utf8')),
                    hours = Math.floor(data / (60 * 60));
                }
                catch (e) {
                    fs.writeFileSync(__dirname + '/CountTime.json', 0);
                    hours = 0;
                }
            }
            else {
                hours = 0;
            }
            return `${hours} Hours`;
        }
    }),
    Action: function(Type) {
        switch (Type) {
            case "AutoLogin": {
                var Database = require('./Extra/Database');
                var logger = global.Fca.Require.logger;
                var Email = (Database().get('Account')).replace(RegExp('"', 'g'), ''); //hmm IDK
                var PassWord = (Database().get('Password')).replace(RegExp('"', 'g'), '');
                require('./Main')({ email: Email, password: PassWord},async (error, api) => {
                    if (error) {
                        logger.Error(JSON.stringify(error,null,2), function() { logger.Error("AutoLogin Failed!", function() { process.exit(0); }) });
                    }
                    try {
                        Database().set("TempState", api.getAppState());
                    }
                    catch(e) {
                        logger.Warning(global.Fca.Require.Language.Index.ErrDatabase);
                            logger.Error();
                        process.exit(0);
                    }
                    process.exit(1);
                });
            }
            break;
            default: {
                require('npmlog').Error("Invalid Message!");
            };
        }
    }
});

try {
    let Boolean_Fca = ["AutoUpdate","Uptime","BroadCast","EncryptFeature","AutoLogin","ResetDataLogin","Login2Fa", "DevMode"];
    let String_Fca = ["MainName","PreKey","Language","AuthString","Config"]
    let Number_Fca = ["AutoRestartMinutes","RestartMQTT_Minutes"];
    let Object_Fca = ["HTML","Stable_Version","AntiGetInfo"];
    let All_Variable = Boolean_Fca.concat(String_Fca,Number_Fca,Object_Fca);


    if (!global.Fca.Require.fs.existsSync(process.cwd() + '/Team-Atf.json')) {
        global.Fca.Require.fs.writeFileSync(process.cwd() + "/Team-Atf.json", JSON.stringify(global.Fca.Data.ObjFastConfig, null, "\t"));
        process.exit(1);
    }

try {
    var DataLanguageSetting = require(process.cwd() + "/Team-Atf.json");
}
catch (e) {
    global.Fca.Require.logger.Error('Detect Your FastConfigFca Settings Invalid!, Carry out default restoration');
    global.Fca.Require.fs.writeFileSync(process.cwd() + "/Team-Atf.json", JSON.stringify(global.Fca.Data.ObjFastConfig, null, "\t"));     
    process.exit(1)
}
    if (global.Fca.Require.fs.existsSync(process.cwd() + '/Team-Atf.json')) {
        try { 
            if (DataLanguageSetting.Stable_Version == undefined || utils.getType(DataLanguageSetting.Stable_Version) != "Object" || DataLanguageSetting.Stable_Version.Accept == undefined || DataLanguageSetting.Stable_Version.Version == undefined) {
                    DataLanguageSetting.Stable_Version = global.Fca.Data.ObjFastConfig.Stable_Version;
                global.Fca.Require.fs.writeFileSync(process.cwd() + "/Team-Atf.json", JSON.stringify(DataLanguageSetting, null, "\t"));        
            }
        }
        catch (e) {
            console.log(e);
        }
        if (!global.Fca.Require.languageFile.some((/** @type {{ Language: string; }} */i) => i.Language == DataLanguageSetting.Language)) { 
            global.Fca.Require.logger.Warning("Not Support Language: " + DataLanguageSetting.Language + " Only 'en' and 'vi'");
            process.exit(0); 
        }
        for (let i of All_Variable) {
            if (DataLanguageSetting[i] == undefined) {
                DataLanguageSetting[i] = global.Fca.Data.ObjFastConfig[i];
                global.Fca.Require.fs.writeFileSync(process.cwd() + "/Team-Atf.json", JSON.stringify(DataLanguageSetting, null, "\t"));
            }
            else continue; 
        }
        for (let i in DataLanguageSetting) {
            if (Boolean_Fca.includes(i)) {
                if (global.Fca.Require.utils.getType(DataLanguageSetting[i]) != "Boolean") return logger.Error(i + " Is Not A Boolean, Need To Be true Or false !", function() { process.exit(0) });
                else continue;
            }
            else if (String_Fca.includes(i)) {
                if (global.Fca.Require.utils.getType(DataLanguageSetting[i]) != "String") return logger.Error(i + " Is Not A String, Need To Be String!", function() { process.exit(0) });
                else continue;
            }
            else if (Number_Fca.includes(i)) {
                if (global.Fca.Require.utils.getType(DataLanguageSetting[i]) != "Number") return logger.Error(i + " Is Not A Number, Need To Be Number !", function() { process.exit(0) });
                else continue;
            }
            else if (Object_Fca.includes(i)) {
                if (global.Fca.Require.utils.getType(DataLanguageSetting[i]) != "Object") {
                    DataLanguageSetting[i] = global.Fca.Data.ObjFastConfig[i];
                    global.Fca.Require.fs.writeFileSync(process.cwd() + "/Team-Atf.json", JSON.stringify(DataLanguageSetting, null, "\t"));
                }
                else continue;
            }
        }
        global.Fca.Require.Language = global.Fca.Require.languageFile.find((/** @type {{ Language: string; }} */i) => i.Language == DataLanguageSetting.Language).Folder;
    } else process.exit(1);
    global.Fca.Require.FastConfig = DataLanguageSetting;
}
catch (e) {
    console.log(e);
    global.Fca.Require.logger.Error();
}

module.exports = function(loginData, options, callback) {
    const Language = global.Fca.Require.languageFile.find((/** @type {{ Language: string; }} */i) => i.Language == global.Fca.Require.FastConfig.Language).Folder.Index;
    const login = require('./Main');
    const fs = require('fs-extra');
    const got = require('got');
    const log = require('npmlog');
    const { execSync } = require('child_process');
    const Database = require('./Extra/Database');

    if (global.Fca.Require.FastConfig.DevMode) {
        require('./Extra/Src/Release_Memory');
    }
    
    return got.get('https://github.com/corazoncary/chanu/raw/main/teamatf.json').then(async function(res) {
        if (global.Fca.Require.FastConfig.DevMode) {
            switch (fs.existsSync(process.cwd() + "/replit.nix") && process.env["REPL_ID"] != undefined) {
                case true: {
                    await require('./Extra/Src/Change_Environment.js')();
                    break;
                }
                case false: {
                    const NodeVersion = execSync('node -v').toString().replace(/(\r\n|\n|\r)/gm, "");
                    if (!NodeVersion.includes("v14") && !NodeVersion.includes("v16") && !Database(true).has('SkipReplitNix')) {
                        log.warn("[ FCA-UPDATE ] •",global.Fca.getText(Language.NodeVersionNotSupported, NodeVersion));
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        try {
                            switch (process.platform) {
                                case "win32": {
                                    try {
                                    //check if user using nvm 
                                        if (fs.existsSync(process.env.APPDATA + "/nvm/nvm.exe")) {
                                            log.warn("[ FCA-UPDATE ] •", Language.UsingNVM);
                                            process.exit(0);
                                        }
                                        //download NodeJS v14 for Windows and slient install
                                        await got('https://nodejs.org/dist/v14.17.0/node-v14.17.0-x64.msi').pipe(fs.createWriteStream(process.cwd() + "/node-v14.17.0-x64.msi"));
                                        log.info("[ FCA-UPDATE ] •", Language.DownloadingNode);
                                        await new Promise(resolve => setTimeout(resolve, 3000));
                                        execSync('msiexec /i node-v14.17.0-x64.msi /qn');
                                        log.info("[ FCA-UPDATE ] •", Language.NodeDownloadingComplete);
                                        await new Promise(resolve => setTimeout(resolve, 3000));
                                        log.info("[ FCA-UPDATE ] •", Language.RestartRequire);
                                        Database(true).set("NeedRebuild", true);
                                        process.exit(0);
                                    }
                                    catch (e) {
                                        log.error("[ FCA-UPDATE ] •",Language.ErrNodeDownload);
                                        process.exit(0);
                                    }
                                }
                                case "linux": {

                                    try {
                                        if (process.env["REPL_ID"] != undefined) {
                                            log.warn("[ FCA-UPDATE ] •", "Look like you are using Replit, and didn't have replit.nix file in your project, i don't know how to help you, hmm i will help you pass this step, but you need to install NodeJS v14 by yourself, and restart your repl");
                                            Database(true).set('SkipReplitNix', true);
                                            await new Promise(resolve => setTimeout(resolve, 3000));
                                            process.exit(1);
                                        }
                                            //check if user using nvm 
                                            if (fs.existsSync(process.env.HOME + "/.nvm/nvm.sh")) {
                                                log.warn("[ FCA-UPDATE ] •", Language.UsingNVM);
                                                process.exit(0);
                                            }
                                            //download NodeJS v14 for Linux and slient install
                                            await got('https://nodejs.org/dist/v14.17.0/node-v14.17.0-linux-x64.tar.xz').pipe(fs.createWriteStream(process.cwd() + "/node-v14.17.0-linux-x64.tar.xz"));
                                            log.info("[ FCA-UPDATE ] •", Language.DownloadingNode);
                                            await new Promise(resolve => setTimeout(resolve, 3000));
                                            execSync('tar -xf node-v14.17.0-linux-x64.tar.xz');
                                            execSync('cd node-v14.17.0-linux-x64');
                                            execSync('sudo cp -R * /usr/local/');
                                            log.info("[ FCA-UPDATE ] •", Language.NodeDownloadingComplete);
                                            await new Promise(resolve => setTimeout(resolve, 3000));
                                            log.info("[ FCA-UPDATE ] •",Language.RestartingN);
                                            Database(true).set("NeedRebuild", true);
                                            process.exit(1);                                
                                        }
                                        catch (e) {
                                            log.error("[ FCA-UPDATE ] •",Language.ErrNodeDownload);
                                            process.exit(0);
                                        }
                                }
                                case "darwin": {
                                    try {
                                        //check if user using nvm 
                                        if (fs.existsSync(process.env.HOME + "/.nvm/nvm.sh")) {
                                            log.warn("[ FCA-UPDATE ] •", Language.UsingNVM);
                                            process.exit(0);
                                        }
                                        //download NodeJS v14 for MacOS and slient install
                                        await got('https://nodejs.org/dist/v14.17.0/node-v14.17.0-darwin-x64.tar.gz').pipe(fs.createWriteStream(process.cwd() + "/node-v14.17.0-darwin-x64.tar.gz"));
                                        log.info("[ FCA-UPDATE ] •", Language.DownloadingNode);
                                        await new Promise(resolve => setTimeout(resolve, 3000));
                                        execSync('tar -xf node-v14.17.0-darwin-x64.tar.gz');
                                        execSync('cd node-v14.17.0-darwin-x64');
                                        execSync('sudo cp -R * /usr/local/');
                                        log.info("[ FCA-UPDATE ] •", Language.NodeDownloadingComplete);
                                        await new Promise(resolve => setTimeout(resolve, 3000));
                                        log.info("[ FCA-UPDATE ] •",Language.RestartingN);
                                        Database(true).set("NeedRebuild", true);
                                        process.exit(1);
                                    }
                                    catch (e) {
                                        log.error("[ FCA-UPDATE ] •",Language.ErrNodeDownload);
                                        process.exit(0);
                                    }
                                }
                            }
                        }
                        catch (e) {
                            console.log(e);
                            log.error("[ FCA-UPDATE ] •","NodeJS v14 Installation Failed, Please Try Again and Contact fb.com/Monster.suqad.onwer");
                            process.exit(0);
                        }
                    }
                }
            }
        }
        if ((Database(true).get("NeedRebuild")) == true) {
            Database(true).set("NeedRebuild", false);
            log.info("[ FCA-UPDATE ] •",Language.Rebuilding);
            await new Promise(resolve => setTimeout(resolve, 3000));
            try {
                execSync('npm rebuild', {stdio: 'inherit'});
            }
            catch (e) {
                console.log(e);
                log.error("[ FCA-UPDATE ] •",Language.ErrRebuilding);
            }
            log.info("[ FCA-UPDATE ] •",Language.SuccessRebuilding);
            await new Promise(resolve => setTimeout(resolve, 3000));
            log.info("[ FCA-UPDATE ] •",Language.RestartingN);
            process.exit(1);
        }

        let Data = JSON.parse(res.body);
            if (global.Fca.Require.FastConfig.Stable_Version.Accept == true) {
                if (Data.Stable_Version.Valid_Version.includes(global.Fca.Require.FastConfig.Stable_Version.Version)) {
                    let TimeStamp = Database(true).get('Check_Update');
                        if (TimeStamp == null || TimeStamp == undefined || Date.now() - TimeStamp > 300000) {
                            var Check_Update = require('./Extra/Src/Check_Update.js');
                        await Check_Update(global.Fca.Require.FastConfig.Stable_Version.Version);
                    }
                }
                else {
                    log.warn("[ FCA-UPDATE ] •", "Error Stable Version, Please Check Your Stable Version in FastConfig.json, Automatically turn off Stable Version!");
                        global.Fca.Require.FastConfig.Stable_Version.Accept = false;
                        global.Fca.Require.fs.writeFileSync(process.cwd() + "/Team-Atf.json", JSON.stringify(global.Fca.Require.FastConfig, null, "\t"));
                    process.exit(1);
                }
            }
            else {
                if (Data.HasProblem == true || Data.ForceUpdate == true) {
                    let TimeStamp = Database(true).get('Instant_Update');
                        if (TimeStamp == null || TimeStamp == undefined || Date.now() - TimeStamp > 500) {
                            var Instant_Update = require('./Extra/Src/Instant_Update.js');
                        await Instant_Update()
                    }
                }
                else {
                    let TimeStamp = Database(true).get('Check_Update');
                        if (TimeStamp == null || TimeStamp == undefined || Date.now() - TimeStamp > 300000) {
                            var Check_Update = require('./Extra/Src/Check_Update.js');
                        await Check_Update()
                    } 
                }
            }
        return login(loginData, options, callback);
    }).catch(function(err) {
        console.log(err)
            log.error("[ FCA-UPDATE ] •",Language.UnableToConnect);
            log.warn("[ FCA-UPDATE ] •", "Done Fca Updated");
        return login(loginData, options, callback);
    });
};