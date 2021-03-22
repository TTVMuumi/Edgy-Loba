const Discord = require('discord.js');
const fs = require("fs");
const config = require('./config.json');
const https = require('follow-redirects').https;



const client = new Discord.Client();
const prefix = config.prefix;


client.once('ready', () => {
    console.log('ApexRanks is now online!');
    client.user.setPresence({ activity: { name: '!hl || Checking the stats!' }, status: 'online' })
})


function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

    function inRange(x, min, max) {
        return ((x-min)*(x-max) <= 0);
    }

    function getAfterColon(str) {
        return str.split(':');
    }


client.on('message', message => {

    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "hl"){
        message.channel.send("```apache\n!link {username} || Link your discord account to apex\n!stats {username} || Check someone elses apex stats\n!clearnames | !cn || Clear the names database list(admin only)```")
    }


    if (command === 'link') {
        if(!args.length){
            return message.channel.send("```apache\nWrong format do it like this: \n!link {username}```");
        }

            var readData = fs.readFileSync("names.txt").toString();
            if(readData.indexOf(message.author.id)>-1){
                message.channel.send("```apache\nYou have already linked an account!```");
            }else{

                //Save format:
                //discordID: apexUsername
                var toWrite = message.author.id + ": " + args[0]; 
                message.channel.send("```apache\nLinked:\n" + toWrite + "```");   
                fs.appendFile("names.txt", toWrite + "\n", (err) => { if(err){message.channel.send(err);}});
            }

    }


    if (command === "stats")
    {
        if(!args.length){
                return message.channel.send("```apache\nIt doesent seem you have linked your account do\n!link {username} \n\nOr if you want to check someone elses stats do \n!stats {username} ```");
        }

        var username = args[0];
        var platform = "origin";
        if(args[1] != undefined){
            platform = args[1];
        }
        var url = `https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${username}`;
        
        var name, RankedPoints, level, rank;


        https.get(url, {
            headers: {
                "TRN-Api-Key" : config.TRN_Token
            }
        }, function (res) {
          
            var data = '';
            res.on('data', function (chunk) {
                data += chunk.toString();
            });
            res.on('end', function () { 
                
                var json; 
        
                try {             
                    json = JSON.parse(data);
                    name = args[0];
                    level = json.data.segments[0].stats.level.value;
                    RankedPoints = json.data.segments[0].stats.rankScore.value;
                    

                    //#region ranks
                    //In range bronze

                    let member = message.guild.member(message.author);
                    if(inRange(RankedPoints, 0, 1200) === true){

                        if(inRange(RankedPoints, 0, 300)){
                            rankNr = " 4";
                        }
                        if(inRange(RankedPoints, 300, 600)){
                            rankNr = " 3";
                        }
                        if(inRange(RankedPoints, 600, 900)){
                            rankNr = " 2";
                        }
                        if(inRange(RankedPoints, 900, 1200)){
                            rankNr = " 1";
                        }
                        rank = "Bronze" + rankNr;
                    }
                    //In range silver
                    if(inRange(RankedPoints, 1200, 2800) === true){

                        if(inRange(RankedPoints, 1200, 1600)){
                            rankNr = " 4";
                        }
                        if(inRange(RankedPoints, 1600, 2000)){
                            rankNr = " 3";
                        }
                        if(inRange(RankedPoints, 2000, 2400)){
                            rankNr = " 2";
                        }
                        if(inRange(RankedPoints, 2400, 2800)){
                            rankNr = " 1";
                        }
                        rank = "Silver";
                    }
                    //In range gold
                    if(inRange(RankedPoints, 2800, 4800) === true){

                        if(inRange(RankedPoints, 2800, 3300)){
                            rankNr = " 4";
                        }
                        if(inRange(RankedPoints, 3300, 3800)){
                            rankNr = " 3";
                        }
                        if(inRange(RankedPoints, 3800, 4300)){
                            rankNr = " 2";
                        }
                        if(inRange(RankedPoints, 4300, 4800)){
                            rankNr = " 1";
                        }

                        rank = "Gold" + rankNr;
                    }
                    //In range platinum
                    if(inRange(RankedPoints, 4800, 7200) === true){

                        if(inRange(RankedPoints, 4800, 5400)){
                            rankNr = " 4";
                        }
                        if(inRange(RankedPoints, 5400, 6000)){
                            rankNr = " 3";
                        }
                        if(inRange(RankedPoints, 6000, 6600)){
                            rankNr = " 2";
                        }
                        if(inRange(RankedPoints, 6600, 7200)){
                            rankNr = " 1";
                        }
                        rank = "Platinum" + rankNr;
                    }
                    //In range diamond
                    if(inRange(RankedPoints, 7200, 10000) === true){

                        if(inRange(RankedPoints, 7200, 7900)){
                            rankNr = " 4";
                        }
                        if(inRange(RankedPoints, 7900, 8600)){
                            rankNr = " 3";
                        }
                        if(inRange(RankedPoints, 8600, 9300)){
                            rankNr = " 2";
                        }
                        if(inRange(RankedPoints, 9300, 10000)){
                            rankNr = " 1";
                        }
                        rank = "Diamond" + rankNr;
                    }
                    //In range master
                    if(inRange(RankedPoints, 10000, 12000) === true){
                        rank = "Master";
                    }
                    //In range predator need better solution to show top 750
                    if(inRange(RankedPoints, 12000, 40000) === true){
                        rank = "Predator";
                        // member.roles.add(predator);
                    }
                    //#endregion

                    var constructor = "```apache\nName: " + name + "\nLevel: " + level + "\nRank: " + rank + "\nRP: "+ RankedPoints + "```";
                    message.channel.send(constructor);

                }
                catch (e) {
                    message.channel.send("An error accured: " + e)
                }
            });
            }).on('error', function (err) {
            message.channel.send("An error accured: " + err)
        });	
        
    }

    if (command === "top"){

    }

    if (command === "clearnames" || command === "cn")
    {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("```apache\nYou dont have permission to use that command!```");
        fs.truncate("names.txt", (err) => {if(err){message.channel.send(err);}});
        message.channel.send("```apache\nThe names list has been cleard```");
    }
});

client.login(config.token);