dependencies:
node -v
npm -v
npm install

to run server:
npm run dev

conformation that an account was made:
in developer tools go to the console and input the following command

localStorage.getItem('token')

token should output

command to decode:
JSON.parse(atob(localStorage.getItem('token').split('.')[1]))