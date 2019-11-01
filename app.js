const request = require("request");
const fs = require("fs");
const {
	webhooks,
	groupId,
	ROBLOSECURITY,
	checkInterval,
	overridePfp,
    disableMentions,
    colors
} = require("./config");

async function main() {
	request(
		`https://groups.roblox.com/v1/groups/${groupId}`,
		ROBLOSECURITY !== ""
			? {
					headers: {
						Cookie: `.ROBLOSECURITY=${ROBLOSECURITY}`
					}
			  }
			: {},
		async (err, {}, body) => {
			if (err) throw err;

			body = JSON.parse(body);

			if (!body.shout) {
				console.error(
					"I cannot view the shout. Please add a .ROBLOSECURITY token to the config file for a user that is in the group."
				);
				process.exit(1);
			}

			let groupName = body.name;
			let shouter = body.shout.poster.username;
			let shouterId = body.shout.poster.userId;
			let shout = body.shout.body;
			let createdAt = body.shout.updated;

			if (!fs.existsSync(".lastPostDate"))
				await fs.writeFileSync(".lastPostDate", Date.parse(createdAt));

			let lastPost = await fs.readFileSync(".lastPostDate", "utf8");

			if (Date.parse(createdAt) === Number(lastPost)) return;

			await fs.writeFileSync(".lastPostDate", Date.parse(createdAt));

			let thumbnail = await getThumbnail(groupId).catch(console.error);

			webhooks.forEach(webhook => {
				request.post(webhook, {
					json: true,
					body: {
						username: "Shout Bot",
						avatar_url: ( overridePfp ? thumbnail : null ),
						content: disableMentions ? null : "@here",
						embeds: [
							{
								title: `${groupName} Notification`,
								color: getRandomColor(colors),
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
				}, (err) => {
					if(err) console.error(err);
				});
			});
		}
	);
}

function getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function getThumbnail(groupId) {
	return new Promise((resolve, reject) => {
		request(
			`https://thumbnails.roblox.com/v1/groups/icons?format=png&groupIds=${groupId}&size=150x150`,
			(err, res, body) => {
				body = JSON.parse(body);

				if (res.statusCode !== 200)
					return reject(body.errors[0].message);

				resolve(body.data[0].imageUrl);
			}
		);
	});
}

setInterval(main, checkInterval * 1000);