mkdir trip-manager
cd trip-manager
mkdir backend frontend
cd backend
npm init -y
npm install @nestjs/cli -g
nest new . # Choose npm when prompted
npm install
cd ../frontend
npx create-react-app . --template typescript
npm install
cd backend
docker-compose up -d
cd backend
npm run start:dev
cd ../frontend
npm start 