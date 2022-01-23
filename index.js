const fs = require('fs');
const {Client, Intents, MessageEmbed} = require('discord.js');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// the client is created with the partial message option to capture events for uncached messages
// if this options is not set, the bot may not be aware of the message that it should be watching
const client = new Client({ partials: ['MESSAGE'], intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, "GUILD_MEMBERS"]  });

client.on('messageCreate', onMessage);
// client.on('messageReactionRemove', removeRole);

client.login(process.env.BOT_TOKEN);


/**
 * add a role to a user when they add reactions to the configured message
 * @param {Object} reaction - the reaction that the user added
 * @param {Objext} user - the user that added a role to a message
 */
async function addRole({message, _emoji}, user) {
  if (user.bot || message.id !== config.message_id) {
    return;
  }

  // partials do not guarantee all data is available, but it can be fetched
  // fetch the information to ensure everything is available
  // https://github.com/discordjs/discord.js/blob/master/docs/topics/partials.md
  if (message.partial) {
    try {
      await message.fetch();
    } catch (err) {
      console.error('Error fetching message', err);
      return;
    }
  }

  const { guild } = message;

  const member = guild.members.cache.get(user.id);
  const role = guild.roles.cache.find((role) => role.name === config.role);

  if (!role) {
    console.error(`Role not found for '${_emoji.name}'`);
    return;
  }
  
  try {
    member.roles.add(role.id);
  } catch (err) {
    console.error('Error adding role', err);
    return;
  }
}

/**
 * remove a role from a user when they remove reactions from the configured message
 * @param {Object} reaction - the reaction that the user added
 * @param {Objext} user - the user that added a role to a message
 */
async function removeRole({message, _emoji}, user) {
  if (user.bot || message.id !== config.message_id) {
    return;
  }

  // partials do not guarantee all data is available, but it can be fetched
  // fetch the information to ensure everything is available
  // https://github.com/discordjs/discord.js/blob/master/docs/topics/partials.md
  if (message.partial) {
    try {
      await message.fetch();
    } catch (err) {
      console.error('Error fetching message', err);
      return;
    }
  }

  const { guild } = message;

  const member = guild.members.get(user.id);
  const role = guild.roles.find((role) => role.name === config.roles[_emoji.name]);

  if (!role) {
    console.error(`Role not found for '${_emoji.name}'`);
    return;
  }

  try{
    member.roles.remove(role.id);
  } catch (err) {
    console.error('Error removing role', err);
    return;
  }
}



function onMessage(message, user) {
  if(message.content.startsWith("//wlUsersJoinedBefore2days")){
      let d
      const { guild } = message;
      const role = guild.roles.cache.find((role) => role.name === config.role);
      console.log(`role ${role}`)
      //Then mapping the filtered array to their usernames
      message.guild.members.fetch().then(members => { 
        let membersWithRole = members.filter(member => { 
          d = new Date();
          d.setDate(d.getDate()-2);
          return (!member.roles.cache.find((role) => role.name === config.role)) && member.joinedAt < d
        }).map((mem) => mem)
        membersWithRole.forEach(member => {
          try {
            member.roles.add(role.id);
            console.log(`added role`);

          } catch (err) {
            console.error('Error adding role', err);
          }
        })

        let embed = new MessageEmbed()
        .setTitle(`Added role`)
        .setDescription(`Added Early Supporter to ${membersWithRole.length} members`)
          
        return message.channel.send({embeds: [embed]});
      })
  }
}