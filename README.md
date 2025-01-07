# Trip Manager

A full-stack web application for managing group trips and expenses. Built with React, NestJS, and PostgreSQL.

## Features

- 👥 User Authentication & Authorization
- 🌍 Create and manage trips
- 👥 Add members to trips
- 💰 Track expenses for each trip
- 💵 Calculate per-person expenses
- 📊 View expense summaries
- ✅ Mark trips as completed
- 🌓 Dark/Light mode support

## Tech Stack

### Frontend

- React
- TypeScript
- Chakra UI
- React Query
- React Router
- Axios

### Backend

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- Docker

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v14 or higher)
- npm or yarn
- Docker and Docker Compose
- PostgreSQL (if not using Docker)

## API Endpoints

### Authentication

- POST `/auth/register` - Register a new user
- POST `/auth/login` - Login user
- GET `/auth/verify` - Verify JWT token

### Trips

- GET `/trips` - Get all trips for user
- POST `/trips` - Create a new trip
- GET `/trips/:id` - Get trip details
- POST `/trips/:id/members` - Add member to trip
- DELETE `/trips/:id/members/:memberId` - Remove member from trip
- POST `/trips/:id/status` - Update trip status

### Expenses

- POST `/trips/:tripId/expenses` - Add expense to trip
- DELETE `/trips/:tripId/expenses/:id` - Delete expense

## Features in Detail

### Trip Management

- Create new trips with name, destination, and dates
- Add/remove members from trips
- View active and completed trips
- Mark trips as completed

### Expense Tracking

- Add expenses with description, amount, and date
- View all expenses for a trip
- Calculate total expenses and per-person share
- View who paid what and who owes whom

### User Management

- User registration and login
- JWT-based authentication
- Protected routes and API endpoints

## Project Structure

### Frontend Structure

- ├── public/
- ├── src/
- │ ├── components/ # Reusable components
- │ ├── pages/ # Page components
- │ ├── services/ # API services
- │ ├── hooks/ # Custom hooks
- │ ├── utils/ # Utility functions
- │ ├── types/ # TypeScript types
- │ ├── App.tsx # Main App component
- │ └── index.tsx # Entry point

### Backend Structure

- ├── src/
- │ ├── auth/ # Authentication module
- │ ├── trips/ # Trips module
- │ ├── expenses/ # Expenses module
- │ ├── users/ # Users module
- │ ├── entities/ # Database entities
- │ ├── app.module.ts # Main module
- │ └── main.ts # Entry point

## Environment Variables

### Backend (.env)

- DB_HOST=
- DB_PORT=
- DB_USERNAME=
- DB_PASSWORD=
- DB_NAME=
- JWT_SECRET=
- PORT=

### Frontend (.env)

- REACT_APP_API_URL=

## Security Features

- JWT-based authentication
- Password hashing using bcrypt
- Protected API endpoints
- CORS configuration
- Environment variable management
- Input validation

## Error Handling

The application includes comprehensive error handling:

### Frontend

- API error interceptors
- Form validation
- Loading states
- Error messages using toasts

### Backend

- Global exception filters
- Custom error messages
- Validation pipes
- Logger service

## Performance Considerations

- React Query for efficient data caching
- Lazy loading of routes
- Database indexing
- Connection pooling
- Proper TypeORM relations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Testing

- Write unit tests for components
- Test API endpoints
- Run integration tests
- Perform end-to-end testing

## Deployment

### Frontend Deployment

1. Build the production bundle:
2. Deploy the `build` folder to your hosting service

### Backend Deployment

1. Build the production bundle:
2. Set up production environment variables
3. Deploy using PM2 or similar process manager

## Troubleshooting

Common issues and solutions:

1. Database Connection Issues

   - Check PostgreSQL service is running
   - Verify database credentials
   - Ensure correct port configuration

2. Authentication Issues

   - Check JWT token expiration
   - Verify JWT secret in environment variables
   - Clear browser storage and retry

3. Build Issues
   - Clear node_modules and reinstall
   - Check TypeScript version compatibility
   - Verify all dependencies are installed

## License

- None

## Acknowledgments

- [NestJS](https://nestjs.com/) - The backend framework
- [React](https://reactjs.org/) - The frontend library
- [Chakra UI](https://chakra-ui.com/) - UI component library
- [TypeORM](https://typeorm.io/) - Database ORM
- [React Query](https://react-query.tanstack.com/) - Data-fetching library
- [Docker](https://www.docker.com/) - Containerization

## Support

For support, email [sg247938@gmail.com](mailto:sg247938@gmail.com) or open an issue in the repository.

## Future Enhancements

- [ ] Add email notifications
- [ ] Implement real-time updates using WebSockets
- [ ] Add expense categories and tags
- [ ] Implement expense receipt uploads
- [ ] Add expense charts and analytics
- [ ] Support multiple currencies
- [ ] Add trip templates
- [ ] Implement trip sharing via links
