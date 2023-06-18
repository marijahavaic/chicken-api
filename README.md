# Chicken API

The Chicken API is a RESTful API that allows you to manage chickens in a hen house. It provides endpoints to retrieve information about chickens, add new chickens, update their information, and delete chickens.

## Requirements

-   Node.js
-   MySQL
-   Docker (optional)

## Installation

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Set the following environment variables in the `.env` file:

    - `DB_HOST`: MySQL database host
    - `DB_PORT`: MySQL database port
    - `DB_USER`: MySQL database username
    - `DB_PASSWORD`: MySQL database password
    - `DB_DATABASE`: MySQL database name

## Database Setup

1. Start your MySQL server.
2. Create a new database with the name specified in `DB_DATABASE`.
3. Run the `init.sql` script provided in the repository to create the necessary tables and user.

## Usage

### Running Locally

1. Start the API server: `npm start`
2. The API will be available at `http://localhost:3000`

### Running with Docker Compose

1. Make sure you have Docker installed and running on your machine.
2. Open a terminal and navigate to the project's root directory.
3. Run the following command to start the API and the MySQL database:

    ```
    docker-compose up
    ```

4. The API will be available at `http://localhost:3000`

## API Endpoints

-   `GET /chicken`: Get all chickens.
-   `GET /chicken/:id`: Get a chicken by ID.
-   `POST /chicken`: Add a new chicken (requires `name` and `weight` parameters).
-   `PUT /chicken/:id`: Update a chicken by ID.
-   `PATCH /chicken/:id`: Update a specific property of a chicken by ID.
-   `PATCH /chicken/run/:id`: Increment the steps of a chicken by ID.
-   `DELETE /chicken/:id`: Delete a chicken by ID.

## Error Handling

-   If an error occurs during API requests, a 500 Internal Server Error will be returned with an error message.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
