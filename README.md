# DI_Software_Technology

### Instructions to run Web Client locally:  
- cd WebClient  
- npm install
- npm run dev  
- o  

##### Shortcuts  
- press r to restart the server  
- press u to show server url  
- press o to open in browser  
- press c to clear console  
- press q to quit  

------  

### Instructions to run database, api and webClient with docker:    
- grandlew clean 
- grandlew build
- run the file docker-compose.yml
- http://localhost:5173

------

### Configuration

- **JWT signing key:** generated in memory each time the API starts, so there are no key files to manage. Tokens issued before a restart stop being valid.
- **Email notifications:** set `MAIL_USERNAME` (a Gmail address) and `MAIL_PASSWORD` (a Gmail app password) in the environment before starting the API or running `docker compose`. Without them the API still runs, but notification emails are not sent.
