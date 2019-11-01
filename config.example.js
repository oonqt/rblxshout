module.exports = {
    "webhooks": [""],
    // this is the webhook url for the discord notification channel
    // if you want to use multiple webhook support, add a second webhook to the array

    "colors": [0xa746db, 0xed5f07],
    // this is an array of colors to use for the embed, all values must be in hex but instead of being prefix by #<hexcolor>, prefixed by 0x<hexcolor>
    // default colors are orange and purple

    "checkInterval": 5,
    // this is the interval (in seconds) to check if the group shout has been changed.
    // Default is 5, I wouldn't recommend going below 1 

    "groupId": "",
    // this is the group ID of the group to check for shouts

    "ROBLOSECURITY": "",
    // this is only necessary if the group which shout you're trying to check is a private group
    // if that is the case, you need to roblosecurity authorization token for an account in the group that has permission to view the shout
    // if this isn't necessary, just leave it blank

    "overridePfp": false,
    // this setting allows the script to automatically set the webhook profile picture to that of the roblox group icon. 
    // set this to false to disable

    "disableMentions": true,
    // this setting dictates whether or not to ping @here when the group shout has been changed
    // set this to true to disable mentions
}