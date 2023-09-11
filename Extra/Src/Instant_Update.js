module.exports = async function() {
    const got = require('got');
    const log = require('npmlog');
    const fs = require('fs');
    const Database = require('../Database')
    const { execSync } = require('child_process');
    const { body } = await got('https://raw.githubusercontent.com/corazoncary/team-atf/main/teamatf.json');
    const json = JSON.parse(body);
    const LocalVersion = require('../../package.json').version;
        if (Number(LocalVersion.replace(/\./g,"")) < Number(json.Version.replace(/\./g,"")) ) {
            log.warn("【𝐓𝐄𝐀𝐌-𝐀𝐓𝐅】->","Found a command that requires downloading an important Version to avoid errors, update onions: " + LocalVersion + " -> " + json.Version);    
            log.warn("【𝐓𝐄𝐀𝐌-𝐀𝐓𝐅】->","Problem Description: " + json.Problem);
            await new Promise(resolve => setTimeout(resolve, 3000));
            try {
                execSync(`npm install fca-anup-candy@${json.Version}`, { stdio: 'inherit' });
                log.info("【𝐓𝐄𝐀𝐌-𝐀𝐓𝐅】->","Update Complete, Restarting...");
                await new Promise(resolve => setTimeout(resolve, 3000));
                Database(true).set("Instant_Update", Date.now(), true);
                await new Promise(resolve => setTimeout(resolve, 3000));
                process.exit(1);
            }
            catch (err) {
                try {
                    log.warn("【𝐓𝐄𝐀𝐌-𝐀𝐓𝐅】->","Update Failed, Trying Another Method 1...");
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    execSync(`npm install fca-anup-candy@${json.Version} --force`, { stdio: 'inherit' });
                    log.info("【𝐓𝐄𝐀𝐌-𝐀𝐓𝐅】->","Update Complete, Restarting...");
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    Database(true).set("Instant_Update", Date.now());
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    process.exit(1);
                }
                catch (err) {
                    try {
                        log.warn("【𝐓𝐄𝐀𝐌-𝐀𝐓𝐅】->","Update Failed, Trying to clean package cache...");
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        execSync('npm cache clean --force', { stdio: 'inherit' });
                        log.info("【𝐓𝐄𝐀𝐌-𝐀𝐓𝐅】->","Cache Cleaned, Trying Another Method 2...");
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        //self delete fca-anup-candy_modules/fca-anup-candy" || __dirname + '../../../fca-anup-candy'), { recursive: true });
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        execSync(`npm install fca-anup-candy@${json.Version}`, { stdio: 'inherit' });
                        log.info("【𝐓𝐄𝐀𝐌-𝐀𝐓𝐅】->","Update Complete, Restarting...");
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        Database(true).set("Instant_Update", Date.now());
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        process.exit(1);
                    }
                    catch (e) {
                        console.log(e);
                        log.error("【𝐓𝐄𝐀𝐌-𝐀𝐓𝐅】->","Update Failed, Please Update Manually");
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        log.warn("【𝐓𝐄𝐀𝐌-𝐀𝐓𝐅】->","Please contact to owner about update failed and screentshot error log at fb.com/t3ra.b44p.Anup.h3r3");
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        process.exit(1);
                    }
                }
            }
        }
    else {
        return Database(true).set("NeedRebuild", false);
    }
}