# To update the software:

1. `git pull origin main`
2. `npm run build`
3. `pm2 list` --> get the current PID
4. `pm2 delete PID`
5. `pm2 start npm --name cbg-software -- start`
