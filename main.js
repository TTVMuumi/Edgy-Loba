const Discord = require('discord.js');
const fs = require("fs");
const config = require('./config.json');
const https = require('follow-redirects').https;


const client = new Discord.Client();
const prefix = config.prefix;


client.once('ready', () => {
    console.log('ApexRanks is now online!');
    client.user.setPresence({ activity: { name: 'checking the stats!' }, status: 'online' })
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

    let y = process.openStdin()
    y.addListener("data", res => {
    let x = res.toString().trim().split(/ +/g)
    message.channel.get("684035492446339092").send(x.join(" "));
    });


    function inRange(x, min, max) {
        return ((x-min)*(x-max) <= 0);
    }

    function getAfterColon(str, lineA) {
        return str.split(':')[lineA];
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
                return message.channel.send("```apache\nIt doesent seem you have linked your account do\n!link {username} \n\nOr if you want to check someone elses stats do \n!stats {username}```");
            }
        var platform = "origin";
        var username = args[0];
        var url = `https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${username}`;
        
        //Variables for name kills etc.
        var name, RankedPoints, level, rank;
        //Rank roles
        // let bronze = message.guild.roles.cache.find(role => role.name === "Bronze");
        // let silver = message.guild.roles.cache.find(role => role.name === "Silver");
        // let gold = message.guild.roles.cache.find(role => role.name === "Gold");
        // let platinum = message.guild.roles.cache.find(role => role.name === "Platinum");
        // let diamond = message.guild.roles.cache.find(role => role.name === "Diamond");
        // let master = message.guild.roles.cache.find(role => role.name === "Master");
        // let predator = message.guild.roles.cache.find(role => role.name === "Predator");

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
                        rank = "Bronze";
                    }
                    //In range silver
                    if(inRange(RankedPoints, 1200, 1800) === true){
                        rank = "Silver";
                    }
                    //In range gold
                    if(inRange(RankedPoints, 2800, 4800) === true){
                        rank = "Gold";
                    }
                    //In range platinum
                    if(inRange(RankedPoints, 4800, 7200) === true){
                        rank = "Platinum";
                    }
                    //In range diamond
                    if(inRange(RankedPoints, 7200, 10000) === true){
                        rank = "Diamond";
                    }
                    //In range master
                    if(inRange(RankedPoints, 10000, 12000) === true){
                        rank = "Master";
                    }
                    //In range predator this cant be set like this beacuse it changes dynamicly BAD SOLUTION
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