# Autogacha

Periodically play `!gacha` on 9arm channel

## Setup

1. Create Twitch developer OAuth application : https://dev.twitch.tv/console/apps

   - Name : Use any name
   - OAuth Redirect URLS : Use any valid URL eg. `http://localhost/oauth`
   - Category : Chat Bot
   - Note `Client ID` & `Client Secret`

1. Set `Client ID` & `Client Secret` in `.env`, save as `.env.local` to prevent commiting to Git.
1. Get OAuth Authorization Code

   - Replace `Client ID` & `OAuth Redirect URL` in this url, then access through browser.

     ```plaintext
     https://id.twitch.tv/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URL&response_type=code&scope=chat:read+chat:edit
     ```

   - Authenticate then get Authorization Code via `code` query string after redirect

     ```plaintext
     http://localhost/oauth?code=YOUR_AUTH_CODE&scope=chat%3Aread+chat%3Aedit
     ```

1. Get OAuth Access Token & Refresh Token

   - Replace `Client ID`, `Client Secret`, `Redirect URL`, and `Authorization Code` in this url:

     ```plaintext
     https://id.twitch.tv/oauth2/token?client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&code=YOUR_AUTH_CODE&grant_type=authorization_code&redirect_uri=YOUR_REDIRECT_URL
     ```

   - Request tokens from URL above via `POST` request (Use `Postman`, `Insomnia`, `cURL`, `wget`, etc.)
     ```zsh
     curl -X POST 'https://id.twitch.tv/oauth2/token?client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&code=YOUR_AUTH_CODE&grant_type=authorization_code&redirect_uri=YOUR_REDIRECT_URL'
     ```
   - You'll get `access_token` & `refresh_token` via JSON

     ```json
     {
       "access_token": "abcdha31dpldqi4m8ucf2cfqhh72t9",
       "expires_in": 12345,
       "refresh_token": "wxyz4h7t3v4t0ngdl3ri6se4b6qvava4xc931rxro2leh6at9h",
       "scope": ["chat:edit", "chat:read"],
       "token_type": "bearer"
     }
     ```

1. Save this file as `tokens.json`

1. `yarn install` or `npm install`

1. `yarn dev` or `npm run dev`
