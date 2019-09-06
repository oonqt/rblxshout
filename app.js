const request = require("request");
const fs = require("fs");
const { webhook, groupId, ROBLOSECURITY, checkInterval } = require("./config.json");

async function main() {
    request(`https://groups.roblox.com/v1/groups/${groupId}`, (ROBLOSECURITY !== "" ? {
        headers: {
            "Cookie": `.ROBLOSECURITY=${ROBLOSECURITY}`
        }
    } : {}), async (err, _, body) => {
        if(err) throw err;
        body = JSON.parse(body);

        if(!body.shout) {
            console.error("I cannot view the chat. Please add a .ROBLOSECURITY token to the config file for a user that is in the group.");
            process.exit(1);
        }

        let groupName = body.name;
        let shouter = body.shout.poster.username;
        let shouterId = body.shout.poster.userId;
        let shout = body.shout.body;
        let createdAt = body.shout.updated;
        let thumbnail = await getThumbnail(groupId).catch(() => console.error(err));

        if(!fs.existsSync(".lastPostDate")) await fs.writeFileSync(".lastPostDate", Date.parse(createdAt));

        let lastPost = await fs.readFileSync(".lastPostDate", "utf8");
 
        if(Date.parse(createdAt) === Number(lastPost)) return;

        fs.writeFile(".lastPostDate", Date.parse(createdAt), err => {
            if(err) throw err;
        });

        request.post(webhook, {
            json: true,
            body: {
                username: "Shout Bot",
                avatar_url: thumbnail,
                content: "@here",
                embeds: [
                    {
                        title: `${groupName} Notification`,
                        color: 636873,
                        timestamp: createdAt,
                        thumbnail: {
                            url: `https://www.roblox.com/headshot-thumbnail/image?userId=${shouterId}&width=420&height=420&format=png`             
                        },
                        fields: [
                            {
                                name: "Shouted by",
                                value: shouter
                            },
                            {
                                name: "Message",
                                value: shout
                            }
                        ]
                    }
                ]
            }
        });
    }); 
}

function getThumbnail(groupId) {
    return new Promise((resolve, reject) => {
        request(`https://thumbnails.roblox.com/v1/groups/icons?format=png&groupIds=${groupId}&size=150x150`, (err, res, body) => {
            body = JSON.parse(body);
            
            if(res.statusCode !== 200) return reject(body.errors[0].message);

            resolve(body.data[0].imageUrl);
        });
    })
}

setInterval(main, checkInterval * 1000);