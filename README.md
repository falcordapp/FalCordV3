![Herple...](/hurple.png)
<!-- FalCord: bring back the past -->

# FalcordV3
An open-source reimplementation of the old (2015-2018) Discord backend, including an on-demand client patcher. <br>
Contributions are highly encouraged! We'd love your help to clean and refactor the codebase!
Official instance: https://falcord.ixchats.com

# ⚠️ Important Notices
**Database Migrations**:
   - The database schema can change between updates. When this happens, we will provide SQL migration scripts to upgrade existing databases, **some of these scripts may run automatically on start**.

**Configuration File**:
   - **Always ensure your config.json file matches the structure and entries in config.example.json when you pull new updates.** Instances created before November 14, 2024, must update their configuration file to the new format to function.

# Things to do:
- [ ] testing instance with new assets cdn to fix emojis (wip)
- [ ] More in-app connections other than Twitch<br>
> - [ ] YouTube
> - [ ] Reddit
> - [ ] Twitter
> - [ ] Skype (added around 2016–2017????) <I>would fit into [Escaropen](https://escaropen.ixchats.com) quite well!</i> <!-- Removed around March–April 2020 --><br>
<!-- github markdown be like -->
> (is there any higher client versions that uses more in-app connections?)

- [ ] Modified client, like BetterDiscord possible within lander, before app load? There is some electron client patching & modifications (for networking, I think?), so maybe it is possible to change the code there to make it possible? ~~*after new assets cdn is complete*~~<br> <!-- should i grab all win, ios and linux builds of stable, carnary, pdb, and development? -->
- [X] Find older BetterDiscord clients.<br>
- [ ] Falcord Admin Dashboard HTML (completed, kind of)<br>
- [ ] Integrate Falcord Admin Dashboard into the server<br>
- [ ] Mobile client? (more complex, need to check out how the mobile API works)<br>
- [ ] CHANNEL_UPDATE for Voice Channels: "bitrate" and "user limit"<br>
- [ ] Users in a group/DM/server call/voice chat will be shown (apparently added in **April 2017**, but idk, there isn't alot of info about the system message notifier)<br>
- [ ] Server Widget
- [ ] Server Widget Compact (needs to generate a image)
- [ ] 2FA? (`/api/v6/users/@me/mfa/totp/enable`) `{"code":"000000","secret":"???"}` need to figure out what the secret means and for accounts that have 2FA, some clients will not work as 2FA was not implemented back then.<br>
older clients are annoying fuck.. because the bootloader does it at the start and it the user doesnt logon until after the bootloader loads ofc<br>
it could log in the user but in a minified state and then have only dms open on a system chat and ask for 2fa, then it could show all the chats, servers, friendships, etc (reloading in a non-locked state) once 2fa is given?<br>
- [ ] HypeSquad (`/api/v6/hypesquad/online`) `{"house_id":3}` and add hypesquad email in config
- [ ] add affinities (how relevant a user is/how likely to be friends with the user/interacted before alot but not friends)
- [ ] store?
- [ ] Random thing but get the help button working (support.[falcordinstancehere]/api/v2/help_center/articles.json?label_names=featured, when searched (new tab: support.[falcordinstancehere]/hc/en-us/search?utf8=%E2%9C%93&query=test&commit=Search))
- [ ] nov2020 replying feature
requires:<br>
higher client builds to work or patched client like the modified falcord client ~~that is going to be done when the new assets cdn comes~~<br>
compatibility for older clients.. example for a message
> @ErrorOliver#3907: `heya, this is a message for reply, woohoo this is so amazi`...<br>

this is a reply lol<br><br>
yeah theres gotta be a a "..." for if there's lots of characters on the message the user is replying to<br>
also ping and no ping possible with compatibility which is sweet<br>
- [ ] self hosted email server? (not too important tho)

# Project Status & Features

**Client Year Support**:
  - 🟢 **2015 - 2016**: Full support.
  - 🟠 **2017 - 2018**: In development, mostly supported. (To-dos like Search, tenor, giphy support, etc)
  - ❎ **2019+**: No plans for support. Too much commercial crap in these versions, we're focused on preserving the classic Discord experience, completely free from telemetry and bloat.

**Voice & Video**:
  - **Voice**: 🟠 Work in progress, but functional via WebRTC P2P, standard WebRTC (Browser), and UDP (Desktop Client).
      - **Known Issues**: Minor bugs like speaker indicators not showing, firefox not working, or needing to rejoin a call to hear/speak to others are being actively worked on.
      - **Note**: WebRTC requires the "Modernize WebRTC" patch to be enabled in order to work properly. Right now, because of the media server code being integrated into Falcord, running Falcord behind a firewall like Cloudflare would not work well with UDP (affecting both standard WebRTC and Desktop Client) and will disconnect upon joining.
  - **Video**: 🔴 Not yet supported. Our current focus is on ensuring voice chat works 100% of the time with little to no issues.
  - **Moderation Features**: 🔴Server mute and deafen are planned and actively being worked on.

# Setup Guide
**Prerequisites**:
  - A running PostgreSQL server.
  - Node.js and npm.

**Installation**:
  1. **Setup the Database**: Create a new database via PgAdmin or commandline for PostgreSQL, make sure this database (user & password login as well) matches what's in your future config.json file.
  2. **Install Dependencies**: In the project directory, run the command `npm install`.
  3. **Configure**: Copy `config.example.json` to a new file named `config.json`. Edit the values to match your setup (See the configuration section below for further details).
  4. **Start the Server**: Run the command `node server.js`.

**Configuration** (`config.json`):
  - `custom_invite_url`: Sets the domain for your instance's invite links (e.g., setting it to example.com will make it so every invite has the prefix example.com - similar to discord.gg)
  - `Google reCAPTCHA`: To enable, provide a `site_key`, `secret_key` and change `enabled` to `true`. Do the opposite (`enabled` to `false`) to disable.
     - **IMPORTANT**: The default keys are for demo purposes, **all answers will be marked as valid**, you MUST change these for a production environment.
  - `integration_config`: Manages in-app connections (e.g, Twitch). You'll need to create developer applications on these platforms (like Twitch) to get a `client_id` and `client_secret`.
     ```
       "integration_config" : [{
         "platform" : "twitch",
         "client_id" : "client_id",
         "client_secret" : "client_secret",
         "redirect_uri" : "https://falcord.ixchats.com.com/api/connections/twitch/callback"
    }]
    ```
  - `trusted_users`: An array of user IDs that bypass short-term rate limits. Useful for bots.
  - `instance_flags`: An array of strings to enable special features or restrictions:
     - `NO_REGISTRATION`: Blocks new user sign-ups.
     - `NO_GUILD_CREATION`: Prevents users from creating new guilds.
     - `NO_INVITE_USE`: Stops users from joining guilds via invites.
     - `autojoin:GUILDID` - Automatically makes new users join a specific guild upon registration (e.g., `"autojoin:1413791197947867136"`)
  - `gcs_config`: (Optional) Configure automatic asset uploading to Google Cloud Storage. Requires setting up the Google Cloud SDK.
   ```
      "gcs_config": {
         "autoUploadBucket": "your-gcs-bucket-name",
         "gcStorageFolder": "assets"
     }
   ```
   After setting this up, authorize the SDK by running `gcloud auth login` and `gcloud auth application-default login`. You may also need to configure CORS on your bucket.

 # FAQ
 **What is WebRTC P2P?**
   - WebRTC P2P is a peer-to-peer voice protocol found in 2017-2018 Discord clients. As far as we're aware, it was never officially used, it works by relaying connection data directly between users in a call.
   - Because this protocol is **peer-to-peer**, **it will expose your IP address to other users** in the call. **It is highly recommended to use a VPN with this feature.**

# Acknowledgements
Without these awesome people & resources, Oldcord wouldn't be possible.
  - **ziad87**: Hummus2 source code for token generation, permissions and sessions.
  - **discord.js**: Snowflake implementation.
  - **unkn0w**: Disposable email domain list.
  - **Nebula Entertainment & Broadcasting LLC**: [Nebula Sans font](https://nebulasans.com/) - Drop in replacement for Whitney (Font which discord used before 2022), used in the bootloader and build selector.
  - [**s074 & the spacebar team**](https://github.com/spacebarchat/mediasoup-webrtc): WebRTC media server implementation.
