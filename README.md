![Herple...](/hurple.png)

# FalCordV3
Current code for FalCord (Rewritten) as typescript sucks for this kinda project. It's a fork from OldCordV3! (please contribute!!) 🎉

Official instance: https://falcord.erroroliver.lol

# Credits
ziad - token generation, permissions, sessions references, and some middleware references <br>
Deskehs - branding, electron client patching & modifications, general assistance with backend <br>
dogsong - web client bootloader contributions, major aid in cleaning up the backend and squashing bugs <br>
discord.js - snowflake <br>
unkn0w - disposable email domain list <br>
noia - everything else <br>

# Important, read me!
Due to Falcord's rapidly changing nature, there are some commits which may break your current database generated by the program. <br>
Which is why, on future commits where the db is changed in a significant way, I will add a short SQL query/queries you can run to update the Database to work with the new wrapper on the commit description. <br>

# Setup
Download and setup a postgreSQL server with the database name of your choice.
Download the config.json from the repository and modify the entries of your choice. Look below for a guide.

Run npm install and then node server.js to start FalCord.

Since V3 is hosted on my own server at home, I use cloudflared to bypass CG-NAT and have enabled cloudflare's free SSL so the SSL stuff in the earlier configuration is kinda deprecated.

custom_invite_url is used for invites in the app, so, putting "falcord.erroroliver.lol" will make it so every invite made has the prefix falcord.erroroliver.lol - much like discord.gg, etc.

There are Google Recaptcha v2 demo site & secret keys in the config example which you may find useful to look at when looking to enable recaptcha on your instance. If you'd like to not have recaptcha enabled, just set the sitekey and secret key to "" (blank). <br>
Also <b>it is highly recommended you change those values if you do plan on using Recaptcha on production. Since it's a demo site key, all answers are valid.</b>⚠️

integration_config is for the in-app connections under user settings, currently only twitch is supported, and you need to make a twitch application which gives you a client_secret to use this.

Example integration configuration:
```
"integration_config" : [{
        "platform" : "twitch",
        "client_id" : "client_id",
        "client_secret" : "client_secret",
        "redirect_uri" : "https://staging-falcord.erroroliver.lol/api/connections/twitch/callback"
}]
```

trusted_users bypass short term rate-limits, use this to add specific users like bots from being blocked by the wacky rate-limits scattered across the project. <br>

instance_flags are kinda limited at the moment, but you can lock down an instance with these entries:

NO_REGISTRATION - Block all future users from creating an account on your instance. <br>
NO_GUILD_CREATION - Block future guilds from being created. <br>
NO_INVITE_USE - Block invites from being used. <br>

More are to come with instance flags in the future. <br>

The gcs_config section of the config.example.json is for the ability to auto-upload saved assets from the wayback machine for future use later. <br>
It takes 2 properties, autoUploadBucket - which is the name of the bucket you want to automatically upload assets into, and gcStorageFolder (name of the folder within the bucket, i.e assets) <br>

Here's an example google cloud storage configuration: 

```
"gcs_config" : {
   "autoUploadBucket" : "discord_assets_stuff",
   "gcStorageFolder" : "assets"
},
```

To setup google cloud storage auto uploading, you need to download the Google Cloud SDK Shell and run these 2 commands to login and authorize your billing account for use in applications:

```
gcloud auth login
gcloud auth application-default login
```

You <b>might</b> also need to configure cors for your use of the bucket accordingly.

# Project Support Outline
🟢 = Full Support <br>
🟠 = Currently in development (or mostly supported, but not fully) <br>
🔴 = Planned for development in the future <br>
❎ = No plan for support in the future <br>

2015 🟢 <br>
2016 🟢 <br>
2017 🟠 <br>
2018 🟠 <br>
2019 ❎ (As much as I'd like to say we'd fully support this year one day, the amount of telemetry, commercial crap, and bloatware - along with big crucial infrastructure changes which are hardly documented for the year just makes me lose faith in even getting a fraction of the gateway up to speed for this year) <br>
2020+ ❎ (NOTE: This is not planned for support due to being when discord became a shell of its former self) <br>
